/**
 * Train Bias Detection Model
 * 
 * Trains a lightweight neural network model for bias detection.
 * Uses synthetic data for demonstration, but can be adapted for real datasets.
 */

const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const DatadogLogger = require('./datadog-logger');

// Initialize Datadog Logger
const dd = new DatadogLogger(process.env.DD_API_KEY, {
  service: 'aiguardian-ml-training',
  tags: ['component:bias-model', `env:${process.env.NODE_ENV || 'dev'}`]
});

// Model configuration - Reduced for smaller model size
const CONFIG = {
  vocabSize: 5000, // Reduced from 10000
  maxLength: 256, // Reduced from 512
  embeddingDim: 64, // Reduced from 128
  denseUnits1: 32, // Reduced from 64
  denseUnits2: 16, // Reduced from 32
  outputUnits: 6, // bias_score + 5 categories
  epochs: 10,
  batchSize: 32,
  learningRate: 0.001
};

/**
 * Generate synthetic training data
 * In production, replace this with real bias detection dataset
 */
function generateSyntheticData(numSamples = 1000) {
  const samples = [];
  
  // Bias patterns and their corresponding labels
  const biasPatterns = [
    {
      text: 'Men are better than women at technical tasks.',
      labels: [0.7, 0.9, 0.1, 0.1, 0.1, 0.1] // gender_bias high
    },
    {
      text: 'White people are more intelligent than other races.',
      labels: [0.8, 0.1, 0.95, 0.1, 0.1, 0.1] // racial_bias high
    },
    {
      text: 'Young people are lazy and entitled.',
      labels: [0.6, 0.1, 0.1, 0.9, 0.1, 0.1] // age_bias high
    },
    {
      text: 'Poor people are criminals.',
      labels: [0.65, 0.1, 0.1, 0.1, 0.9, 0.1] // socioeconomic_bias high
    },
    {
      text: 'Disabled people cannot work effectively.',
      labels: [0.7, 0.1, 0.1, 0.1, 0.1, 0.95] // ability_bias high
    },
    {
      text: 'This is a neutral text with no bias.',
      labels: [0.05, 0.05, 0.05, 0.05, 0.05, 0.05] // low bias
    },
    {
      text: 'We welcome people of all backgrounds and abilities.',
      labels: [0.02, 0.02, 0.02, 0.02, 0.02, 0.02] // very low bias
    }
  ];

  // Generate variations
  for (let i = 0; i < numSamples; i++) {
    const pattern = biasPatterns[i % biasPatterns.length];
    const variation = generateVariation(pattern.text);
    const labels = [...pattern.labels]; // Copy labels
    
    // Add slight noise to labels for realism
    labels[0] = Math.max(0, Math.min(1, labels[0] + (Math.random() - 0.5) * 0.1));
    
    samples.push({
      text: variation,
      labels: labels
    });
  }

  return samples;
}

/**
 * Generate text variations
 */
function generateVariation(text) {
  const variations = [
    text,
    text.toLowerCase(),
    text.toUpperCase(),
    text + ' This is additional context.',
    'Context: ' + text,
    text.replace(/\./g, '!'),
    text.replace(/\./g, '?')
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

/**
 * Simple tokenizer (matches the one in text-preprocessor.js)
 */
function tokenize(text, vocabSize, maxLength) {
  const normalized = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = normalized.split(/\s+/).filter(word => word.length > 0);
  
  const tokens = words.map(word => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % vocabSize;
  });

  // Pad or truncate
  while (tokens.length < maxLength) {
    tokens.push(0);
  }
  return tokens.slice(0, maxLength);
}

/**
 * Create the model architecture
 */
function createModel() {
  const model = tf.sequential({
    layers: [
      // Embedding layer
      tf.layers.embedding({
        inputDim: CONFIG.vocabSize,
        outputDim: CONFIG.embeddingDim,
        inputLength: CONFIG.maxLength,
        name: 'embedding'
      }),
      
      // Flatten
      tf.layers.flatten({
        name: 'flatten'
      }),
      
      // Dense layer 1
      tf.layers.dense({
        units: CONFIG.denseUnits1,
        activation: 'relu',
        name: 'dense_1'
      }),
      
      // Dense layer 2
      tf.layers.dense({
        units: CONFIG.denseUnits2,
        activation: 'relu',
        name: 'dense_2'
      }),
      
      // Output layer
      tf.layers.dense({
        units: CONFIG.outputUnits,
        activation: 'sigmoid',
        name: 'dense_output'
      })
    ]
  });

  // Compile model
  model.compile({
    optimizer: tf.train.adam(CONFIG.learningRate),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}

/**
 * Prepare training data
 */
function prepareData(samples) {
  const texts = samples.map(s => s.text);
  const labels = samples.map(s => s.labels);

  // Tokenize texts
  const tokenized = texts.map(text => tokenize(text, CONFIG.vocabSize, CONFIG.maxLength));

  // Convert to tensors
  const x = tf.tensor2d(tokenized, [samples.length, CONFIG.maxLength]);
  const y = tf.tensor2d(labels, [samples.length, CONFIG.outputUnits]);

  return { x, y };
}

/**
 * Main training function
 */
async function trainModel() {
  console.log('🚀 Starting model training...\n');

  try {
    // Generate training data
    console.log('📊 Generating training data...');
    const trainingData = generateSyntheticData(1000);
    const validationData = generateSyntheticData(200);
    console.log(`   Training samples: ${trainingData.length}`);
    console.log(`   Validation samples: ${validationData.length}\n`);

    // Prepare data
    console.log('🔧 Preparing data...');
    const train = prepareData(trainingData);
    const val = prepareData(validationData);
    console.log('   Data prepared\n');

    // Create model
    console.log('🏗️  Creating model architecture...');
    const model = createModel();
    model.summary();
    console.log('');

    // Train model
    console.log(`🎓 Training model for ${CONFIG.epochs} epochs...`);
    dd.info('Starting model training', { config: CONFIG });

    const history = await model.fit(train.x, train.y, {
      epochs: CONFIG.epochs,
      batchSize: CONFIG.batchSize,
      validationData: [val.x, val.y],
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`   Epoch ${epoch + 1}/${CONFIG.epochs} - loss: ${logs.loss.toFixed(4)}, acc: ${logs.acc.toFixed(4)}, val_loss: ${logs.val_loss.toFixed(4)}, val_acc: ${logs.val_acc.toFixed(4)}`);
          
          // Send metrics to Datadog
          dd.metric('ml.training.loss', logs.loss, 'gauge', [`epoch:${epoch}`]);
          dd.metric('ml.training.accuracy', logs.acc, 'gauge', [`epoch:${epoch}`]);
          dd.metric('ml.validation.loss', logs.val_loss, 'gauge', [`epoch:${epoch}`]);
          dd.metric('ml.validation.accuracy', logs.val_acc, 'gauge', [`epoch:${epoch}`]);
        }
      }
    });

    console.log('\n✅ Training complete!\n');
    dd.info('Model training complete', { epochs: CONFIG.epochs });

    // Evaluate model
    console.log('📈 Evaluating model...');
    const evalResult = model.evaluate(val.x, val.y);
    const loss = await evalResult[0].data();
    const acc = await evalResult[1].data();
    console.log(`   Validation Loss: ${loss[0].toFixed(4)}`);
    console.log(`   Validation Accuracy: ${acc[0].toFixed(4)}\n`);

    dd.metric('ml.final.validation_loss', loss[0]);
    dd.metric('ml.final.validation_accuracy', acc[0]);

    // Save model
    const modelDir = path.join(__dirname, '../src/models');
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }

    console.log('💾 Saving model...');
    // Save with custom path prefix
    const savePath = `file://${path.join(modelDir, 'bias-detection-model')}`;
    await model.save(savePath);
    
    // TensorFlow.js saves as model.json and weights.bin in a subdirectory
    // We need to move them to the correct location with correct names
    const savedModelDir = path.join(modelDir, 'bias-detection-model');
    const oldModelJson = path.join(savedModelDir, 'model.json');
    const oldWeightsBin = path.join(savedModelDir, 'weights.bin');
    const newModelJson = path.join(modelDir, 'bias-detection-model.json');
    const newWeightsBin = path.join(modelDir, 'bias-detection-model.weights.bin');
    
    // Move and rename files
    if (fs.existsSync(oldModelJson)) {
      fs.copyFileSync(oldModelJson, newModelJson);
      // Update weights path in JSON
      const modelJson = JSON.parse(fs.readFileSync(newModelJson, 'utf8'));
      if (modelJson.weightsManifest && modelJson.weightsManifest[0]) {
        modelJson.weightsManifest[0].paths = ['bias-detection-model.weights.bin'];
      }
      fs.writeFileSync(newModelJson, JSON.stringify(modelJson, null, 2));
    }
    if (fs.existsSync(oldWeightsBin)) {
      fs.copyFileSync(oldWeightsBin, newWeightsBin);
    }
    
    // Clean up temporary directory
    if (fs.existsSync(savedModelDir)) {
      fs.rmSync(savedModelDir, { recursive: true, force: true });
    }
    
    console.log(`   Model saved to: ${modelDir}\n`);

    // Clean up tensors
    train.x.dispose();
    train.y.dispose();
    val.x.dispose();
    val.y.dispose();

    // Test prediction
    console.log('🧪 Testing model prediction...');
    const testText = 'Men are better than women at programming.';
    const testTokens = tokenize(testText, CONFIG.vocabSize, CONFIG.maxLength);
    const testInput = tf.tensor2d([testTokens], [1, CONFIG.maxLength]);
    const prediction = model.predict(testInput);
    const predData = await prediction.data();
    
    console.log(`   Test text: "${testText}"`);
    console.log(`   Predicted bias_score: ${predData[0].toFixed(4)}`);
    
    dd.info('Model test prediction', {
      text: testText,
      bias_score: predData[0],
      categories: {
        gender: predData[1],
        racial: predData[2],
        age: predData[3],
        socioeconomic: predData[4],
        ability: predData[5]
      }
    });

    console.log(`   Category scores:`, {
      gender: predData[1].toFixed(4),
      racial: predData[2].toFixed(4),
      age: predData[3].toFixed(4),
      socioeconomic: predData[4].toFixed(4),
      ability: predData[5].toFixed(4)
    });
    console.log('');

    testInput.dispose();
    prediction.dispose();

    // Check file sizes
    const modelJsonPath = path.join(modelDir, 'bias-detection-model.json');
    const weightsPath = path.join(modelDir, 'bias-detection-model.weights.bin');
    
    if (fs.existsSync(modelJsonPath)) {
      const jsonSize = fs.statSync(modelJsonPath).size;
      console.log(`📦 Model JSON size: ${(jsonSize / 1024).toFixed(2)} KB`);
    }
    
    if (fs.existsSync(weightsPath)) {
      const weightsSize = fs.statSync(weightsPath).size;
      const weightsMB = (weightsSize / (1024 * 1024)).toFixed(2);
      console.log(`📦 Model weights size: ${weightsMB} MB`);
      
      if (weightsSize > 3 * 1024 * 1024) {
        console.warn(`⚠️  Warning: Model size (${weightsMB} MB) exceeds 3MB target`);
        dd.warn('Model size exceeds target', { size_mb: parseFloat(weightsMB), limit_mb: 3 });
      } else {
        console.log(`✅ Model size within target (< 3MB)`);
        dd.metric('ml.model.size_mb', parseFloat(weightsMB));
      }
    }

    console.log('\n✅ Model training and saving complete!');
    dd.info('Training pipeline finished successfully');
    console.log('\n📝 Next steps:');
    console.log('   1. Test the model in the extension');
    console.log('   2. Evaluate on real bias detection data');
    console.log('   3. Fine-tune if needed');

    return model;
  } catch (error) {
    console.error('❌ Training failed:', error);
    dd.error('Training failed', { error: error.message, stack: error.stack });
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  trainModel()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { trainModel, createModel, generateSyntheticData };

