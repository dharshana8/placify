const USE_MOCK = true;

const mockAI = {
  predictPlacement: async (profile) => {
    await new Promise(r => setTimeout(r, 1000));
    const cgpa = profile.cgpa || 0;
    const hasGoodSkills = (profile.skills || []).some(s => 
      ['Java', 'Python', 'React', 'JavaScript', 'SQL'].some(tech => 
        s.toLowerCase().includes(tech.toLowerCase())
      )
    );
    const probability = cgpa >= 8 && hasGoodSkills ? 85 : cgpa >= 7 ? 65 : 40;
    return {
      probability,
      verdict: probability > 75 ? 'High Chance' : probability > 50 ? 'Medium Chance' : 'Low Chance',
      strengths: cgpa >= 8 ? ['Strong academic record', 'Good technical foundation'] : ['Decent CGPA', 'Basic skills'],
      weaknesses: hasGoodSkills ? ['Need more project experience'] : ['Limited technical skills', 'Need to learn in-demand technologies'],
      advice: `Focus on building ${hasGoodSkills ? 'real-world projects' : 'core technical skills like Java, Python, and web development'}. Practice DSA and participate in coding competitions.`
    };
  },
  skillGapAnalysis: async (skills, role) => {
    await new Promise(r => setTimeout(r, 1000));
    const hasJava = skills.some(s => s.toLowerCase().includes('java'));
    const hasPython = skills.some(s => s.toLowerCase().includes('python'));
    const hasWeb = skills.some(s => ['react', 'javascript', 'html', 'css'].some(t => s.toLowerCase().includes(t)));
    return {
      missingSkills: [!hasJava && 'Java/Spring Boot', !hasPython && 'Python', !hasWeb && 'React/Frontend', 'System Design', 'Cloud (AWS/Azure)'].filter(Boolean),
      strongSkills: skills.slice(0, 3),
      roadmap: ['Week 1-2: Master DSA basics', 'Week 3-4: Build 2 full-stack projects', 'Week 5-6: Learn system design fundamentals', 'Week 7-8: Practice mock interviews'],
      estimatedWeeks: 8
    };
  },
  mockInterview: async (role, question) => {
    await new Promise(r => setTimeout(r, 1000));
    if (question) {
      return { answer: 'A comprehensive answer would cover: 1) Understanding the problem requirements, 2) Discussing trade-offs between different approaches, 3) Implementing the optimal solution with proper error handling, 4) Testing edge cases thoroughly.' };
    }
    return {
      questions: [
        { q: 'Tell me about yourself and your technical background', hint: 'Brief intro, key projects, technical strengths' },
        { q: 'Explain the difference between REST and GraphQL', hint: 'Architecture, use cases, pros/cons' },
        { q: 'How would you optimize a slow database query?', hint: 'Indexing, query optimization, caching strategies' },
        { q: 'Describe a challenging project you worked on', hint: 'Problem, solution, impact, learnings' },
        { q: 'How do you handle conflicts in a team?', hint: 'Communication, empathy, problem-solving approach' }
      ]
    };
  },
  rankCandidates: async (jobTitle, jobSkills, candidates) => {
    await new Promise(r => setTimeout(r, 1500));
    return {
      ranked: candidates.slice(0, 10).map((c, i) => {
        const cgpa = c.studentCgpa || c.cgpa || 0;
        const skills = c.studentSkills || c.skills || [];
        const score = Math.min(100, (cgpa * 8) + (skills.length * 2) + Math.random() * 20);
        return {
          name: c.studentName || c.name,
          score: Math.round(score),
          reason: score > 80 ? 'Strong technical skills matching job requirements' : score > 60 ? 'Good academic background, some relevant skills' : 'Limited match with required skills'
        };
      }).sort((a, b) => b.score - a.score)
    };
  },
  departmentInsights: async (deptName, stats) => {
    await new Promise(r => setTimeout(r, 1000));
    const rate = stats.total > 0 ? (stats.placed / stats.total) * 100 : 0;
    return {
      insights: [
        { title: 'Placement Performance', description: `Current placement rate of ${rate.toFixed(1)}% ${rate > 70 ? 'is excellent' : rate > 50 ? 'is good but can improve' : 'needs significant improvement'}. Focus on skill development and industry partnerships.`, priority: rate < 50 ? 'high' : 'medium' },
        { title: 'Skill Development', description: `Top skills among placed students: ${(stats.topSkills || []).join(', ')}. Encourage all students to develop these in-demand skills through workshops and projects.`, priority: 'high' },
        { title: 'Industry Collaboration', description: 'Increase company visits, guest lectures, and internship opportunities to improve student exposure to industry requirements.', priority: 'medium' }
      ]
    };
  },
  adminStrategy: async (platformStats) => {
    await new Promise(r => setTimeout(r, 1000));
    const rate = platformStats.placementRate || 0;
    return {
      strategies: [
        { title: 'Corporate Partnership Program', description: 'Establish MoUs with 20+ companies for guaranteed interview slots. Create a dedicated corporate relations team to manage partnerships and organize quarterly hiring drives.', impact: 'high' },
        { title: 'Skill Enhancement Bootcamps', description: `Launch intensive 8-week bootcamps in high-demand areas: Full-Stack Development, Data Science, Cloud Computing. ${rate < 60 ? 'Critical priority given current placement rate.' : 'Will further boost placement numbers.'}`, impact: rate < 60 ? 'critical' : 'high' },
        { title: 'AI-Powered Student Readiness', description: 'Implement continuous skill assessment and personalized learning paths. Use AI to identify at-risk students early and provide targeted interventions.', impact: 'high' }
      ]
    };
  }
};

const KEYS = [
  'AIzaSyBnH3WQWuMoJjjtaHgB9Ezq-CVQe2joaRk',
  'AIzaSyBgLRStfPiC4vGfSaI1OLdZ1ZKBTaq4HgQ',
  'AIzaSyDDezj4yHAbvazLaerU1xmj2mhU5BCpSEc',
];

let keyIndex = 0;

const ask = async (prompt) => {
  let lastError = null;
  const maxAttempts = KEYS.length;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const currentKey = KEYS[keyIndex];
    keyIndex = (keyIndex + 1) % KEYS.length;
    
    console.log(`[AI] Using API key ending in ...${currentKey.slice(-4)} (Attempt ${attempt + 1}/${maxAttempts})`);
    
    try {
      if (attempt > 0) {
        const delayMs = 1500;
        console.log(`[AI] Switching to next key, waiting ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${currentKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            contents: [{ 
              role: "user",
              parts: [{ text: prompt }] 
            }],
            generationConfig: {
              temperature: 0.4,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
              responseMimeType: "application/json"
            }
          }),
        }
      );
      
      const data = await res.json();
      
      if (!res.ok || data.error) {
        const errorMsg = data?.error?.message || res.statusText;
        console.warn(`[AI] Attempt ${attempt + 1} failed: HTTP ${res.status} - ${errorMsg}`);
        lastError = new Error(`HTTP ${res.status} - ${errorMsg}`);
        continue;
      }
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log(`[AI] Success! Got response of length ${text.length}`);
      return text;
    } catch (e) {
      console.warn(`[AI] Attempt ${attempt + 1} fetch error:`, e.message);
      lastError = e;
    }
  }
  
  throw new Error(`All API keys failed or rate limits exceeded. Last error: ${lastError?.message}`);
};

const parseJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.warn("[AI] Native JSON parse failed, attempting regex extraction...", e.message);
    try {
      const match = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
      return JSON.parse(match ? match[1] : text);
    } catch {
      console.error("[AI] Fatal JSON parse error for text:", text);
      return null;
    }
  }
};

export const aiService = {
  predictPlacement: async (profile) => {
    if (USE_MOCK) return mockAI.predictPlacement(profile);
    const text = await ask(
      `You are an expert Campus Placement Predictor AI and Career Counselor.
      Analyze this student profile precisely based on current tech industry hiring trends.
      Name: ${profile.name}, CGPA: ${profile.cgpa}/10, Skills: ${(profile.skills || []).join(', ')}, Department: ${profile.department}, Year: ${profile.year}.
      
      Scoring criteria:
      - High Chance (>75%): Good CGPA (>7.5) + Strong modern tech stack.
      - Medium Chance (50-75%): Average CGPA or average skills.
      - Low Chance (<50%): Poor CGPA or missing core technical skills.
      
      Respond ONLY in this exact structured JSON format and nothing else:
      {"probability": <number 0-100>, "verdict": "High Chance|Medium Chance|Low Chance", "strengths": ["<detailed strength 1>", "<detailed strength 2>"], "weaknesses": ["<actionable weakness 1>", "<actionable weakness 2>"], "advice": "<highly specific action plan>"}`
    );
    return parseJSON(text);
  },

  skillGapAnalysis: async (studentSkills, jobRole) => {
    if (USE_MOCK) return mockAI.skillGapAnalysis(studentSkills, jobRole);
    const text = await ask(
      `You are an elite Tech Career Analyst.
      A student has these skills: ${(studentSkills || []).join(', ')}.
      They want to achieve the target role: ${jobRole || 'Software Engineer'}.
      
      Compare their current skill stack against industry-standard requirements for this role in top tech companies.
      
      Respond ONLY in this exact structured JSON format and nothing else:
      {"missingSkills": ["<critical missing skill 1>", "<skill 2>"], "strongSkills": ["<current good skill 1>", "<skill 2>"], "roadmap": ["<Week 1-2 action>", "<Week 3-4 action>", "<Week 5-6 action>", "<Week 7-8 action>"], "estimatedWeeks": <number>}`
    );
    return parseJSON(text);
  },

  mockInterview: async (role, question) => {
    if (USE_MOCK) return mockAI.mockInterview(role, question);
    const text = await ask(
      `You are a strict but constructive Senior Technical Interviewer from a FAANG company.
      Role being interviewed for: ${role || 'Software Engineer'}.
      
      ${question
        ? `The candidate has been asked: "${question}". Provide a rigorous 'model answer' demonstrating deep technical understanding and best practices. Respond ONLY in this exact JSON format: {"answer": "<detailed expert response string with technical depth>"}`
        : `Generate 5 progressively difficult interview questions (mix of behavioral, situational, and technical) for this role.
           Respond ONLY in this exact structured JSON format and nothing else:
           {"questions": [{"q": "<question text>", "hint": "<what the interviewer expects to hear>"}]}`
      }`
    );
    if (question) {
      const data = parseJSON(text);
      return { answer: data?.answer || text };
    }
    return parseJSON(text);
  },

  rankCandidates: async (jobTitle, jobSkills, candidates) => {
    if (USE_MOCK) return mockAI.rankCandidates(jobTitle, jobSkills, candidates);
    const studentDataStr = JSON.stringify(candidates.slice(0, 10).map(c => ({ 
      id: c.studentId || c.id || c.name, 
      name: c.studentName || c.name, 
      cgpa: c.studentCgpa || c.cgpa, 
      dept: c.studentDepartment || c.department,
      skills: c.studentSkills || c.skills || []
    })));
    
    const text = await ask(
      `You are an unbiased, data-driven AI Technical Recruiter.
      Job Role: ${jobTitle}
      Required Skills: ${jobSkills}
      
      Evaluate and rank the following candidates strictly based on how well their skills and academic background match this specific job. Penalize candidates lacking core required skills.
      
      Candidates JSON: ${studentDataStr}
      
      Respond ONLY in this exact structured JSON format:
      {"ranked": [{"name": "<candidate name>", "score": <0-100 technical match score>, "reason": "<data-driven justification referencing specific matching skills or gaps>"}]}`
    );
    return parseJSON(text);
  },

  departmentInsights: async (deptName, stats) => {
    if (USE_MOCK) return mockAI.departmentInsights(deptName, stats);
    const text = await ask(
      `You are a University Data Analytics AI consulting for the Head of Department.
      Department Name: ${deptName}.
      Latest placement statistics: total placed=${stats.placed}, total eligible=${stats.total}, average CGPA=${stats.avgCgpa}.
      Top skills among placed students: ${JSON.stringify(stats.topSkills || [])}.
      
      Provide strategic, actionable insights to improve curriculum, training focus, and overall placement rates for the next academic year.
      
      Respond ONLY in this exact structured JSON format:
      {"insights": [{"title": "<Clear insight heading>", "description": "<Detailed data-backed observation and recommendation>", "priority": "high|medium|low"}]}`
    );
    return parseJSON(text);
  },

  adminStrategy: async (platformStats) => {
    if (USE_MOCK) return mockAI.adminStrategy(platformStats);
    const text = await ask(
      `You are a visionary Strategic Advisor to the University Director of Placements.
      College Platform Stats: Total Students=${platformStats.totalStudents}, Total Placed=${platformStats.totalPlacements}, Hiring Companies=${platformStats.totalCompanies}, Overall Placement Rate=${platformStats.placementRate}%.
      
      Based on these high-level metrics, suggest 3 high-impact institutional strategies (corporate relations, bootcamp planning, policy changes) to drastically improve placement outcomes and attract higher-tier companies.
      
      Respond ONLY in this exact structured JSON format:
      {"strategies": [{"title": "<Strategic Initiative Name>", "description": "<Comprehensive execution plan>", "impact": "high|critical"}]}`
    );
    return parseJSON(text);
  }
};
