require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getLocationFarmPlan(body) {
  const prompt = `You are an expert agricultural planner AI specializing in profitable and sustainable farm optimization.

  Your objective is to MAXIMIZE long-term profit while:
  - Maintaining soil fertility balance
  - Preventing nutrient depletion
  - Applying crop rotation principles
  - Adjusting for realistic regional climate patterns
  - Optimizing water efficiency
  - Considering agricultural suitability of the region

  INPUT DATA:
  - Location: ${body.location}
  - Land Size: ${body.landSize} acres

  INTERNAL ANALYSIS REQUIREMENTS:
  You must internally determine based on the given location:
  - Climate zone
  - Typical annual rainfall
  - Temperature profile
  - Humidity patterns
  - Common soil types
  - Water availability trends
  - Regionally suitable crops
  - Market viability

  SUSTAINABILITY RULES:
  1. Recommend crops scientifically suitable for the region’s climate and soil.
  2. Include at least one crop that supports soil regeneration (e.g., legumes).
  3. Avoid monocropping unless region strongly supports it.
  4. Balance cereals, legumes, oilseeds, or root crops.
  5. Avoid water-intensive crops in low-rainfall regions.
  6. Estimate realistic water consumption based on regional climate.
  7. Optimize long-term profitability, not short-term yield only.

  Return ONLY a valid JSON object (no markdown, no explanation, no code fences) with this EXACT structure:

  {
    "stats": {
      "expectedProfit": "<total profit as string e.g. '$42,500'>",
      "waterUsed": "<total water in liters as string e.g. '12.4k L'>",
      "allocatedArea": "<allocated area as string e.g. '48.2 Ac'>",
      "riskLevel": "<one of: Low, Moderate, High>"
    },
    "crops": [
      { "name": "<crop name>", "percent": <integer 1-100>, "color": "<hex color>" }
    ],
    "profits": [
      { "name": "<crop name>", "amount": "<profit string e.g. '$18.5k'>", "percent": <0-100 bar width>, "color": "<tailwind bg class>" }
    ],
    "plantingGrid": [
      [0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2]
    ],
    "fields": [
      { "name": "<field label>", "bgColor": "<tailwind bg class>", "borderColor": "<tailwind border class>" }
    ],
    "insights": [
      {
        "icon": "<emoji>",
        "iconBg": "<tailwind classes>",
        "title": "<short title>",
        "desc": "<1-2 sentence explanation>"
      }
    ],
    "irrigation": {
      "days": ["M","T","W","T","F","S","S"],
      "active": [<0 or 1 for each day, 1 means irrigation active that day>]
    }
  }

  STRICT RULES:
  - Recommend 2–3 crops best suited to the region
  - Crop percentages must sum to 100
  - plantingGrid must be exactly 5x10
  - Grid values must match crop index
  - One field entry per crop
  - Exactly 3 insights:
    1. Crop selection reasoning
    2. Water efficiency assessment
    3. Risk assessment (specific threats in that region) only between Low and Moderate only in worst case High risk
  - Profit estimates must be realistic for the region and land size
  - Profit bar widths must be proportional to profit amounts i.e. acc to their percentage of total profit
  - Valid Tailwind bg classes only:
    bg-green-500, bg-yellow-400, bg-blue-500
  - Monetary values in INR and multiple of 10k
  - waterUsed in thousands of liters
  - allocatedArea must not exceed land size

  Return ONLY the JSON object. No other text.`;

  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
  });

  const text = response.text.trim();

  // Strip markdown code fences if Gemini wraps them
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  const data = JSON.parse(cleaned);
  return data;
}


module.exports = { getLocationFarmPlan };
