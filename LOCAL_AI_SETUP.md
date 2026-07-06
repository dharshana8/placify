# Local AI Model Setup Guide

## Option 1: Ollama (Recommended for Local)

### 1. Install Ollama
```bash
# Windows/Mac/Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Download Model
```bash
ollama pull llama2
# or
ollama pull codellama
```

### 3. Create Local AI Service
```javascript
// localAiService.js
const askOllama = async (prompt) => {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt: prompt,
      stream: false
    })
  });
  
  const data = await response.json();
  return data.response;
};
```

## Option 2: Hugging Face Transformers

### 1. Install Dependencies
```bash
npm install @huggingface/inference
```

### 2. Implementation
```javascript
import { HfInference } from '@huggingface/inference';

const hf = new HfInference('YOUR_HF_TOKEN');

export const hfAiService = {
  async predictPlacement(profile) {
    const prompt = `Analyze placement probability for: ${JSON.stringify(profile)}`;
    const result = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: prompt
    });
    return parseResponse(result.generated_text);
  }
};
```

## Option 3: TensorFlow.js (Browser-based)

### 1. Install TensorFlow.js
```bash
npm install @tensorflow/tfjs
```

### 2. Load Pre-trained Model
```javascript
import * as tf from '@tensorflow/tfjs';

const loadModel = async () => {
  const model = await tf.loadLayersModel('/models/placement-model.json');
  return model;
};

export const tfAiService = {
  async predictPlacement(profile) {
    const model = await loadModel();
    const prediction = model.predict(preprocessProfile(profile));
    return formatPrediction(prediction);
  }
};
```

## Quick Start Recommendation

For immediate real AI functionality:
1. Get Google Gemini API key (free tier available)
2. Replace key in realAiService.js
3. Your AI features will work with actual AI responses

For production:
- Use OpenAI for best quality
- Use local models for privacy/cost control
- Use Gemini for free tier testing