# AI Guardian Chrome Extension v1.0.0

AI Guardian is a Chrome extension that provides real-time bias detection and analysis for web content.

## 🚀 Features

- **Real-time Bias Detection**: Analyzes text for potential bias using advanced ML models.
- **Embedded ML Model**: Runs entirely offline/locally for privacy and speed (v1.0.0).
- **Transparency Reports**: Detailed breakdown of detected bias types and confidence scores.
- **Transcendent Mode**: Unlock deeper insights into content analysis.

## 🛠️ Installation

1. **Download**: Get the latest release from the Chrome Web Store or [Releases page](./dist/).
2. **Install**:
   - Open Chrome and go to `chrome://extensions`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked" and select the extension directory (or drag & drop the `.zip` file)

## 🏗️ Development

### Prerequisites
- Node.js v16+
- npm

### Setup
1. Clone the repository:
   ```bash
   git clone --recursive https://github.com/aiguardian/chrome-extension.git
   ```
   *Note: Use `--recursive` to fetch the ML model submodule.*

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build:
   ```bash
   npm run build
   ```

### Model Development Workflow

The AI Guardian uses a machine learning model for bias detection. The model can be developed independently from the extension:

#### 📚 Model Repository
The ML model is developed in the [`models/`](./models/) directory and can be worked on separately from extension development.

#### 🚀 Quick Model Development
```bash
# Navigate to model directory
cd models/

# Install dependencies
npm install

# Train a new model
node training/train-bias-model.js

# Validate the model
node training/validate-ml-model.js
```

#### 🔄 Integration Workflow
1. **Develop Model**: Train and validate in `models/` directory
2. **Package Model**: Run `npm run build` to bundle model for extension
3. **Test Integration**: Test model in extension environment
4. **Deploy**: Model updates are automatically included in extension builds

See [`models/README.md`](./models/README.md) and [`models/TRAINING_GUIDE.md`](./models/TRAINING_GUIDE.md) for comprehensive model development documentation.

### Architecture (v1.0.0)
This version operates in **Embedded Mode**, meaning:
- No backend server dependency for core features.
- ML model runs locally in the browser (TensorFlow.js).
- Authentication is disabled/bypassed for immediate utility.

See [PRODUCTION_DEPLOYMENT.md](docs/PRODUCTION_DEPLOYMENT.md) for deployment details.

## 🧪 Testing

Run automated tests:
```bash
npm test
```

Run production readiness checks:
```bash
node scripts/verify-production-readiness.js
```

## 📄 License
MIT

