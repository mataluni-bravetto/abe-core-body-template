/**
 * Datadog Logger Utility
 * 
 * Provides simple integration with Datadog API for scripts.
 * Uses HTTP API to avoid heavy dependencies.
 */

const https = require('https');
const os = require('os');

class DatadogLogger {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey || process.env.DD_API_KEY;
    this.site = options.site || process.env.DD_SITE || 'datadoghq.com';
    this.service = options.service || process.env.DD_SERVICE || 'aiguardian-ml-training';
    this.source = options.source || 'nodejs';
    this.hostname = os.hostname();
    this.tags = options.tags || [`env:${process.env.NODE_ENV || 'development'}`];
    this.enabled = !!this.apiKey;
    
    if (!this.enabled) {
      console.log('⚠️  Datadog Logger disabled: DD_API_KEY not found');
    } else {
      console.log('✅ Datadog Logger enabled');
    }
  }

  log(level,message, attributes = {}) {
    if (!this.enabled) return;

    const payload = {
      ddsource: this.source,
      ddtags: this.tags.join(','),
      hostname: this.hostname,
      service: this.service,
      status: level.toUpperCase(),
      message: message,
      ...attributes,
      timestamp: Date.now()
    };

    this._send('/api/v2/logs', payload);
  }

  info(message, attributes) { this.log('info', message, attributes); }
  warn(message, attributes) { this.log('warn', message, attributes); }
  error(message, attributes) { this.log('error', message, attributes); }

  metric(name, value, type = 'gauge', tags = []) {
    if (!this.enabled) return;

    const allTags = [...this.tags, ...tags];
    
    const payload = {
      series: [
        {
          metric: name,
          points: [[Math.floor(Date.now() / 1000), value]],
          type: type,
          tags: allTags,
          host: this.hostname
        }
      ]
    };

    this._send('/api/v1/series', payload);
  }

  _send(endpoint, data) {
    const dataStr = JSON.stringify(data);
    
    const options = {
      hostname: `http-intake.logs.${this.site}`, // For logs, typically http-intake.logs.datadoghq.com
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': this.apiKey
      }
    };

    // Adjust hostname for metrics
    if (endpoint.includes('/api/v1/series')) {
      options.hostname = `api.${this.site}`;
    }

    const req = https.request(options, (res) => {
      // Silently handle response, maybe debug log if needed
      // res.on('data', (d) => process.stdout.write(d));
    });

    req.on('error', (e) => {
      console.error(`Datadog Error: ${e.message}`);
    });

    req.write(dataStr);
    req.end();
  }
}

module.exports = DatadogLogger;

