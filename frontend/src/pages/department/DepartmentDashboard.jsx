import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { departmentAPI } from '../../services/api';
import { aiService } from '../../services/aiService';
import { Upload, Search, Filter, Eye, Edit, CheckCircle, AlertCircle, TrendingUp, Send, Brain, FolderOpen, Trash2, Plus, Clock, Award, Calendar, MapPin } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

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

const inputCls = 'w-full px-4 py-2.5 bg-dark-hover border border-dark-border text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500';

const DepartmentDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [noteStudent, setNoteStudent] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [placementDrives, setPlacementDrives] = useState([]);
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [studentGroups, setStudentGroups] = useState([]);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [driveForm, setDriveForm] = useState({ title: '', description: '', driveDate: '', venue: '' });
  const [programForm, setProgramForm] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [groupForm, setGroupForm] = useState({ name: '', description: '' });
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: '', description: '', duration: 30, totalMarks: 100 });
  const [quizQuestions, setQuizQuestions] = useState([{ question: '', option1: '', option2: '', option3: '', option4: '', correctOption: 1, marks: 10 }]);
  const [selectedQuizAttempts, setSelectedQuizAttempts] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [reviewComments, setReviewComments] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadStudents();
    loadProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') loadStudents();
    if (activeTab === 'analytics') loadAnalytics();
    if (activeTab === 'placement-drive') loadPlacementDrives();
    if (activeTab === 'training-programs') loadTrainingPrograms();
    if (activeTab === 'quizzes') loadQuizzes();
    if (activeTab === 'achievements') loadAchievements();
    if (activeTab === 'profile') loadProfile();
  }, [activeTab]);

  const loadStudents = async () => {
    setLoading(true);
    try { const res = await departmentAPI.getStudents(); setStudents(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadProfile = async () => {
    try { const res = await departmentAPI.getProfile(); setProfile(res.data); }
    catch (e) { console.error(e); }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try { const res = await departmentAPI.getAnalytics(); setAnalytics(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const addNote = async (studentId) => {
    if (!noteText.trim()) return;
    try {
      await departmentAPI.addStudentNote(studentId, noteText);
      setNoteText(''); setSelectedStudent(null); loadStudents();
    } catch (e) { alert('Failed to add note'); }
  };

  const uploadExcel = async (file) => {
    try { await departmentAPI.uploadExcel(file); alert('Excel uploaded and students updated!'); loadStudents(); }
    catch (e) { alert('Failed to upload Excel file'); }
  };

  const recommendStudent = async (studentId, name) => {
    if (!window.confirm(`Recommend ${name} for placement?`)) return;
    try { await departmentAPI.recommendStudent(studentId); alert(`${name} has been recommended!`); }
    catch (e) { alert('Failed to recommend student'); }
  };

  const sendAnnouncement = async () => {
    if (!announcementMsg.trim()) { alert('Please enter a message'); return; }
    try {
      await departmentAPI.sendAnnouncement(announcementMsg);
      setAnnouncementMsg('');
      alert('Announcement sent to department students!');
    } catch (e) { alert(e.response?.data?.message || 'Failed to send announcement'); }
  };

  const loadPlacementDrives = async () => {
    setLoading(true);
    try { const res = await departmentAPI.getPlacementDrives(); setPlacementDrives(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const createPlacementDrive = async () => {
    if (!driveForm.title || !driveForm.driveDate || !driveForm.venue) { alert('Please fill all fields'); return; }
    try {
      await departmentAPI.createPlacementDrive(driveForm);
      setShowDriveModal(false);
      setDriveForm({ title: '', description: '', driveDate: '', venue: '' });
      loadPlacementDrives();
    } catch (e) { alert('Failed to create drive'); }
  };

  const deletePlacementDrive = async (id) => {
    if (!window.confirm('Delete this placement drive?')) return;
    try { await departmentAPI.deletePlacementDrive(id); loadPlacementDrives(); }
    catch (e) { alert('Failed to delete'); }
  };

  const loadTrainingPrograms = async () => {
    setLoading(true);
    try { const res = await departmentAPI.getTrainingPrograms(); setTrainingPrograms(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const createTrainingProgram = async () => {
    if (!programForm.title || !programForm.startDate || !programForm.endDate) { alert('Please fill all fields'); return; }
    try {
      await departmentAPI.createTrainingProgram(programForm);
      setShowProgramModal(false);
      setProgramForm({ title: '', description: '', startDate: '', endDate: '' });
      loadTrainingPrograms();
    } catch (e) { alert('Failed to create program'); }
  };

  const deleteTrainingProgram = async (id) => {
    if (!window.confirm('Delete this training program?')) return;
    try { await departmentAPI.deleteTrainingProgram(id); loadTrainingPrograms(); }
    catch (e) { alert('Failed to delete'); }
  };

  const loadStudentGroups = async () => {
    setLoading(true);
    try { const res = await departmentAPI.getStudentGroups(); setStudentGroups(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const createStudentGroup = async () => {
    if (!groupForm.name) { alert('Please enter group name'); return; }
    try {
      await departmentAPI.createStudentGroup(groupForm);
      setShowGroupModal(false);
      setGroupForm({ name: '', description: '' });
      loadStudentGroups();
    } catch (e) { alert('Failed to create group'); }
  };

  const deleteStudentGroup = async (id) => {
    if (!window.confirm('Delete this student group?')) return;
    try { await departmentAPI.deleteStudentGroup(id); loadStudentGroups(); }
    catch (e) { alert('Failed to delete'); }
  };

  const loadQuizzes = async () => {
    setLoading(true);
    try { const res = await departmentAPI.getQuizzes(); setQuizzes(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const createQuiz = async () => {
    if (!quizForm.title || quizQuestions.some(q => !q.question || !q.option1 || !q.option2)) {
      alert('Please fill all required fields'); return;
    }
    try {
      await departmentAPI.createQuiz({ ...quizForm, questions: quizQuestions });
      setShowQuizModal(false);
      setQuizForm({ title: '', description: '', duration: 30, totalMarks: 100 });
      setQuizQuestions([{ question: '', option1: '', option2: '', option3: '', option4: '', correctOption: 1, marks: 10 }]);
      loadQuizzes();
    } catch (e) { alert('Failed to create quiz'); }
  };

  const deleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try { await departmentAPI.deleteQuiz(id); loadQuizzes(); }
    catch (e) { alert('Failed to delete'); }
  };

  const viewQuizAttempts = async (quizId) => {
    try { const res = await departmentAPI.getQuizAttempts(quizId); setSelectedQuizAttempts(res.data); }
    catch (e) { alert('Failed to load attempts'); }
  };

  const addQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: '', option1: '', option2: '', option3: '', option4: '', correctOption: 1, marks: 10 }]);
  };

  const removeQuestion = (idx) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx, field, value) => {
    const updated = [...quizQuestions];
    updated[idx][field] = value;
    setQuizQuestions(updated);
  };

  const loadAchievements = async () => {
    setLoading(true);
    try { const res = await departmentAPI.getDepartmentAchievements(); setAchievements(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const approveAchievement = async (id) => {
    try {
      await departmentAPI.approveAchievement(id, reviewComments);
      setSelectedAchievement(null);
      setReviewComments('');
      loadAchievements();
      alert('Achievement approved!');
    } catch (e) { alert('Failed to approve'); }
  };

  const rejectAchievement = async (id) => {
    if (!reviewComments.trim()) { alert('Please provide a reason for rejection'); return; }
    try {
      await departmentAPI.rejectAchievement(id, reviewComments);
      setSelectedAchievement(null);
      setReviewComments('');
      loadAchievements();
      alert('Achievement rejected');
    } catch (e) { alert('Failed to reject'); }
  };

  const cgpaColor = (cgpa) => cgpa >= 8 ? 'text-green-400' : cgpa >= 7 ? 'text-yellow-400' : 'text-red-400';

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Department Students</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search students..."
              className="pl-9 pr-4 py-2 text-sm bg-dark-card border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-dark-border text-slate-400 rounded-lg hover:bg-dark-hover transition-colors">
            <Filter className="w-4 h-4" />Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={students.length} color="text-blue-400" />
        <StatCard label="Placed" value={students.filter(s => s.placementStatus === 'PLACED').length} color="text-green-400" />
        <StatCard label="Eligible (CGPA ≥7)" value={students.filter(s => s.cgpa >= 7).length} color="text-primary-400" />
        <StatCard label="Avg CGPA" value={students.length ? (students.reduce((s, st) => s + st.cgpa, 0) / students.length).toFixed(2) : '0.00'} color="text-purple-400" />
      </div>

      {loading ? <Spinner /> : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  {['Student', 'CGPA', 'Skills', 'Status', 'Internal Score', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-dark-hover transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-white">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-semibold ${cgpaColor(s.cgpa)}`}>{s.cgpa}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(s.skills && Array.isArray(s.skills) ? s.skills : (s.skills || '').toString().split(',')).filter(Boolean).slice(0, 3).map((sk, i) => (
                          <span key={i} className="px-2 py-0.5 bg-dark-bg border border-dark-border text-slate-400 text-xs rounded-full">{typeof sk === 'string' ? sk.trim() : sk}</span>
                        ))}
                        {(s.skills && Array.isArray(s.skills) ? s.skills : (s.skills || '').toString().split(',')).filter(Boolean).length > 3 && (
                          <span className="text-xs text-slate-500">+{(s.skills && Array.isArray(s.skills) ? s.skills : (s.skills || '').toString().split(',')).filter(Boolean).length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                        s.placementStatus === 'PLACED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        s.cgpa >= 7 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {s.placementStatus || (s.cgpa >= 7 ? 'Eligible' : 'Ineligible')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <input type="number" min="0" max="100" defaultValue={s.internalScore || 0}
                        onBlur={async e => {
                          const score = parseFloat(e.target.value);
                          if (!isNaN(score)) {
                            try { await departmentAPI.updateStudentMarks(s.id, score, null); }
                            catch (err) { console.error('Failed to update score', err); }
                          }
                        }}
                        className="w-16 px-2 py-1 bg-dark-hover border border-dark-border text-white text-sm rounded text-center focus:outline-none focus:ring-1 focus:ring-primary-500" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setNoteStudent(s); }} className="text-primary-400 hover:text-primary-300 transition-colors" title="Add Note"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedStudent(s); setShowStudentModal(true); }} className="text-green-400 hover:text-green-300 transition-colors" title="View Profile"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => recommendStudent(s.id, s.name)} className="text-purple-400 hover:text-purple-300 transition-colors" title="Recommend for placement"><CheckCircle className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && <p className="text-slate-500 text-center py-12 text-sm">No students found</p>}
          </div>
        </Card>
      )}

      {noteStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setNoteStudent(null)}>
          <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-white mb-1">Add Internal Note</h3>
            <p className="text-slate-400 text-sm mb-4">Student: {noteStudent.name}</p>
            <textarea rows="4" value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Enter internal note (not visible to student)..."
              className={inputCls + ' mb-4'} />
            <div className="flex justify-end gap-3">
              <button onClick={() => setNoteStudent(null)} className="px-4 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">Cancel</button>
              <button onClick={() => addNote(noteStudent.id)} className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Add Note</button>
            </div>
          </div>
        </div>
      )}

      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowStudentModal(false)}>
          <div className="bg-dark-card border border-dark-border rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Student Profile</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Name</p>
                  <p className="text-white font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Email</p>
                  <p className="text-white font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Department</p>
                  <p className="text-white font-medium">{selectedStudent.department || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Roll Number</p>
                  <p className="text-white font-medium">{selectedStudent.rollNumber || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">CGPA</p>
                  <p className={`font-medium ${cgpaColor(selectedStudent.cgpa)}`}>{selectedStudent.cgpa || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Year</p>
                  <p className="text-white font-medium">{selectedStudent.year || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Phone</p>
                  <p className="text-white font-medium">{selectedStudent.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Placement Status</p>
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                    selectedStudent.placementStatus === 'PLACED'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                  }`}>
                    {selectedStudent.placementStatus || 'Not Placed'}
                  </span>
                </div>
              </div>
              {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedStudent.skills) ? selectedStudent.skills : selectedStudent.skills.split(',')).map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm rounded-full">{typeof skill === 'string' ? skill.trim() : skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedStudent.resumeUrl && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Resume</p>
                  <div className="bg-dark-hover border border-dark-border rounded-lg p-4">
                    <a href={`http://localhost:8080${selectedStudent.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors">
                      <FolderOpen className="w-5 h-5" />
                      <span className="text-sm font-medium">View Resume (PDF)</span>
                    </a>
                  </div>
                </div>
              )}
              {selectedStudent.internalNotes && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Internal Notes</p>
                  <div className="bg-dark-hover border border-dark-border rounded-lg p-4">
                    <p className="text-slate-300 text-sm">{selectedStudent.internalNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Upload Excel Data</h2>
      <Card>
        <h3 className="text-base font-semibold text-white mb-2">Upload Student Data</h3>
        <p className="text-slate-400 text-sm mb-6">Upload Excel files containing student information. The system will automatically parse and merge the data.</p>
        <div className="border-2 border-dashed border-dark-border rounded-xl p-10 text-center hover:border-primary-500/50 transition-colors">
          <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 font-medium mb-1">Drop Excel files here</p>
          <p className="text-slate-500 text-sm mb-4">or click to browse</p>
          <input type="file" accept=".xlsx,.xls" onChange={e => e.target.files[0] && uploadExcel(e.target.files[0])} className="hidden" id="excel-upload" />
          <label htmlFor="excel-upload" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />Choose File
          </label>
        </div>
        <div className="mt-6 p-4 bg-dark-hover rounded-lg border border-dark-border">
          <h4 className="text-sm font-medium text-white mb-2">Excel Format:</h4>
          <ul className="text-xs text-slate-400 space-y-1">
            {['A: Student Name', 'B: Email', 'C: CGPA', 'D: Skills (comma-separated)', 'E: Phone Number', 'F: Internal Marks (optional)'].map(f => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );

  const renderAnalytics = () => {
    const cgpaDistribution = [
      { range: '9.0-10.0', count: students.filter(s => s.cgpa >= 9).length },
      { range: '8.0-8.9', count: students.filter(s => s.cgpa >= 8 && s.cgpa < 9).length },
      { range: '7.0-7.9', count: students.filter(s => s.cgpa >= 7 && s.cgpa < 8).length },
      { range: '6.0-6.9', count: students.filter(s => s.cgpa >= 6 && s.cgpa < 7).length },
      { range: '<6.0', count: students.filter(s => s.cgpa < 6).length }
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Department Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-slate-400 mb-3">Placement Percentage</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-dark-hover rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${analytics.placementPercentage || 0}%` }} />
              </div>
              <span className="text-xl font-bold text-green-400">{analytics.placementPercentage || 0}%</span>
            </div>
          </Card>
          <StatCard label="Eligible Students" value={`${students.filter(s => s.cgpa >= 7).length}/${students.length}`} color="text-primary-400" />
          <StatCard label="Avg Package" value={`₹${analytics.avgPackage || 0} LPA`} color="text-green-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CGPA Distribution Bar Chart */}
          <Card>
            <h3 className="text-base font-semibold text-white mb-4">CGPA Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cgpaDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#94a3b8" style={{ fontSize: '11px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Current Statistics */}
          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Current Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-300 text-sm">Total Students</span>
                <span className="text-2xl font-bold text-blue-400">{students.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-300 text-sm">Placed Students</span>
                <span className="text-2xl font-bold text-green-400">{students.filter(s => s.placementStatus === 'PLACED').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-300 text-sm">Eligible (CGPA ≥7)</span>
                <span className="text-2xl font-bold text-primary-400">{students.filter(s => s.cgpa >= 7).length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-300 text-sm">Average CGPA</span>
                <span className="text-2xl font-bold text-purple-400">{students.length ? (students.reduce((s, st) => s + st.cgpa, 0) / students.length).toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-base font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-dark-hover rounded-lg">
              <p className="text-2xl font-bold text-green-400">{students.filter(s => s.cgpa >= 8.5).length}</p>
              <p className="text-xs text-slate-400 mt-1">Top Performers (8.5+)</p>
            </div>
            <div className="text-center p-4 bg-dark-hover rounded-lg">
              <p className="text-2xl font-bold text-blue-400">{students.filter(s => s.cgpa >= 7.5 && s.cgpa < 8.5).length}</p>
              <p className="text-xs text-slate-400 mt-1">Good (7.5-8.4)</p>
            </div>
            <div className="text-center p-4 bg-dark-hover rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">{students.filter(s => s.cgpa >= 7 && s.cgpa < 7.5).length}</p>
              <p className="text-xs text-slate-400 mt-1">Average (7.0-7.4)</p>
            </div>
            <div className="text-center p-4 bg-dark-hover rounded-lg">
              <p className="text-2xl font-bold text-red-400">{students.filter(s => s.cgpa < 7).length}</p>
              <p className="text-xs text-slate-400 mt-1">At Risk (&lt;7.0)</p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderAnnouncements = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Department Announcements</h2>
      <Card>
        <h3 className="text-base font-semibold text-white mb-4">Send Announcement</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Message (sent to department students)</label>
            <textarea rows="5" placeholder="Enter announcement message for department students" value={announcementMsg}
              onChange={e => setAnnouncementMsg(e.target.value)}
              className={inputCls} />
          </div>
          <button onClick={sendAnnouncement}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
            <Send className="w-4 h-4" />Send Announcement
          </button>
        </div>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'students': return renderStudents();
      case 'analytics': return renderAnalytics();
      case 'announcements': return renderAnnouncements();
      case 'dashboard': return renderStudents();
      case 'placement-drive': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Placement Drives</h2>
            <button onClick={() => setShowDriveModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />Schedule New Drive
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Drives" value={placementDrives.length} color="text-blue-400" />
            <StatCard label="Upcoming" value={placementDrives.filter(d => d.status === 'SCHEDULED').length} color="text-yellow-400" />
            <StatCard label="Ongoing" value={placementDrives.filter(d => d.status === 'ONGOING').length} color="text-green-400" />
            <StatCard label="Completed" value={placementDrives.filter(d => d.status === 'COMPLETED').length} color="text-slate-400" />
          </div>
          {loading ? <Spinner /> : (
            <div className="space-y-3">
              {placementDrives.map(drive => (
                <Card key={drive.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white text-lg">{drive.title}</h3>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          drive.status === 'SCHEDULED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          drive.status === 'ONGOING' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          drive.status === 'COMPLETED' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>{drive.status}</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{drive.description}</p>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary-400" />
                          <span className="text-slate-300">Date:</span>
                          <span className="text-white font-medium">{new Date(drive.driveDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary-400" />
                          <span className="text-slate-300">Venue:</span>
                          <span className="text-white font-medium">{drive.venue}</span>
                        </div>
                      </div>
                      <div className="flex gap-4 p-3 bg-dark-hover rounded-lg border border-dark-border">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-400">{students.length}</p>
                          <p className="text-xs text-slate-400">Total Students</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-400">{students.filter(s => s.cgpa >= 7).length}</p>
                          <p className="text-xs text-slate-400">Eligible</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary-400">{students.filter(s => s.placementStatus === 'PLACED').length}</p>
                          <p className="text-xs text-slate-400">Already Placed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-400">{students.filter(s => s.cgpa >= 7 && s.placementStatus !== 'PLACED').length}</p>
                          <p className="text-xs text-slate-400">Can Attend</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deletePlacementDrive(drive.id)} className="text-red-400 hover:text-red-300 transition-colors ml-4">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              ))}
              {placementDrives.length === 0 && <Card><p className="text-slate-400 text-center py-12">No placement drives scheduled. Click "Schedule New Drive" to create one.</p></Card>}
            </div>
          )}
          {showDriveModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowDriveModal(false)}>
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Schedule Placement Drive</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Drive Title *</label>
                    <input type="text" placeholder="e.g., TCS Campus Drive 2024" value={driveForm.title} onChange={e => setDriveForm({...driveForm, title: e.target.value})} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
                    <textarea rows="3" placeholder="Drive details, requirements, instructions..." value={driveForm.description} onChange={e => setDriveForm({...driveForm, description: e.target.value})} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Drive Date *</label>
                      <input type="date" value={driveForm.driveDate} onChange={e => setDriveForm({...driveForm, driveDate: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Venue *</label>
                      <input type="text" placeholder="e.g., Seminar Hall" value={driveForm.venue} onChange={e => setDriveForm({...driveForm, venue: e.target.value})} className={inputCls} />
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400 text-sm font-medium mb-1">📊 Eligible Students</p>
                    <p className="text-slate-300 text-sm">{students.filter(s => s.cgpa >= 7 && s.placementStatus !== 'PLACED').length} students can attend this drive (CGPA ≥7 and not placed)</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowDriveModal(false)} className="px-4 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">Cancel</button>
                  <button onClick={createPlacementDrive} className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Schedule Drive</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case 'training-programs': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Training Programs</h2>
            <button onClick={() => setShowProgramModal(true)} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Create Program</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Active Programs" value={trainingPrograms.filter(p => p.status === 'ACTIVE').length} color="text-green-400" />
            <StatCard label="Total Programs" value={trainingPrograms.length} color="text-blue-400" />
            <StatCard label="Students" value={students.length} color="text-primary-400" />
          </div>
          {loading ? <Spinner /> : (
            <div className="space-y-3">
              {trainingPrograms.map(program => (
                <Card key={program.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{program.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{program.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>Start: {new Date(program.startDate).toLocaleDateString()}</span>
                        <span>End: {new Date(program.endDate).toLocaleDateString()}</span>
                        <span>Enrolled: {program.enrolledCount || 0}</span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          program.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                          program.status === 'COMPLETED' ? 'bg-slate-500/20 text-slate-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>{program.status}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteTrainingProgram(program.id)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                  </div>
                </Card>
              ))}
              {trainingPrograms.length === 0 && <Card><p className="text-slate-400 text-center py-8">No training programs created</p></Card>}
            </div>
          )}
          {showProgramModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowProgramModal(false)}>
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Create Training Program</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Program Title" value={programForm.title} onChange={e => setProgramForm({...programForm, title: e.target.value})} className={inputCls} />
                  <textarea rows="3" placeholder="Description" value={programForm.description} onChange={e => setProgramForm({...programForm, description: e.target.value})} className={inputCls} />
                  <input type="date" placeholder="Start Date" value={programForm.startDate} onChange={e => setProgramForm({...programForm, startDate: e.target.value})} className={inputCls} />
                  <input type="date" placeholder="End Date" value={programForm.endDate} onChange={e => setProgramForm({...programForm, endDate: e.target.value})} className={inputCls} />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setShowProgramModal(false)} className="px-4 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">Cancel</button>
                  <button onClick={createTrainingProgram} className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Create Program</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
      case 'performance-tracking': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Performance Tracking</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Avg CGPA" value={(students.reduce((s, st) => s + st.cgpa, 0) / students.length).toFixed(2)} color="text-green-400" />
            <StatCard label="Top Performers" value={students.filter(s => s.cgpa >= 8.5).length} color="text-primary-400" />
            <StatCard label="At Risk" value={students.filter(s => s.cgpa < 7).length} color="text-red-400" />
            <StatCard label="Placement Rate" value={`${Math.round((students.filter(s => s.placementStatus === 'PLACED').length / students.length) * 100)}%`} color="text-blue-400" />
          </div>
          <Card>
            <h3 className="font-semibold text-white mb-4">Student Performance Distribution</h3>
            <div className="space-y-3">
              {[
                { label: 'Excellent (8.5+)', count: students.filter(s => s.cgpa >= 8.5).length, color: 'bg-green-500' },
                { label: 'Good (7.5-8.4)', count: students.filter(s => s.cgpa >= 7.5 && s.cgpa < 8.5).length, color: 'bg-blue-500' },
                { label: 'Average (7.0-7.4)', count: students.filter(s => s.cgpa >= 7.0 && s.cgpa < 7.5).length, color: 'bg-yellow-500' },
                { label: 'Below Average (<7.0)', count: students.filter(s => s.cgpa < 7.0).length, color: 'bg-red-500' }
              ].map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-slate-300 text-sm w-40">{cat.label}</span>
                  <div className="flex-1 bg-dark-hover rounded-full h-2">
                    <div className={`${cat.color} h-2 rounded-full`} style={{width: `${(cat.count / students.length) * 100}%`}} />
                  </div>
                  <span className="text-slate-400 text-sm w-12 text-right">{cat.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
      case 'reports': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Department Reports</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Students" value={students.length} color="text-blue-400" />
            <StatCard label="Placed" value={students.filter(s => s.placementStatus === 'PLACED').length} color="text-green-400" />
            <StatCard label="Avg CGPA" value={students.length ? (students.reduce((s, st) => s + st.cgpa, 0) / students.length).toFixed(2) : '0.00'} color="text-primary-400" />
          </div>
          <Card>
            <h3 className="font-semibold text-white mb-4">Department Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-300">Eligible Students (CGPA ≥7)</span>
                <span className="text-primary-400 font-medium">{students.filter(s => s.cgpa >= 7).length}</span>
              </div>
              <div className="flex justify-between p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-300">High Performers (CGPA ≥8)</span>
                <span className="text-green-400 font-medium">{students.filter(s => s.cgpa >= 8).length}</span>
              </div>
              <div className="flex justify-between p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-300">At Risk (CGPA &lt;7)</span>
                <span className="text-red-400 font-medium">{students.filter(s => s.cgpa < 7).length}</span>
              </div>
              <div className="flex justify-between p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-300">Placement Rate</span>
                <span className="text-primary-400 font-medium">{students.length ? Math.round((students.filter(s => s.placementStatus === 'PLACED').length / students.length) * 100) : 0}%</span>
              </div>
            </div>
          </Card>
        </div>
      );
      case 'quizzes': return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Department Quizzes</h2>
            <button onClick={() => setShowQuizModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />Create Quiz
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Quizzes" value={quizzes.length} color="text-blue-400" />
            <StatCard label="Active Quizzes" value={quizzes.filter(q => q.status === 'ACTIVE').length} color="text-green-400" />
            <StatCard label="Total Attempts" value={quizzes.reduce((sum, q) => sum + (q.attemptCount || 0), 0)} color="text-primary-400" />
          </div>
          {loading ? <Spinner /> : (
            <div className="space-y-3">
              {quizzes.map(quiz => (
                <Card key={quiz.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">{quiz.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          quiz.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                          quiz.status === 'DRAFT' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>{quiz.status}</span>
                      </div>
                      <p className="text-slate-400 text-sm mt-1">{quiz.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{quiz.duration} mins</span>
                        <span className="flex items-center gap-1"><Award className="w-3 h-3" />{quiz.totalMarks} marks</span>
                        <span>Questions: {quiz.questionCount || 0}</span>
                        <span>Attempts: {quiz.attemptCount || 0}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => viewQuizAttempts(quiz.id)} className="text-blue-400 hover:text-blue-300 transition-colors text-sm">View Attempts</button>
                      <button onClick={() => deleteQuiz(quiz.id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </Card>
              ))}
              {quizzes.length === 0 && <Card><p className="text-slate-400 text-center py-8">No quizzes created</p></Card>}
            </div>
          )}
          {showQuizModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowQuizModal(false)}>
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Create Quiz</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Quiz Title" value={quizForm.title} onChange={e => setQuizForm({...quizForm, title: e.target.value})} className={inputCls} />
                    <input type="number" placeholder="Duration (mins)" value={quizForm.duration} onChange={e => setQuizForm({...quizForm, duration: parseInt(e.target.value)})} className={inputCls} />
                  </div>
                  <textarea rows="2" placeholder="Description" value={quizForm.description} onChange={e => setQuizForm({...quizForm, description: e.target.value})} className={inputCls} />
                  <div className="border-t border-dark-border pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-medium">Questions</h4>
                      <button onClick={addQuestion} className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
                        <Plus className="w-4 h-4" />Add Question
                      </button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-auto">
                      {quizQuestions.map((q, idx) => (
                        <div key={idx} className="p-4 bg-dark-hover border border-dark-border rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">Question {idx + 1}</span>
                            {quizQuestions.length > 1 && (
                              <button onClick={() => removeQuestion(idx)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                            )}
                          </div>
                          <input type="text" placeholder="Question" value={q.question} onChange={e => updateQuestion(idx, 'question', e.target.value)} className={inputCls} />
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Option 1" value={q.option1} onChange={e => updateQuestion(idx, 'option1', e.target.value)} className={inputCls} />
                            <input type="text" placeholder="Option 2" value={q.option2} onChange={e => updateQuestion(idx, 'option2', e.target.value)} className={inputCls} />
                            <input type="text" placeholder="Option 3" value={q.option3} onChange={e => updateQuestion(idx, 'option3', e.target.value)} className={inputCls} />
                            <input type="text" placeholder="Option 4" value={q.option4} onChange={e => updateQuestion(idx, 'option4', e.target.value)} className={inputCls} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <select value={q.correctOption} onChange={e => updateQuestion(idx, 'correctOption', parseInt(e.target.value))} className={inputCls}>
                              <option value={1}>Correct: Option 1</option>
                              <option value={2}>Correct: Option 2</option>
                              <option value={3}>Correct: Option 3</option>
                              <option value={4}>Correct: Option 4</option>
                            </select>
                            <input type="number" placeholder="Marks" value={q.marks} onChange={e => updateQuestion(idx, 'marks', parseInt(e.target.value))} className={inputCls} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setShowQuizModal(false)} className="px-4 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">Cancel</button>
                  <button onClick={createQuiz} className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Create Quiz</button>
                </div>
              </div>
            </div>
          )}
          {selectedQuizAttempts && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedQuizAttempts(null)}>
              <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Quiz Attempts ({selectedQuizAttempts.length})</h3>
                  <button onClick={() => setSelectedQuizAttempts(null)} className="text-slate-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {selectedQuizAttempts.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No attempts yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedQuizAttempts.map((attempt, idx) => (
                      <div key={idx} className="p-4 bg-dark-hover border border-dark-border rounded-lg flex justify-between items-center hover:border-primary-500/50 transition-colors">
                        <div className="flex-1">
                          <p className="text-white font-medium">{attempt.studentName || 'Unknown Student'}</p>
                          <p className="text-slate-400 text-sm">{attempt.studentEmail || 'No email'}</p>
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
      case 'achievements': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Student Achievements</h2>
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Achievements" value={achievements.length} color="text-primary-400" />
            <StatCard label="Total Students" value={students.length} color="text-blue-400" />
            <StatCard label="This Month" value={achievements.filter(a => {
              const date = new Date(a.submittedAt);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length} color="text-green-400" />
          </div>
          {loading ? <Spinner /> : (
            <div className="space-y-3">
              {achievements.map(ach => (
                <Card key={ach.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-primary-400" />
                        <h3 className="font-semibold text-white">{ach.title}</h3>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{ach.description}</p>
                      <div className="flex gap-4 text-xs text-slate-500 mb-2">
                        <span className="px-2 py-1 bg-dark-hover rounded">📁 {ach.category}</span>
                        {ach.organizationName && <span>🏢 {ach.organizationName}</span>}
                        {ach.eventDate && <span>📅 {new Date(ach.eventDate).toLocaleDateString()}</span>}
                        {ach.position && <span>🏆 {ach.position}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>👤 {ach.student?.user?.name || 'Student'}</span>
                        <span>•</span>
                        <span>📫 {ach.student?.user?.email || ''}</span>
                        <span>•</span>
                        <span>📅 Submitted {new Date(ach.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {achievements.length === 0 && <Card><p className="text-slate-400 text-center py-12">No achievements submitted yet</p></Card>}
            </div>
          )}
        </div>
      );
      case 'profile': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Department Profile</h2>
          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Department Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Department Name</label>
                <input type="text" value={profile?.name || ''} readOnly className={inputCls + ' bg-dark-bg text-slate-400 cursor-default'} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Department Code</label>
                <input type="text" value={profile?.code || ''} readOnly className={inputCls + ' bg-dark-bg text-slate-400 cursor-default'} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Total Students</label>
                <input type="text" value={students.length} readOnly className={inputCls + ' bg-dark-bg text-slate-400 cursor-default'} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Placed Students</label>
                <input type="text" value={students.filter(s => s.placementStatus === 'PLACED').length} readOnly className={inputCls + ' bg-dark-bg text-slate-400 cursor-default'} />
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Department Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-dark-hover rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Avg CGPA</p>
                <p className="text-2xl font-bold text-green-400">{students.length ? (students.reduce((s, st) => s + st.cgpa, 0) / students.length).toFixed(2) : '0.00'}</p>
              </div>
              <div className="p-4 bg-dark-hover rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Eligible (CGPA ≥7)</p>
                <p className="text-2xl font-bold text-blue-400">{students.filter(s => s.cgpa >= 7).length}</p>
              </div>
              <div className="p-4 bg-dark-hover rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Placement Rate</p>
                <p className="text-2xl font-bold text-primary-400">{students.length ? Math.round((students.filter(s => s.placementStatus === 'PLACED').length / students.length) * 100) : 0}%</p>
              </div>
              <div className="p-4 bg-dark-hover rounded-lg">
                <p className="text-slate-400 text-xs mb-1">Top Performers (8+)</p>
                <p className="text-2xl font-bold text-purple-400">{students.filter(s => s.cgpa >= 8).length}</p>
              </div>
            </div>
          </Card>
        </div>
      );
      default: return renderStudents();
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="DEPARTMENT" />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;

