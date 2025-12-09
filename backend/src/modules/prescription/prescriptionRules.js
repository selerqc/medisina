import { Engine } from 'json-rules-engine';

export const medicationDatabase = {
  FBS: [
    { name: "Metformin 500mg tab (GLUMET)", signature: " take 1 tab every 12 hrs after meal", quantity: 60 },
    { name: "Vildagliptin+Metformin 50mg/500mg tab (PROGLINMET)", signature: " take 1 tab every 12 hrs after meal", quantity: 60 },
    { name: "Gliclazide 60mg (GLUBITOR-OD)", signature: " take 1 tab once daily before breakfast", quantity: 30 }
  ],
  CHOLE: [
    { name: "Rosuvastatin 10mg tab (ROSWIN)", signature: " take 1 tab once daily at bedtime", quantity: 30 },
    { name: "Fenofibrate 160mg cap (FENOFLEX)", signature: " take 1 cap once daily with meal", quantity: 30 }
  ],
  BUA: [
    { name: "Febuxostat 40mg tab (URINORM)", signature: " take 1 tab once daily after meal", quantity: 30 }
  ],
  ALA: [
    { name: "Ketoannalogues + Essential Amino Acids tab (ALFAREN)", signature: " take 1 tab three times daily with meal", quantity: 90 }
  ],
  HTN: [
    { name: "Amlodipine+Losartan 5mg/50mg tab (AMLIFE)", signature: " take 1 tab once daily in the morning", quantity: 30 },
    { name: "Nevibolol 5mg tab (NITROXEL)", signature: " take 1 tab once daily in the morning", quantity: 30 }
  ],
  UTI: [
    { name: "Ciprofloxacin 500mg tab", signature: " take 1 tab every 12 hrs for 7 days", quantity: 14 }
  ],
  ANEMIA: [
    { name: "Ferrous Sulfate + Folic Acid tab", signature: " take 1 tab once daily after meal", quantity: 30 }
  ],
  BUN: [
    { name: "Ketoannalogues + Essential Amino Acids tab (ALFAREN)", signature: " take 1 tab three times daily with meal", quantity: 90 }
  ],
  CREA: [
    { name: "Ketoannalogues + Essential Amino Acids tab (ALFAREN)", signature: " take 1 tab three times daily with meal", quantity: 90 }
  ],
  "HIGH FBS": [
    { name: "Metformin+Sitagliptin 1000mg/50mg (TREVIAMET)", signature: " take 1 tab every 12 hrs after meal", quantity: 60 },
    { name: "Dafagliflozin 10mg tab (ASTIGET)", signature: " take 1 tab once daily in the morning", quantity: 30 }
  ],
  HYPERTHY: [
    { name: "Propylthiouracil 50mg tab", signature: " take as directed by physician", quantity: 30 }
  ],
  HYPOTHY: [
    { name: "Levothyroxine 100mcg tab (TFOUR)", signature: " take 1 tab once daily on empty stomach", quantity: 30 }
  ],
  NORMAL: [
    { name: "Vitamin B complex + Vitamin E tab (NEUROGEN E)", signature: " take 1 tab once daily after meal", quantity: 30 }
  ]
};

export const classificationRules = {
  A1: ["FBS"],
  A2: ["FBS", "CHOLE"],
  A3: ["FBS", "BUA"],
  A4: ["FBS", "ALA"],
  A5: ["FBS", "CHOLE", "ALA"],
  A6: ["FBS", "BUA", "ALA"],
  A7: ["FBS", "CHOLE", "BUA", "ALA"],
  A8: ["FBS", "CHOLE", "ALA", "UTI", "ANEMIA"],
  A9: ["FBS", "BUA", "CHOLE"],

  B1: ["CHOLE"],
  B2: ["CHOLE", "BUA"],
  B3: ["CHOLE", "ALA"],
  B4: ["CHOLE", "BUA", "ALA"],
  B5: ["CHOLE", "BUA", "HTN"],
  B6: ["CHOLE", "BUA", "ANEMIA"],
  B7: ["CHOLE", "BUA", "ALA", "HTN"],
  B8: ["CHOLE", "ALA", "HTN"],
  B9: ["CHOLE", "ANEMIA"],
  B10: ["CHOLE", "HTN"],

  C1: ["BUA"],
  C2: ["BUA", "ALA"],
  C3: ["BUA", "ALA", "ANEMIA"],
  C4: ["BUA", "ALA", "HTN"],
  C5: ["BUA", "ALA", "UTI"],
  C6: ["BUA", "HTN"],

  D1: ["ALA"],
  D2: ["ALA", "ANEMIA"],
  D3: ["ALA", "ANEMIA", "HTN"],

  E1: ["UTI"],
  E2: ["HTN"],
  E3: ["UTI", "HTN"],
  E4: ["ANEMIA"],
  E5: ["NORMAL"],

  F1: ["FBS", "BUN"],
  F2: ["FBS", "BUN", "HTN"],
  F3: ["FBS", "BUN", "CREA", "HTN"],
  F4: ["FBS", "BUN", "HIGH FBS", "HTN"],
  F5: ["HYPERTHY"],
  F6: ["HYPOTHY"]
};

const createRulesEngine = () => {
  const engine = new Engine();

  Object.entries(classificationRules).forEach(([classification, conditions]) => {
    engine.addRule({
      conditions: {
        all: [{
          fact: 'classification',
          operator: 'equal',
          value: classification
        }]
      },
      event: {
        type: 'medication-recommendation',
        params: {
          classification,
          conditions
        }
      }
    });
  });

  return engine;
};

export const getMedicationsForClassification = async (classification) => {
  if (!classification) return [];

  const classificationCode = classification.trim().split(/\s*-\s*/)[0].trim();

  const engine = createRulesEngine();

  try {
    const results = await engine.run({ classification: classificationCode });

    if (results.events.length === 0) return [];

    const event = results.events[0];
    const conditions = event.params.conditions;

    const medications = [];
    const addedMeds = new Set();

    conditions.forEach(condition => {
      const conditionMeds = medicationDatabase[condition];
      if (conditionMeds) {
        conditionMeds.forEach(med => {
          if (!addedMeds.has(med.name)) {
            medications.push({ ...med });
            addedMeds.add(med.name);
          }
        });
      }
    });

    return medications.map((med, index) => ({
      itemNumber: index + 1,
      medicationName: med.name,
      signature: med.signature,
      quantity: med.quantity
    }));
  } catch (error) {
    console.error('Error in medication rules engine:', error);
    return [];
  }
};

export const validateMedications = async (classification, medications) => {
  if (!classification || !medications || medications.length === 0) {
    return { valid: true, warnings: [] };
  }

  // Extract classification code (e.g., "A1" from "A1 - FBS + CHOLE")
  const classificationCode = classification.trim().split(/\s*-\s*/)[0].trim();

  const recommendedMeds = await getMedicationsForClassification(classificationCode);
  const warnings = [];

  const recommendedMedNames = new Set(recommendedMeds.map(m => m.medicationName));
  const providedMedNames = new Set(medications.map(m => m.medicationName));

  recommendedMedNames.forEach(medName => {
    if (!providedMedNames.has(medName)) {
      warnings.push(`Recommended medication missing: ${medName}`);
    }
  });

  return {
    valid: true,
    warnings,
    recommendedMedications: recommendedMeds
  };
};

export default {
  getMedicationsForClassification,
  validateMedications,
  medicationDatabase,
  classificationRules
};
