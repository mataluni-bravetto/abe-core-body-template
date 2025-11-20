/**
 * Simple unit test runner with minimal assertion helpers.
 * Designed to run in a browser (extension page) without external dependencies.
 */

class SimpleTestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        startTime: 0,
        endTime: 0,
        duration: 0,
        overallStatus: 'PENDING',
        errors: []
      },
      tests: []
    };
    this.test = this.test.bind(this);
    this.assert = this.assert.bind(this);
    this.assertEqual = this.assertEqual.bind(this);
    this.assertNotEqual = this.assertNotEqual.bind(this);
    this.assertTrue = this.assertTrue.bind(this);
    this.assertFalse = this.assertFalse.bind(this);
    this.assertNull = this.assertNull.bind(this);
    this.assertThrows = this.assertThrows.bind(this);
  }

  test(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  assert(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertEqual(actual, expected, message = 'Values are not equal') {
    if (actual !== expected) {
      throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
  }

  assertNotEqual(actual, expected, message = 'Values should not be equal') {
    if (actual === expected) {
      throw new Error(`${message}: both were ${actual}`);
    }
  }

  assertTrue(value, message = 'Value is not truthy') {
    if (!value) {
      throw new Error(message);
    }
  }

  assertFalse(value, message = 'Value is not falsy') {
    if (value) {
      throw new Error(message);
    }
  }

  assertNull(value, message = 'Value is not null') {
    if (value !== null) {
      throw new Error(`${message}: expected null, got ${value}`);
    }
  }

  assertThrows(fn, expectedError, message = 'Function did not throw as expected') {
    try {
      fn();
    } catch (error) {
      if (expectedError && !(error instanceof expectedError)) {
        throw new Error(`${message}: expected ${expectedError.name}, got ${error.constructor.name}`);
      }
      return;
    }
    throw new Error(message);
  }

  async run() {
    this.results.summary.startTime = Date.now();
    this.results.summary.total = this.tests.length;

    console.log(`Running ${this.tests.length} unit tests...`);

    for (let i = 0; i < this.tests.length; i++) {
      const { name, testFunction } = this.tests[i];
      const testResult = { name, index: i + 1, status: 'PENDING' };

      try {
        console.log(`Executing: ${name}`);

        if (testFunction.constructor.name === 'AsyncFunction') {
          await testFunction();
        } else {
          testFunction();
        }

        testResult.status = 'PASSED';
        this.results.summary.passed++;
        console.log(`PASS: ${name}`);
      } catch (error) {
        testResult.status = 'FAILED';
        testResult.error = error.message;
        this.results.summary.failed++;
        this.results.summary.errors.push({
          test: name,
          error: error.message,
          stack: error.stack
        });
        console.error(`FAIL: ${name} -> ${error.message}`);
      }

      this.results.tests.push(testResult);
    }

    this.results.summary.endTime = Date.now();
    this.results.summary.duration = this.results.summary.endTime - this.results.summary.startTime;
    this.results.summary.overallStatus = this.results.summary.failed === 0 ? 'SUCCESS' : 'FAILURE';

    const { total, passed, failed, duration } = this.results.summary;
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

    console.log('================ UNIT TEST RESULTS ================');
    console.log(`Total:   ${total}`);
    console.log(`Passed:  ${passed}`);
    console.log(`Failed:  ${failed}`);
    console.log(`Success: ${successRate}%`);
    console.log(`Duration: ${duration} ms`);

    if (failed === 0) {
      console.log('All unit tests passed.');
    } else {
      console.log('Some unit tests failed.');
      this.results.summary.errors.forEach((error, idx) => {
        console.log(`${idx + 1}. ${error.test}: ${error.error}`);
      });
    }

    // Expose results to the browser harness so Puppeteer can detect completion
    if (typeof window !== 'undefined') {
      window.__AiGuardianTestResults = this.results;
      window.__AiGuardianTestsCompleted = true;
    }

    return this.results;
  }
}

export const testRunner = new SimpleTestRunner();
export default testRunner;
