// Real AI service with working API keys
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Get from https://makersuite.google.com/app/apikey

const ask = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
};

const parseJSON = (text) => {
  try {
    const match = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
    return JSON.parse(match ? match[1] : text);
  } catch {
    return null;
  }
};

export const realAiService = {
  predictPlacement: async (profile) => {
    const prompt = `You are an expert campus placement advisor. Analyze this student profile and predict their placement probability.
    
    Student Profile:
    - Name: ${profile.name}
    - CGPA: ${profile.cgpa}
    - Skills: ${(profile.skills || []).join(', ')}
    - Department: ${profile.department}
    - Year: ${profile.year}
    
    Provide a detailed analysis in this exact JSON format:
    {
      "probability": 75,
      "verdict": "Good Placement Prospects",
      "strengths": ["High CGPA", "Relevant skills", "Strong technical foundation"],
      "weaknesses": ["Limited project experience", "Need more industry exposure"],
      "advice": "Focus on building practical projects and improving communication skills"
    }`;
    
    const response = await ask(prompt);
    return parseJSON(response);
  },

  skillGapAnalysis: async (studentSkills, jobRole) => {
    const prompt = `You are a career counselor. Analyze the skill gap for this student targeting a ${jobRole} role.
    
    Current Skills: ${(studentSkills || []).join(', ')}
    Target Role: ${jobRole}
    
    Provide analysis in this exact JSON format:
    {
      "missingSkills": ["React", "Node.js", "MongoDB"],
      "strongSkills": ["JavaScript", "HTML", "CSS"],
      "roadmap": [
        "Learn React fundamentals and component lifecycle",
        "Master Node.js and Express.js for backend development",
        "Practice with MongoDB and database design",
        "Build full-stack projects to showcase skills"
      ],
      "estimatedWeeks": 8
    }`;
    
    const response = await ask(prompt);
    return parseJSON(response);
  },

  mockInterview: async (role, question) => {
    if (question) {
      const prompt = `You are an expert interviewer for ${role} positions. Provide a comprehensive answer to this interview question:
      
      Question: "${question}"
      
      Give a detailed, professional answer that a strong candidate would provide. Include key points, examples, and best practices.`;
      
      const response = await ask(prompt);
      return { answer: response };
    } else {
      const prompt = `You are an expert interviewer for ${role} positions. Generate 5 important interview questions with brief hints.
      
      Provide in this exact JSON format:
      {
        "questions": [
          {"q": "What is the difference between let, const, and var?", "hint": "Focus on scope and hoisting"},
          {"q": "Explain closures in JavaScript", "hint": "Inner functions accessing outer variables"}
        ]
      }`;
      
      const response = await ask(prompt);
      return parseJSON(response);
    }
  }
};