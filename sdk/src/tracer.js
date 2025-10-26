/**
 * AiGuardian SDK - Unified Tracing System
 *
 * Provides centralized tracing and metrics collection for SDK operations.
 */

import { SDK_VERSION } from './constants.js';

/**
 * Unified tracing system for performance monitoring and debugging
 */
export class Tracer {
  /**
   * Creates a new tracer instance
   * @param {Object} config - Tracing configuration
   */
  constructor(config = {}) {
    this.config = {
      enabled: config.enabled !== false,
      sampleRate: config.sampleRate || 1.0,
      maxTraces: config.maxTraces || 1000,
      includeMetrics: config.includeMetrics !== false
    };

    this.activeTraces = new Map();
    this.completedTraces = [];
    this.metrics = new Map();
    this.sessionId = this.generateSessionId();
  }

  /**
   * Starts a new trace
   * @param {string} operation - Operation name
   * @param {Object} metadata - Additional metadata
   * @returns {string} Trace ID
   */
  startTrace(operation, metadata = {}) {
    if (!this.config.enabled) return null;

    const traceId = this.generateTraceId();
    const trace = {
      id: traceId,
      operation,
      startTime: Date.now(),
      metadata: { ...metadata },
      sessionId: this.sessionId,
      sdkVersion: SDK_VERSION,
      status: 'active'
    };

    this.activeTraces.set(traceId, trace);
    return traceId;
  }

  /**
   * Ends an active trace
   * @param {string} operation - Operation name (for validation)
   * @param {string} traceId - Trace ID to end
   * @param {Object} result - Optional result metadata
   */
  endTrace(operation, traceId, result = {}) {
    if (!this.config.enabled || !traceId) return;

    const trace = this.activeTraces.get(traceId);
    if (!trace) return;

    if (trace.operation !== operation) {
      console.warn(`[AiGuardian] Trace operation mismatch: expected ${operation}, got ${trace.operation}`);
    }

    trace.endTime = Date.now();
    trace.duration = trace.endTime - trace.startTime;
    trace.status = 'completed';
    trace.result = result;

    // Move to completed traces
    this.activeTraces.delete(traceId);
    this.completedTraces.push(trace);

    // Maintain max traces limit
    if (this.completedTraces.length > this.config.maxTraces) {
      this.completedTraces.shift();
    }

    // Add to metrics
    if (this.config.includeMetrics) {
      this.addMetric(`${operation}_duration`, trace.duration);
      this.addMetric(`${operation}_completed`);
    }
  }

  /**
   * Records a trace event
   * @param {string} traceId - Trace ID
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  recordEvent(traceId, event, data = {}) {
    if (!this.config.enabled || !traceId) return;

    const trace = this.activeTraces.get(traceId);
    if (!trace) return;

    if (!trace.events) trace.events = [];
    trace.events.push({
      timestamp: Date.now(),
      event,
      data: { ...data }
    });
  }

  /**
   * Adds a metric value
   * @param {string} name - Metric name
   * @param {number} value - Metric value (default: 1 for counters)
   */
  addMetric(name, value = 1) {
    if (!this.config.enabled || !this.config.includeMetrics) return;

    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + value);
  }

  /**
   * Increments a counter metric
   * @param {string} name - Counter name
   */
  incrementCounter(name) {
    this.addMetric(name, 1);
  }

  /**
   * Records a timing metric
   * @param {string} name - Metric name
   * @param {number} duration - Duration in milliseconds
   */
  recordTiming(name, duration) {
    this.addMetric(`${name}_duration`, duration);
  }

  /**
   * Gets trace statistics
   * @returns {Object} Trace statistics
   */
  getStats() {
    if (!this.config.enabled) {
      return { enabled: false };
    }

    const completedTraces = this.completedTraces;
    const activeTraces = Array.from(this.activeTraces.values());

    // Calculate statistics
    const stats = {
      enabled: true,
      sessionId: this.sessionId,
      activeTraces: activeTraces.length,
      completedTraces: completedTraces.length,
      totalOperations: completedTraces.length,
      averageDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
      operationsByType: {},
      metrics: Object.fromEntries(this.metrics)
    };

    if (completedTraces.length > 0) {
      let totalDuration = 0;

      completedTraces.forEach(trace => {
        totalDuration += trace.duration;
        stats.minDuration = Math.min(stats.minDuration, trace.duration);
        stats.maxDuration = Math.max(stats.maxDuration, trace.duration);

        // Count by operation type
        const op = trace.operation;
        stats.operationsByType[op] = (stats.operationsByType[op] || 0) + 1;
      });

      stats.averageDuration = totalDuration / completedTraces.length;
    }

    // Add active trace info
    stats.activeTraceDetails = activeTraces.map(trace => ({
      id: trace.id,
      operation: trace.operation,
      startTime: trace.startTime,
      duration: Date.now() - trace.startTime,
      metadata: trace.metadata
    }));

    return stats;
  }

  /**
   * Gets traces by operation type
   * @param {string} operation - Operation name
   * @param {number} limit - Maximum number of traces to return
   * @returns {Array} Traces for the operation
   */
  getTracesByOperation(operation, limit = 50) {
    return this.completedTraces
      .filter(trace => trace.operation === operation)
      .slice(-limit);
  }

  /**
   * Gets a specific trace by ID
   * @param {string} traceId - Trace ID
   * @returns {Object|null} Trace object or null if not found
   */
  getTrace(traceId) {
    return this.activeTraces.get(traceId) ||
           this.completedTraces.find(trace => trace.id === traceId) ||
           null;
  }

  /**
   * Clears all trace data
   */
  clearTraces() {
    this.activeTraces.clear();
    this.completedTraces = [];
    this.metrics.clear();
  }

  /**
   * Exports trace data for analysis
   * @param {Object} options - Export options
   * @returns {Object} Exported trace data
   */
  exportTraces(options = {}) {
    const { includeActive = true, includeMetrics = true, limit = 1000 } = options;

    const data = {
      sessionId: this.sessionId,
      exportTime: new Date().toISOString(),
      sdkVersion: SDK_VERSION
    };

    if (includeActive) {
      data.activeTraces = Array.from(this.activeTraces.values());
    }

    data.completedTraces = this.completedTraces.slice(-limit);

    if (includeMetrics) {
      data.metrics = Object.fromEntries(this.metrics);
    }

    return data;
  }

  /**
   * Updates tracing configuration
   * @param {Object} config - New configuration
   */
  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Gets current tracing configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Generates a unique trace ID
   * @returns {string} Trace ID
   */
  generateTraceId() {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generates a unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
