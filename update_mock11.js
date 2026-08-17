const fs = require('fs');
const path = require('path');
const mockProducts = require('./server/data/mockProducts');
const lovEngine = require('./server/services/lovEngine');

async function updateMockData() {
  const products = mockProducts.getProducts();

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const classpath = i === 0 ? "valves.ball" 
                    : i === 1 ? "transmitters.pressure" 
                    : i === 2 ? "valves.solenoid" 
                    : i === 3 ? "fittings.pipe" 
                    : i === 4 ? "drives.vfd" 
                    : "sensors.rtd";
    
    p.lov = await lovEngine.matchLOV(p.extraction, classpath);
  }

  const output = `// Mock Data for DocForge
// Contains full payloads for all stages including LOV Verification
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
  console.log('mockProducts.js updated with LOV verification data!');
}

updateMockData();
