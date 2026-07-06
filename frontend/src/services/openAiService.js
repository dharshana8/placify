// Real OpenAI API service
const OPENAI_API_KEY = 'sk-your-actual-openai-key-here'; // Replace with your real key

const callOpenAI = async (messages, temperature = 0.7) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: temperature,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
};

const parseJSON = (text) => {
  try {
    // Extract JSON from markdown code blocks or find JSON object
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    // Try parsing the entire text as JSON
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return null;
  }
};

export const openAiService = {
  predictPlacement: async (profile) => {
    const messages = [
      {
        role: 'system',
        content: 'You are an expert campus placement advisor with 15+ years of experience. Analyze student profiles and predict placement probability with detailed insights.'
      },
      {
        role: 'user',
        content: `Analyze this student profile for placement prediction:

Student Details:
- Name: ${profile.name}
- CGPA: ${profile.cgpa}
- Department: ${profile.department}
- Year: ${profile.year}
- Skills: ${(profile.skills || []).join(', ')}
- Phone: ${profile.phone}

Please provide a detailed analysis in this exact JSON format:
{
  "probability": 75,
  "verdict": "Good Placement Prospects",
  "strengths": ["High CGPA above 8.0", "Strong technical skills in React", "Good communication skills"],
  "weaknesses": ["Limited project portfolio", "Need more industry exposure", "Missing some trending technologies"],
  "advice": "Focus on building 2-3 substantial projects, contribute to open source, and practice coding interviews. Consider learning cloud technologies like AWS."
}

Base your analysis on:
- CGPA weightage (30%): >8.5 excellent, 7-8.5 good, 6-7 average, <6 needs improvement
- Skills relevance (40%): Modern tech stack, industry demand, skill depth
- Overall profile completeness (30%): Projects, experience, communication

Be realistic but encouraging. Provide actionable advice.`
      }
    ];

    const response = await callOpenAI(messages, 0.3); // Lower temperature for consistent analysis
    return parseJSON(response);
  },

  skillGapAnalysis: async (studentSkills, jobRole) => {
    const messages = [
      {
        role: 'system',
        content: 'You are a senior technical recruiter and career counselor specializing in skill gap analysis for tech roles.'
      },
      {
        role: 'user',
        content: `Perform skill gap analysis for this scenario:

Current Student Skills: ${(studentSkills || []).join(', ')}
Target Job Role: ${jobRole}

Analyze the gap between current skills and industry requirements for ${jobRole} role.

Provide analysis in this exact JSON format:
{
  "missingSkills": ["Docker", "Kubernetes", "System Design", "MongoDB"],
  "strongSkills": ["JavaScript", "React", "Node.js"],
  "roadmap": [
    "Week 1-2: Learn Docker fundamentals and containerization concepts",
    "Week 3-4: Practice Kubernetes basics and orchestration",
    "Week 5-6: Study system design patterns and scalability",
    "Week 7-8: Build a full-stack project using all new skills"
  ],
  "estimatedWeeks": 8
}

Consider:
- Current industry trends for ${jobRole}
- Skills in high demand
- Realistic learning timeline
- Practical project-based learning approach`
      }
    ];

    const response = await callOpenAI(messages, 0.4);
    return parseJSON(response);
  },

  mockInterview: async (role, question) => {
    if (question) {
      // Answer specific question
      const messages = [
        {
          role: 'system',
          content: `You are an expert technical interviewer for ${role} positions at top tech companies. Provide comprehensive, professional answers that demonstrate deep understanding.`
        },
        {
          role: 'user',
          content: `Interview Question: "${question}"

Provide a detailed, professional answer that a strong ${role} candidate would give. Include:
1. Clear explanation of concepts
2. Practical examples
3. Best practices
4. Common pitfalls to avoid
5. Real-world applications

Make it comprehensive but concise, suitable for a technical interview setting.`
        }
      ];

      const response = await callOpenAI(messages, 0.6);
      return { answer: response };
    } else {
      // Generate interview questions
      const messages = [
        {
          role: 'system',
          content: `You are a senior technical interviewer conducting ${role} interviews at leading tech companies.`
        },
        {
          role: 'user',
          content: `Generate 5 important technical interview questions for a ${role} position. 

Focus on:
- Core technical concepts
- Problem-solving abilities
- Practical experience
- Industry best practices
- Real-world scenarios

Provide in this exact JSON format:
{
  "questions": [
    {"q": "Explain the difference between let, const, and var in JavaScript", "hint": "Focus on scope, hoisting, and temporal dead zone"},
    {"q": "How would you optimize a React application's performance?", "hint": "Mention React.memo, useMemo, useCallback, code splitting"}
  ]
}

Make questions challenging but fair, suitable for mid-level ${role} candidates.`
        }
      ];

      const response = await callOpenAI(messages, 0.7);
      return parseJSON(response);
    }
  },

  rankCandidates: async (jobTitle, jobSkills, candidates) => {
    const messages = [
      {
        role: 'system',
        content: 'You are an AI recruitment specialist with expertise in candidate evaluation and ranking.'
      },
      {
        role: 'user',
        content: `Rank these candidates for the position: ${jobTitle}
Required Skills: ${jobSkills}

Candidates:
${candidates.slice(0, 10).map((c, i) => 
  `${i+1}. ${c.studentName} - CGPA: ${c.studentCgpa}, Department: ${c.studentDepartment}`
).join('\n')}

Rank them based on:
- Academic performance (25%)
- Skill relevance (40%)
- Department alignment (20%)
- Overall potential (15%)

Provide ranking in this JSON format:
{
  "ranked": [
    {"name": "Student Name", "score": 85, "reason": "Strong technical background with relevant skills and excellent academic record"}
  ]
}

Score out of 100. Be objective and provide specific reasons.`
      }
    ];

    const response = await callOpenAI(messages, 0.3);
    return parseJSON(response);
  }
};