// Mock AI service for development/demo purposes
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockData = {
  interviewQuestions: {
    'frontend developer': [
      { q: "What is the difference between let, const, and var in JavaScript?", hint: "Focus on scope, hoisting, and reassignment" },
      { q: "Explain the concept of closures in JavaScript", hint: "Inner functions accessing outer function variables" },
      { q: "What are React hooks and why are they useful?", hint: "State management in functional components" },
      { q: "How do you optimize React application performance?", hint: "Mention memo, useMemo, useCallback, lazy loading" },
      { q: "What is the difference between CSS Grid and Flexbox?", hint: "2D vs 1D layout systems" }
    ],
    'backend developer': [
      { q: "Explain the difference between SQL and NoSQL databases", hint: "Structure, scalability, ACID properties" },
      { q: "What is REST API and what are its principles?", hint: "Stateless, cacheable, uniform interface" },
      { q: "How do you handle authentication and authorization?", hint: "JWT, OAuth, session management" },
      { q: "Explain microservices architecture", hint: "Independent services, communication, benefits/challenges" },
      { q: "What is database indexing and why is it important?", hint: "Query performance, trade-offs" }
    ],
    'data scientist': [
      { q: "Explain the bias-variance tradeoff", hint: "Model complexity vs generalization" },
      { q: "What is the difference between supervised and unsupervised learning?", hint: "Labeled vs unlabeled data" },
      { q: "How do you handle missing data in a dataset?", hint: "Imputation, deletion, analysis impact" },
      { q: "Explain cross-validation and its importance", hint: "Model evaluation, overfitting prevention" },
      { q: "What is feature engineering and why is it crucial?", hint: "Data transformation, model performance" }
    ],
    'software engineer': [
      { q: "What are the SOLID principles in software design?", hint: "Single responsibility, Open/closed, etc." },
      { q: "Explain the difference between stack and heap memory", hint: "Storage location, lifecycle, performance" },
      { q: "What is Big O notation and why is it important?", hint: "Algorithm complexity, scalability" },
      { q: "How do you approach debugging a complex issue?", hint: "Systematic approach, tools, logging" },
      { q: "Explain version control and Git workflow", hint: "Branching, merging, collaboration" }
    ]
  },

  placementPredictions: [
    {
      probability: 85,
      verdict: "Excellent Placement Prospects",
      strengths: ["Strong CGPA", "Relevant technical skills", "Good communication"],
      weaknesses: ["Limited project experience", "Need more industry exposure"],
      advice: "Focus on building more projects and contributing to open source"
    },
    {
      probability: 72,
      verdict: "Good Placement Chances",
      strengths: ["Solid technical foundation", "Problem-solving skills"],
      weaknesses: ["CGPA could be higher", "Missing some in-demand skills"],
      advice: "Work on improving grades and learn trending technologies"
    },
    {
      probability: 58,
      verdict: "Moderate Placement Potential",
      strengths: ["Enthusiasm to learn", "Basic programming knowledge"],
      weaknesses: ["Low CGPA", "Limited technical skills", "Lack of projects"],
      advice: "Focus on skill development, build projects, and improve academic performance"
    }
  ],

  skillGaps: {
    'frontend developer': {
      missingSkills: ["TypeScript", "Next.js", "Testing (Jest)", "State Management (Redux)"],
      strongSkills: ["HTML", "CSS", "JavaScript", "React"],
      roadmap: [
        "Master TypeScript fundamentals and integration with React",
        "Learn Next.js for server-side rendering and routing",
        "Practice unit testing with Jest and React Testing Library",
        "Implement state management with Redux or Zustand",
        "Build a full-stack project showcasing all skills"
      ],
      estimatedWeeks: 8
    },
    'backend developer': {
      missingSkills: ["Docker", "Kubernetes", "Microservices", "System Design"],
      strongSkills: ["Java", "Spring Boot", "SQL", "REST APIs"],
      roadmap: [
        "Learn containerization with Docker",
        "Understand orchestration with Kubernetes basics",
        "Study microservices architecture patterns",
        "Practice system design problems",
        "Build and deploy a microservices project"
      ],
      estimatedWeeks: 10
    },
    'data scientist': {
      missingSkills: ["Deep Learning", "MLOps", "Big Data (Spark)", "Cloud Platforms"],
      strongSkills: ["Python", "Pandas", "Machine Learning", "Statistics"],
      roadmap: [
        "Learn neural networks and deep learning frameworks",
        "Understand MLOps and model deployment",
        "Get familiar with Apache Spark for big data",
        "Practice with cloud ML services (AWS/GCP)",
        "Complete an end-to-end ML project"
      ],
      estimatedWeeks: 12
    }
  }
};

export const mockAiService = {
  predictPlacement: async (profile) => {
    await delay(1500); // Simulate API delay
    
    const cgpa = parseFloat(profile.cgpa) || 0;
    const skillCount = (profile.skills || []).length;
    
    let predictionIndex = 0;
    if (cgpa >= 8.5 && skillCount >= 5) predictionIndex = 0;
    else if (cgpa >= 7.0 && skillCount >= 3) predictionIndex = 1;
    else predictionIndex = 2;
    
    return mockData.placementPredictions[predictionIndex];
  },

  skillGapAnalysis: async (studentSkills, jobRole) => {
    await delay(1200);
    
    const role = jobRole.toLowerCase();
    const roleKey = Object.keys(mockData.skillGaps).find(key => 
      role.includes(key.replace(' ', ''))
    ) || 'frontend developer';
    
    return mockData.skillGaps[roleKey];
  },

  mockInterview: async (role, question) => {
    await delay(1000);
    
    if (question) {
      // Generate a mock answer for specific question
      return {
        answer: `Here's a comprehensive answer to "${question}":\n\n` +
                `This is a fundamental concept that requires understanding of core principles. ` +
                `Key points to cover:\n\n` +
                `1. Define the concept clearly\n` +
                `2. Provide practical examples\n` +
                `3. Discuss real-world applications\n` +
                `4. Mention best practices and common pitfalls\n\n` +
                `Remember to structure your answer logically and demonstrate both theoretical knowledge and practical experience.`
      };
    }
    
    // Generate questions for the role
    const roleKey = role.toLowerCase();
    const questions = mockData.interviewQuestions[roleKey] || 
                     mockData.interviewQuestions['software engineer'];
    
    return { questions };
  },

  rankCandidates: async (jobTitle, jobSkills, candidates) => {
    await delay(800);
    
    const ranked = candidates.slice(0, 5).map((candidate, index) => ({
      name: candidate.studentName,
      score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
      reason: [
        "Strong technical background",
        "Good academic performance", 
        "Relevant project experience",
        "Excellent communication skills",
        "Leadership potential"
      ][index % 5]
    }));
    
    return { ranked: ranked.sort((a, b) => b.score - a.score) };
  },

  departmentInsights: async (deptName, stats) => {
    await delay(1000);
    
    return {
      insights: [
        {
          title: "Placement Rate Analysis",
          description: `${deptName} has a ${((stats.placed / stats.total) * 100).toFixed(1)}% placement rate. Focus on skill development programs.`,
          priority: "high"
        },
        {
          title: "Skill Gap Identification", 
          description: "Students need more exposure to industry-relevant technologies and practical projects.",
          priority: "medium"
        },
        {
          title: "Industry Partnerships",
          description: "Strengthen connections with companies for better placement opportunities.",
          priority: "high"
        }
      ]
    };
  },

  adminStrategy: async (platformStats) => {
    await delay(1200);
    
    return {
      strategies: [
        {
          title: "Enhance Skill Development Programs",
          description: `With ${platformStats.placementRate}% placement rate, focus on upskilling students in trending technologies.`,
          impact: "high"
        },
        {
          title: "Expand Company Network",
          description: `Currently ${platformStats.totalCompanies} companies. Target 50+ companies for better opportunities.`,
          impact: "high"
        },
        {
          title: "Improve Student Preparation",
          description: "Implement mock interviews, resume workshops, and soft skills training.",
          impact: "medium"
        }
      ]
    };
  }
};