import * as ss from 'simple-statistics';
import { Engine } from 'json-rules-engine';
import { allRules } from './personnel-health-analysis.rules.js';

class PersonnelHealthDSSService {
  constructor() {
    this.initializeEngines();
  }


  initializeEngines() {
    this.engines = {
      hypertension: new Engine(),
      diabetes: new Engine(),
      cvd: new Engine(),
      ptb: new Engine(),
      malaria: new Engine(),
      occupationalFitness: new Engine(),
      smoking: new Engine(),
      alcohol: new Engine(),
      femaleRepro: new Engine(),
      maleRepro: new Engine(),
      riskStratification: new Engine()
    };

    Object.keys(this.engines).forEach(engineKey => {
      if (allRules[engineKey]) {
        allRules[engineKey].forEach(rule => this.engines[engineKey].addRule(rule));
      }
    });
  }


  calculateSmokingPackYears(card) {
    if (!card.socialHistory?.smoking?.status) return 0;
    const sticksPerDay = card.socialHistory.smoking.sticksPerDay || 0;
    const ageStarted = card.socialHistory.smoking.ageStarted || new Date().getFullYear();
    const currentYear = new Date().getFullYear();
    const yearsSmoked = Math.max(0, currentYear - ageStarted);
    return (sticksPerDay / 20) * yearsSmoked;
  }


  prepareFacts(card) {
    return {
      'familyHistory.hypertension': card.familyHistory?.hypertension || false,
      'familyHistory.cardiovascularDisease': card.familyHistory?.cardiovascularDisease || false,
      'familyHistory.diabetesMellitus': card.familyHistory?.diabetesMellitus || false,
      'familyHistory.kidneyDisease': card.familyHistory?.kidneyDisease || false,
      'familyHistory.cancer': card.familyHistory?.cancer || false,
      'familyHistory.asthma': card.familyHistory?.asthma || false,

      'pastMedicalHistory.hypertension': card.pastMedicalHistory?.hypertension || false,
      'pastMedicalHistory.diabetesMellitus': card.pastMedicalHistory?.diabetesMellitus || false,
      'pastMedicalHistory.cardiovascularDisease': card.pastMedicalHistory?.cardiovascularDisease || false,
      'pastMedicalHistory.tuberculosis': card.pastMedicalHistory?.tuberculosis || false,
      'pastMedicalHistory.asthma': card.pastMedicalHistory?.asthma || false,

      'presentHealthStatus.cough': card.presentHealthStatus?.cough || null,
      'presentHealthStatus.dizziness': card.presentHealthStatus?.dizziness || false,
      'presentHealthStatus.dyspnea': card.presentHealthStatus?.dyspnea || false,
      'presentHealthStatus.chestBackPain': card.presentHealthStatus?.chestBackPain || false,
      'presentHealthStatus.easyFatigability': card.presentHealthStatus?.easyFatigability || false,
      'presentHealthStatus.syncope': card.presentHealthStatus?.syncope || false,
      'presentHealthStatus.convulsions': card.presentHealthStatus?.convulsions || false,
      'presentHealthStatus.malaria': card.presentHealthStatus?.malaria || false,

      'testResults.ecg.result': card.testResults?.ecg?.result || null,
      'testResults.cxrSputum.result': card.testResults?.cxrSputum?.result || null,
      'testResults.urinalysis.result': card.testResults?.urinalysis?.result || null,

      'socialHistory.smoking.status': card.socialHistory?.smoking?.status || false,
      'socialHistory.alcohol.status': card.socialHistory?.alcohol?.status || false,
      'socialHistory.alcohol.frequency': card.socialHistory?.alcohol?.frequency || null,
      smokingPackYears: this.calculateSmokingPackYears(card),

      gender: card.personnel?.gender || null,
      age: card.personnel?.age || card.age || 0,
      obGynHistory: card.obGynHistory || null,
      'obGynHistory.papsmearDone.status': card.obGynHistory?.papsmearDone?.status || false,
      'obGynHistory.selfBreastExamDone': card.obGynHistory?.selfBreastExamDone || false,
      'obGynHistory.massNoted.status': card.obGynHistory?.massNoted?.status || false,
      maleExamination: card.maleExamination || null,
      'maleExamination.digitalRectalExamDone': card.maleExamination?.digitalRectalExamDone || false
    };
  }

  async analyzeHealthRisks(card) {
    const facts = this.prepareFacts(card);
    const risks = [];

    try {
      const commonEngines = [
        this.engines.hypertension.run(facts),
        this.engines.diabetes.run(facts),
        this.engines.cvd.run(facts),
        this.engines.ptb.run(facts),
        this.engines.malaria.run(facts),
        this.engines.occupationalFitness.run(facts),
        this.engines.smoking.run(facts),
        this.engines.alcohol.run(facts)
      ];

      if (card.personnel?.gender === 'Female') {
        commonEngines.push(this.engines.femaleRepro.run(facts));
      } else if (card.personnel?.gender === 'Male') {
        commonEngines.push(this.engines.maleRepro.run(facts));
      }

      const allEngineResults = await Promise.all(commonEngines);

      const allResults = allEngineResults.flatMap(result => result.events);

      const seenFlags = new Set();
      for (const event of allResults) {
        const flag = event.params.flag;
        if (!seenFlags.has(flag)) {
          seenFlags.add(flag);
          risks.push({
            risk: flag,
            recommendations: event.params.recommendations
          });
        }
      }

      return risks;
    } catch (error) {
      console.error('Error analyzing health risks:', error);
      return [];
    }
  }

  async stratifyRisk(card) {
    const facts = this.prepareFacts(card);

    try {
      const results = await this.engines.riskStratification.run(facts);

      const sortedEvents = results.events.sort((a, b) => a.params.priority - b.params.priority);

      return sortedEvents.length > 0 ? sortedEvents[0].params.riskLevel : 'Unclassified';
    } catch (error) {
      console.error('Error stratifying risk:', error);
      return 'Unclassified';
    }
  }


  async personnelHealthCardDSS(card) {
    const risks = await this.analyzeHealthRisks(card);
    const riskLevel = await this.stratifyRisk(card);

    return {
      individualHealthProfile: {
        risksFlagged: risks.map(r => r.risk),
        recommendations: risks.flatMap(r => r.recommendations),
        fitnessToWork: risks.some(r => r.risk.includes('fitness-to-work clearance'))
          ? 'Needs clearance'
          : 'Fit',
        riskLevel: riskLevel
      },
      risks,
      risksCount: risks.length,
      riskLevel: riskLevel
    };
  }

  async personnelHealthDashboard(cards) {
    let stats = {
      hypertension: 0,
      diabetes: 0,
      cvd: 0,
      ptb: 0,
      smoking: 0,
      needsClearance: 0,
      total: cards.length
    };

    const ageValues = [];
    const ageGroups = {
      '<20': 0,
      '20-29': 0,
      '30-39': 0,
      '40-49': 0,
      '50-59': 0,
      '60+': 0
    };

    const riskDistribution = {
      'High Risk': 0,
      'Medium Risk': 0,
      'Low Risk': 0,
      'Unclassified': 0
    };

    for (const card of cards) {
      const dss = await this.personnelHealthCardDSS(card);
      const riskLevel = await this.stratifyRisk(card);

      if (dss.risks.some(r => r.risk === 'Hypertension')) stats.hypertension++;
      if (dss.risks.some(r => r.risk === 'Diabetes')) stats.diabetes++;
      if (dss.risks.some(r => r.risk === 'Cardiovascular Disease')) stats.cvd++;
      if (dss.risks.some(r => r.risk === 'PTB Suspect')) stats.ptb++;
      if (dss.risks.some(r => r.risk === 'High risk: Smoking')) stats.smoking++;
      if (dss.individualHealthProfile.fitnessToWork === 'Needs clearance') stats.needsClearance++;

      // Count risk stratification
      if (riskDistribution[riskLevel] !== undefined) {
        riskDistribution[riskLevel]++;
      } else {
        riskDistribution['Unclassified']++;
      }

      const age = card.personnel?.age;
      if (typeof age === 'number') {
        ageValues.push(age);

        if (age < 20) ageGroups['<20']++;
        else if (age < 30) ageGroups['20-29']++;
        else if (age < 40) ageGroups['30-39']++;
        else if (age < 50) ageGroups['40-49']++;
        else if (age < 60) ageGroups['50-59']++;
        else ageGroups['60+']++;
      }
    }

    const dashboard = {
      total: stats.total,
      hypertensionRate: stats.total ? (stats.hypertension / stats.total) * 100 : 0,
      diabetesRate: stats.total ? (stats.diabetes / stats.total) * 100 : 0,
      cvdRate: stats.total ? (stats.cvd / stats.total) * 100 : 0,
      ptbRate: stats.total ? (stats.ptb / stats.total) * 100 : 0,
      smokingPrevalence: stats.total ? (stats.smoking / stats.total) * 100 : 0,
      fitnessToWorkPercent: stats.total ? (stats.needsClearance / stats.total) * 100 : 0,
      ageStats: ageValues.length ? {
        mean: ss.mean(ageValues),
        median: ss.median(ageValues),
        mode: ss.mode(ageValues),
        stdev: ss.standardDeviation(ageValues)
      } : null,
      ageDistribution: ageGroups,
      riskDistribution: riskDistribution
    };

    const preventiveActionPlan = this.generatePreventiveActionPlan(dashboard, stats);

    return { dashboard, preventiveActionPlan };
  }

  generatePreventiveActionPlan(dashboard, stats) {
    const preventiveActionPlan = [];

    if (dashboard.smokingPrevalence > 20) {
      preventiveActionPlan.push('Launch workplace smoking cessation program');
    }
    if (dashboard.hypertensionRate > 15) {
      preventiveActionPlan.push('Offer regular blood pressure screening and lifestyle counseling');
    }
    if (dashboard.diabetesRate > 10) {
      preventiveActionPlan.push('Introduce nutrition and weight management workshops');
    }
    if (dashboard.ptbRate > 5) {
      preventiveActionPlan.push('Conduct TB awareness and screening campaigns');
    }
    if (dashboard.cvdRate > 10) {
      preventiveActionPlan.push('Implement cardiovascular health monitoring and ECG screening program');
    }
    if (dashboard.fitnessToWorkPercent > 15) {
      preventiveActionPlan.push('Establish fitness-to-work clearance protocol and occupational health clinic');
    }
    if (dashboard.ageDistribution['50-59'] + dashboard.ageDistribution['60+'] > stats.total * 0.25) {
      preventiveActionPlan.push('Increase geriatric care programs (annual physicals, heart health checks)');
    }
    if (dashboard.riskDistribution['High Risk'] > stats.total * 0.15) {
      preventiveActionPlan.push('Priority intervention for high-risk personnel - immediate medical review required');
    }
    if (dashboard.riskDistribution['Medium Risk'] + dashboard.riskDistribution['High Risk'] > stats.total * 0.40) {
      preventiveActionPlan.push('Expand preventive health programs and regular monitoring for at-risk personnel');
    }

    return preventiveActionPlan;
  }

  async getPersonnelByCategory(cards, category) {
    const filteredPersonnel = [];

    for (const card of cards) {
      const dss = await this.personnelHealthCardDSS(card);
      let match = false;

      switch (category) {
        case 'hypertension':
          match = dss.risks.some(r => r.risk === 'Hypertension');
          break;
        case 'diabetes':
          match = dss.risks.some(r => r.risk === 'Diabetes');
          break;
        case 'cvd':
          match = dss.risks.some(r => r.risk === 'Cardiovascular Disease');
          break;
        case 'ptb':
          match = dss.risks.some(r => r.risk === 'PTB Suspect');
          break;
        case 'smoking':
          match = dss.risks.some(r => r.risk === 'High risk: Smoking');
          break;
        case 'needsClearance':
          match = dss.individualHealthProfile.fitnessToWork === 'Needs clearance';
          break;
        case 'highRisk':
          match = dss.riskLevel === 'High Risk';
          break;
        case 'mediumRisk':
          match = dss.riskLevel === 'Medium Risk';
          break;
        case 'lowRisk':
          match = dss.riskLevel === 'Low Risk';
          break;
        case 'unclassified':
          match = dss.riskLevel === 'Unclassified';
          break;
        default:
          match = false;
      }
      if (match) {
        filteredPersonnel.push({
          personnelId: card.personnel?.perId,
          personnelName: `${card.personnel?.firstName || ''} ${card.personnel?.lastName || ''}`.trim(),
          position: card.personnel?.position,
          age: card.personnel?.age,
          schoolId: card.personnel?.schoolId,
          schoolName: card.personnel?.schoolName,
          riskLevel: dss.riskLevel,
          risksIdentified: dss.risks.map(r => r.risk).join(', '),
          risksCount: dss.risksCount,
          fitnessToWork: dss.individualHealthProfile.fitnessToWork,
          recommendations: dss.individualHealthProfile.recommendations.slice(0, 3).join('; ')
        });
      }
    }
    return filteredPersonnel;
  }
}

export default new PersonnelHealthDSSService();

