
export const hypertensionRules = [
  {
    conditions: {
      any: [
        {
          fact: 'familyHistory.hypertension',
          operator: 'equal',
          value: true
        },
        {
          fact: 'pastMedicalHistory.hypertension',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.chestBackPain',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'health-risk',
      params: {
        category: 'hypertension',
        severity: 'high',
        counter: 'healthRisks.hypertension',
        flag: 'Hypertension',
        recommendations: [
          'Check BP regularly',
          'Annual ECG',
          'Lifestyle modification'
        ]
      }
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'testResults.ecg.result',
          operator: 'notEqual',
          value: null
        }
      ],
      any: [
        {
          fact: 'testResults.ecg.result',
          operator: 'equal',
          value: 'abnormal'
        },
        {
          fact: 'testResults.ecg.result',
          operator: 'equal',
          value: 'Abnormal'
        }
      ]
    },
    event: {
      type: 'health-risk',
      params: {
        category: 'hypertension',
        severity: 'high',
        counter: 'healthRisks.hypertension',
        flag: 'Hypertension',
        recommendations: [
          'Check BP regularly',
          'Annual ECG',
          'Lifestyle modification'
        ]
      }
    }
  }
];


export const diabetesRules = [
  {
    conditions: {
      any: [
        {
          fact: 'familyHistory.diabetesMellitus',
          operator: 'equal',
          value: true
        },
        {
          fact: 'pastMedicalHistory.diabetesMellitus',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.easyFatigability',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'health-risk',
      params: {
        category: 'diabetes',
        severity: 'high',
        counter: 'healthRisks.diabetes',
        flag: 'Diabetes',
        recommendations: [
          'Recommend fasting blood sugar test'
        ]
      }
    }
  }
];


export const cvdRules = [
  {
    conditions: {
      any: [
        {
          fact: 'familyHistory.cardiovascularDisease',
          operator: 'equal',
          value: true
        },
        {
          fact: 'pastMedicalHistory.cardiovascularDisease',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.chestBackPain',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'health-risk',
      params: {
        category: 'cvd',
        severity: 'critical',
        counter: 'healthRisks.cvd',
        flag: 'Cardiovascular Disease',
        recommendations: [
          'Prioritize ECG',
          'Lifestyle modification'
        ]
      }
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'testResults.ecg.result',
          operator: 'notEqual',
          value: null
        }
      ],
      any: [
        {
          fact: 'testResults.ecg.result',
          operator: 'equal',
          value: 'abnormal'
        },
        {
          fact: 'testResults.ecg.result',
          operator: 'equal',
          value: 'Abnormal'
        }
      ]
    },
    event: {
      type: 'health-risk',
      params: {
        category: 'cvd',
        severity: 'critical',
        counter: 'healthRisks.cvd',
        flag: 'Cardiovascular Disease',
        recommendations: [
          'Prioritize ECG',
          'Lifestyle modification'
        ]
      }
    }
  }
];


export const ptbRules = [
  {
    conditions: {
      any: [
        {
          fact: 'pastMedicalHistory.tuberculosis',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'health-risk',
      params: {
        category: 'ptb',
        severity: 'high',
        counter: 'healthRisks.ptb',
        flag: 'PTB Suspect',
        recommendations: [
          'Recommend sputum test',
          'Refer to RHU'
        ]
      }
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'presentHealthStatus.cough',
          operator: 'notEqual',
          value: null
        },
        {
          fact: 'presentHealthStatus.cough',
          operator: 'notEqual',
          value: ''
        }
      ]
    },
    event: {
      type: 'health-risk',
      params: {
        category: 'ptb',
        severity: 'medium',
        counter: 'healthRisks.ptb',
        flag: 'PTB Suspect',
        recommendations: [
          'Recommend sputum test',
          'Refer to RHU'
        ]
      }
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'testResults.cxrSputum.result',
          operator: 'notEqual',
          value: null
        },
        {
          fact: 'testResults.cxrSputum.result',
          operator: 'notEqual',
          value: ''
        },
        {
          fact: 'testResults.cxrSputum.result',
          operator: 'notEqual',
          value: 'clear'
        },
        {
          fact: 'testResults.cxrSputum.result',
          operator: 'notEqual',
          value: 'Clear'
        },
        {
          fact: 'testResults.cxrSputum.result',
          operator: 'notEqual',
          value: 'normal'
        },
        {
          fact: 'testResults.cxrSputum.result',
          operator: 'notEqual',
          value: 'Normal'
        }
      ]
    },
    event: {
      type: 'health-risk',
      params: {
        category: 'ptb',
        severity: 'high',
        counter: 'healthRisks.ptb',
        flag: 'PTB Suspect',
        recommendations: [
          'Recommend sputum test',
          'Refer to RHU'
        ]
      }
    }
  }
];

export const malariaRules = [
  {
    conditions: {
      all: [
        {
          fact: 'presentHealthStatus.malaria',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'health-risk',
      params: {
        category: 'malaria',
        severity: 'critical',
        counter: 'healthRisks.malaria',
        flag: 'Malaria',
        recommendations: [
          'Trigger vector control',
          'Coordinate with RHU'
        ]
      }
    }
  }
];

export const occupationalFitnessRules = [
  {
    conditions: {
      any: [
        {
          fact: 'presentHealthStatus.dizziness',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.chestBackPain',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.dyspnea',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'occupational-fitness',
      params: {
        category: 'fitnessToWork',
        severity: 'medium',
        counter: 'occupationalFitness.needsClearance',
        flag: 'Needs fitness-to-work clearance',
        recommendations: [
          'Refer for fitness-to-work clearance'
        ]
      }
    }
  },
  {
    conditions: {
      any: [
        {
          fact: 'presentHealthStatus.syncope',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.convulsions',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'occupational-fitness',
      params: {
        category: 'immediateReferral',
        severity: 'critical',
        counter: 'occupationalFitness.immediateReferral',
        flag: 'Immediate referral to physician',
        recommendations: [
          'Immediate referral to physician'
        ]
      }
    }
  }
];

export const smokingRules = [
  {
    conditions: {
      all: [
        {
          fact: 'socialHistory.smoking.status',
          operator: 'equal',
          value: true
        },
        {
          fact: 'smokingPackYears',
          operator: 'greaterThan',
          value: 10
        }
      ]
    },
    event: {
      type: 'lifestyle-risk',
      params: {
        category: 'smoking',
        severity: 'high',
        counter: 'lifestyleRisks.smoking',
        flag: 'High risk: Smoking',
        recommendations: [
          'Smoking cessation counseling'
        ]
      }
    }
  }
];

export const alcoholRules = [
  {
    conditions: {
      all: [
        {
          fact: 'socialHistory.alcohol.status',
          operator: 'equal',
          value: true
        },
        {
          fact: 'socialHistory.alcohol.frequency',
          operator: 'equal',
          value: 'frequent'
        }
      ]
    },
    event: {
      type: 'lifestyle-risk',
      params: {
        category: 'alcohol',
        severity: 'medium',
        counter: 'lifestyleRisks.alcohol',
        flag: 'Risky behavior: Alcohol',
        recommendations: [
          'Recommend counseling'
        ]
      }
    }
  }
];

export const femaleReproRules = [
  {
    conditions: {
      all: [
        {
          fact: 'gender',
          operator: 'equal',
          value: 'F'
        },
        {
          fact: 'obGynHistory',
          operator: 'notEqual',
          value: null
        }
      ],
      any: [
        {
          fact: 'obGynHistory.papsmearDone.status',
          operator: 'equal',
          value: false
        },
        {
          fact: 'obGynHistory.papsmearDone.status',
          operator: 'equal',
          value: null
        }
      ]
    },
    event: {
      type: 'reproductive-health',
      params: {
        category: 'cervicalScreening',
        severity: 'medium',
        counter: 'reproductiveHealth.cervicalScreening',
        flag: 'Cervical cancer screening needed',
        recommendations: [
          'Schedule cervical cancer screening'
        ]
      }
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'gender',
          operator: 'equal',
          value: 'F'
        },
        {
          fact: 'obGynHistory',
          operator: 'notEqual',
          value: null
        }
      ],
      any: [
        {
          fact: 'obGynHistory.selfBreastExamDone',
          operator: 'equal',
          value: false
        },
        {
          fact: 'obGynHistory.massNoted.status',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'reproductive-health',
      params: {
        category: 'breastExam',
        severity: 'medium',
        counter: 'reproductiveHealth.breastExam',
        flag: 'Breast exam needed',
        recommendations: [
          'Refer to OB-Gyn'
        ]
      }
    }
  }
];

export const maleReproRules = [
  {
    conditions: {
      all: [
        {
          fact: 'gender',
          operator: 'equal',
          value: 'M'
        },
        {
          fact: 'age',
          operator: 'greaterThanInclusive',
          value: 50
        }
      ],
      any: [
        {
          fact: 'maleExamination.digitalRectalExamDone',
          operator: 'equal',
          value: false
        },
        {
          fact: 'maleExamination.digitalRectalExamDone',
          operator: 'equal',
          value: null
        },
        {
          fact: 'maleExamination',
          operator: 'equal',
          value: null
        }
      ]
    },
    event: {
      type: 'reproductive-health',
      params: {
        category: 'prostateExam',
        severity: 'medium',
        counter: 'reproductiveHealth.prostateExam',
        flag: 'Prostate exam needed',
        recommendations: [
          'Schedule digital rectal exam'
        ]
      }
    }
  }
];

export const riskStratificationRules = [
  // High Risk - Priority 1
  {
    conditions: {
      any: [
        {
          fact: 'pastMedicalHistory.cardiovascularDisease',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.syncope',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.convulsions',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.malaria',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'risk-stratification',
      params: {
        riskLevel: 'High Risk',
        priority: 1
      }
    }
  },
  // Medium Risk - Priority 2
  {
    conditions: {
      all: [
        {
          fact: 'pastMedicalHistory.cardiovascularDisease',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'presentHealthStatus.syncope',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'presentHealthStatus.convulsions',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'presentHealthStatus.malaria',
          operator: 'notEqual',
          value: true
        }
      ],
      any: [
        {
          fact: 'familyHistory.hypertension',
          operator: 'equal',
          value: true
        },
        {
          fact: 'pastMedicalHistory.hypertension',
          operator: 'equal',
          value: true
        },
        {
          fact: 'familyHistory.diabetesMellitus',
          operator: 'equal',
          value: true
        },
        {
          fact: 'pastMedicalHistory.diabetesMellitus',
          operator: 'equal',
          value: true
        },
        {
          fact: 'pastMedicalHistory.tuberculosis',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.dizziness',
          operator: 'equal',
          value: true
        },
        {
          fact: 'presentHealthStatus.dyspnea',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'risk-stratification',
      params: {
        riskLevel: 'Medium Risk',
        priority: 2
      }
    }
  },
  // Low Risk - Priority 3
  {
    conditions: {
      all: [
        {
          fact: 'pastMedicalHistory.cardiovascularDisease',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'pastMedicalHistory.hypertension',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'pastMedicalHistory.diabetesMellitus',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'pastMedicalHistory.tuberculosis',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'presentHealthStatus.syncope',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'presentHealthStatus.convulsions',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'presentHealthStatus.malaria',
          operator: 'notEqual',
          value: true
        },
        {
          fact: 'presentHealthStatus.dizziness',
          operator: 'notEqual',
          value: true
        }
      ]
    },
    event: {
      type: 'risk-stratification',
      params: {
        riskLevel: 'Low Risk',
        priority: 3
      }
    }
  }
];


export const allRules = {
  hypertension: hypertensionRules,
  diabetes: diabetesRules,
  cvd: cvdRules,
  ptb: ptbRules,
  malaria: malariaRules,
  occupationalFitness: occupationalFitnessRules,
  smoking: smokingRules,
  alcohol: alcoholRules,
  femaleRepro: femaleReproRules,
  maleRepro: maleReproRules,
  riskStratification: riskStratificationRules
};
