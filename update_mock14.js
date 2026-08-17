const fs = require('fs');
const path = require('path');
const mockProducts = require('./server/data/mockProducts');
const fractionConverter = require('./server/services/fractionConverter');

async function updateMockData() {
  const products = mockProducts.getProducts();

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    p.fraction = await fractionConverter.convertFractions(p.normalization || p.extraction);
  }

  const output = `// Mock Data for DocForge
// Contains full payloads for all stages including Decimal-Fraction Conversion
const products = ${JSON.stringify(products, null, 2)};

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
  console.log('mockProducts.js updated with Decimal-Fraction Conversion data!');
}

updateMockData();
