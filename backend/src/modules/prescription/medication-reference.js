export const medicationDatabase = {
  nutritional: {
    underweight: [
      {
        name: "Multivitamin Syrup",
        genericName: "Multivitamins + Minerals",
        dosage: "5ml",
        frequency: "Once daily",
        duration: "30 days",
        quantity: 1,
        route: "Oral",
        instructions: "Take after meals"
      },
      {
        name: "Iron Supplement",
        genericName: "Ferrous Sulfate",
        dosage: "60mg",
        frequency: "Once daily",
        duration: "30 days",
        quantity: 30,
        route: "Oral",
        instructions: "Take with orange juice for better absorption"
      }
    ],
    overweight: [
      {
        name: "Dietary Fiber Supplement",
        genericName: "Psyllium Husk",
        dosage: "5g",
        frequency: "Twice daily",
        duration: "30 days",
        quantity: 60,
        route: "Oral",
        instructions: "Mix with water before meals"
      }
    ]
  },

  skinInfections: {
    lice: [
      {
        name: "Permethrin Lotion",
        genericName: "Permethrin 1%",
        dosage: "Applied to scalp",
        frequency: "Single application",
        duration: "1 day",
        quantity: 1,
        route: "Topical",
        instructions: "Apply to dry hair, leave for 10 minutes, rinse thoroughly"
      }
    ],
    scabies: [
      {
        name: "Permethrin Cream",
        genericName: "Permethrin 5%",
        dosage: "Applied to affected areas",
        frequency: "Once, repeat after 7 days",
        duration: "14 days",
        quantity: 1,
        route: "Topical",
        instructions: "Apply from neck down, wash off after 8-14 hours"
      }
    ],
    skinInfection: [
      {
        name: "Antibiotic Ointment",
        genericName: "Mupirocin 2%",
        dosage: "Applied to affected area",
        frequency: "Three times daily",
        duration: "7 days",
        quantity: 1,
        route: "Topical",
        instructions: "Clean area before application"
      }
    ]
  },

  respiratory: {
    cough: [
      {
        name: "Cough Syrup",
        genericName: "Dextromethorphan",
        dosage: "10ml",
        frequency: "Every 6 hours as needed",
        duration: "7 days",
        quantity: 1,
        route: "Oral",
        instructions: "Take after meals, avoid if productive cough"
      }
    ],
    asthma: [
      {
        name: "Salbutamol Inhaler",
        genericName: "Salbutamol 100mcg",
        dosage: "2 puffs",
        frequency: "As needed for wheezing",
        duration: "30 days",
        quantity: 1,
        route: "Inhalation",
        instructions: "Shake well before use, rinse mouth after"
      }
    ]
  },

  cardiovascular: {
    hypertension: [
      {
        name: "Amlodipine",
        genericName: "Amlodipine Besylate",
        dosage: "5mg",
        frequency: "Once daily",
        duration: "30 days",
        quantity: 30,
        route: "Oral",
        instructions: "Take in the morning with or without food"
      }
    ]
  },

  endocrine: {
    diabetes: [
      {
        name: "Metformin",
        genericName: "Metformin HCl",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "30 days",
        quantity: 60,
        route: "Oral",
        instructions: "Take with meals to reduce stomach upset"
      }
    ]
  },

  analgesics: {
    general: [
      {
        name: "Paracetamol",
        genericName: "Acetaminophen",
        dosage: "500mg",
        frequency: "Every 6 hours as needed",
        duration: "5 days",
        quantity: 20,
        route: "Oral",
        instructions: "Take with food, do not exceed 4g per day"
      },
      {
        name: "Ibuprofen",
        genericName: "Ibuprofen",
        dosage: "400mg",
        frequency: "Every 8 hours as needed",
        duration: "5 days",
        quantity: 15,
        route: "Oral",
        instructions: "Take with food to prevent stomach upset"
      }
    ]
  },

  gastrointestinal: {
    stomachPain: [
      {
        name: "Antacid",
        genericName: "Aluminum Hydroxide + Magnesium Hydroxide",
        dosage: "10ml",
        frequency: "Three times daily",
        duration: "7 days",
        quantity: 1,
        route: "Oral",
        instructions: "Take between meals and at bedtime"
      }
    ]
  },

  antihistamines: {
    allergies: [
      {
        name: "Cetirizine",
        genericName: "Cetirizine HCl",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "7 days",
        quantity: 7,
        route: "Oral",
        instructions: "Take in the evening, may cause drowsiness"
      }
    ]
  },

  deworming: {
    general: [
      {
        name: "Mebendazole",
        genericName: "Mebendazole",
        dosage: "500mg",
        frequency: "Single dose",
        duration: "1 day",
        quantity: 1,
        route: "Oral",
        instructions: "Can be taken with or without food"
      }
    ]
  },

  vitamins: {
    general: [
      {
        name: "Vitamin C",
        genericName: "Ascorbic Acid",
        dosage: "500mg",
        frequency: "Once daily",
        duration: "30 days",
        quantity: 30,
        route: "Oral",
        instructions: "Take with meals"
      }
    ],
    iron: [
      {
        name: "Iron Supplement",
        genericName: "Ferrous Sulfate",
        dosage: "60mg",
        frequency: "Once daily",
        duration: "60 days",
        quantity: 60,
        route: "Oral",
        instructions: "Take on empty stomach if tolerated, or with food"
      }
    ]
  }
};

export const conditionMedicationMap = {
  'Under Nutrition Risk': 'nutritional.underweight',
  'Severe Under Nutrition Risk': 'nutritional.underweight',
  'Obesity Risk': 'nutritional.overweight',
  'Presence of Lice': 'skinInfections.lice',
  'Scabies': 'skinInfections.scabies',
  'Skin Infection': 'skinInfections.skinInfection',
  'Hypertension': 'cardiovascular.hypertension',
  'Diabetes': 'endocrine.diabetes',
  'PTB Suspect': 'respiratory.asthma',
  'Vision Problem': 'analgesics.general',
  'Hearing Problem': 'analgesics.general'
};

export function getMedicationsForCondition(condition) {
  const path = conditionMedicationMap[condition];
  if (!path) return [];

  const [category, subcategory] = path.split('.');
  return medicationDatabase[category]?.[subcategory] || [];
}

export function getMedicationsForRecommendation(recommendation) {
  const lowerRec = recommendation.toLowerCase();

  if (lowerRec.includes('nutritional') || lowerRec.includes('sbfp')) {
    return medicationDatabase.nutritional.underweight;
  }

  if (lowerRec.includes('deworming')) {
    return medicationDatabase.deworming.general;
  }

  if (lowerRec.includes('iron')) {
    return medicationDatabase.vitamins.iron;
  }

  if (lowerRec.includes('vitamin')) {
    return medicationDatabase.vitamins.general;
  }

  return [];
}
