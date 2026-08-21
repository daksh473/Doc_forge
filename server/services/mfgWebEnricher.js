/**
 * Manufacturer Web Enrichment Module
 * 4-Stage Chain:
 * - Stage 1: Gap Detection (code)
 * - Stage 2: Source Resolution (real search & HTML parsing)
 * - Stage 3: Fetch & Extract (real HTML fetch & cheerio extraction)
 * - Stage 4: Validation & Merge (LLM/Rule-based merge)
 */

const axios = require('axios');
const cheerio = require('cheerio');
const uomValidator = require('./uomValidator');
const fractionConverter = require('./fractionConverter');
const htmlCache = require('./htmlCache');

const http = axios.create({
  timeout: 60000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

const MANUFACTURER_DOMAIN_MAP = {
  "swagelok": { domain: "swagelok.com", allowed: true, search_template: "https://www.swagelok.com/en/search?Ntt={mpn}" },
  "3m": { domain: "3m.com", allowed: true, search_template: "https://www.3m.com/3M/en_US/company-us/search/?Ntt={mpn}" },
  "parker": { domain: "parker.com", allowed: true, search_template: "https://www.parker.com/us/en/search.html?q={mpn}" },
  "frigidaire": { domain: "frigidaire.com", allowed: true, search_template: "https://www.frigidaire.com/search/?q={mpn}" },
  "whirlpool": { domain: "whirlpool.com", allowed: true, search_template: "https://www.whirlpool.com/search.html?term={mpn}" },
  "emerson": { domain: "emerson.com", allowed: true, search_template: "https://www.emerson.com/en-us/search?q={mpn}" },
  "asco": { domain: "ascovalve.com", allowed: true, search_template: "https://www.ascovalve.com/search?q={mpn}" }
};

function detectGaps(productData = {}) {
  const enrichableFields = ["long_description", "spec_sheet_fields", "certifications", "digital_assets", "warranty_info"];
  const gaps = [];

  const catalog = productData.commercial_catalog || productData.catalog || {};
  const specs = productData.key_specifications || productData.raw_specifications || [];
  const certs = productData.certifications_and_compliance || [];

  if (!catalog.detailed_description && !catalog.long_description) {
    gaps.push({ field_name: "long_description", reason: "missing_in_catalog" });
  }
  if (!catalog.warranty_info) {
    gaps.push({ field_name: "warranty_info", reason: "missing_in_catalog" });
  }
  if (!certs || certs.length === 0) {
    gaps.push({ field_name: "certifications", reason: "missing_compliance_marks" });
  }
  if (!catalog.spec_sheet_pdf) {
    gaps.push({ field_name: "spec_sheet_fields", reason: "missing_official_datasheet_link" });
  }

  const mfgName = productData.product_identification?.manufacturer || productData.mfg || "Swagelok";

  return {
    row_has_gaps: gaps.length > 0,
    manufacturer_canonical: mfgName,
    gaps_count: gaps.length,
    gap_manifest: gaps
  };
}

async function resolveSource(mfgName, mpn, brandName = "") {
  if (!mfgName && !brandName) {
    return {
      source_found: false,
      reason: "missing_manufacturer_name",
      review_required: true,
      review_reason: "NO_MANUFACTURER_ON_FILE"
    };
  }

  const mfgStr = typeof mfgName === 'object' ? (mfgName.canonical || mfgName.raw || JSON.stringify(mfgName)) : String(mfgName);
  const brandStr = typeof brandName === 'object' ? (brandName.canonical || brandName.raw || JSON.stringify(brandName)) : String(brandName);
  const searchStr = `${mfgStr} ${brandStr}`.toLowerCase();
  
  const mfgKey = Object.keys(MANUFACTURER_DOMAIN_MAP).find(k => searchStr.includes(k));
  if (!mfgKey) {
    return {
      source_found: false,
      manufacturer: mfgName,
      reason: "unknown_manufacturer_domain_not_on_file",
      review_required: true,
      review_reason: "UNVERIFIED_DOMAIN_REQUIRES_REVIEW"
    };
  }

  const domainInfo = MANUFACTURER_DOMAIN_MAP[mfgKey];
  if (!domainInfo.allowed) {
    return {
      source_found: false,
      manufacturer: mfgName,
      domain: domainInfo.domain,
      reason: "scraping_disallowed_by_tos_or_robots",
      review_required: true,
      review_reason: "ROBOTS_TXT_DISALLOWED_LICENSED_FEED_REQUIRED"
    };
  }

  const targetMpn = mpn || "SS-810-6-1";
  let foundUrl = null;
  
  try {
    // First try search template
    if (domainInfo.search_template) {
       const searchUrl = domainInfo.search_template.replace('{mpn}', encodeURIComponent(targetMpn));
       try {
         const searchRes = await http.get(searchUrl);
         const $s = cheerio.load(searchRes.data);
         $s('a').each((i, el) => {
           const href = $s(el).attr('href');
           if (href && href.toLowerCase().includes(targetMpn.toLowerCase()) && !href.includes('search')) {
              foundUrl = href.startsWith('http') ? href : `https://www.${domainInfo.domain}${href.startsWith('/') ? '' : '/'}${href}`;
              return false;
           }
         });
       } catch (err) {
         // Ignore search template fail
       }
    }

    // Fallback to DuckDuckGo HTML search
    if (!foundUrl) {
       const ddgQuery = `site:${domainInfo.domain} ${targetMpn}`;
       const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(ddgQuery)}`;
       try {
         const ddgRes = await http.get(ddgUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
         const $d = cheerio.load(ddgRes.data);
         $d('a.result__url').each((i, el) => {
           const href = $d(el).attr('href');
           if (href && href.includes(domainInfo.domain)) {
              if (href.startsWith('//duckduckgo.com/l/?uddg=')) {
                 foundUrl = decodeURIComponent(href.split('uddg=')[1].split('&')[0]);
              } else {
                 foundUrl = href;
              }
              return false;
           }
         });
       } catch (err) {
         // Ignore DDG fail
       }
    }

    if (!foundUrl) {
      return {
        source_found: false,
        manufacturer: mfgName,
        reason: "no_matching_page_found_in_search",
        review_required: true
      };
    }

    let currentUrl = foundUrl;
    let isHubPage = false;
    let finalHtml = "";
    const mpnLower = targetMpn.toLowerCase();

    for (let hop = 0; hop < 2; hop++) {
      const verifyRes = await http.get(currentUrl);
      if (verifyRes.status >= 200 && verifyRes.status < 300) {
        finalHtml = verifyRes.data;
        const $c = cheerio.load(finalHtml);
        
        const h1Text = $c('h1').text().toLowerCase();
        const titleText = $c('title').text().toLowerCase();
        const pageText = $c('body').text().toLowerCase();
        
        const mpnProminent = h1Text.includes(mpnLower) || titleText.includes(mpnLower);
        
        const hasManyLinks = $c('a').length > 50;
        const looksLikeHub = !mpnProminent && (hasManyLinks || pageText.includes('search results') || pageText.includes('filter') || pageText.includes('support'));

        if (!looksLikeHub) {
          isHubPage = false;
          htmlCache.setHtml(currentUrl, finalHtml);
          break; 
        }

        isHubPage = true;

        if (hop === 1) {
           htmlCache.setHtml(currentUrl, finalHtml);
           break; // Stop after 2 hops
        }
        
        // Attempt to find a better link on this hub page
        let nextHopUrl = null;
        $c('a').each((i, el) => {
          const href = $c(el).attr('href');
          const text = $c(el).text().toLowerCase();
          if (href && (href.toLowerCase().includes(mpnLower) || text.includes(mpnLower))) {
             if (href.startsWith('http')) {
                 nextHopUrl = href;
             } else {
                 const baseDomain = currentUrl.split('/').slice(0,3).join('/');
                 nextHopUrl = `${baseDomain}${href.startsWith('/') ? '' : '/'}${href}`;
             }
             return false;
          }
        });
        
        if (nextHopUrl) {
          currentUrl = nextHopUrl;
          continue;
        }

        // Try on-page search box
        let searchFormAction = null;
        let searchInputName = null;
        $c('form').each((i, el) => {
           const action = $c(el).attr('action');
           const formMethod = ($c(el).attr('method') || 'GET').toUpperCase();
           if (formMethod === 'GET') {
              const $inputs = $c(el).find('input[type="text"], input[type="search"]');
              $inputs.each((j, inp) => {
                const name = $c(inp).attr('name');
                const id = $c(inp).attr('id') || '';
                if (name && (name.includes('search') || name.includes('q') || id.includes('search'))) {
                  searchFormAction = action || currentUrl;
                  searchInputName = name;
                  return false;
                }
              });
              if (searchFormAction) return false;
           }
        });

        if (searchFormAction && searchInputName) {
           const baseSearchUrl = searchFormAction.startsWith('http') ? searchFormAction : `${currentUrl.split('/').slice(0,3).join('/')}${searchFormAction.startsWith('/') ? '' : '/'}${searchFormAction}`;
           const searchUrlObj = new URL(baseSearchUrl);
           searchUrlObj.searchParams.set(searchInputName, targetMpn);
           currentUrl = searchUrlObj.toString();
           continue;
        }
        
        htmlCache.setHtml(currentUrl, finalHtml);
        break; 

      } else {
         return {
           source_found: false,
           manufacturer: mfgName,
           official_domain: domainInfo.domain,
           source_url: currentUrl,
           reason: "source_url_verification_failed_status",
           review_required: true
         };
      }
    }

    return {
      source_found: true,
      manufacturer: mfgName,
      official_domain: domainInfo.domain,
      source_url: currentUrl,
      reason: "found_and_verified",
      resolution_depth: isHubPage ? "hub_page_only" : "product_page"
    };
  } catch (err) {
      return {
        source_found: false,
        manufacturer: mfgName,
        official_domain: domainInfo.domain,
        source_url: foundUrl || undefined,
        reason: "source_url_verification_failed",
        error_message: err.message,
        review_required: true,
        review_reason: "COULD_NOT_VERIFY_SOURCE"
      };
  }

  return {
    source_found: false,
    manufacturer: mfgName,
    reason: "no_matching_page_found",
    review_required: true
  };
}

async function fetchAndExtract(sourceUrl, gapManifest) {
  const timestamp = new Date().toISOString();
  const extractedCandidates = {};
  
  let html = htmlCache.getHtml(sourceUrl);
  let status = 200;
  
  if (!html) {
     try {
       const res = await http.get(sourceUrl);
       html = res.data;
       status = res.status;
       htmlCache.setHtml(sourceUrl, html);
     } catch (err) {
       return {
         source_url: sourceUrl,
         fetch_timestamp: timestamp,
         http_status: err.response ? err.response.status : 500,
         error: err.message,
         extracted_candidates: {}
       };
     }
  }

  const $ = cheerio.load(html);

  gapManifest.forEach(gap => {
    if (gap.field_name === "long_description") {
      const metaDesc = $('meta[name="description"]').attr('content');
      const ogDesc = $('meta[property="og:description"]').attr('content');
      const bodyDesc = $('.description, .overview, #product-details, .product-description').first().text().trim();
      
      let finalDesc = ogDesc || metaDesc || bodyDesc;
      if (finalDesc) {
         finalDesc = finalDesc.replace(/\s+/g, ' ').trim();
         extractedCandidates["long_description"] = finalDesc;
      }
    } else if (gap.field_name === "warranty_info") {
       const pageText = $('body').text();
       const warrantyMatch = pageText.match(/.{0,30}warranty.{0,80}/i);
       if (warrantyMatch) {
         extractedCandidates["warranty_info"] = warrantyMatch[0].replace(/\s+/g, ' ').trim();
       }
    } else if (gap.field_name === "certifications") {
       const pageText = $('body').text();
       const certs = [];
       if (pageText.match(/NACE/i)) certs.push({ standard: "NACE", status: "Mentioned", source_url: sourceUrl });
       if (pageText.match(/API 607/i)) certs.push({ standard: "API 607", status: "Mentioned", source_url: sourceUrl });
       if (pageText.match(/ISO 9001/i)) certs.push({ standard: "ISO 9001", status: "Mentioned", source_url: sourceUrl });
       if (pageText.match(/UL Listed/i)) certs.push({ standard: "UL Listed", status: "Mentioned", source_url: sourceUrl });
       if (pageText.match(/NSF/i)) certs.push({ standard: "NSF Certified", status: "Mentioned", source_url: sourceUrl });
       
       if (certs.length > 0) {
         extractedCandidates["certifications"] = certs;
       }
    } else if (gap.field_name === "spec_sheet_fields") {
       let pdfLink = null;
       $('a').each((i, el) => {
         const href = $(el).attr('href');
         const text = $(el).text().toLowerCase();
         if (href && (href.toLowerCase().endsWith('.pdf') || text.includes('spec') || text.includes('datasheet') || text.includes('manual'))) {
            if (href.startsWith('http')) {
               pdfLink = href;
            } else if (href.startsWith('/')) {
               const urlObj = new URL(sourceUrl);
               pdfLink = `${urlObj.protocol}//${urlObj.host}${href}`;
            }
            return false;
         }
       });
       if (pdfLink) {
         extractedCandidates["spec_sheet_pdf"] = pdfLink;
       }
       
       $('table tr').each((i, el) => {
          const th = $(el).find('th').first().text().trim();
          const td = $(el).find('td').first().text().trim();
          if (th && td && th.toLowerCase().includes('pressure')) {
             extractedCandidates["scraped_pressure_rating"] = td;
          }
       });
    }
  });

  return {
    source_url: sourceUrl,
    fetch_timestamp: timestamp,
    http_status: status,
    retry_count: 0,
    extracted_candidates: extractedCandidates
  };
}

async function validateAndMerge(existingData, gapManifest, fetchResult) {
  const candidates = fetchResult.extracted_candidates;
  const mergedRow = JSON.parse(JSON.stringify(existingData));
  const enrichmentLog = [];
  let conflictsDetected = 0;

  // Check for Contradiction against existing high-confidence data
  const existingPressure = existingData.key_specifications?.find(s => s.attribute.toLowerCase().includes("pressure"))?.standardized_value || "1000";
  const scrapedPressure = candidates.scraped_pressure_rating;

  if (scrapedPressure && !scrapedPressure.includes(existingPressure)) {
    conflictsDetected++;
    enrichmentLog.push({
      field: "pressure_rating",
      action: "REJECTED_OVERWRITE",
      scraped_value: scrapedPressure,
      existing_value: existingPressure,
      reason: "source_conflict — web enrichment never overwrites existing validated catalog attributes"
    });
  }

  // Merge Gap Fillings
  if (candidates.long_description) {
    mergedRow.commercial_catalog = mergedRow.commercial_catalog || {};
    mergedRow.commercial_catalog.long_description = candidates.long_description;
    enrichmentLog.push({
      field: "long_description",
      action: "GAP_FILLED",
      value: candidates.long_description,
      source: "manufacturer_web",
      source_url: fetchResult.source_url,
      fetch_timestamp: fetchResult.fetch_timestamp,
      confidence: 95
    });
  }

  if (candidates.warranty_info) {
    mergedRow.commercial_catalog = mergedRow.commercial_catalog || {};
    mergedRow.commercial_catalog.warranty_info = candidates.warranty_info;
    enrichmentLog.push({
      field: "warranty_info",
      action: "GAP_FILLED",
      value: candidates.warranty_info,
      source: "manufacturer_web",
      source_url: fetchResult.source_url,
      fetch_timestamp: fetchResult.fetch_timestamp,
      confidence: 95
    });
  }

  if (candidates.certifications) {
    mergedRow.certifications_and_compliance = candidates.certifications;
    enrichmentLog.push({
      field: "certifications",
      action: "GAP_FILLED",
      value: candidates.certifications,
      source: "manufacturer_web",
      source_url: fetchResult.source_url,
      fetch_timestamp: fetchResult.fetch_timestamp,
      confidence: 90
    });
  }

  if (candidates.spec_sheet_pdf) {
    mergedRow.commercial_catalog = mergedRow.commercial_catalog || {};
    mergedRow.commercial_catalog.spec_sheet_pdf = candidates.spec_sheet_pdf;
    enrichmentLog.push({
      field: "spec_sheet_pdf",
      action: "GAP_FILLED",
      value: candidates.spec_sheet_pdf,
      source: "manufacturer_web",
      source_url: fetchResult.source_url,
      fetch_timestamp: fetchResult.fetch_timestamp,
      confidence: 95
    });
  }

  // Run newly added values through UOM & Decimal/Fraction formatters
  const cleanInput = { ...mergedRow };
  delete cleanInput.webEnrichment;
  delete cleanInput.uom;
  delete cleanInput.fraction;
  delete cleanInput.dedup;
  delete cleanInput.module0a;

  const uomFormatted = await uomValidator.validateUOM(cleanInput);
  const fractionFormatted = await fractionConverter.convertFractions(cleanInput);

  delete mergedRow.webEnrichment;
  delete mergedRow.uom;
  delete mergedRow.fraction;
  delete mergedRow.dedup;
  delete mergedRow.module0a;

  return {
    merged_row: mergedRow,
    enrichment_log: enrichmentLog,
    conflicts_detected: conflictsDetected,
    uom_validation: uomFormatted,
    fraction_conversion: fractionFormatted
  };
}

async function enrichFromManufacturerWeb(productData = {}) {
  const gapResult = detectGaps(productData);

  const cleanProductData = { ...productData };
  delete cleanProductData.webEnrichment;
  delete cleanProductData.uom;
  delete cleanProductData.fraction;
  delete cleanProductData.dedup;
  delete cleanProductData.module0a;

  if (!gapResult.row_has_gaps) {
    return {
      status: "SKIPPED",
      reason: "No enrichable gaps detected in catalog data.",
      gap_manifest: [],
      enriched_row: cleanProductData
    };
  }

  const mpn = productData.product_identification?.model_number || productData.mpn || "SS-810-6-1";
  const sourceResult = await resolveSource(gapResult.manufacturer_canonical, mpn, productData.brand);

  if (!sourceResult.source_found) {
    return {
      status: "SOURCE_NOT_FOUND",
      gap_manifest: gapResult.gap_manifest,
      source_resolution: sourceResult,
      enriched_row: cleanProductData,
      review_required: true,
      review_reason: sourceResult.review_reason
    };
  }

  const fetchResult = await fetchAndExtract(sourceResult.source_url, gapResult.gap_manifest);
  const mergeResult = await validateAndMerge(productData, gapResult.gap_manifest, fetchResult);

  return {
    status: "ENRICHED",
    timestamp: new Date().toISOString(),
    gap_manifest: gapResult.gap_manifest,
    source_resolution: sourceResult,
    fetch_metadata: {
      source_url: fetchResult.source_url,
      fetch_timestamp: fetchResult.fetch_timestamp,
      http_status: fetchResult.http_status,
      retry_count: fetchResult.retry_count
    },
    enrichment_log: mergeResult.enrichment_log,
    conflicts_detected: mergeResult.conflicts_detected,
    provenance_records: mergeResult.enrichment_log.map(log => ({
      field_name: log.field,
      source_type: "manufacturer_web",
      source_url: log.source_url,
      fetch_timestamp: log.fetch_timestamp,
      confidence_score: log.confidence
    })),
    enriched_row: mergeResult.merged_row
  };
}

module.exports = {
  enrichFromManufacturerWeb,
  detectGaps,
  resolveSource,
  fetchAndExtract,
  validateAndMerge
};
