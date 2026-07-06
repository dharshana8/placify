// Test script to check available Gemini models
const testApiKey = 'AIzaSyBx2pCm_yA1wUg4vzs2340V9wu8rtGTwbg';

const testEndpoints = [
  'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/text-bison-001:generateText',
  'https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText'
];

export const testGeminiEndpoints = async () => {
  console.log('Testing Gemini API endpoints...');
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(`${endpoint}?key=${testApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }]
        })
      });
      
      console.log(`Status: ${response.status}`);
      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok && data.candidates) {
        console.log('✅ SUCCESS! Working endpoint:', endpoint);
        return endpoint;
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  console.log('No working endpoints found');
  return null;
};

// Call this function in browser console to test
// testGeminiEndpoints();