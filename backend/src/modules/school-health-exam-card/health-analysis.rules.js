export const nutritionalRules = [
  // Underweight
  {
    conditions: {
      all: [
        {
          fact: 'nutritionalStatusBMI',
          operator: 'contains',
          value: 'Underweight'
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'underweight',
        severity: 'medium',
        counter: 'nutritionalIssues.underweight',
        flag: 'Under Nutrition Risk',
        recommendation: 'Suggest enrollment in SBFP or nutritional counseling.'
      }
    }
  },
  // Severely Underweight
  {
    conditions: {
      all: [
        {
          fact: 'nutritionalStatusBMI',
          operator: 'contains',
          value: 'Severely'
        },
        {
          fact: 'nutritionalStatusBMI',
          operator: 'contains',
          value: 'Underweight'
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'severelyUnderweight',
        severity: 'high',
        counter: 'nutritionalIssues.severelyUnderweight',
        flag: 'Severe Under Nutrition Risk',
        recommendation: 'Urgent enrollment in SBFP or nutritional counseling required.'
      }
    }
  },
  // Wasted variants
  {
    conditions: {
      any: [
        {
          fact: 'bmiForAge',
          operator: 'in',
          value: ['Wasted/Underweight', 'Wasted']
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'underweight',
        severity: 'high',
        counter: 'nutritionalIssues.underweight',
        flag: 'Under Nutrition Risk',
        recommendation: 'Suggest enrollment in SBFP or nutritional counseling.'
      }
    }
  },
  // Severely Wasted
  {
    conditions: {
      any: [
        {
          fact: 'bmiForAge',
          operator: 'in',
          value: ['Severely Wasted/Underweight', 'Severely Wasted']
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'severelyUnderweight',
        severity: 'critical',
        counter: 'nutritionalIssues.severelyUnderweight',
        flag: 'Severe Under Nutrition Risk',
        recommendation: 'Urgent enrollment in SBFP or nutritional counseling required.'
      }
    }
  },
  // Overweight
  {
    conditions: {
      any: [
        {
          fact: 'nutritionalStatusBMI',
          operator: 'equal',
          value: 'Overweight'
        },
        {
          fact: 'bmiForAge',
          operator: 'equal',
          value: 'Overweight'
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'overweight',
        severity: 'medium',
        counter: 'nutritionalIssues.overweight',
        flag: 'Obesity Risk',
        recommendation: 'Suggest enrollment in SBFP or nutritional counseling.'
      }
    }
  },
  // Obese
  {
    conditions: {
      any: [
        {
          fact: 'nutritionalStatusBMI',
          operator: 'equal',
          value: 'Obese'
        },
        {
          fact: 'bmiForAge',
          operator: 'equal',
          value: 'Obese'
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'obese',
        severity: 'high',
        counter: 'nutritionalIssues.obese',
        flag: 'Obesity Risk',
        recommendation: 'Suggest enrollment in SBFP or nutritional counseling.'
      }
    }
  },
  // Stunted
  {
    conditions: {
      any: [
        {
          fact: 'nutritionalStatusHeightForAge',
          operator: 'equal',
          value: 'Stunted'
        },
        {
          fact: 'heightForAge',
          operator: 'equal',
          value: 'Stunted'
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'stunted',
        severity: 'high',
        counter: 'nutritionalIssues.stunted',
        flag: 'Growth Delay',
        recommendation: 'Suggest enrollment in SBFP or nutritional counseling.'
      }
    }
  },
  // Severely Stunted
  {
    conditions: {
      any: [
        {
          fact: 'nutritionalStatusHeightForAge',
          operator: 'equal',
          value: 'Severely Stunted'
        },
        {
          fact: 'heightForAge',
          operator: 'equal',
          value: 'Severely Stunted'
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'severelyStunted',
        severity: 'critical',
        counter: 'nutritionalIssues.severelyStunted',
        flag: 'Severe Growth Delay',
        recommendation: 'Urgent nutritional intervention and growth monitoring required.'
      }
    }
  },
  // Short Stature (height-based)
  {
    conditions: {
      all: [
        {
          fact: 'heightInCm',
          operator: 'lessThan',
          value: 100
        },
        {
          fact: 'heightInCm',
          operator: 'greaterThan',
          value: 0
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'stunted',
        severity: 'medium',
        counter: 'nutritionalIssues.stunted',
        flag: 'Short Stature',
        recommendation: 'Monitor growth, consider referral.'
      }
    }
  },
  // Low Weight (weight-based)
  {
    conditions: {
      all: [
        {
          fact: 'weightInKg',
          operator: 'lessThan',
          value: 20
        },
        {
          fact: 'weightInKg',
          operator: 'greaterThan',
          value: 0
        }
      ]
    },
    event: {
      type: 'nutritional-issue',
      params: {
        category: 'underweight',
        severity: 'medium',
        counter: 'nutritionalIssues.underweight',
        flag: 'Low Weight',
        recommendation: 'Monitor nutrition, consider referral.'
      }
    }
  }
];

// =============================================================================
// SCREENING RULES (Vision & Hearing)
// =============================================================================

export const screeningRules = [
  {
    conditions: {
      any: [
        {
          fact: 'visionScreening',
          operator: 'equal',
          value: 'Failed'
        },
        {
          fact: 'vision',
          operator: 'equal',
          value: 'Failed'
        }
      ]
    },
    event: {
      type: 'screening-failure',
      params: {
        category: 'vision',
        severity: 'medium',
        counter: 'screeningFailures.vision',
        flag: 'Vision Problem',
        recommendation: 'Refer to ophthalmologist / provision of eyeglasses.'
      }
    }
  },
  {
    conditions: {
      any: [
        {
          fact: 'auditoryScreening',
          operator: 'equal',
          value: 'Failed'
        }
      ]
    },
    event: {
      type: 'screening-failure',
      params: {
        category: 'hearing',
        severity: 'medium',
        counter: 'screeningFailures.hearing',
        flag: 'Hearing Problem',
        recommendation: 'Recommend ENT consultation.'
      }
    }
  }
];

// =============================================================================
// PHYSICAL CONDITION RULES
// =============================================================================

export const physicalConditionRules = [
  // Lice
  {
    conditions: {
      any: [
        {
          fact: 'skinScalp',
          operator: 'equal',
          value: 'Presence of Lice'
        },
        {
          fact: 'lice',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'lice',
        severity: 'low',
        counter: 'physicalConditions.lice',
        flag: 'Communicable Disease',
        recommendation: 'Health counseling and treatment recommendation. Family education advised.'
      }
    }
  },
  // Skin Infections
  {
    conditions: {
      any: [
        {
          fact: 'skinScalp',
          operator: 'in',
          value: ['Impetigo/boil', 'Skin Lesions', 'Acne/Pimple', 'Redness of Skin', 'White Spots', 'Flaky Skin']
        },
        {
          fact: 'boils',
          operator: 'equal',
          value: true
        },
        {
          fact: 'skinInfection',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'skinInfections',
        severity: 'medium',
        counter: 'physicalConditions.skinInfections',
        flag: 'Communicable Disease',
        recommendation: 'Health counseling and treatment recommendation. Family education advised.'
      }
    }
  },
  // Trauma/Injuries
  {
    conditions: {
      any: [
        {
          fact: 'skinScalp',
          operator: 'in',
          value: ['Hematoma', 'Bruises/Injuries']
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'trauma',
        severity: 'medium',
        counter: 'physicalConditions.trauma',
        flag: 'Physical Trauma/Injury',
        recommendation: 'Assess for recent injury. Monitor for signs of abuse or neglect. Document and refer if necessary.'
      }
    }
  },
  // Scabies
  {
    conditions: {
      any: [
        {
          fact: 'skinScalp',
          operator: 'equal',
          value: 'Itchiness'
        },
        {
          fact: 'scabies',
          operator: 'equal',
          value: true
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'skinInfections',
        severity: 'medium',
        counter: 'physicalConditions.skinInfections',
        flag: 'Communicable Disease',
        recommendation: 'Health counseling and treatment recommendation. Family education advised.'
      }
    }
  },
  // Anemia Indicator
  {
    conditions: {
      all: [
        {
          fact: 'eyesEarsNose',
          operator: 'equal',
          value: 'Pale Conjunctiva'
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'anemia',
        severity: 'high',
        counter: 'physicalConditions.anemia',
        flag: 'Possible Anemia',
        recommendation: 'Refer for blood test and nutritional assessment. Consider iron supplementation.'
      }
    }
  },
  // Eye Problems
  {
    conditions: {
      all: [
        {
          fact: 'eyesEarsNose',
          operator: 'in',
          value: ['Stye', 'Eye Redness', 'Eye discharge', 'Matted Eyelashes', 'Ocular Misalignment']
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'eyeProblems',
        severity: 'medium',
        counter: 'physicalConditions.eyeProblems',
        flag: 'Eye Problem',
        recommendation: 'Recommend eye examination and treatment.'
      }
    }
  },
  // Ear Problems
  {
    conditions: {
      all: [
        {
          fact: 'eyesEarsNose',
          operator: 'in',
          value: ['Ear discharge', 'Impacted cerumen']
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'earProblems',
        severity: 'medium',
        counter: 'physicalConditions.earProblems',
        flag: 'Ear Problem',
        recommendation: 'Recommend ENT consultation.'
      }
    }
  },
  // Nose Problems
  {
    conditions: {
      all: [
        {
          fact: 'eyesEarsNose',
          operator: 'in',
          value: ['Mucus discharge', 'Nose Bleeding (Epistaxis)']
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'noseProblems',
        severity: 'medium',
        counter: 'physicalConditions.noseProblems',
        flag: 'Nasal Problem',
        recommendation: 'Recommend ENT consultation.'
      }
    }
  },
  // Enlarged Lymphnodes (Infection/Immune Response)
  {
    conditions: {
      all: [
        {
          fact: 'mouthThroatNeck',
          operator: 'equal',
          value: 'Enlarged lymphnodes'
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'lymphaticIssues',
        severity: 'high',
        counter: 'physicalConditions.lymphaticIssues',
        flag: 'Possible Infection/Immune Response',
        recommendation: 'Refer for medical evaluation to determine cause of lymph node enlargement.'
      }
    }
  },
  // Throat Problems
  {
    conditions: {
      all: [
        {
          fact: 'mouthThroatNeck',
          operator: 'in',
          value: ['Enlarged tonsils', 'Presence of lesions', 'Inflamed pharynx']
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'throatProblems',
        severity: 'medium',
        counter: 'physicalConditions.throatProblems',
        flag: 'Throat Problem',
        recommendation: 'Recommend medical examination and treatment.'
      }
    }
  },
  // Respiratory Issues
  {
    conditions: {
      any: [
        {
          fact: 'lungsHeart',
          operator: 'in',
          value: ['Rales', 'Wheeze']
        },
        {
          fact: 'lungFindings',
          operator: 'equal',
          value: 'Abnormal'
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'respiratoryIssues',
        severity: 'high',
        counter: 'physicalConditions.respiratoryIssues',
        flag: 'Possible Respiratory/Cardiac Issue',
        recommendation: 'Suggest referral to health center.'
      }
    }
  },
  // Cardiac Issues
  {
    conditions: {
      any: [
        {
          fact: 'lungsHeart',
          operator: 'in',
          value: ['Murmur', 'Irregular heart rate']
        },
        {
          fact: 'heartFindings',
          operator: 'equal',
          value: 'Abnormal'
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'cardiacIssues',
        severity: 'high',
        counter: 'physicalConditions.cardiacIssues',
        flag: 'Possible Respiratory/Cardiac Issue',
        recommendation: 'Suggest referral to health center.'
      }
    }
  },
  // Abdominal Distension
  {
    conditions: {
      all: [
        {
          fact: 'abdomen',
          operator: 'equal',
          value: 'Distended'
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'abdominalIssues',
        severity: 'medium',
        counter: 'physicalConditions.abdominalIssues',
        flag: 'Abdominal Distension',
        recommendation: 'Refer for medical examination to rule out parasitic infection, malnutrition, or other gastrointestinal issues.'
      }
    }
  },
  // Abdominal Pain
  {
    conditions: {
      all: [
        {
          fact: 'abdomen',
          operator: 'equal',
          value: 'Abdominal Pain'
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'abdominalIssues',
        severity: 'high',
        counter: 'physicalConditions.abdominalIssues',
        flag: 'Abdominal Pain',
        recommendation: 'Immediate medical evaluation required to determine cause.'
      }
    }
  },
  // Abdominal Tenderness
  {
    conditions: {
      all: [
        {
          fact: 'abdomen',
          operator: 'equal',
          value: 'Tenderness'
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'abdominalIssues',
        severity: 'high',
        counter: 'physicalConditions.abdominalIssues',
        flag: 'Abdominal Tenderness',
        recommendation: 'Urgent medical evaluation needed. May indicate appendicitis or other acute conditions.'
      }
    }
  },
  // Dysmenorrhea
  {
    conditions: {
      all: [
        {
          fact: 'abdomen',
          operator: 'equal',
          value: 'Dysmenorrhea'
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'reproductiveHealth',
        severity: 'low',
        counter: 'physicalConditions.reproductiveHealth',
        flag: 'Dysmenorrhea',
        recommendation: 'Provide health education on menstrual hygiene. Refer for pain management if severe.'
      }
    }
  },
  // Deformities
  {
    conditions: {
      all: [
        {
          fact: 'deformities',
          operator: 'notEqual',
          value: 'Not Examined'
        },
        {
          fact: 'deformities',
          operator: 'notEqual',
          value: ''
        }
      ]
    },
    event: {
      type: 'physical-condition',
      params: {
        category: 'deformities',
        severity: 'high',
        counter: 'physicalConditions.deformities',
        flag: 'Physical Deformity',
        recommendation: 'Recommend specialist consultation.'
      }
    }
  }
];

// =============================================================================
// PREVENTIVE CARE RULES
// =============================================================================

export const preventiveCareRules = [
  {
    conditions: {
      any: [
        {
          fact: 'immunization',
          operator: 'notEqual',
          value: 'Complete'
        },
        {
          fact: 'immunization',
          operator: 'equal',
          value: null
        },
        {
          fact: 'immunization',
          operator: 'equal',
          value: ''
        }
      ]
    },
    event: {
      type: 'preventive-care',
      params: {
        category: 'incompleteImmunization',
        severity: 'high',
        counter: 'preventiveCare.incompleteImmunization',
        flag: 'Immunization Incomplete',
        recommendation: 'Check vaccination status with RHU.'
      }
    }
  },
  {
    conditions: {
      any: [
        {
          fact: 'deworming',
          operator: 'equal',
          value: false
        },
        {
          fact: 'deworming',
          operator: 'equal',
          value: null
        }
      ]
    },
    event: {
      type: 'preventive-care',
      params: {
        category: 'notDewormed',
        severity: 'medium',
        counter: 'preventiveCare.notDewormed',
        flag: 'Deworming Not Done',
        recommendation: 'Suggest schedule deworming.'
      }
    }
  },
  {
    conditions: {
      any: [
        {
          fact: 'ironSupplementation',
          operator: 'equal',
          value: false
        },
        {
          fact: 'ironSupplementation',
          operator: 'equal',
          value: null
        }
      ]
    },
    event: {
      type: 'preventive-care',
      params: {
        category: 'noIronSupplementation',
        severity: 'medium',
        counter: 'preventiveCare.noIronSupplementation',
        flag: 'Iron Supplementation Missing',
        recommendation: 'Recommend iron drops/folate supplementation.'
      }
    }
  }
];

// =============================================================================
// RISK LEVEL RULES (For population counting)
// =============================================================================

export const riskLevelRules = [
  {
    conditions: {
      all: [
        {
          fact: 'riskLevel',
          operator: 'equal',
          value: 'HIGH'
        }
      ]
    },
    event: {
      type: 'risk-level',
      params: {
        level: 'HIGH',
        counter: 'riskDistribution.HIGH'
      }
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'riskLevel',
          operator: 'equal',
          value: 'MEDIUM'
        }
      ]
    },
    event: {
      type: 'risk-level',
      params: {
        level: 'MEDIUM',
        counter: 'riskDistribution.MEDIUM'
      }
    }
  },
  {
    conditions: {
      all: [
        {
          fact: 'riskLevel',
          operator: 'equal',
          value: 'LOW'
        }
      ]
    },
    event: {
      type: 'risk-level',
      params: {
        level: 'LOW',
        counter: 'riskDistribution.LOW'
      }
    }
  },
  {
    conditions: {
      any: [
        {
          fact: 'riskLevel',
          operator: 'equal',
          value: null
        },
        {
          fact: 'riskLevel',
          operator: 'equal',
          value: 'UNKNOWN'
        }
      ]
    },
    event: {
      type: 'risk-level',
      params: {
        level: 'UNKNOWN',
        counter: 'riskDistribution.UNKNOWN'
      }
    }
  }
];

// =============================================================================
// RISK STRATIFICATION RULES (For individual assessment)
// =============================================================================

export const riskStratificationRules = [
  // High Risk Rules - Priority 1
  {
    conditions: {
      any: [
        {
          fact: 'bmiForAge',
          operator: 'in',
          value: ['Severely Wasted', 'Severely Wasted/Underweight']
        },
        {
          fact: 'nutritionalStatusBMI',
          operator: 'contains',
          value: 'Severely'
        },
        {
          fact: 'vision',
          operator: 'equal',
          value: 'Failed'
        },
        {
          fact: 'visionScreening',
          operator: 'equal',
          value: 'Failed'
        },
        {
          fact: 'auditoryScreening',
          operator: 'equal',
          value: 'Failed'
        },
        {
          fact: 'heartFindings',
          operator: 'equal',
          value: 'Abnormal'
        },
        {
          fact: 'lungFindings',
          operator: 'equal',
          value: 'Abnormal'
        },
        {
          fact: 'lungsHeart',
          operator: 'in',
          value: ['Murmur', 'Irregular heart rate', 'Rales', 'Wheeze']
        },
        {
          fact: 'eyesEarsNose',
          operator: 'equal',
          value: 'Pale Conjunctiva'
        },
        {
          fact: 'mouthThroatNeck',
          operator: 'equal',
          value: 'Enlarged lymphnodes'
        },
        {
          fact: 'abdomen',
          operator: 'in',
          value: ['Abdominal Pain', 'Tenderness']
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
  // Medium Risk Rules - Priority 2
  {
    conditions: {
      all: [
        {
          fact: 'bmiForAge',
          operator: 'notIn',
          value: ['Severely Wasted', 'Severely Wasted/Underweight']
        },
        {
          fact: 'vision',
          operator: 'notEqual',
          value: 'Failed'
        },
        {
          fact: 'visionScreening',
          operator: 'notEqual',
          value: 'Failed'
        },
        {
          fact: 'auditoryScreening',
          operator: 'notEqual',
          value: 'Failed'
        },
        {
          fact: 'heartFindings',
          operator: 'notEqual',
          value: 'Abnormal'
        },
        {
          fact: 'lungFindings',
          operator: 'notEqual',
          value: 'Abnormal'
        }
      ],
      any: [
        {
          fact: 'bmiForAge',
          operator: 'in',
          value: ['Overweight', 'Obese']
        },
        {
          fact: 'nutritionalStatusBMI',
          operator: 'in',
          value: ['Overweight', 'Obese']
        },
        {
          fact: 'lice',
          operator: 'equal',
          value: true
        },
        {
          fact: 'skinScalp',
          operator: 'equal',
          value: 'Presence of Lice'
        },
        {
          fact: 'tonsils',
          operator: 'equal',
          value: 'Enlarged'
        },
        {
          fact: 'skinInfection',
          operator: 'equal',
          value: true
        },
        {
          fact: 'skinScalp',
          operator: 'in',
          value: ['Impetigo/boil', 'Skin Lesions', 'Itchiness']
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
  // Low Risk Rules - Priority 3
  {
    conditions: {
      all: [
        {
          fact: 'bmiForAge',
          operator: 'in',
          value: ['Normal', 'Normal Weight']
        },
        {
          fact: 'vision',
          operator: 'equal',
          value: 'Passed'
        },
        {
          fact: 'auditoryScreening',
          operator: 'equal',
          value: 'Passed'
        },
        {
          fact: 'heartFindings',
          operator: 'equal',
          value: 'Normal'
        },
        {
          fact: 'lungFindings',
          operator: 'equal',
          value: 'Normal'
        },
        {
          fact: 'immunization',
          operator: 'equal',
          value: 'Complete'
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

// Export all rule sets
export const allRules = {
  nutritional: nutritionalRules,
  screening: screeningRules,
  physical: physicalConditionRules,
  preventiveCare: preventiveCareRules,
  riskLevel: riskLevelRules,
  riskStratification: riskStratificationRules
};
