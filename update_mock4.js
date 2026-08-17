const fs = require('fs');
const path = require('path');
const mockProducts = require('./server/data/mockProducts');

const products = mockProducts.getProducts();

function convert(value, unit, type) {
  let v = parseFloat(value);
  if (isNaN(v)) return { sv: value, su: unit, sec_v: null, sec_u: null };
  
  if (type === 'pressure') {
    if (unit.toLowerCase().includes('psi')) return { sv: (v / 14.504).toFixed(2), su: 'Bar', sec_v: (v * 6.895).toFixed(2), sec_u: 'kPa' };
    if (unit.toLowerCase().includes('bar')) return { sv: v, su: 'Bar', sec_v: (v * 14.504).toFixed(2), sec_u: 'PSI' };
    if (unit.toLowerCase().includes('mpa')) return { sv: (v * 10).toFixed(2), su: 'Bar', sec_v: (v * 145.04).toFixed(2), sec_u: 'PSI' };
  }
  if (type === 'dimension') {
    if (unit.includes('"') || unit.toLowerCase().includes('in')) return { sv: (v * 25.4).toFixed(2), su: 'mm', sec_v: null, sec_u: null };
    if (unit.toLowerCase().includes('mm')) return { sv: v, su: 'mm', sec_v: (v / 25.4).toFixed(2), sec_u: 'inches' };
    if (unit.toLowerCase().includes('cm')) return { sv: v * 10, su: 'mm', sec_v: null, sec_u: null };
  }
  if (type === 'temperature') {
    if (unit.includes('C')) return { sv: v, su: '°C', sec_v: (v * 9/5 + 32).toFixed(1), sec_u: '°F' };
    if (unit.includes('F')) return { sv: ((v - 32) * 5/9).toFixed(1), su: '°C', sec_v: null, sec_u: null };
  }
  if (type === 'flow') {
    if (unit.toLowerCase().includes('gpm')) return { sv: (v * 3.785).toFixed(2), su: 'L/min', sec_v: null, sec_u: null };
  }
  if (type === 'voltage') {
    return { sv: v, su: 'V', sec_v: null, sec_u: null };
  }
  
  return { sv: value, su: unit, sec_v: null, sec_u: null };
}

function determineType(unit) {
  const u = unit.toLowerCase();
  if (u.includes('psi') || u.includes('bar') || u.includes('mpa') || u.includes('wog') || u.includes('pn') || u.includes('class')) return 'pressure';
  if (u.includes('"') || u.includes('in') || u.includes('mm') || u.includes('cm') || u.includes('npt') || u.includes('bsp')) return 'dimension';
  if (u.includes('c') || u.includes('f')) return 'temperature';
  if (u.includes('gpm') || u.includes('cfm') || u.includes('hr')) return 'flow';
  if (u.includes('v') || u.includes('hz')) return 'voltage';
  return 'other';
}

const updatedProducts = products.map(p => {
  const ext = p.extraction;
  
  const norm_attrs = [];
  
  if (ext.raw_specifications) {
    ext.raw_specifications.forEach((spec, i) => {
      const type = determineType(spec.raw_unit || '');
      const conv = convert(spec.raw_value, spec.raw_unit || '', type);
      
      let isAmb = !spec.raw_unit || type === 'other';
      if (['material', 'connection', 'cert'].some(k => spec.attribute_name.toLowerCase().includes(k))) isAmb = false;

      norm_attrs.push({
        attribute_name: spec.attribute_name,
        tier: i < 5 ? 1 : 2,
        raw_value: spec.raw_value,
        raw_unit: spec.raw_unit || null,
        standardized_value: conv.sv,
        standardized_unit: conv.su,
        secondary_value: conv.sec_v,
        secondary_unit: conv.sec_u,
        range_min: null,
        range_max: null,
        unit_ambiguous: false,
        normalization_status: isAmb ? 'passthrough' : 'normalized',
        conversion_formula: isAmb ? null : 'Standard conversion matrix applied',
        inferred: false
      });
    });
  }
  
  if (ext.dimensional_data && ext.dimensional_data.entries) {
    ext.dimensional_data.entries.forEach(dim => {
      const conv = convert(dim.raw_value, dim.raw_unit || '', 'dimension');
      norm_attrs.push({
        attribute_name: dim.label,
        tier: 2,
        raw_value: dim.raw_value,
        raw_unit: dim.raw_unit || null,
        standardized_value: conv.sv,
        standardized_unit: conv.su,
        secondary_value: conv.sec_v,
        secondary_unit: conv.sec_u,
        range_min: null,
        range_max: null,
        unit_ambiguous: false,
        normalization_status: 'normalized',
        conversion_formula: 'Inches to mm matrix applied',
        inferred: false
      });
    });
  }

  p.normalization = {
    pipeline_id: "pl_" + Math.random().toString(36).substr(2, 9),
    normalization_timestamp: new Date().toISOString(),
    normalized_attributes: norm_attrs,
    normalization_summary: {
      total_attributes: norm_attrs.length,
      normalized_count: norm_attrs.filter(a => a.normalization_status === 'normalized').length,
      passthrough_count: norm_attrs.filter(a => a.normalization_status === 'passthrough').length,
      ambiguous_count: 0,
      manual_review_required: [],
      normalization_quality: "high"
    }
  };
  
  return p;
});

const output = `// Mock Data for DocForge
// Contains full payloads for 6 stages: extraction, normalization, enrichment, cataloging
const products = ${JSON.stringify(updatedProducts, null, 2)};

module.exports = {
  getProducts: () => products,
  selectProduct: (keywords) => {
    if (!keywords) return products[0];
    const kw = keywords.toLowerCase();
    if (kw.includes('ball valve')) return products[0];
    if (kw.includes('pressure transmitter')) return products[1];
    if (kw.includes('solenoid')) return products[2];
    if (kw.includes('fitting') || kw.includes('elbow')) return products[3];
    if (kw.includes('vfd') || kw.includes('drive')) return products[4];
    if (kw.includes('rtd') || kw.includes('sensor')) return products[5];
    return products[0]; // fallback
  }
};
`;

fs.writeFileSync(path.join(__dirname, 'server', 'data', 'mockProducts.js'), output);
console.log('mockProducts.js updated with normalization data!');
