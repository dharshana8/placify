-- Phase 1: Learning Resources Seed Data (50+ curated resources)

INSERT INTO learning_resources (title, description, resource_type, url, platform, difficulty_level, skills_covered, duration_hours, rating, verified) VALUES

-- DSA Resources (15)
('Complete DSA Roadmap', 'Comprehensive data structures and algorithms course', 'COURSE', 'https://www.youtube.com/watch?v=8hly31xKli0', 'YouTube', 'BEGINNER', '["DSA", "Problem Solving"]', 40, 4.8, true),
('LeetCode Top 100 Liked', 'Most popular coding problems', 'PROBLEM_SET', 'https://leetcode.com/problemset/all/', 'LeetCode', 'INTERMEDIATE', '["DSA", "Algorithms"]', 60, 4.9, true),
('GeeksforGeeks DSA Course', 'Self-paced DSA learning', 'COURSE', 'https://practice.geeksforgeeks.org/courses/dsa-self-paced', 'GeeksForGeeks', 'BEGINNER', '["DSA", "Coding"]', 50, 4.7, true),
('Striver DSA Sheet', '180 problems for interview prep', 'PROBLEM_SET', 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', 'TakeUForward', 'INTERMEDIATE', '["DSA", "Interview Prep"]', 100, 4.9, true),
('InterviewBit DSA Track', 'Interview-focused DSA problems', 'PROBLEM_SET', 'https://www.interviewbit.com/courses/programming/', 'InterviewBit', 'INTERMEDIATE', '["DSA", "Problem Solving"]', 80, 4.6, true),
('HackerRank Interview Kit', 'Structured interview preparation', 'PROBLEM_SET', 'https://www.hackerrank.com/interview/interview-preparation-kit', 'HackerRank', 'INTERMEDIATE', '["DSA", "Algorithms"]', 40, 4.5, true),
('Neetcode 150', 'Curated LeetCode problems', 'PROBLEM_SET', 'https://neetcode.io/', 'Neetcode', 'INTERMEDIATE', '["DSA", "Coding Patterns"]', 70, 4.8, true),
('Abdul Bari Algorithms', 'Algorithm visualization and theory', 'VIDEO', 'https://www.youtube.com/watch?v=0IAPZzGSbME&list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O', 'YouTube', 'BEGINNER', '["Algorithms", "Theory"]', 30, 4.9, true),
('Dynamic Programming Patterns', 'Master DP problems', 'ARTICLE', 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns', 'LeetCode', 'ADVANCED', '["Dynamic Programming", "Algorithms"]', 20, 4.7, true),
('Graph Algorithms Playlist', 'Complete graph theory', 'VIDEO', 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P', 'YouTube', 'INTERMEDIATE', '["Graphs", "Algorithms"]', 15, 4.6, true),
('Binary Tree Bootcamp', 'Master tree problems', 'COURSE', 'https://www.educative.io/courses/binary-tree-bootcamp', 'Educative', 'INTERMEDIATE', '["Trees", "DSA"]', 12, 4.5, true),
('System Design for Coding', 'DSA in system context', 'ARTICLE', 'https://github.com/donnemartin/system-design-primer', 'GitHub', 'ADVANCED', '["DSA", "System Design"]', 25, 4.8, true),
('Recursion Masterclass', 'Deep dive into recursion', 'VIDEO', 'https://www.youtube.com/watch?v=IJDJ0kBx2LM', 'YouTube', 'BEGINNER', '["Recursion", "Problem Solving"]', 8, 4.4, true),
('Competitive Programming', 'CP techniques and tricks', 'COURSE', 'https://www.coursera.org/learn/competitive-programming-core-skills', 'Coursera', 'ADVANCED', '["CP", "Algorithms"]', 35, 4.6, true),
('Sorting & Searching Deep Dive', 'Master fundamental algorithms', 'TUTORIAL', 'https://www.programiz.com/dsa', 'Programiz', 'BEGINNER', '["Sorting", "Searching"]', 10, 4.3, true),

-- Backend Development (12)
('Spring Boot Complete Guide', 'Full-stack Spring Boot development', 'COURSE', 'https://www.udemy.com/course/spring-hibernate-tutorial/', 'Udemy', 'INTERMEDIATE', '["Spring Boot", "Java", "Backend"]', 45, 4.8, true),
('Node.js & Express Mastery', 'Build REST APIs with Node', 'COURSE', 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/', 'Udemy', 'INTERMEDIATE', '["Node.js", "Express", "Backend"]', 42, 4.9, true),
('Django for Beginners', 'Python web development', 'COURSE', 'https://www.youtube.com/watch?v=F5mRW0jo-U4', 'YouTube', 'BEGINNER', '["Django", "Python", "Backend"]', 25, 4.6, true),
('REST API Best Practices', 'Design scalable APIs', 'ARTICLE', 'https://www.freecodecamp.org/news/rest-api-best-practices/', 'FreeCodeCamp', 'INTERMEDIATE', '["REST API", "Backend"]', 3, 4.7, true),
('Microservices Architecture', 'Design microservices systems', 'COURSE', 'https://www.youtube.com/watch?v=CdBtNQZH8a4', 'YouTube', 'ADVANCED', '["Microservices", "Architecture"]', 20, 4.8, true),
('Database Design Fundamentals', 'SQL and NoSQL concepts', 'COURSE', 'https://www.coursera.org/learn/database-management', 'Coursera', 'INTERMEDIATE', '["SQL", "Database Design"]', 30, 4.5, true),
('JWT Authentication Guide', 'Secure your APIs', 'TUTORIAL', 'https://jwt.io/introduction', 'JWT.io', 'INTERMEDIATE', '["Security", "Authentication"]', 5, 4.6, true),
('Spring Security Deep Dive', 'Master Spring Security', 'VIDEO', 'https://www.youtube.com/watch?v=her_7pa0vrg', 'YouTube', 'ADVANCED', '["Spring Security", "Java"]', 15, 4.7, true),
('GraphQL Complete Course', 'Modern API development', 'COURSE', 'https://www.howtographql.com/', 'HowToGraphQL', 'INTERMEDIATE', '["GraphQL", "APIs"]', 18, 4.5, true),
('Redis Crash Course', 'Caching and performance', 'VIDEO', 'https://www.youtube.com/watch?v=jgpVdJB2sKQ', 'YouTube', 'INTERMEDIATE', '["Redis", "Caching"]', 4, 4.4, true),
('PostgreSQL Advanced', 'Advanced database techniques', 'COURSE', 'https://www.postgresqltutorial.com/', 'PostgreSQL Tutorial', 'ADVANCED', '["PostgreSQL", "Database"]', 22, 4.6, true),
('API Testing with Postman', 'Test and document APIs', 'TUTORIAL', 'https://learning.postman.com/', 'Postman', 'BEGINNER', '["Testing", "APIs"]', 8, 4.3, true),

-- Frontend Development (10)
('React Complete Guide 2024', 'Modern React development', 'COURSE', 'https://www.udemy.com/course/react-the-complete-guide/', 'Udemy', 'INTERMEDIATE', '["React", "Frontend", "JavaScript"]', 48, 4.9, true),
('JavaScript ES6+ Features', 'Modern JavaScript techniques', 'TUTORIAL', 'https://javascript.info/', 'JavaScript.info', 'INTERMEDIATE', '["JavaScript", "ES6"]', 20, 4.8, true),
('CSS Flexbox & Grid', 'Modern CSS layouts', 'TUTORIAL', 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', 'CSS-Tricks', 'BEGINNER', '["CSS", "Flexbox", "Grid"]', 6, 4.7, true),
('Next.js Full Course', 'React framework for production', 'VIDEO', 'https://www.youtube.com/watch?v=9P8mASSREYM', 'YouTube', 'ADVANCED', '["Next.js", "React", "SSR"]', 12, 4.8, true),
('Tailwind CSS Mastery', 'Utility-first CSS framework', 'COURSE', 'https://tailwindcss.com/docs', 'Tailwind Docs', 'BEGINNER', '["Tailwind", "CSS"]', 8, 4.6, true),
('Vue.js Fundamentals', 'Progressive JavaScript framework', 'COURSE', 'https://vuejs.org/tutorial/', 'Vue Docs', 'BEGINNER', '["Vue.js", "Frontend"]', 15, 4.5, true),
('TypeScript Deep Dive', 'Type-safe JavaScript', 'COURSE', 'https://www.typescriptlang.org/docs/', 'TypeScript Docs', 'INTERMEDIATE', '["TypeScript", "JavaScript"]', 18, 4.7, true),
('Redux Toolkit Guide', 'State management in React', 'TUTORIAL', 'https://redux-toolkit.js.org/tutorials/quick-start', 'Redux', 'INTERMEDIATE', '["Redux", "State Management"]', 10, 4.5, true),
('Responsive Web Design', 'Mobile-first design principles', 'COURSE', 'https://www.freecodecamp.org/learn/responsive-web-design/', 'FreeCodeCamp', 'BEGINNER', '["HTML", "CSS", "Responsive"]', 25, 4.8, true),
('Web Performance Optimization', 'Speed up your websites', 'ARTICLE', 'https://web.dev/learn-web-vitals/', 'Web.dev', 'ADVANCED', '["Performance", "Optimization"]', 8, 4.6, true),

-- DevOps & Cloud (8)
('Docker Complete Guide', 'Containerization fundamentals', 'COURSE', 'https://www.youtube.com/watch?v=fqMOX6JJhGo', 'YouTube', 'INTERMEDIATE', '["Docker", "DevOps"]', 12, 4.8, true),
('Kubernetes Basics', 'Container orchestration', 'COURSE', 'https://kubernetes.io/docs/tutorials/', 'Kubernetes Docs', 'ADVANCED', '["Kubernetes", "DevOps"]', 20, 4.7, true),
('AWS Cloud Practitioner', 'AWS fundamentals', 'COURSE', 'https://www.youtube.com/watch?v=SOTamWNgDKc', 'YouTube', 'BEGINNER', '["AWS", "Cloud"]', 16, 4.6, true),
('CI/CD with Jenkins', 'Automate deployments', 'TUTORIAL', 'https://www.jenkins.io/doc/tutorials/', 'Jenkins', 'INTERMEDIATE', '["CI/CD", "Jenkins"]', 10, 4.4, true),
('Git & GitHub Mastery', 'Version control essentials', 'COURSE', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 'YouTube', 'BEGINNER', '["Git", "GitHub"]', 6, 4.8, true),
('Linux Command Line', 'Master terminal commands', 'TUTORIAL', 'https://linuxjourney.com/', 'Linux Journey', 'BEGINNER', '["Linux", "Shell"]', 12, 4.5, true),
('Terraform Infrastructure', 'Infrastructure as Code', 'COURSE', 'https://www.youtube.com/watch?v=l5k1ai_GBDE', 'YouTube', 'ADVANCED', '["Terraform", "IaC"]', 14, 4.6, true),
('Nginx Web Server', 'Configure and optimize Nginx', 'TUTORIAL', 'https://nginx.org/en/docs/beginners_guide.html', 'Nginx Docs', 'INTERMEDIATE', '["Nginx", "Web Servers"]', 5, 4.3, true),

-- System Design (5)
('System Design Primer', 'Complete system design guide', 'ARTICLE', 'https://github.com/donnemartin/system-design-primer', 'GitHub', 'ADVANCED', '["System Design", "Architecture"]', 40, 4.9, true),
('Gaurav Sen System Design', 'Video series on system design', 'VIDEO', 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX', 'YouTube', 'INTERMEDIATE', '["System Design"]', 25, 4.8, true),
('Design Patterns', 'Software design patterns', 'COURSE', 'https://refactoring.guru/design-patterns', 'Refactoring Guru', 'INTERMEDIATE', '["Design Patterns", "OOP"]', 18, 4.7, true),
('Scalability Lecture Series', 'Build scalable systems', 'VIDEO', 'https://www.youtube.com/watch?v=-W9F__D3oY4', 'YouTube', 'ADVANCED', '["Scalability", "Architecture"]', 15, 4.6, true),
('Load Balancing Concepts', 'Distribute traffic efficiently', 'ARTICLE', 'https://www.nginx.com/resources/glossary/load-balancing/', 'Nginx', 'INTERMEDIATE', '["Load Balancing", "Architecture"]', 3, 4.4, true);
