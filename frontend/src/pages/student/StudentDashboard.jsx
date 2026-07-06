import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import NotificationPopup from '../../components/NotificationPopup';
import { studentAPI, quizAPI } from '../../services/api';
import { aiService } from '../../services/aiService';
import {
  Calendar, MapPin, DollarSign, Building2, Clock,
  Upload, Send, Filter, Search,
  CheckCircle, XCircle, AlertCircle, Eye, Brain, TrendingUp, MessageSquare, Award, Plus, Trash2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const Badge = ({ status }) => {
  const map = {
    SELECTED: 'bg-green-500/20 text-green-400 border border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-400 border border-red-500/30',
    INTERVIEW: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    SHORTLISTED: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    APPLIED: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || map.APPLIED}`}>
      {status === 'SELECTED' && <CheckCircle className="w-3 h-3" />}
      {status === 'REJECTED' && <XCircle className="w-3 h-3" />}
      {status === 'INTERVIEW' && <Clock className="w-3 h-3" />}
      {status === 'SHORTLISTED' && <AlertCircle className="w-3 h-3" />}
      {status}
    </span>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-dark-card border border-dark-border rounded-xl p-6 ${className}`}>{children}</div>
);

const StatCard = ({ label, value, color = 'text-primary-400' }) => (
  <Card>
    <p className="text-sm text-slate-400 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </Card>
);

const Spinner = () => (
  <div className="flex justify-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
  </div>
);

const DEPARTMENTS = ['CSE', 'CSE(CY)', 'AIDS', 'AIML', 'IT', 'CCE', 'ECE', 'EEE', 'CSBS', 'MECH'];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState({ name: '', department: '', cgpa: '', phone: '', year: '', rollNumber: '', skills: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPlacement, setAiPlacement] = useState(null);
  const [aiSkills, setAiSkills] = useState(null);
  const [aiSkillRole, setAiSkillRole] = useState('');
  const [aiInterview, setAiInterview] = useState(null);
  const [aiInterviewRole, setAiInterviewRole] = useState('');
  const [aiInterviewQ, setAiInterviewQ] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [assessmentScore, setAssessmentScore] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [peerData, setPeerData] = useState(null);
  const [resumeData, setResumeData] = useState({
    personalInfo: { name: '', email: '', phone: '', linkedin: '' },
    education: [{ degree: '', institution: '', year: '', cgpa: '' }],
    experience: [{ title: '', company: '', duration: '', description: '' }],
    skills: [],
    projects: [{ name: '', description: '', technologies: '' }]
  });
  const [prepMaterials, setPrepMaterials] = useState([
    { 
      id: 1, 
      title: 'Data Structures & Algorithms', 
      topics: [
        { name: 'Arrays', completed: false },
        { name: 'Strings', completed: false },
        { name: 'Linked Lists', completed: false },
        { name: 'Stacks', completed: false },
        { name: 'Queues', completed: false },
        { name: 'Trees', completed: false },
        { name: 'Binary Search Trees', completed: false },
        { name: 'Graphs', completed: false },
        { name: 'Hashing', completed: false },
        { name: 'Heaps', completed: false },
        { name: 'Dynamic Programming', completed: false },
        { name: 'Greedy Algorithms', completed: false },
        { name: 'Backtracking', completed: false },
        { name: 'Sorting Algorithms', completed: false },
        { name: 'Searching Algorithms', completed: false }
      ]
    },
    { 
      id: 2, 
      title: 'Database Management System (DBMS)', 
      topics: [
        { name: 'ER Model', completed: false },
        { name: 'Relational Model', completed: false },
        { name: 'SQL Queries', completed: false },
        { name: 'Joins', completed: false },
        { name: 'Normalization', completed: false },
        { name: 'Transactions', completed: false },
        { name: 'ACID Properties', completed: false },
        { name: 'Indexing', completed: false },
        { name: 'B-Trees & B+ Trees', completed: false },
        { name: 'Concurrency Control', completed: false },
        { name: 'Deadlock', completed: false },
        { name: 'File Organization', completed: false }
      ]
    },
    { 
      id: 3, 
      title: 'Operating Systems (OS)', 
      topics: [
        { name: 'Process Management', completed: false },
        { name: 'Threads', completed: false },
        { name: 'CPU Scheduling', completed: false },
        { name: 'Deadlock', completed: false },
        { name: 'Memory Management', completed: false },
        { name: 'Paging', completed: false },
        { name: 'Segmentation', completed: false },
        { name: 'Virtual Memory', completed: false },
        { name: 'File Systems', completed: false },
        { name: 'Disk Scheduling', completed: false },
        { name: 'Synchronization', completed: false },
        { name: 'Semaphores & Mutex', completed: false }
      ]
    },
    { 
      id: 4, 
      title: 'Computer Networks', 
      topics: [
        { name: 'OSI Model', completed: false },
        { name: 'TCP/IP Model', completed: false },
        { name: 'IP Addressing', completed: false },
        { name: 'Subnetting', completed: false },
        { name: 'Routing Algorithms', completed: false },
        { name: 'TCP vs UDP', completed: false },
        { name: 'HTTP/HTTPS', completed: false },
        { name: 'DNS', completed: false },
        { name: 'Network Security', completed: false },
        { name: 'Firewalls', completed: false },
        { name: 'Switching Techniques', completed: false }
      ]
    },
    { 
      id: 5, 
      title: 'Object-Oriented Programming (OOP)', 
      topics: [
        { name: 'Classes & Objects', completed: false },
        { name: 'Encapsulation', completed: false },
        { name: 'Inheritance', completed: false },
        { name: 'Polymorphism', completed: false },
        { name: 'Abstraction', completed: false },
        { name: 'Interfaces', completed: false },
        { name: 'Abstract Classes', completed: false },
        { name: 'Method Overloading', completed: false },
        { name: 'Method Overriding', completed: false },
        { name: 'Constructors', completed: false },
        { name: 'Exception Handling', completed: false }
      ]
    },
    { 
      id: 6, 
      title: 'Aptitude - Quantitative', 
      topics: [
        { name: 'Number System', completed: false },
        { name: 'Percentages', completed: false },
        { name: 'Profit & Loss', completed: false },
        { name: 'Time & Work', completed: false },
        { name: 'Time, Speed & Distance', completed: false },
        { name: 'Simple & Compound Interest', completed: false },
        { name: 'Ratio & Proportion', completed: false },
        { name: 'Averages', completed: false },
        { name: 'Mixtures & Alligations', completed: false },
        { name: 'Permutation & Combination', completed: false },
        { name: 'Probability', completed: false },
        { name: 'Ages', completed: false }
      ]
    },
    { 
      id: 7, 
      title: 'Aptitude - Logical Reasoning', 
      topics: [
        { name: 'Series Completion', completed: false },
        { name: 'Coding-Decoding', completed: false },
        { name: 'Blood Relations', completed: false },
        { name: 'Direction Sense', completed: false },
        { name: 'Seating Arrangement', completed: false },
        { name: 'Puzzles', completed: false },
        { name: 'Syllogism', completed: false },
        { name: 'Data Sufficiency', completed: false },
        { name: 'Clocks & Calendars', completed: false },
        { name: 'Venn Diagrams', completed: false },
        { name: 'Statement & Conclusions', completed: false }
      ]
    },
    { 
      id: 8, 
      title: 'Aptitude - Verbal Ability', 
      topics: [
        { name: 'Reading Comprehension', completed: false },
        { name: 'Sentence Correction', completed: false },
        { name: 'Synonyms & Antonyms', completed: false },
        { name: 'Fill in the Blanks', completed: false },
        { name: 'Para Jumbles', completed: false },
        { name: 'Idioms & Phrases', completed: false },
        { name: 'Spotting Errors', completed: false },
        { name: 'One Word Substitution', completed: false },
        { name: 'Active & Passive Voice', completed: false },
        { name: 'Direct & Indirect Speech', completed: false }
      ]
    }
  ]);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [permissionRequest, setPermissionRequest] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [achievementForm, setAchievementForm] = useState({
    title: '', description: '', category: 'HACKATHON',
    organizationName: '', eventDate: '', position: ''
  });
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedJobPreview, setSelectedJobPreview] = useState(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(null);
  const [quizTimerInterval, setQuizTimerInterval] = useState(null);

  useEffect(() => {
    loadProfile();
    loadJobs();
    loadApplications();
    loadQuizzes();
    loadQuizAttempts();
    loadAchievements();
    checkNotifications();
  }, []);

  useEffect(() => {
    if (activeTab === 'jobs') loadJobs();
    if (activeTab === 'applications') loadApplications();
    if (activeTab === 'notifications') loadNotifications();
    if (activeTab === 'quizzes') { loadQuizzes(); loadQuizAttempts(); }
    if (activeTab === 'achievements') loadAchievements();
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      const res = await studentAPI.getProfile();
      setProfile(res.data);
      setEditProfile({
        name: res.data.name || '', department: res.data.department || '',
        cgpa: res.data.cgpa || '', phone: res.data.phone || '',
        year: res.data.year || '', rollNumber: res.data.rollNumber || '',
        skills: res.data.skills || []
      });
    } catch (e) { console.error(e); }
  };

  const loadJobs = async () => {
    setLoading(true);
    try { const res = await studentAPI.getJobs(); setJobs(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadApplications = async () => {
    setLoading(true);
    try { const res = await studentAPI.getApplications(); setApplications(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadNotifications = async () => {
    try { const res = await studentAPI.getNotifications(); setNotifications(res.data); }
    catch (e) { console.error(e); }
  };

  const checkNotifications = async () => {
    try {
      const res = await studentAPI.getUnreadCount();
      setUnreadCount(res.data.count);
      if (res.data.count > 0) {
        await loadNotifications();
        setShowNotificationPopup(true);
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await studentAPI.deleteNotification(id);
      loadNotifications();
      checkNotifications();
    } catch (e) { alert('Failed to delete notification'); }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await studentAPI.markAsRead(id);
      await loadNotifications();
      await checkNotifications();
    } catch (e) { 
      console.error('Failed to mark as read:', e);
      alert('Failed to mark as read'); 
    }
  };

  const loadQuizzes = async () => {
    try { const res = await quizAPI.getAvailableQuizzes(); setQuizzes(res.data); }
    catch (e) { console.error(e); }
  };

  const loadQuizAttempts = async () => {
    try { const res = await quizAPI.getMyAttempts(); setQuizAttempts(res.data); }
    catch (e) { console.error(e); }
  };

  const startQuiz = async (quizId) => {
    try {
      const res = await quizAPI.getQuizQuestions(quizId);
      const data = res.data;
      const quiz = data.quiz || quizzes.find(q => q.id === quizId);
      setQuizQuestions(data.questions || []);
      setSelectedQuiz(quiz);
      setQuizAnswers({});
      
      // Start timer
      if (quiz?.duration) {
        const totalSeconds = quiz.duration * 60;
        setQuizTimeLeft(totalSeconds);
        
        const interval = setInterval(() => {
          setQuizTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              submitQuiz();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        setQuizTimerInterval(interval);
      }
    } catch (e) { alert(e.response?.data?.message || 'Failed to load quiz'); }
  };

  const submitQuiz = async () => {
    if (Object.keys(quizAnswers).length < quizQuestions.length) {
      if (quizTimeLeft > 0 && !window.confirm('You have not answered all questions. Submit anyway?')) return;
    }
    
    // Clear timer
    if (quizTimerInterval) {
      clearInterval(quizTimerInterval);
      setQuizTimerInterval(null);
    }
    
    setQuizSubmitting(true);
    try {
      await quizAPI.submitQuiz(selectedQuiz.id, quizAnswers);
      alert('Quiz submitted successfully!');
      setSelectedQuiz(null);
      setQuizQuestions([]);
      setQuizAnswers({});
      setQuizTimeLeft(null);
      loadQuizzes();
      loadQuizAttempts();
    } catch (e) { alert(e.response?.data?.message || 'Failed to submit quiz'); }
    finally { setQuizSubmitting(false); }
  };

  const loadAchievements = async () => {
    try { const res = await studentAPI.getMyAchievements(); setAchievements(res.data); }
    catch (e) { console.error(e); }
  };

  const submitAchievement = async () => {
    if (!achievementForm.title || !achievementForm.category) {
      alert('Please fill required fields'); return;
    }
    try {
      await studentAPI.submitAchievement(achievementForm);
      setShowAchievementModal(false);
      setAchievementForm({ title: '', description: '', category: 'HACKATHON', organizationName: '', eventDate: '', position: '' });
      loadAchievements();
      alert('Achievement submitted for review!');
    } catch (e) { alert('Failed to submit achievement'); }
  };

  const deleteAchievement = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    try { await studentAPI.deleteAchievement(id); loadAchievements(); }
    catch (e) { alert('Failed to delete'); }
  };

  const applyToJob = async (jobId) => {
    if (!profile?.resumeUrl) {
      alert('Please upload your resume first before applying to jobs.');
      setActiveTab('profile');
      return;
    }
    try {
      await studentAPI.applyJob(jobId);
      loadJobs();
    } catch (e) { alert(e.response?.data?.message || 'Failed to apply'); }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const payload = { ...editProfile };
      delete payload._skillsInput; // cleanup temporary UI state
      
      const resumeFile = payload.resumeFile;
      delete payload.resumeFile;
      
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      
      await studentAPI.updateProfile(formData);
      loadProfile();
      setEditProfile(p => ({ ...p, resumeFile: null })); // clear file
      alert('Profile updated successfully!');
    } catch (e) { alert(e.response?.data?.message || 'Failed to update'); }
    finally { setLoading(false); }
  };

  const inputCls = (editable = true) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
      editable ? 'bg-dark-hover border-dark-border' : 'bg-dark-bg border-dark-border text-slate-400 cursor-default'
    }`;

  const filteredJobs = jobs.filter(j =>
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ResumeBanner = () => {
    if (profile?.resumeUrl) return null;
    return (
      <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
        <span className="text-red-400 text-lg">⚠</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-300">Resume Required</p>
          <p className="text-xs text-red-400/70">Upload your resume to apply for jobs</p>
        </div>
        <button onClick={() => setActiveTab('profile')}
          className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
          Upload Now
        </button>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back, {profile?.name || 'Student'}!</h2>
        <p className="text-primary-100 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Available Jobs" value={jobs.length} color="text-primary-400" />
        <StatCard label="Applications" value={applications.length} color="text-blue-400" />
        <StatCard label="CGPA" value={profile?.cgpa || 'N/A'} color="text-green-400" />
        <StatCard label="Status" value={profile?.placementStatus || 'Not Placed'} color="text-yellow-400" />
      </div>
      <Card>
        <h3 className="text-base font-semibold text-white mb-4">Recent Jobs</h3>
        <div className="space-y-3">
          {jobs.slice(0, 3).map(job => (
            <div key={job.id} className="flex justify-between items-center p-4 bg-dark-hover rounded-lg border border-dark-border">
              <div>
                <p className="font-medium text-white text-sm">{job.title}</p>
                <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3" />{job.companyName}
                  <span className="mx-1">·</span>
                  <DollarSign className="w-3 h-3" />{job.salaryPackage}
                </p>
              </div>
              <button onClick={() => applyToJob(job.id)} disabled={job.applied}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {job.applied ? 'Applied' : 'Apply'}
              </button>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No jobs available yet</p>}
        </div>
      </Card>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Available Jobs</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search jobs..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-dark-card border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-dark-border text-slate-400 rounded-lg hover:bg-dark-hover transition-colors">
            <Filter className="w-4 h-4" />Filter
          </button>
        </div>
      </div>
      {loading ? <Spinner /> : (
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <Card key={job.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-3">
                    <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{job.companyName}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salaryPackage}</span>
                    {job.interviewDate && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(job.interviewDate).toLocaleDateString()}</span>}
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="ml-6 flex gap-2">
                  <button onClick={() => setSelectedJobPreview(job)}
                    className="px-4 py-2 text-sm font-medium border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">
                    <Eye className="w-4 h-4 inline mr-1" />View Details
                  </button>
                  <button onClick={() => applyToJob(job.id)} disabled={job.applied}
                    className="px-5 py-2 text-sm font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    {job.applied ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
          {filteredJobs.length === 0 && <p className="text-slate-500 text-center py-12">No jobs found</p>}
        </div>
      )}
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">My Applications</h2>
      {loading ? <Spinner /> : (
        <div className="space-y-3">
          {applications.map(app => (
            <Card key={app.id}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white">{app.jobTitle}</h3>
                  <p className="text-slate-400 text-sm flex items-center gap-1 mt-0.5"><Building2 className="w-3 h-3" />{app.companyName}</p>
                  <p className="text-slate-500 text-xs mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <Badge status={app.status} />
              </div>
            </Card>
          ))}
          {applications.length === 0 && <p className="text-slate-500 text-center py-12">No applications yet</p>}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Profile</h2>
      </div>
      <Card>
        <h3 className="text-base font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Name', field: 'name', type: 'text' },
            { label: 'Email', field: 'email', type: 'email', readOnly: true },
            { label: 'Roll Number', field: 'rollNumber', type: 'text' },
            { label: 'Phone', field: 'phone', type: 'tel' },
            { label: 'Department', field: 'department', type: 'text' },
            { label: 'CGPA', field: 'cgpa', type: 'number' },
          ].map(({ label, field, type, readOnly }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
              <input type={type}
                value={readOnly ? (profile?.email || '') : (editProfile[field] ?? '')}
                onChange={e => {
                  if (!readOnly) {
                    setEditProfile(p => ({ ...p, [field]: e.target.value }));
                  }
                }}
                readOnly={readOnly}
                className={inputCls(!readOnly)} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Year</label>
            <select value={editProfile.year ?? ''}
              onChange={e => setEditProfile(p => ({ ...p, year: e.target.value }))}
              className={inputCls(true)}>
              <option value="">Select Year</option>
              {[1,2,3,4].map(y => <option key={y} value={y}>{y}{['st','nd','rd','th'][y-1]} Year</option>)}
            </select>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="text-base font-semibold text-white mb-4">Skills</h3>
        <input type="text"
          value={editProfile._skillsInput !== undefined ? editProfile._skillsInput : (editProfile.skills ? editProfile.skills.join(', ') : '')}
          onChange={e => setEditProfile(p => ({ ...p, _skillsInput: e.target.value, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
          placeholder="Java, Python, React... (comma separated)"
          className={inputCls(true)} />
        <div className="flex flex-wrap gap-2 mt-3">
          {editProfile.skills?.map((s, i) => (
            <span key={i} className="px-2.5 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs rounded-full">{s}</span>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="text-base font-semibold text-white mb-4">Resume</h3>
        <div className="flex items-center gap-3">
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" id="resume-upload"
            onChange={e => {
              if (e.target.files[0]) {
                setEditProfile(p => ({ ...p, resumeFile: e.target.files[0] }));
              }
            }} />
          <label htmlFor="resume-upload" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />{editProfile.resumeFile ? editProfile.resumeFile.name : 'Upload Resume'}
          </label>
          {profile?.resumeUrl && (
            <button className="flex items-center gap-2 px-4 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">
              <Eye className="w-4 h-4" />View Resume
            </button>
          )}
        </div>
      </Card>
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={loadProfile} className="px-5 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">Reset Values</button>
        <button onClick={handleProfileUpdate} disabled={loading}
          className="px-5 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 transition-colors">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Notifications</h2>
        {notifications.filter(n => !n.isRead).length > 0 && (
          <button onClick={async () => {
            try {
              await studentAPI.markAllAsRead();
              loadNotifications();
              checkNotifications();
            } catch (e) { alert('Failed to mark all as read'); }
          }} className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
            Mark all as read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {notifications.map(n => (
          <Card key={n.id} className={!n.isRead ? 'border-primary-500/30 bg-primary-500/5' : ''}>
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {!n.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full"></span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    n.type === 'ANNOUNCEMENT' || n.type === 'DEPT_ANNOUNCEMENT'
                      ? 'bg-blue-500/20 text-blue-400'
                      : n.type === 'ACHIEVEMENT_APPROVED'
                      ? 'bg-green-500/20 text-green-400'
                      : n.type === 'ACHIEVEMENT_REJECTED'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {n.type?.replace('_', ' ')}
                  </span>
                  {n.sentBy && (
                    <span className="text-xs text-slate-500">from {n.sentBy}</span>
                  )}
                </div>
                <h3 className="font-semibold text-white text-sm">{n.title || 'Notification'}</h3>
                <p className="text-slate-400 text-sm mt-1">{n.message}</p>
                <p className="text-slate-500 text-xs mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                {!n.isRead && (
                  <button onClick={() => handleMarkAsRead(n.id)} className="text-primary-400 hover:text-primary-300 text-xs transition-colors">
                    Mark read
                  </button>
                )}
                <button onClick={() => handleDeleteNotification(n.id)} className="text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {notifications.length === 0 && <p className="text-slate-500 text-center py-12">No notifications</p>}
      </div>
    </div>
  );

  const runPlacementAI = async () => {
    if (!profile) return;
    setAiLoading(true); setAiError('');
    try { 
      const result = await aiService.predictPlacement(profile);
      setAiPlacement(result);
    }
    catch (e) { 
      console.error('AI Placement Error:', e);
      setAiError(`AI failed: ${e.message || 'Network or API error. Please try again.'}`); 
    } finally { setAiLoading(false); }
  };

  const runSkillGapAI = async () => {
    setAiLoading(true); setAiError('');
    try { 
      const result = await aiService.skillGapAnalysis(profile?.skills, aiSkillRole);
      setAiSkills(result);
    }
    catch (e) { 
      console.error('AI Skills Error:', e);
      setAiError(`AI failed: ${e.message || 'Network or API error. Please try again.'}`); 
    } finally { setAiLoading(false); }
  };

  const runInterviewAI = async (question = '') => {
    setAiLoading(true); setAiError('');
    try { 
      const result = await aiService.mockInterview(aiInterviewRole, question);
      setAiInterview(result);
    }
    catch (e) { 
      console.error('AI Interview Error:', e);
      setAiError(`AI failed: ${e.message || 'Network or API error. Please try again.'}`); 
    } finally { setAiLoading(false); }
  };

  const renderAIPlacement = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">AI Placement Score</h2>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">Based on your profile: CGPA {profile?.cgpa || 'N/A'}, {profile?.skills?.length || 0} skills</p>
          </div>
          <button onClick={runPlacementAI} disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 transition-colors">
            <Brain className="w-4 h-4" />{aiLoading ? 'Analyzing...' : 'Analyze My Profile'}
          </button>
        </div>
        {aiError && <p className="text-red-400 text-sm mb-4">{aiError}</p>}
        {aiPlacement && (
          <div className="space-y-4">
            <div className="flex items-center gap-6 p-4 bg-dark-hover rounded-xl border border-dark-border">
              <div className="text-center">
                <p className="text-5xl font-bold text-primary-400">{aiPlacement.probability}%</p>
                <p className="text-xs text-slate-400 mt-1">Placement Probability</p>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-lg">{aiPlacement.verdict}</p>
                <p className="text-slate-400 text-sm mt-1">{aiPlacement.advice}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 text-xs font-medium mb-2">✓ Strengths</p>
                {aiPlacement.strengths?.map((s, i) => <p key={i} className="text-slate-300 text-sm">• {s}</p>)}
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-xs font-medium mb-2">✗ Areas to Improve</p>
                {aiPlacement.weaknesses?.map((w, i) => <p key={i} className="text-slate-300 text-sm">• {w}</p>)}
              </div>
            </div>
          </div>
        )}
        {!aiPlacement && !aiLoading && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-primary-400/30 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Click "Analyze My Profile" to get your AI placement prediction</p>
          </div>
        )}
      </Card>
    </div>
  );

  const renderAISkills = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Skill Gap Analysis</h2>
      <Card>
        <div className="flex gap-3 mb-4">
          <input type="text" placeholder="Target role (e.g. Data Scientist)" value={aiSkillRole}
            onChange={e => setAiSkillRole(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-dark-hover border border-dark-border text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" />
          <button onClick={runSkillGapAI} disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 transition-colors">
            <TrendingUp className="w-4 h-4" />{aiLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {aiError && <p className="text-red-400 text-sm mb-4">{aiError}</p>}
        {aiSkills && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 text-xs font-medium mb-2">✓ Strong Skills</p>
                {aiSkills.strongSkills?.map((s, i) => (
                  <span key={i} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">{s}</span>
                ))}
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-xs font-medium mb-2">✗ Missing Skills</p>
                {aiSkills.missingSkills?.map((s, i) => (
                  <span key={i} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-dark-hover border border-dark-border rounded-xl">
              <p className="text-white text-sm font-medium mb-3">📍 Learning Roadmap <span className="text-slate-500 text-xs ml-2">~{aiSkills.estimatedWeeks} weeks</span></p>
              {aiSkills.roadmap?.map((step, i) => (
                <div key={i} className="flex items-start gap-3 mb-2">
                  <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  <p className="text-slate-300 text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {!aiSkills && !aiLoading && (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-primary-400/30 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Enter a target role and click Analyze to see your skill gaps</p>
          </div>
        )}
      </Card>
    </div>
  );

  const renderAIInterview = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Mock Interview AI</h2>
      <Card>
        <div className="flex gap-3 mb-4">
          <input type="text" placeholder="Role (e.g. Frontend Developer)" value={aiInterviewRole}
            onChange={e => setAiInterviewRole(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-dark-hover border border-dark-border text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" />
          <button onClick={() => { setAiInterviewQ(''); runInterviewAI(''); }} disabled={aiLoading || !aiInterviewRole.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 transition-colors">
            <MessageSquare className="w-4 h-4" />{aiLoading ? 'Generating...' : 'Get Questions'}
          </button>
        </div>
        {aiError && <p className="text-red-400 text-sm mb-4">{aiError}</p>}
        {aiInterview?.questions && (
          <div className="space-y-3 mb-4">
            {aiInterview.questions.map((q, i) => (
              <div key={i} className="p-4 bg-dark-hover border border-dark-border rounded-xl">
                <p className="text-white text-sm font-medium mb-1">Q{i+1}. {q.q}</p>
                <p className="text-slate-400 text-xs">💡 {q.hint}</p>
              </div>
            ))}
          </div>
        )}
        {aiInterview?.answer && (
          <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl mb-4">
            <p className="text-primary-400 text-xs font-medium mb-2">AI Answer</p>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{aiInterview.answer}</p>
          </div>
        )}
        <div className="flex gap-3 mt-2">
          <input type="text" placeholder="Ask a specific interview question..." value={aiInterviewQ}
            onChange={e => setAiInterviewQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runInterviewAI(aiInterviewQ)}
            className="flex-1 px-4 py-2.5 bg-dark-hover border border-dark-border text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" />
          <button onClick={() => runInterviewAI(aiInterviewQ)} disabled={aiLoading || !aiInterviewQ}
            className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 transition-colors">
            Ask AI
          </button>
        </div>
        {!aiInterview && !aiLoading && (
          <div className="text-center py-6">
            <MessageSquare className="w-12 h-12 text-primary-400/30 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Enter a role and get AI-generated interview questions</p>
          </div>
        )}
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'jobs': return renderJobs();
      case 'applications': return renderApplications();
      case 'profile': return renderProfile();
      case 'notifications': return renderNotifications();
      case 'ai-placement': return renderAIPlacement();
      case 'ai-skills': return renderAISkills();
      case 'ai-interview': return renderAIInterview();
      case 'saved-jobs': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Saved Jobs ({jobs.slice(0, 5).length})</h2>
          {jobs.length === 0 ? (
            <Card className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Save jobs while browsing to view them here</p>
              <button onClick={() => setActiveTab('jobs')} className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg">Browse Jobs</button>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map(job => (
                <Card key={job.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-3">
                        <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{job.companyName}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.salaryPackage}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills?.slice(0,4).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs rounded-full">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => applyToJob(job.id)} disabled={job.applied}
                      className="ml-6 px-5 py-2 text-sm font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      {job.applied ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
      case 'interview-schedule': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Interview Schedule</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card><p className="text-sm text-slate-400">Upcoming</p><p className="text-2xl font-bold text-yellow-400">{applications.filter(a => a.status === 'INTERVIEW').length}</p></Card>
            <Card><p className="text-sm text-slate-400">This Week</p><p className="text-2xl font-bold text-blue-400">{applications.filter(a => a.status === 'INTERVIEW').length}</p></Card>
            <Card><p className="text-sm text-slate-400">Completed</p><p className="text-2xl font-bold text-green-400">{applications.filter(a => a.status === 'SELECTED').length}</p></Card>
          </div>
          {applications.filter(a => a.status === 'INTERVIEW' || a.status === 'SHORTLISTED').map(app => (
            <Card key={app.id}>
              <div className="flex items-center gap-4">
                <Calendar className="w-10 h-10 text-primary-400" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{app.jobTitle}</h3>
                  <p className="text-slate-400 text-sm">{app.companyName}</p>
                  <p className="text-slate-500 text-xs mt-1">Check email for interview details</p>
                </div>
                <Badge status={app.status} />
              </div>
            </Card>
          ))}
          {applications.filter(a => a.status === 'INTERVIEW').length === 0 && (
            <Card className="text-center py-12"><Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" /><p className="text-slate-500 text-sm">No interviews scheduled</p></Card>
          )}
        </div>
      );
      case 'placement-prep': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Placement Preparation</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard 
              label="Total Topics" 
              value={prepMaterials.reduce((sum, m) => sum + m.topics.length, 0)} 
              color="text-blue-400" 
            />
            <StatCard 
              label="Completed" 
              value={prepMaterials.reduce((sum, m) => sum + m.topics.filter(t => t.completed).length, 0)} 
              color="text-green-400" 
            />
            <StatCard 
              label="Remaining" 
              value={prepMaterials.reduce((sum, m) => sum + m.topics.filter(t => !t.completed).length, 0)} 
              color="text-yellow-400" 
            />
            <StatCard 
              label="Progress" 
              value={`${Math.round((prepMaterials.reduce((sum, m) => sum + m.topics.filter(t => t.completed).length, 0) / prepMaterials.reduce((sum, m) => sum + m.topics.length, 0)) * 100)}%`} 
              color="text-primary-400" 
            />
          </div>
          <div className="space-y-4">
            {prepMaterials.map((module) => {
              const completedCount = module.topics.filter(t => t.completed).length;
              const totalCount = module.topics.length;
              const progress = Math.round((completedCount / totalCount) * 100);
              
              return (
                <Card key={module.id}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-white text-lg">{module.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">{completedCount}/{totalCount} completed</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-dark-hover rounded-full h-2">
                          <div className="bg-primary-500 h-2 rounded-full transition-all" style={{width: `${progress}%`}} />
                        </div>
                        <span className="text-sm text-primary-400 font-medium w-12">{progress}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {module.topics.map((topic, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPrepMaterials(prev => prev.map(m => 
                            m.id === module.id 
                              ? {
                                  ...m,
                                  topics: m.topics.map((t, i) => 
                                    i === idx ? { ...t, completed: !t.completed } : t
                                  )
                                }
                              : m
                          ));
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                          topic.completed
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-dark-hover border-dark-border text-slate-300 hover:border-primary-500/50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          topic.completed ? 'bg-green-500 border-green-500' : 'border-slate-500'
                        }`}>
                          {topic.completed && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className={topic.completed ? 'line-through' : ''}>{topic.name}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      );
      case 'resume-builder': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Resume Builder</h2>
          <Card>
            <h3 className="font-semibold text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Full Name" defaultValue={profile?.name || ''} className={inputCls()} />
              <input type="email" placeholder="Email" defaultValue={profile?.email || ''} className={inputCls()} />
              <input type="tel" placeholder="Phone" defaultValue={profile?.phone || ''} className={inputCls()} />
              <input type="text" placeholder="LinkedIn" className={inputCls()} />
            </div>
            <textarea rows="3" placeholder="Professional Summary" className={inputCls()} />
          </Card>
          <Card>
            <h3 className="font-semibold text-white mb-4">Education</h3>
            <div className="space-y-3">
              <div className="p-3 bg-dark-hover rounded-lg">
                <p className="text-white font-medium">{profile?.department || 'Department'}</p>
                <p className="text-slate-400 text-sm">CGPA: {profile?.cgpa || 'N/A'} | Year: {profile?.year || 'N/A'}</p>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold text-white mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(profile?.skills || []).map((s, i) => (
                <span key={i} className="px-3 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm rounded-full">{s}</span>
              ))}
            </div>
          </Card>
          <div className="flex gap-3">
            <button onClick={() => alert('Resume preview will open in new tab')} className="px-5 py-2 border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">Preview</button>
            <button onClick={() => alert('Generating PDF resume...')} className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Download PDF</button>
          </div>
        </div>
      );
      case 'skill-assessment': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Skill Assessment</h2>
          <Card>
            <p className="text-slate-400 text-sm mb-4">Your department will conduct skill assessments and update your internal marks. Check with your department coordinator for assessment schedules.</p>
            <div className="p-4 bg-dark-hover rounded-lg border border-dark-border">
              <h3 className="font-semibold text-white mb-2">Internal Marks</h3>
              <p className="text-slate-300 text-sm">Mock Interview Score: <span className="text-primary-400 font-medium">{profile?.mockScore || 'Not assessed'}</span></p>
              <p className="text-slate-300 text-sm mt-1">Coding Assessment: <span className="text-primary-400 font-medium">{profile?.codingScore || 'Not assessed'}</span></p>
            </div>
          </Card>
        </div>
      );
      case 'peer-comparison': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Peer Comparison</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card><p className="text-sm text-slate-400">Dept Avg CGPA</p><p className="text-2xl font-bold text-green-400">7.8</p></Card>
            <Card><p className="text-sm text-slate-400">Your CGPA</p><p className="text-2xl font-bold text-green-400">{profile?.cgpa || 'N/A'}</p></Card>
            <Card><p className="text-sm text-slate-400">Difference</p><p className={`text-2xl font-bold ${(profile?.cgpa || 0) >= 7.8 ? 'text-green-400' : 'text-red-400'}`}>{profile?.cgpa ? ((profile.cgpa - 7.8) > 0 ? '+' : '') + (profile.cgpa - 7.8).toFixed(2) : 'N/A'}</p></Card>
          </div>
          <Card>
            <h3 className="font-semibold text-white mb-4">Performance Metrics</h3>
            {[
              {label: 'Applications Submitted', you: applications.length, avg: 8, max: 20},
              {label: 'Interview Calls', you: applications.filter(a => a.status === 'INTERVIEW' || a.status === 'SHORTLISTED').length, avg: 3, max: 10},
              {label: 'Skills Listed', you: profile?.skills?.length || 0, avg: 6, max: 15},
              {label: 'Profile Completion', you: profile?.resumeUrl ? 100 : 60, avg: 75, max: 100}
            ].map((m, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">{m.label}</span>
                  <span className="text-white">You: {m.you} | Dept Avg: {m.avg}</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-dark-hover rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full transition-all" style={{width: `${(m.you/m.max)*100}%`}} />
                  </div>
                  <div className="flex-1 bg-dark-hover rounded-full h-2">
                    <div className="bg-slate-500 h-2 rounded-full transition-all" style={{width: `${(m.avg/m.max)*100}%`}} />
                  </div>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <h3 className="font-semibold text-white mb-4">Recommendations</h3>
            <div className="space-y-3">
              {applications.length < 5 && <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"><p className="text-yellow-400 text-sm">💡 Apply to more jobs to increase your chances (Current: {applications.length}/5)</p></div>}
              {!profile?.resumeUrl && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-red-400 text-sm">⚠️ Upload your resume to apply for jobs</p></div>}
              {(profile?.skills?.length || 0) < 5 && <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"><p className="text-blue-400 text-sm">📚 Add more skills to your profile (Current: {profile?.skills?.length || 0}/5)</p></div>}
              {(profile?.cgpa || 0) < 7.0 && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-red-400 text-sm">📈 Your CGPA is below eligibility criteria (7.0). Focus on improving academics.</p></div>}
              {(profile?.cgpa || 0) >= 8.0 && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"><p className="text-green-400 text-sm">🌟 Excellent CGPA! You're in the top tier for placements.</p></div>}
            </div>
          </Card>
        </div>
      );
      case 'request-permission': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Request Permission</h2>
          <Card>
            <p className="text-slate-400 text-sm mb-4">Already placed but want to apply for more opportunities? Request permission from admin.</p>
            <textarea rows="4" placeholder="Reason for requesting permission..." value={permissionRequest}
              onChange={e => setPermissionRequest(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-hover border border-dark-border text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500 mb-4" />
            <button onClick={async () => {
              if (!permissionRequest.trim()) { alert('Please enter a reason'); return; }
              try {
                await studentAPI.requestPermission({ reason: permissionRequest });
                setPermissionRequest('');
                alert('Permission request submitted successfully!');
              } catch (e) { alert(e.response?.data?.message || 'Failed to submit request'); }
            }}
              className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Submit Request</button>
          </Card>
        </div>
      );
      case 'contact': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Contact Admin</h2>
          <Card>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Subject</label>
                <input type="text" placeholder="Enter subject" value={contactForm.subject}
                  onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-dark-hover border border-dark-border text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Message</label>
                <textarea rows="5" placeholder="Enter your message" value={contactForm.message}
                  onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-dark-hover border border-dark-border text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" />
              </div>
              <button onClick={async () => {
                if (!contactForm.subject || !contactForm.message) { alert('Please enter subject and message'); return; }
                try {
                  await studentAPI.contactAdmin(contactForm);
                  setContactForm({ subject: '', message: '' });
                  alert('Message sent to admin successfully!');
                } catch (e) { alert(e.response?.data?.message || 'Failed to send message'); }
              }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                <Send className="w-4 h-4" />Send Message
              </button>
            </div>
          </Card>
        </div>
      );
      case 'quizzes': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Department Quizzes</h2>
          {selectedQuiz && quizQuestions.length > 0 ? (
            <Card>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedQuiz.title}</h3>
                  <p className="text-slate-400 text-sm">{selectedQuiz.description}</p>
                </div>
                <div className="text-right">
                  {quizTimeLeft !== null && (
                    <div className={`mb-2 px-4 py-2 rounded-lg border ${
                      quizTimeLeft < 60 ? 'bg-red-500/10 border-red-500/30' :
                      quizTimeLeft < 300 ? 'bg-yellow-500/10 border-yellow-500/30' :
                      'bg-green-500/10 border-green-500/30'
                    }`}>
                      <p className="text-xs text-slate-400 mb-0.5">Time Remaining</p>
                      <p className={`text-2xl font-bold ${
                        quizTimeLeft < 60 ? 'text-red-400' :
                        quizTimeLeft < 300 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {Math.floor(quizTimeLeft / 60)}:{String(quizTimeLeft % 60).padStart(2, '0')}
                      </p>
                    </div>
                  )}
                  <p className="text-slate-400 text-sm">Total Marks: {selectedQuiz.totalMarks}</p>
                </div>
              </div>
              <div className="space-y-6">
                {quizQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-dark-hover border border-dark-border rounded-lg">
                    <p className="text-white font-medium mb-3">Q{idx + 1}. {q.question} <span className="text-slate-500 text-sm">({q.marks} marks)</span></p>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map(optNum => {
                        const optText = q[`option${optNum}`];
                        if (!optText) return null;
                        return (
                          <button
                            key={optNum}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optNum }))}
                            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                              quizAnswers[q.id] === optNum
                                ? 'bg-primary-500/20 border-primary-500 text-white'
                                : 'bg-dark-bg border-dark-border text-slate-300 hover:border-primary-500/50'
                            }`}
                          >
                            <span className="font-medium">{String.fromCharCode(64 + optNum)}.</span> {optText}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-dark-border">
                <button onClick={() => { 
                  if (quizTimerInterval) clearInterval(quizTimerInterval);
                  setSelectedQuiz(null); 
                  setQuizQuestions([]); 
                  setQuizAnswers({}); 
                  setQuizTimeLeft(null);
                  setQuizTimerInterval(null);
                }}
                  className="px-4 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">
                  Cancel
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm">Answered: {Object.keys(quizAnswers).length}/{quizQuestions.length}</span>
                  <button onClick={submitQuiz} disabled={quizSubmitting}
                    className="px-6 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 transition-colors">
                    {quizSubmitting ? 'Submitting...' : 'Submit Quiz'}
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <StatCard label="Available Quizzes" value={quizzes.length} color="text-blue-400" />
                <StatCard label="Completed" value={quizAttempts.length} color="text-green-400" />
                <StatCard label="Avg Score" value={quizAttempts.length ? `${Math.round(quizAttempts.reduce((sum, a) => sum + (a.score / a.totalMarks) * 100, 0) / quizAttempts.length)}%` : '0%'} color="text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Available Quizzes</h3>
                <div className="space-y-3">
                  {quizzes.map(quiz => {
                    const attempted = quizAttempts.find(a => a.quizId === quiz.id);
                    return (
                      <Card key={quiz.id}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{quiz.title}</h4>
                            <p className="text-slate-400 text-sm mt-1">{quiz.description}</p>
                            <div className="flex gap-4 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{quiz.duration} mins</span>
                              <span>Total Marks: {quiz.totalMarks}</span>
                              <span>Questions: {quiz.questionCount || 0}</span>
                            </div>
                          </div>
                          {attempted ? (
                            <div className="text-right">
                              <p className={`text-lg font-bold ${
                                (attempted.score / attempted.totalMarks) >= 0.8 ? 'text-green-400' :
                                (attempted.score / attempted.totalMarks) >= 0.6 ? 'text-yellow-400' : 'text-red-400'
                              }`}>{attempted.score}/{attempted.totalMarks}</p>
                              <p className="text-slate-400 text-xs">Completed</p>
                            </div>
                          ) : (
                            <button onClick={() => startQuiz(quiz.id)}
                              className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                              Start Quiz
                            </button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                  {quizzes.length === 0 && <Card><p className="text-slate-400 text-center py-8">No quizzes available</p></Card>}
                </div>
              </div>
              {quizAttempts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">My Attempts</h3>
                  <div className="space-y-2">
                    {quizAttempts.map((attempt, idx) => (
                      <Card key={idx}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{attempt.quizTitle}</p>
                            <p className="text-slate-500 text-xs mt-1">{new Date(attempt.attemptedAt).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              (attempt.score / attempt.totalMarks) >= 0.8 ? 'text-green-400' :
                              (attempt.score / attempt.totalMarks) >= 0.6 ? 'text-yellow-400' : 'text-red-400'
                            }`}>{attempt.score}/{attempt.totalMarks}</p>
                            <p className="text-slate-400 text-xs">{Math.round((attempt.score / attempt.totalMarks) * 100)}%</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      );
      case 'achievements': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">My Achievements</h2>
            <button onClick={() => setShowAchievementModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />Add Achievement
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total" value={achievements.length} color="text-blue-400" />
            <StatCard label="Approved" value={achievements.filter(a => a.status === 'APPROVED').length} color="text-green-400" />
            <StatCard label="Pending" value={achievements.filter(a => a.status === 'PENDING').length} color="text-yellow-400" />
          </div>
          <div className="space-y-3">
            {achievements.map(ach => (
              <Card key={ach.id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-primary-400" />
                      <h3 className="font-semibold text-white">{ach.title}</h3>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        ach.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        ach.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>{ach.status}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{ach.description}</p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span className="px-2 py-1 bg-dark-hover rounded">📁 {ach.category}</span>
                      {ach.organizationName && <span>🏢 {ach.organizationName}</span>}
                      {ach.eventDate && <span>📅 {new Date(ach.eventDate).toLocaleDateString()}</span>}
                      {ach.position && <span>🏆 {ach.position}</span>}
                    </div>
                    {ach.reviewComments && (
                      <div className="mt-2 p-2 bg-dark-hover rounded text-xs">
                        <span className="text-slate-400">Review: </span>
                        <span className="text-slate-300">{ach.reviewComments}</span>
                      </div>
                    )}
                  </div>
                  {ach.status === 'PENDING' && (
                    <button onClick={() => deleteAchievement(ach.id)} className="text-red-400 hover:text-red-300 transition-colors ml-4">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Card>
            ))}
            {achievements.length === 0 && <Card><p className="text-slate-400 text-center py-12">No achievements added yet. Click "Add Achievement" to share your accomplishments!</p></Card>}
          </div>
          {showAchievementModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowAchievementModal(false)}>
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Add Achievement</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
                    <input type="text" placeholder="e.g., Won Smart India Hackathon 2024" value={achievementForm.title} onChange={e => setAchievementForm({...achievementForm, title: e.target.value})} className={inputCls()} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Category *</label>
                    <select value={achievementForm.category} onChange={e => setAchievementForm({...achievementForm, category: e.target.value})} className={inputCls()}>
                      <option value="HACKATHON">Hackathon</option>
                      <option value="CONTEST">Contest/Competition</option>
                      <option value="CERTIFICATION">Certification</option>
                      <option value="PROJECT">Project</option>
                      <option value="PUBLICATION">Publication</option>
                      <option value="AWARD">Award</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                    <textarea rows="3" placeholder="Describe your achievement..." value={achievementForm.description} onChange={e => setAchievementForm({...achievementForm, description: e.target.value})} className={inputCls()} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Organization</label>
                      <input type="text" placeholder="e.g., Google, IEEE" value={achievementForm.organizationName} onChange={e => setAchievementForm({...achievementForm, organizationName: e.target.value})} className={inputCls()} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Event Date</label>
                      <input type="date" value={achievementForm.eventDate} onChange={e => setAchievementForm({...achievementForm, eventDate: e.target.value})} className={inputCls()} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Position/Rank</label>
                    <input type="text" placeholder="e.g., Winner, 1st Place, Participant" value={achievementForm.position} onChange={e => setAchievementForm({...achievementForm, position: e.target.value})} className={inputCls()} />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowAchievementModal(false)} className="px-4 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">Cancel</button>
                  <button onClick={submitAchievement} className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Submit for Review</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="STUDENT" />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">{renderContent()}</div>
      </div>
      <NotificationPopup
        show={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        notifications={notifications}
        onDelete={handleDeleteNotification}
        onMarkAsRead={handleMarkAsRead}
      />
      
      {/* Job Preview Modal */}
      {selectedJobPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedJobPreview(null)}>
          <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedJobPreview.title}</h2>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{selectedJobPreview.companyName}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{selectedJobPreview.location}</span>
                  <span className="flex items-center gap-1 text-primary-400 font-semibold"><DollarSign className="w-4 h-4" />{selectedJobPreview.salaryPackage}</span>
                </div>
              </div>
              <button onClick={() => setSelectedJobPreview(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Job Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Job Description</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedJobPreview.description || 'No description provided.'}</p>
              </div>
              
              {/* Required Skills */}
              {selectedJobPreview.requiredSkills && selectedJobPreview.requiredSkills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobPreview.requiredSkills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Job Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Job Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedJobPreview.minCgpa && (
                    <div className="p-3 bg-dark-hover rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Minimum CGPA</p>
                      <p className="text-white font-semibold">{selectedJobPreview.minCgpa}</p>
                    </div>
                  )}
                  {selectedJobPreview.interviewDate && (
                    <div className="p-3 bg-dark-hover rounded-lg">
                      <p className="text-xs text-slate-400 mb-1">Interview Date</p>
                      <p className="text-white font-semibold">{new Date(selectedJobPreview.interviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  )}
                  <div className="p-3 bg-dark-hover rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Location</p>
                    <p className="text-white font-semibold">{selectedJobPreview.location}</p>
                  </div>
                  <div className="p-3 bg-dark-hover rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Package</p>
                    <p className="text-white font-semibold">{selectedJobPreview.salaryPackage}</p>
                  </div>
                </div>
              </div>
              
              {/* Eligibility Check */}
              {profile && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">📋 Your Eligibility</h3>
                  <div className="space-y-2 text-sm">
                    {selectedJobPreview.minCgpa && (
                      <div className="flex items-center gap-2">
                        {profile.cgpa >= selectedJobPreview.minCgpa ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={profile.cgpa >= selectedJobPreview.minCgpa ? 'text-green-400' : 'text-red-400'}>
                          CGPA: {profile.cgpa} {profile.cgpa >= selectedJobPreview.minCgpa ? '(Eligible)' : `(Required: ${selectedJobPreview.minCgpa})`}
                        </span>
                      </div>
                    )}
                    {profile.resumeUrl ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Resume uploaded</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">Resume required</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-dark-card border-t border-dark-border p-6 flex justify-end gap-3">
              <button onClick={() => setSelectedJobPreview(null)}
                className="px-6 py-2.5 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">
                Close
              </button>
              <button 
                onClick={() => {
                  applyToJob(selectedJobPreview.id);
                  setSelectedJobPreview(null);
                }} 
                disabled={selectedJobPreview.applied}
                className="px-6 py-2.5 text-sm font-medium rounded-lg bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {selectedJobPreview.applied ? '✓ Already Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
