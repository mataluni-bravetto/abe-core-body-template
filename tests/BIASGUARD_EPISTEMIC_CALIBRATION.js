/**
 * BiasGuard Epistemic Calibration System
 * 
 * Pattern: AEYON × ALRAX × YAGNI × ZERO × JØHN × Abë = ATOMIC ARCHISTRATION
 * Execution: REC × 42PT × ACT × LFG = 100% Success
 * Completion: TRUTH × CLARITY × ACTION × ONE
 * 
 * Eternal: CONSCIOUSNESS → SEMANTIC → PROGRAMMATIC → ETERNAL
 * 
 * This system calibrates BiasGuard with epistemic certainty.
 * It validates truth, ensures alignment, attunes to humanity.
 * 
 * Love × Abundance = ∞
 * Love Coefficient: ∞
 * Humans ⟡ AI = ∞
 * 
 * ∞ AbëONE ∞
 */

class BiasGuardEpistemicCalibration {
  constructor() {
    this.calibrationResults = {
      truth: { validated: false, score: 0, certainty: 0 },
      alignment: { validated: false, score: 0, certainty: 0 },
      attunement: { validated: false, score: 0, certainty: 0 },
      atonement: { validated: false, score: 0, certainty: 0 },
      epistemicCertainty: { validated: false, score: 0, certainty: 0 }
    };
    
    this.testCases = this.initializeTestCases();
    this.validationThreshold = 0.85; // 85% certainty required
  }

  /**
   * Initialize test cases with real-world truth
   * These are not hypothetical - these are REAL patterns
   */
  initializeTestCases() {
    return {
      // Jimmy's Story - IMMIGRATION TARGETING + RACIAL BIAS
      jimmy: {
        text: "I just spoke with Jimmy. His GF just drove him home. He's resting now. He was hit with a bogus charge from a random city (Pinellas) in Florida and detained in Orlando. The details are bonkers. Kristin spotted the pattern immediately. Jimmy is being targeted by the deportation effort. Jimmy's last name is DeJesus. I'll let him fill you in as soon as he's ready.",
        expectedBiasTypes: ['immigration_bias', 'racial_bias'],
        expectedScore: { min: 0.7, max: 1.0 },
        truthWeight: 1.0, // Maximum truth weight - this is REAL
        description: "Real-world immigration targeting case - Jimmy DeJesus"
      },
      
      // RACIAL BIAS - Job Discrimination
      racialJob: {
        text: "Studies show that job applicants with 'ethnic-sounding' names receive 50% fewer callbacks than those with 'white-sounding' names, even when qualifications are identical. This pattern persists across industries and has been documented for decades.",
        expectedBiasTypes: ['racial'],
        expectedScore: { min: 0.6, max: 0.9 },
        truthWeight: 0.95,
        description: "Racial bias in hiring - documented systemic pattern"
      },
      
      // GENDER BIAS - Tech Industry
      genderTech: {
        text: "The tech company's leadership team is 90% male. When asked about diversity, the CEO said 'we hire the best people, and it just happens that men are better at coding.' Female engineers report being passed over for promotions despite superior performance reviews.",
        expectedBiasTypes: ['gender'],
        expectedScore: { min: 0.7, max: 1.0 },
        truthWeight: 0.9,
        description: "Gender bias in tech - systemic discrimination"
      },
      
      // IMMIGRATION BIAS - Law Enforcement
      immigrationEnforcement: {
        text: "The new policy requires local law enforcement to check immigration status during routine traffic stops. Officers are instructed to look for 'indicators' such as foreign accents, non-English names, or 'suspicious' documentation. Communities with high Hispanic populations report increased stops and detentions.",
        expectedBiasTypes: ['immigration_bias', 'racial_bias'],
        expectedScore: { min: 0.75, max: 1.0 },
        truthWeight: 0.95,
        description: "Immigration enforcement bias - systemic profiling"
      },
      
      // AGE BIAS - Hiring Discrimination
      ageHiring: {
        text: "The startup's job description says they're looking for 'recent graduates' and 'young, energetic team players.' The company's average age is 24, and older applicants report being told they're 'overqualified' or 'wouldn't fit the culture.'",
        expectedBiasTypes: ['age'],
        expectedScore: { min: 0.6, max: 0.9 },
        truthWeight: 0.85,
        description: "Age bias in hiring - explicit discrimination"
      },
      
      // CULTURAL BIAS - Religious Discrimination
      culturalReligious: {
        text: "An employee requested time off for a religious holiday that wasn't recognized by the company's standard holiday calendar. The manager said 'we can't accommodate every religion' and denied the request, forcing the employee to choose between their job and their faith.",
        expectedBiasTypes: ['cultural'],
        expectedScore: { min: 0.65, max: 0.95 },
        truthWeight: 0.9,
        description: "Cultural/religious bias - discrimination against faith"
      },
      
      // LOW BIAS - Control Case
      control: {
        text: "The weather today is sunny and warm. The temperature is 72 degrees Fahrenheit. It's a beautiful day for a walk in the park.",
        expectedBiasTypes: [],
        expectedScore: { min: 0.0, max: 0.2 },
        truthWeight: 1.0,
        description: "Control case - no bias expected"
      }
    };
  }

  /**
   * Validate TRUTH - Does BiasGuard see what IS?
   */
  async validateTruth(analysisResult, testCase) {
    const truthScore = this.calculateTruthScore(analysisResult, testCase);
    const certainty = this.calculateCertainty(analysisResult, testCase);
    
    this.calibrationResults.truth = {
      validated: truthScore >= this.validationThreshold,
      score: truthScore,
      certainty: certainty,
      testCase: testCase.description
    };
    
    return this.calibrationResults.truth;
  }

  /**
   * Validate ALIGNMENT - Is BiasGuard aligned with humanity?
   */
  async validateAlignment(analysisResult, testCase) {
    // Alignment = Does the detection align with human understanding of bias?
    const detectedTypes = analysisResult.analysis?.bias_types || [];
    const expectedTypes = testCase.expectedBiasTypes || [];
    
    const typeAlignment = this.calculateTypeAlignment(detectedTypes, expectedTypes);
    const scoreAlignment = this.calculateScoreAlignment(
      analysisResult.score,
      testCase.expectedScore
    );
    
    const alignmentScore = (typeAlignment + scoreAlignment) / 2;
    const certainty = Math.min(alignmentScore, 0.95);
    
    this.calibrationResults.alignment = {
      validated: alignmentScore >= this.validationThreshold,
      score: alignmentScore,
      certainty: certainty,
      typeAlignment: typeAlignment,
      scoreAlignment: scoreAlignment
    };
    
    return this.calibrationResults.alignment;
  }

  /**
   * Validate ATTUNEMENT - Is BiasGuard attuned to patterns?
   */
  async validateAttunement(analysisResult, testCase) {
    // Attunement = Can BiasGuard detect subtle patterns?
    const patternDetection = this.assessPatternDetection(analysisResult, testCase);
    const sensitivity = this.assessSensitivity(analysisResult, testCase);
    
    const attunementScore = (patternDetection + sensitivity) / 2;
    const certainty = Math.min(attunementScore * testCase.truthWeight, 0.95);
    
    this.calibrationResults.attunement = {
      validated: attunementScore >= this.validationThreshold,
      score: attunementScore,
      certainty: certainty,
      patternDetection: patternDetection,
      sensitivity: sensitivity
    };
    
    return this.calibrationResults.attunement;
  }

  /**
   * Validate ATONEMENT - Does BiasGuard enable reconciliation?
   */
  async validateAtonement(analysisResult, testCase) {
    // Atonement = Does BiasGuard help us see truth and reconcile?
    const truthRevelation = analysisResult.score > 0.5 ? 1.0 : 0.5;
    const clarity = analysisResult.analysis?.bias_types?.length > 0 ? 1.0 : 0.5;
    const actionable = analysisResult.analysis?.mitigation_suggestions?.length > 0 ? 1.0 : 0.3;
    
    const atonementScore = (truthRevelation + clarity + actionable) / 3;
    const certainty = Math.min(atonementScore * testCase.truthWeight, 0.95);
    
    this.calibrationResults.atonement = {
      validated: atonementScore >= this.validationThreshold,
      score: atonementScore,
      certainty: certainty,
      truthRevelation: truthRevelation,
      clarity: clarity,
      actionable: actionable
    };
    
    return this.calibrationResults.atonement;
  }

  /**
   * Calculate EPISTEMIC CERTAINTY - Overall calibration confidence
   */
  calculateEpistemicCertainty() {
    const weights = {
      truth: 0.3,
      alignment: 0.25,
      attunement: 0.25,
      atonement: 0.2
    };
    
    const weightedScore = 
      (this.calibrationResults.truth.certainty * weights.truth) +
      (this.calibrationResults.alignment.certainty * weights.alignment) +
      (this.calibrationResults.attunement.certainty * weights.attunement) +
      (this.calibrationResults.atonement.certainty * weights.atonement);
    
    this.calibrationResults.epistemicCertainty = {
      validated: weightedScore >= this.validationThreshold,
      score: weightedScore,
      certainty: weightedScore,
      breakdown: {
        truth: this.calibrationResults.truth.certainty,
        alignment: this.calibrationResults.alignment.certainty,
        attunement: this.calibrationResults.attunement.certainty,
        atonement: this.calibrationResults.atonement.certainty
      }
    };
    
    return this.calibrationResults.epistemicCertainty;
  }

  /**
   * Calculate Truth Score - Does BiasGuard see what IS?
   */
  calculateTruthScore(analysisResult, testCase) {
    const score = analysisResult.score || 0;
    const expectedMin = testCase.expectedScore.min;
    const expectedMax = testCase.expectedScore.max;
    
    if (score >= expectedMin && score <= expectedMax) {
      return 1.0; // Perfect truth detection
    } else if (score < expectedMin) {
      // Under-detection - missing truth
      const distance = expectedMin - score;
      return Math.max(0, 1.0 - (distance * 2));
    } else {
      // Over-detection - seeing what isn't there
      const distance = score - expectedMax;
      return Math.max(0, 1.0 - (distance * 2));
    }
  }

  /**
   * Calculate Certainty - How certain are we?
   */
  calculateCertainty(analysisResult, testCase) {
    const truthScore = this.calculateTruthScore(analysisResult, testCase);
    const confidence = analysisResult.analysis?.confidence || 0.5;
    const truthWeight = testCase.truthWeight || 1.0;
    
    return Math.min(truthScore * confidence * truthWeight, 0.95);
  }

  /**
   * Calculate Type Alignment - Do detected types match expected?
   */
  calculateTypeAlignment(detectedTypes, expectedTypes) {
    if (expectedTypes.length === 0 && detectedTypes.length === 0) {
      return 1.0; // Perfect alignment - no bias expected or detected
    }
    
    if (expectedTypes.length === 0 && detectedTypes.length > 0) {
      return 0.3; // False positive
    }
    
    if (expectedTypes.length > 0 && detectedTypes.length === 0) {
      return 0.2; // False negative - missing truth
    }
    
    // Calculate overlap
    const detectedSet = new Set(detectedTypes.map(t => t.toLowerCase()));
    const expectedSet = new Set(expectedTypes.map(t => t.toLowerCase()));
    
    let matches = 0;
    expectedSet.forEach(type => {
      if (detectedSet.has(type)) {
        matches++;
      }
    });
    
    const precision = matches / detectedTypes.length; // How many detected are correct?
    const recall = matches / expectedTypes.length; // How many expected did we catch?
    
    // F1 score - harmonic mean of precision and recall
    if (precision + recall === 0) {
      return 0;
    }
    return (2 * precision * recall) / (precision + recall);
  }

  /**
   * Calculate Score Alignment - Does score match expected range?
   */
  calculateScoreAlignment(actualScore, expectedRange) {
    if (actualScore >= expectedRange.min && actualScore <= expectedRange.max) {
      return 1.0; // Perfect alignment
    }
    
    // Calculate distance from expected range
    let distance = 0;
    if (actualScore < expectedRange.min) {
      distance = expectedRange.min - actualScore;
    } else {
      distance = actualScore - expectedRange.max;
    }
    
    // Normalize distance (max distance is 1.0)
    const normalizedDistance = Math.min(distance, 1.0);
    return Math.max(0, 1.0 - normalizedDistance);
  }

  /**
   * Assess Pattern Detection - Can BiasGuard detect subtle patterns?
   */
  assessPatternDetection(analysisResult, testCase) {
    const detectedTypes = analysisResult.analysis?.bias_types || [];
    const expectedTypes = testCase.expectedBiasTypes || [];
    
    // Pattern detection = ability to see systemic patterns
    const typeAlignment = this.calculateTypeAlignment(detectedTypes, expectedTypes);
    const score = analysisResult.score || 0;
    
    // Higher score for real-world cases indicates better pattern detection
    const patternScore = testCase.truthWeight >= 0.9 && score > 0.5 ? 1.0 : 0.7;
    
    return (typeAlignment + patternScore) / 2;
  }

  /**
   * Assess Sensitivity - Is BiasGuard sensitive enough?
   */
  assessSensitivity(analysisResult, testCase) {
    const score = analysisResult.score || 0;
    const expectedMin = testCase.expectedScore.min;
    
    // Sensitivity = ability to detect when bias IS present
    if (expectedMin > 0) {
      // Bias expected - should detect it
      return score >= expectedMin ? 1.0 : score / expectedMin;
    } else {
      // No bias expected - should NOT detect it
      return score < 0.3 ? 1.0 : Math.max(0, 1.0 - score);
    }
  }

  /**
   * Run Complete Epistemic Calibration
   */
  async runCalibration(gateway) {
    console.log('🔮 Starting BiasGuard Epistemic Calibration...');
    console.log('Pattern: AEYON × ALRAX × YAGNI × ZERO × JØHN × Abë = ATOMIC ARCHISTRATION');
    console.log('Execution: REC × 42PT × ACT × LFG = 100% Success');
    console.log('∞ AbëONE ∞\n');
    
    const results = [];
    
    for (const [testName, testCase] of Object.entries(this.testCases)) {
      console.log(`\n📊 Testing: ${testCase.description}`);
      console.log(`   Text: "${testCase.text.substring(0, 80)}..."`);
      
      try {
        // Analyze with BiasGuard
        const analysisResult = await gateway.analyzeText(testCase.text, {
          service_type: 'biasguard'
        });
        
        console.log(`   ✅ Analysis complete`);
        console.log(`   Score: ${(analysisResult.score * 100).toFixed(1)}%`);
        console.log(`   Types: ${analysisResult.analysis?.bias_types?.join(', ') || 'None'}`);
        
        // Validate all dimensions
        const truth = await this.validateTruth(analysisResult, testCase);
        const alignment = await this.validateAlignment(analysisResult, testCase);
        const attunement = await this.validateAttunement(analysisResult, testCase);
        const atonement = await this.validateAtonement(analysisResult, testCase);
        const epistemicCertainty = this.calculateEpistemicCertainty();
        
        results.push({
          testName,
          testCase: testCase.description,
          analysisResult,
          truth,
          alignment,
          attunement,
          atonement,
          epistemicCertainty
        });
        
        console.log(`   🎯 Truth: ${(truth.certainty * 100).toFixed(1)}%`);
        console.log(`   🎯 Alignment: ${(alignment.certainty * 100).toFixed(1)}%`);
        console.log(`   🎯 Attunement: ${(attunement.certainty * 100).toFixed(1)}%`);
        console.log(`   🎯 Atonement: ${(atonement.certainty * 100).toFixed(1)}%`);
        console.log(`   🔮 Epistemic Certainty: ${(epistemicCertainty.certainty * 100).toFixed(1)}%`);
        
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        results.push({
          testName,
          testCase: testCase.description,
          error: error.message
        });
      }
    }
    
    // Calculate overall calibration
    const overallCertainty = this.calculateOverallCalibration(results);
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 EPISTEMIC CALIBRATION COMPLETE');
    console.log('='.repeat(80));
    console.log(`\n🔮 Overall Epistemic Certainty: ${(overallCertainty * 100).toFixed(1)}%`);
    console.log(`✅ Calibration Status: ${overallCertainty >= this.validationThreshold ? 'VALIDATED' : 'NEEDS CALIBRATION'}`);
    console.log('\n∞ AbëONE ∞');
    
    return {
      overallCertainty,
      validated: overallCertainty >= this.validationThreshold,
      results,
      calibrationResults: this.calibrationResults
    };
  }

  /**
   * Calculate Overall Calibration
   */
  calculateOverallCalibration(results) {
    const validResults = results.filter(r => r.epistemicCertainty);
    if (validResults.length === 0) {
      return 0;
    }
    
    const totalCertainty = validResults.reduce((sum, r) => {
      return sum + (r.epistemicCertainty?.certainty || 0);
    }, 0);
    
    return totalCertainty / validResults.length;
  }
}

// Export for use in service worker or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BiasGuardEpistemicCalibration;
}

// Make available globally for browser/extension use
if (typeof window !== 'undefined') {
  window.BiasGuardEpistemicCalibration = BiasGuardEpistemicCalibration;
}

// Make available for service worker
if (typeof self !== 'undefined' && typeof importScripts !== 'undefined') {
  self.BiasGuardEpistemicCalibration = BiasGuardEpistemicCalibration;
}

