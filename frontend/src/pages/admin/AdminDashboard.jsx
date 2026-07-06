import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { adminAPI } from '../../services/api';
import { aiService } from '../../services/aiService';
import { Users, Building2, Briefcase, CheckCircle, XCircle, AlertTriangle, Search, Filter, Eye, Trash2, Bell, Brain, FolderOpen, Calendar } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Card = ({ children, className = '' }) => (
  <div className={`bg-dark-card border border-dark-border rounded-xl p-6 ${className}`}>{children}</div>
);

const StatCard = ({ label, value, color = 'text-primary-400', icon: Icon }) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      {Icon && <Icon className={`w-10 h-10 opacity-15 ${color}`} />}
    </div>
  </Card>
);

const Spinner = () => (
  <div className="flex justify-center py-12">
    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
  </div>
);

const inputCls = 'w-full px-4 py-2.5 bg-dark-hover border border-dark-border text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [deptStats, setDeptStats] = useState([]);
  const [riskStudents, setRiskStudents] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchStudents, setSearchStudents] = useState('');
  const [searchCompanies, setSearchCompanies] = useState('');
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementTarget, setAnnouncementTarget] = useState('ALL_STUDENTS');
  const [announcementDept, setAnnouncementDept] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailTarget, setEmailTarget] = useState('ALL_STUDENTS');
  const [emailDept, setEmailDept] = useState('');
  const [emailMinCgpa, setEmailMinCgpa] = useState('');
  const [emailMaxCgpa, setEmailMaxCgpa] = useState('');
  const [emailCampaigns, setEmailCampaigns] = useState([]);
  const [aiStrategy, setAiStrategy] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [calendarView, setCalendarView] = useState('list');
  const [calendarFilters, setCalendarFilters] = useState({ company: '', location: '', dateFrom: '', dateTo: '', onlyWithApplicants: false });
  const [jobApplicants, setJobApplicants] = useState({});
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [placementYear, setPlacementYear] = useState('2024-25');
  const [minCgpa, setMinCgpa] = useState('7.0');

  useEffect(() => { loadStats(); loadPendingCompanies(); loadStudents(); loadPlacements(); 
    // Load saved settings from localStorage
    const savedYear = localStorage.getItem('placementYear');
    const savedCgpa = localStorage.getItem('minCgpa');
    if (savedYear) setPlacementYear(savedYear);
    if (savedCgpa) setMinCgpa(savedCgpa);
  }, []);

  useEffect(() => {
    if (activeTab === 'students') loadStudents();
    if (activeTab === 'companies') loadCompanies();
    if (activeTab === 'pending') loadPendingCompanies();
    if (activeTab === 'analytics') loadAnalytics();
    if (activeTab === 'jobs') loadAllJobs();
    if (activeTab === 'placements') loadPlacements();
    if (activeTab === 'placement-calendar') loadAllJobs();
    if (activeTab === 'announcements') loadAnnouncements();
    if (activeTab === 'email-campaigns') loadEmailCampaigns();
    if (activeTab === 'bulk-operations') { loadStudents(); loadCompanies(); }
    if (activeTab === 'reports') { loadStudents(); loadCompanies(); loadAllJobs(); loadPlacements(); }
    if (activeTab === 'system-settings') { loadStudents(); } // Load students for eligibility count
  }, [activeTab]);

  const loadStats = async () => {
    try { const res = await adminAPI.getStats(); setStats(res.data); } catch (e) { console.error(e); }
  };
  const loadStudents = async () => {
    setLoading(true);
    try { const res = await adminAPI.getStudents(); setStudents(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const loadCompanies = async () => {
    setLoading(true);
    try { const res = await adminAPI.getCompanies(); setCompanies(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const loadPendingCompanies = async () => {
    try { const res = await adminAPI.getPendingCompanies(); setPendingCompanies(res.data); } catch (e) { console.error(e); }
  };
  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [deptRes, riskRes] = await Promise.all([
        adminAPI.getDepartmentStats(),
        adminAPI.getRiskStudents(),
      ]);
      setDeptStats(deptRes.data);
      setRiskStudents(riskRes.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const approveCompany = async (id) => {
    try { await adminAPI.approveCompany(id); loadPendingCompanies(); loadCompanies(); loadStats(); } catch (e) { alert('Failed to approve'); }
  };
  const rejectCompany = async (id) => {
    try { await adminAPI.rejectCompany(id); loadPendingCompanies(); loadCompanies(); } catch (e) { alert('Failed to reject'); }
  };
  const deleteCompany = async (id) => {
    if (!window.confirm('Delete this company? All their jobs will be removed and students will no longer see them.')) return;
    try { await adminAPI.deleteCompany(id); loadCompanies(); loadStats(); } catch (e) { alert('Failed to delete company'); }
  };
  const deleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try { await adminAPI.deleteStudent(id); loadStudents(); loadStats(); } catch (e) { alert('Failed to delete student'); }
  };
  const loadAllJobs = async () => {
    setLoading(true);
    try { 
      const res = await adminAPI.getAllJobs(); 
      setAllJobs(res.data);
      const applicantsMap = {};
      for (const job of res.data) {
        if (job.interviewDate) {
          try {
            const appRes = await adminAPI.getAllApplications();
            const jobApps = appRes.data.filter(app => app.jobId === job.id);
            applicantsMap[job.id] = jobApps;
          } catch (e) { applicantsMap[job.id] = []; }
        }
      }
      setJobApplicants(applicantsMap);
    }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const loadPlacements = async () => {
    setLoading(true);
    try { const res = await adminAPI.getPlacements(); setPlacements(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const loadAnnouncements = async () => {
    setLoading(true);
    try { const res = await adminAPI.getAnnouncements(); setAnnouncements(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const loadEmailCampaigns = async () => {
    setLoading(true);
    try { const res = await adminAPI.getEmailCampaigns(); setEmailCampaigns(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const sendAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementMsg.trim()) { alert('Please enter title and message'); return; }
    try {
      await adminAPI.createAnnouncement({ title: announcementTitle, message: announcementMsg, targetAudience: announcementTarget, departmentName: announcementDept });
      setAnnouncementTitle(''); setAnnouncementMsg(''); setAnnouncementTarget('ALL_STUDENTS'); setAnnouncementDept('');
      loadAnnouncements();
      alert('Announcement created successfully!');
    } catch (e) { alert(e.response?.data?.message || 'Failed to create announcement'); }
  };
  const deleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try { await adminAPI.deleteAnnouncement(id); loadAnnouncements(); } catch (e) { alert('Failed to delete'); }
  };
  const sendEmailCampaign = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) { alert('Please enter subject and body'); return; }
    const payload = { subject: emailSubject, body: emailBody, targetAudience: emailTarget, departmentName: emailDept };
    if (emailTarget === 'CGPA_RANGE') {
      if (!emailMinCgpa || !emailMaxCgpa) { alert('Please enter CGPA range'); return; }
      payload.minCgpa = parseFloat(emailMinCgpa);
      payload.maxCgpa = parseFloat(emailMaxCgpa);
    }
    try {
      await adminAPI.sendEmailCampaign(payload);
      setEmailSubject(''); setEmailBody(''); setEmailTarget('ALL_STUDENTS'); setEmailDept(''); setEmailMinCgpa(''); setEmailMaxCgpa('');
      loadEmailCampaigns();
      alert('Email campaign sent successfully!');
    } catch (e) { alert(e.response?.data?.message || 'Failed to send email campaign'); }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) { alert('No data to export'); return; }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const exportStudentsCSV = () => {
    const data = students.map(s => ({
      Name: s.name,
      Email: s.email,
      Department: s.department || 'N/A',
      RollNumber: s.rollNumber || 'N/A',
      CGPA: s.cgpa || 'N/A',
      Year: s.year || 'N/A',
      Phone: s.phone || 'N/A',
      PlacementStatus: s.placementStatus || 'Not Placed',
      Skills: Array.isArray(s.skills) ? s.skills.join('; ') : 'N/A'
    }));
    exportToCSV(data, `students_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportCompaniesCSV = () => {
    if (companies.length === 0) { alert('No companies to export'); return; }
    const data = companies.map(c => ({
      CompanyName: c.companyName,
      HRName: c.hrName || 'N/A',
      HREmail: c.hrEmail || 'N/A',
      Industry: c.industry || 'N/A',
      Website: c.website || 'N/A',
      Status: c.status || 'PENDING'
    }));
    exportToCSV(data, `companies_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportPlacementsCSV = () => {
    if (placements.length === 0) { alert('No placements to export'); return; }
    const data = placements.map(p => ({
      StudentName: p.studentName,
      StudentEmail: p.studentEmail,
      JobTitle: p.jobTitle,
      CompanyName: p.companyName,
      Package: p.salaryPackage,
      AppliedDate: new Date(p.appliedAt).toLocaleDateString()
    }));
    exportToCSV(data, `placements_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const renderPlacementCalendar = () => {
    const upcomingJobs = allJobs.filter(j => j.interviewDate && new Date(j.interviewDate) >= new Date());
    const pastJobs = allJobs.filter(j => j.interviewDate && new Date(j.interviewDate) < new Date());
    let filteredUpcoming = upcomingJobs;
    if (calendarFilters.company) filteredUpcoming = filteredUpcoming.filter(j => j.companyName?.toLowerCase().includes(calendarFilters.company.toLowerCase()));
    if (calendarFilters.location) filteredUpcoming = filteredUpcoming.filter(j => j.location?.toLowerCase().includes(calendarFilters.location.toLowerCase()));
    if (calendarFilters.dateFrom) filteredUpcoming = filteredUpcoming.filter(j => new Date(j.interviewDate) >= new Date(calendarFilters.dateFrom));
    if (calendarFilters.dateTo) filteredUpcoming = filteredUpcoming.filter(j => new Date(j.interviewDate) <= new Date(calendarFilters.dateTo));
    if (calendarFilters.onlyWithApplicants) filteredUpcoming = filteredUpcoming.filter(j => (jobApplicants[job.id]?.length || 0) > 0);
    const companies = [...new Set(allJobs.map(j => j.companyName).filter(Boolean))];
    const locations = [...new Set(allJobs.map(j => j.location).filter(Boolean))];
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center"><h2 className="text-xl font-bold text-white">Placement Calendar</h2><div className="flex gap-2"><button onClick={() => setCalendarView('list')} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${calendarView === 'list' ? 'bg-primary-500 text-white' : 'bg-dark-hover text-slate-400'}`}>List</button><button onClick={() => setCalendarView('month')} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${calendarView === 'month' ? 'bg-primary-500 text-white' : 'bg-dark-hover text-slate-400'}`}>Month</button><button onClick={() => setCalendarView('week')} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${calendarView === 'week' ? 'bg-primary-500 text-white' : 'bg-dark-hover text-slate-400'}`}>Week</button></div></div>
        <div className="grid grid-cols-3 gap-4"><StatCard label="Total Events" value={allJobs.filter(j => j.interviewDate).length} color="text-blue-400" /><StatCard label="This Month" value={allJobs.filter(j => j.interviewDate && new Date(j.interviewDate).getMonth() === new Date().getMonth()).length} color="text-green-400" /><StatCard label="Upcoming" value={upcomingJobs.length} color="text-primary-400" /></div>
        <Card><h3 className="font-semibold text-white mb-4">Filters</h3><div className="grid grid-cols-5 gap-3"><select value={calendarFilters.company} onChange={e => setCalendarFilters({...calendarFilters, company: e.target.value})} className={inputCls}><option value="">All Companies</option>{companies.map(c => <option key={c} value={c}>{c}</option>)}</select><select value={calendarFilters.location} onChange={e => setCalendarFilters({...calendarFilters, location: e.target.value})} className={inputCls}><option value="">All Locations</option>{locations.map(l => <option key={l} value={l}>{l}</option>)}</select><input type="date" value={calendarFilters.dateFrom} onChange={e => setCalendarFilters({...calendarFilters, dateFrom: e.target.value})} className={inputCls} /><input type="date" value={calendarFilters.dateTo} onChange={e => setCalendarFilters({...calendarFilters, dateTo: e.target.value})} className={inputCls} /><label className="flex items-center gap-2 px-4 py-2.5 bg-dark-hover border border-dark-border rounded-lg cursor-pointer"><input type="checkbox" checked={calendarFilters.onlyWithApplicants} onChange={e => setCalendarFilters({...calendarFilters, onlyWithApplicants: e.target.checked})} className="w-4 h-4" /><span className="text-sm text-white">With Applicants</span></label></div>{(calendarFilters.company || calendarFilters.location || calendarFilters.dateFrom || calendarFilters.dateTo || calendarFilters.onlyWithApplicants) && (<button onClick={() => setCalendarFilters({ company: '', location: '', dateFrom: '', dateTo: '', onlyWithApplicants: false })} className="mt-3 text-xs text-primary-400 hover:text-primary-300">Clear Filters</button>)}</Card>
        {calendarView === 'list' && (<Card><h3 className="font-semibold text-white mb-4">Upcoming Interviews ({filteredUpcoming.length})</h3>{loading ? <Spinner /> : filteredUpcoming.length === 0 ? (<div className="text-center py-12"><Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" /><p className="text-slate-500 text-sm">No interviews match your filters</p></div>) : (<div className="space-y-3">{filteredUpcoming.sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate)).map(job => {const interviewDate = new Date(job.interviewDate);const daysUntil = Math.ceil((interviewDate - new Date()) / (1000 * 60 * 60 * 24));const applicants = jobApplicants[job.id] || [];return (<div key={job.id} className="flex items-center gap-4 p-4 bg-dark-hover rounded-lg border border-dark-border hover:border-primary-500/50 transition-colors cursor-pointer" onClick={() => { setSelectedInterview(job); setShowInterviewModal(true); }}><div className="flex flex-col items-center justify-center w-16 h-16 bg-primary-500/10 border border-primary-500/30 rounded-lg shrink-0"><span className="text-xs text-primary-400 font-medium">{interviewDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span><span className="text-2xl font-bold text-primary-400">{interviewDate.getDate()}</span></div><div className="flex-1"><h4 className="font-semibold text-white">{job.title}</h4><p className="text-slate-400 text-sm">{job.companyName} · {job.location}</p><p className="text-slate-500 text-xs mt-1">{applicants.length} applicant{applicants.length !== 1 ? 's' : ''}</p></div><div className="text-right"><span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${daysUntil <= 3 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : daysUntil <= 7 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>{daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}</span><p className="text-slate-400 text-xs mt-1">{interviewDate.toLocaleDateString('en-US', { weekday: 'long' })}</p></div></div>);})}</div>)}</Card>)}
        <Card><h3 className="font-semibold text-white mb-4">Past Interviews</h3>{pastJobs.length === 0 ? (<p className="text-slate-500 text-sm text-center py-8">No past interviews</p>) : (<div className="space-y-2">{pastJobs.sort((a, b) => new Date(b.interviewDate) - new Date(a.interviewDate)).slice(0, 5).map(job => (<div key={job.id} className="flex items-center justify-between p-3 bg-dark-hover rounded-lg"><div><p className="text-white text-sm font-medium">{job.title}</p><p className="text-slate-400 text-xs">{job.companyName}</p></div><span className="text-slate-500 text-xs">{new Date(job.interviewDate).toLocaleDateString()}</span></div>))}</div>)}</Card>
      </div>
    );
  };

  const renderDashboard = () => {
    const eligibleStudents = students.filter(s => (s.cgpa || 0) >= 7.0).length;
    const totalEligible = students.filter(s => s.cgpa).length;
    const avgPackage = placements.length > 0 
      ? placements.reduce((sum, p) => sum + (parseFloat(p.salaryPackage?.replace(/[^0-9.]/g, '')) || 0), 0) / placements.length 
      : 0;
    const cgpaExcellent = students.filter(s => (s.cgpa || 0) >= 8.0).length;
    const cgpaGood = students.filter(s => (s.cgpa || 0) >= 7.0 && (s.cgpa || 0) < 8.0).length;
    const cgpaBelow = students.filter(s => (s.cgpa || 0) < 7.0 && s.cgpa).length;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h2>
          <p className="text-primary-100 text-sm">Manage your campus placement system</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={stats.totalStudents || 0} color="text-primary-400" icon={Users} />
          <StatCard label="Total Companies" value={stats.totalCompanies || 0} color="text-primary-400" icon={Building2} />
          <StatCard label="Total Jobs" value={stats.totalJobs || 0} color="text-primary-400" icon={Briefcase} />
          <StatCard label="Placements" value={stats.totalPlacements || 0} color="text-primary-400" icon={CheckCircle} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <p className="text-sm text-slate-400 mb-3">Placement Percentage</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-dark-hover rounded-full h-3">
                <div className="bg-primary-500 h-3 rounded-full transition-all" style={{ width: `${stats.placementRate || 0}%` }} />
              </div>
              <span className="text-xl font-bold text-primary-400">{stats.placementRate || 0}%</span>
            </div>
          </Card>
          <Card>
            <p className="text-sm text-slate-400 mb-1">Eligible Students</p>
            <p className="text-3xl font-bold text-primary-400">{eligibleStudents}/{totalEligible}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-400 mb-1">Avg Package</p>
            <p className="text-3xl font-bold text-primary-400">₹{avgPackage.toFixed(1)} LPA</p>
          </Card>
        </div>
        <Card>
          <h3 className="text-base font-semibold text-white mb-4">CGPA Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">8.0+ (Excellent)</span>
              <span className="text-primary-400 font-bold">{cgpaExcellent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">7.0–7.9 (Good)</span>
              <span className="text-primary-400 font-bold">{cgpaGood}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">&lt;7.0 (Below Criteria)</span>
              <span className="text-red-400 font-bold">{cgpaBelow}</span>
            </div>
          </div>
        </Card>
        {pendingCompanies.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-primary-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-300">Pending Approvals</p>
              <p className="text-xs text-primary-400/70">{pendingCompanies.length} companies waiting for approval</p>
            </div>
            <button onClick={() => setActiveTab('pending')} className="px-3 py-1.5 text-xs font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Review</button>
          </div>
        )}
      </div>
    );
  };

  const renderStudents = () => {
    const filtered = students.filter(s =>
      s.name?.toLowerCase().includes(searchStudents.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchStudents.toLowerCase()) ||
      s.department?.toLowerCase().includes(searchStudents.toLowerCase())
    );
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Students <span className="text-slate-500 text-sm font-normal">({students.length})</span></h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name, email, dept..." value={searchStudents}
              onChange={e => setSearchStudents(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-dark-card border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500 w-72" />
          </div>
        </div>
        {loading ? <Spinner /> : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    {['Student', 'Department', 'CGPA', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {filtered.map(s => (
                    <tr key={s.id} className="hover:bg-dark-hover transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{s.department || '—'}</td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-300">{s.cgpa || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                          s.placementStatus === 'PLACED'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                        }`}>
                          {s.placementStatus || 'Not Placed'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedStudent(s); setShowStudentModal(true); }} className="text-primary-400 hover:text-primary-300 transition-colors"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => deleteStudent(s.id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-slate-500 text-center py-12 text-sm">{searchStudents ? 'No students match your search' : 'No students found'}</p>}
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderCompanies = () => {
    const filtered = companies.filter(c =>
      c.companyName?.toLowerCase().includes(searchCompanies.toLowerCase()) ||
      c.hrEmail?.toLowerCase().includes(searchCompanies.toLowerCase()) ||
      c.industry?.toLowerCase().includes(searchCompanies.toLowerCase())
    );
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Companies <span className="text-slate-500 text-sm font-normal">({companies.length})</span></h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name, email, industry..." value={searchCompanies}
              onChange={e => setSearchCompanies(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-dark-card border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500 w-72" />
          </div>
        </div>
        {loading ? <Spinner /> : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    {['Company', 'HR Contact', 'Industry', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-dark-hover transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white">{c.companyName}</p>
                        <p className="text-xs text-slate-500">{c.website || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-300">{c.hrName || '—'}</p>
                        <p className="text-xs text-slate-500">{c.hrEmail || '—'}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300">{c.industry || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                          c.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          c.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-primary-500/20 text-primary-400 border-primary-500/30'
                        }`}>{c.status || 'PENDING'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {c.status !== 'APPROVED' && (
                            <button onClick={() => approveCompany(c.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                              <CheckCircle className="w-3 h-3" />Approve
                            </button>
                          )}
                          {c.status === 'APPROVED' && (
                            <button onClick={() => rejectCompany(c.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium border border-dark-border text-slate-300 hover:border-red-500/50 hover:text-red-400 rounded-lg transition-colors">
                              <XCircle className="w-3 h-3" />Revoke
                            </button>
                          )}
                          <button onClick={() => deleteCompany(c.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete company permanently">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-slate-500 text-center py-12 text-sm">{searchCompanies ? 'No companies match your search' : 'No companies registered yet'}</p>}
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderPending = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">
        Pending Approvals
        {pendingCompanies.length > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-full">{pendingCompanies.length}</span>
        )}
      </h2>
      {loading ? <Spinner /> : (
        <div className="space-y-4">
          {pendingCompanies.map(c => (
            <Card key={c.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{c.companyName}</h3>
                  <p className="text-slate-400 text-sm mt-1">{c.description || 'No description provided'}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                    {c.hrName && <span>HR: {c.hrName}</span>}
                    {c.hrEmail && <span>Email: {c.hrEmail}</span>}
                    {c.website && <span>Web: {c.website}</span>}
                  </div>
                </div>
                <div className="ml-6 flex gap-2">
                  <button onClick={() => approveCompany(c.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    <CheckCircle className="w-4 h-4" />Approve
                  </button>
                  <button onClick={() => rejectCompany(c.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    <XCircle className="w-4 h-4" />Reject
                  </button>
                </div>
              </div>
            </Card>
          ))}
          {pendingCompanies.length === 0 && <p className="text-slate-500 text-center py-12 text-sm">No pending approvals</p>}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => {
    const chartData = deptStats.map(d => ({
      name: d.department,
      placed: d.placed,
      total: d.total,
      rate: d.placementRate
    }));

    const pieData = [
      { name: 'Placed', value: stats.totalPlacements || 0, color: '#10b981' },
      { name: 'Not Placed', value: (stats.totalStudents || 0) - (stats.totalPlacements || 0), color: '#ef4444' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Analytics</h2>
          <button onClick={loadAnalytics} className="px-3 py-1.5 text-xs border border-dark-border text-slate-400 rounded-lg hover:bg-dark-hover transition-colors">Refresh</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Students" value={stats.totalStudents || 0} color="text-primary-400" icon={Users} />
          <StatCard label="Placed" value={stats.totalPlacements || 0} color="text-green-400" icon={CheckCircle} />
          <StatCard label="Placement Rate" value={`${stats.placementRate || 0}%`} color="text-primary-400" />
          <StatCard label="At-Risk Students" value={riskStudents.length} color="text-red-400" />
        </div>

        {/* Placement Overview Pie Chart */}
        <Card>
          <h3 className="text-base font-semibold text-white mb-4">Placement Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Department-wise Bar Chart */}
        <Card>
          <h3 className="text-base font-semibold text-white mb-4">Department-wise Placement</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="placed" fill="#10b981" name="Placed" />
              <Bar dataKey="total" fill="#3b82f6" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Placement Rate Line Chart */}
        <Card>
          <h3 className="text-base font-semibold text-white mb-4">Placement Rate by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={2} name="Placement Rate (%)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Department Stats Table */}
        <Card>
          <h3 className="text-base font-semibold text-white mb-4">Department Details</h3>
          <div className="space-y-3">
            {deptStats.map((d, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-slate-300 text-sm w-40 shrink-0">{d.department}</span>
                <div className="flex-1 bg-dark-hover rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${d.placementRate}%` }} />
                </div>
                <span className="text-slate-400 text-xs w-24 text-right">{d.placed}/{d.total} ({d.placementRate}%)</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border w-32 text-center ${
                  d.status === 'Excellent' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  d.status === 'Good' ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' :
                  'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>{d.status}</span>
              </div>
            ))}
            {deptStats.length === 0 && <p className="text-slate-500 text-sm">No department data</p>}
          </div>
        </Card>

        {riskStudents.length > 0 && (
          <Card>
            <h3 className="text-base font-semibold text-white mb-4">At-Risk Students <span className="text-red-400 text-sm">({riskStudents.length})</span></h3>
            <div className="space-y-2">
              {riskStudents.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-dark-hover rounded-lg border border-dark-border">
                  <div>
                    <p className="text-white text-sm font-medium">{s.name}</p>
                    <p className="text-slate-500 text-xs">{s.department} · CGPA: {s.cgpa}</p>
                  </div>
                  <span className="text-red-400 text-sm font-medium">{s.placementProbability?.toFixed(0) || 0}% chance</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'students': return renderStudents();
      case 'companies': return renderCompanies();
      case 'pending': return renderPending();
      case 'analytics': return renderAnalytics();
      case 'departments': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Departments</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Departments" value="10" color="text-primary-400" />
            <StatCard label="Total Students" value={students.length} color="text-blue-400" />
            <StatCard label="Avg Placement" value={`${stats.placementRate || 0}%`} color="text-green-400" />
            <StatCard label="Active Programs" value="12" color="text-yellow-400" />
          </div>
          <Card>
            <h3 className="font-semibold text-white mb-4">All Departments</h3>
            {['CSE', 'CSE(CY)', 'AIDS', 'AIML', 'IT', 'CCE', 'ECE', 'EEE', 'CSBS', 'MECH'].map((d, i) => {
              const deptStudents = students.filter(s => s.department === d);
              const placed = deptStudents.filter(s => s.placementStatus === 'PLACED').length;
              return (
                <div key={i} className="p-3 bg-dark-hover rounded-lg mb-2 flex justify-between items-center">
                  <div>
                    <span className="text-white font-medium">{d}</span>
                    <span className="text-slate-500 text-sm ml-3">{deptStudents.length} students</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-400 text-sm">{placed} placed</span>
                    <button onClick={() => setActiveTab('analytics')} className="px-3 py-1 text-sm text-primary-400 hover:text-primary-300 transition-colors">View Details</button>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      );
      case 'placement-calendar': return renderPlacementCalendar();
      case 'bulk-operations': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Bulk Operations</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Students" value={students.length} color="text-blue-400" />
            <StatCard label="Total Companies" value={companies.length} color="text-primary-400" />
            <StatCard label="Pending Approvals" value={pendingCompanies.length} color="text-yellow-400" />
          </div>
          <Card>
            <h3 className="font-semibold text-white mb-4">Mass Operations</h3>
            <div className="space-y-3">
              <button onClick={() => alert(`Import students in bulk`)} className="w-full px-4 py-3 bg-dark-hover border border-dark-border rounded-lg hover:border-primary-500/50 text-white text-left transition-colors">Bulk Student Import (Excel/CSV)</button>
              <button onClick={() => alert(`Approve ${pendingCompanies.length} pending companies`)} className="w-full px-4 py-3 bg-dark-hover border border-dark-border rounded-lg hover:border-primary-500/50 text-white text-left transition-colors">Bulk Company Approval ({pendingCompanies.length} pending)</button>
              <button onClick={() => alert(`Exporting ${students.length} students + ${companies.length} companies...`)} className="w-full px-4 py-3 bg-dark-hover border border-dark-border rounded-lg hover:border-primary-500/50 text-white text-left transition-colors">Bulk Data Export ({students.length + companies.length} records)</button>
            </div>
          </Card>
        </div>
      );
      case 'email-campaigns': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Email Campaigns</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Students" value={students.length} color="text-blue-400" />
            <StatCard label="Eligible (CGPA≥7)" value={students.filter(s => s.cgpa >= 7).length} color="text-green-400" />
            <StatCard label="Companies" value={companies.length} color="text-primary-400" />
            <StatCard label="Campaigns Sent" value={emailCampaigns.length} color="text-yellow-400" />
          </div>
          <Card>
            <h3 className="font-semibold text-white mb-4">Create Email Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Subject</label>
                <input type="text" placeholder="Email subject..." value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Body</label>
                <textarea rows="5" placeholder="Email body..." value={emailBody} onChange={e => setEmailBody(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Audience</label>
                <select value={emailTarget} onChange={e => setEmailTarget(e.target.value)} className={inputCls}>
                  <option value="ALL_STUDENTS">All Students ({students.length})</option>
                  <option value="ALL_COMPANIES">All Companies ({companies.length})</option>
                  <option value="SPECIFIC_DEPARTMENT">Specific Department</option>
                  <option value="CGPA_RANGE">CGPA Range</option>
                  <option value="ALL_USERS">All Users ({students.length + companies.length})</option>
                </select>
              </div>
              {emailTarget === 'SPECIFIC_DEPARTMENT' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
                  <select value={emailDept} onChange={e => setEmailDept(e.target.value)} className={inputCls}>
                    <option value="">Select Department</option>
                    {['CSE', 'CSE(CY)', 'AIDS', 'AIML', 'IT', 'CCE', 'ECE', 'EEE', 'CSBS', 'MECH'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
              {emailTarget === 'CGPA_RANGE' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Min CGPA</label>
                    <input type="number" step="0.1" placeholder="7.0" value={emailMinCgpa} onChange={e => setEmailMinCgpa(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Max CGPA</label>
                    <input type="number" step="0.1" placeholder="10.0" value={emailMaxCgpa} onChange={e => setEmailMaxCgpa(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}
              <button onClick={sendEmailCampaign} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Send Email Campaign</button>
            </div>
          </Card>
          {loading ? <Spinner /> : emailCampaigns.length > 0 && (
            <Card>
              <h3 className="font-semibold text-white mb-4">Campaign History</h3>
              <div className="space-y-3">
                {emailCampaigns.map(c => (
                  <div key={c.id} className="p-4 bg-dark-hover rounded-lg border border-dark-border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{c.subject}</h4>
                        <p className="text-slate-400 text-sm mt-1">{c.body.substring(0, 100)}{c.body.length > 100 ? '...' : ''}</p>
                        <div className="flex gap-4 mt-2 text-xs text-slate-500">
                          <span>To: {c.targetAudience.replace(/_/g, ' ')}</span>
                          <span>Recipients: {c.recipientCount}</span>
                          <span>Sent: {new Date(c.sentAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border shrink-0 ${
                        c.status === 'SENT' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      );
      case 'reports': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Reports & Export</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Students" value={students.length} color="text-blue-400" />
            <StatCard label="Companies" value={companies.length} color="text-primary-400" />
            <StatCard label="Jobs" value={allJobs.length} color="text-yellow-400" />
            <StatCard label="Placements" value={placements.length} color="text-green-400" />
          </div>
          <Card>
            <h3 className="font-semibold text-white mb-4">System Reports</h3>
            <div className="space-y-3">
              <button onClick={exportStudentsCSV} disabled={students.length === 0} className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-left transition-colors">Export All Students (CSV) - {students.length} records</button>
              <button onClick={exportCompaniesCSV} disabled={companies.length === 0} className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-left transition-colors">Export All Companies (CSV) - {companies.length} records</button>
              <button onClick={exportPlacementsCSV} disabled={placements.length === 0} className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-left transition-colors">Export Placements (CSV) - {placements.length} records</button>
            </div>
          </Card>
        </div>
      );
      case 'system-settings': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">System Settings</h2>
          <Card>
            <h3 className="font-semibold text-white mb-4">Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm block mb-2">Placement Year</label>
                <input 
                  type="text" 
                  value={placementYear} 
                  onChange={(e) => setPlacementYear(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-hover border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-2">Min CGPA for Eligibility</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={minCgpa} 
                  onChange={(e) => setMinCgpa(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-hover border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" 
                />
              </div>
              <button 
                onClick={() => {
                  localStorage.setItem('placementYear', placementYear);
                  localStorage.setItem('minCgpa', minCgpa);
                  alert('Settings saved successfully!');
                }}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Save Settings
              </button>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold text-white mb-4">Current Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-400 text-sm">Placement Year</span>
                <span className="text-white font-medium">{placementYear}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-400 text-sm">Min CGPA for Eligibility</span>
                <span className="text-white font-medium">{minCgpa}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-dark-hover rounded-lg">
                <span className="text-slate-400 text-sm">Eligible Students</span>
                <span className="text-green-400 font-medium">{students.filter(s => (s.cgpa || 0) >= parseFloat(minCgpa)).length} / {students.length}</span>
              </div>
            </div>
          </Card>
        </div>
      );
      case 'jobs': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">All Jobs <span className="text-slate-500 text-sm font-normal">({allJobs.length})</span></h2>
          {loading ? <Spinner /> : (
            <div className="space-y-3">
              {allJobs.map(j => (
                <Card key={j.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{j.title}</h3>
                      <p className="text-slate-400 text-sm mt-0.5">{j.companyName} · {j.location} · {j.salaryPackage}</p>
                      <div className="flex gap-2 mt-2">
                        {j.requiredSkills?.slice(0,4).map((s,i) => <span key={i} className="px-2 py-0.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs rounded-full">{s}</span>)}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                      j.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}>{j.status}</span>
                  </div>
                </Card>
              ))}
              {allJobs.length === 0 && <p className="text-slate-500 text-center py-12 text-sm">No jobs found</p>}
            </div>
          )}
        </div>
      );
      case 'placements': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Placements <span className="text-slate-500 text-sm font-normal">({placements.length})</span></h2>
          {loading ? <Spinner /> : (
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      {['Student', 'Job', 'Company', 'Package', 'Applied On'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {placements.map(p => (
                      <tr key={p.id} className="hover:bg-dark-hover transition-colors">
                        <td className="px-5 py-4"><p className="text-sm font-medium text-white">{p.studentName}</p><p className="text-xs text-slate-500">{p.studentEmail}</p></td>
                        <td className="px-5 py-4 text-sm text-slate-300">{p.jobTitle}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{p.companyName}</td>
                        <td className="px-5 py-4 text-sm text-green-400 font-medium">{p.salaryPackage}</td>
                        <td className="px-5 py-4 text-sm text-slate-400">{new Date(p.appliedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {placements.length === 0 && <p className="text-slate-500 text-center py-12 text-sm">No placements yet</p>}
              </div>
            </Card>
          )}
        </div>
      );
      case 'announcements': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Announcements</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Announcements" value={announcements.length} color="text-blue-400" />
            <StatCard label="Students" value={students.length} color="text-green-400" />
            <StatCard label="Companies" value={companies.length} color="text-primary-400" />
            <StatCard label="This Week" value={announcements.filter(a => new Date(a.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length} color="text-yellow-400" />
          </div>
          <Card>
            <h3 className="font-semibold text-white mb-4">Create Announcement</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Title</label>
                <input type="text" placeholder="Announcement title..." value={announcementTitle} onChange={e => setAnnouncementTitle(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Message</label>
                <textarea rows="4" placeholder="Announcement message..." value={announcementMsg} onChange={e => setAnnouncementMsg(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Audience</label>
                <select value={announcementTarget} onChange={e => setAnnouncementTarget(e.target.value)} className={inputCls}>
                  <option value="ALL_STUDENTS">All Students</option>
                  <option value="ALL_COMPANIES">All Companies</option>
                  <option value="SPECIFIC_DEPARTMENT">Specific Department</option>
                  <option value="ALL_USERS">All Users</option>
                </select>
              </div>
              {announcementTarget === 'SPECIFIC_DEPARTMENT' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
                  <select value={announcementDept} onChange={e => setAnnouncementDept(e.target.value)} className={inputCls}>
                    <option value="">Select Department</option>
                    {['CSE', 'CSE(CY)', 'AIDS', 'AIML', 'IT', 'CCE', 'ECE', 'EEE', 'CSBS', 'MECH'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
              <button onClick={sendAnnouncement} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                <Bell className="w-4 h-4" />Create Announcement
              </button>
            </div>
          </Card>
          {loading ? <Spinner /> : announcements.length > 0 && (
            <Card>
              <h3 className="font-semibold text-white mb-4">All Announcements</h3>
              <div className="space-y-3">
                {announcements.map(a => (
                  <div key={a.id} className="p-4 bg-dark-hover rounded-lg border border-dark-border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{a.title}</h4>
                        <p className="text-slate-400 text-sm mt-1">{a.message}</p>
                        <div className="flex gap-4 mt-2 text-xs text-slate-500">
                          <span>To: {a.targetAudience.replace(/_/g, ' ')}</span>
                          {a.departmentName && <span>Dept: {a.departmentName}</span>}
                          <span>Posted: {new Date(a.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteAnnouncement(a.id)} className="text-red-400 hover:text-red-300 transition-colors ml-4">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="ADMIN" />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">{renderContent()}</div>
      </div>
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowStudentModal(false)}>
          <div className="bg-dark-card border border-dark-border rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Student Profile</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
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
                  <p className="text-white font-medium">{selectedStudent.cgpa || '—'}</p>
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
                    selectedStudent.placementStatus === 'PLACED' || selectedStudent.isPlaced
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                  }`}>
                    {selectedStudent.placementStatus || (selectedStudent.isPlaced ? 'PLACED' : 'Not Placed')}
                  </span>
                </div>
              </div>
              {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedStudent.placementProbability && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Placement Probability</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-dark-hover rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${selectedStudent.placementProbability}%` }} />
                    </div>
                    <span className="text-white font-medium">{selectedStudent.placementProbability.toFixed(0)}%</span>
                  </div>
                </div>
              )}
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
      {showInterviewModal && selectedInterview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowInterviewModal(false)}>
          <div className="bg-dark-card border border-dark-border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 flex justify-between items-center"><h3 className="text-xl font-bold text-white">Interview Details</h3><button onClick={() => setShowInterviewModal(false)} className="text-slate-400 hover:text-white transition-colors"><XCircle className="w-6 h-6" /></button></div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-slate-400 mb-1">Job Title</p><p className="text-white font-medium">{selectedInterview.title}</p></div><div><p className="text-xs text-slate-400 mb-1">Company</p><p className="text-white font-medium">{selectedInterview.companyName}</p></div><div><p className="text-xs text-slate-400 mb-1">Location</p><p className="text-white font-medium">{selectedInterview.location}</p></div><div><p className="text-xs text-slate-400 mb-1">Interview Date</p><p className="text-white font-medium">{new Date(selectedInterview.interviewDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div><div><p className="text-xs text-slate-400 mb-1">Package</p><p className="text-white font-medium">{selectedInterview.salaryPackage}</p></div><div><p className="text-xs text-slate-400 mb-1">Status</p><span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${selectedInterview.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>{selectedInterview.status}</span></div></div>
              {(jobApplicants[selectedInterview.id]?.length || 0) > 0 && (<div><p className="text-xs text-slate-400 mb-3">Applicants ({jobApplicants[selectedInterview.id].length})</p><div className="space-y-2 max-h-60 overflow-y-auto">{jobApplicants[selectedInterview.id].map(app => (<div key={app.id} className="flex items-center justify-between p-3 bg-dark-hover rounded-lg border border-dark-border"><div><p className="text-white text-sm font-medium">{app.studentName}</p><p className="text-slate-400 text-xs">{app.studentEmail}</p></div><span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${app.status === 'SHORTLISTED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : app.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-primary-500/20 text-primary-400 border-primary-500/30'}`}>{app.status}</span></div>))}</div></div>)}
              {(jobApplicants[selectedInterview.id]?.length || 0) === 0 && (<div className="text-center py-8"><Users className="w-12 h-12 text-slate-600 mx-auto mb-3" /><p className="text-slate-500 text-sm">No applicants yet</p></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

