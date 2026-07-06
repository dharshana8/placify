import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { companyAPI } from '../../services/api';
import { aiService } from '../../services/aiService';
import { Plus, Edit, Trash2, Users, Filter, Search, XCircle, Clock, Eye, Send, Brain, AlertTriangle, CheckCircle } from 'lucide-react';

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

const StatusBadge = ({ status }) => {
  const map = {
    SELECTED: 'bg-green-500/20 text-green-400 border-green-500/30',
    REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
    INTERVIEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    SHORTLISTED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    APPLIED: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };
  return <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${map[status] || map.APPLIED}`}>{status}</span>;
};

const inputCls = 'w-full px-4 py-2.5 bg-dark-hover border border-dark-border text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [profile, setProfile] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobForm, setJobForm] = useState({ title: '', salaryPackage: '', location: '', minCgpa: '', interviewDate: '', hrEmail: '', requiredSkills: '', description: '' });
  const [jobError, setJobError] = useState('');
  const [jobSuccess, setJobSuccess] = useState('');
  const [aiRanking, setAiRanking] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [editProfileForm, setEditProfileForm] = useState({});
  const [profileSuccess, setProfileSuccess] = useState('');
  const [searchApplicants, setSearchApplicants] = useState('');
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [analytics, setAnalytics] = useState(null);
  const [viewingApplicant, setViewingApplicant] = useState(null);

  useEffect(() => {
    loadJobs();
    loadProfile();
    loadAllApplicants();
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'jobs') loadJobs();
    if (activeTab === 'applicants') { loadJobs().then(() => loadApplicants()); }
    if (activeTab === 'profile') loadProfile();
    if (activeTab === 'analytics') loadAnalytics();
    if (activeTab === 'selected') loadAllApplicants();
  }, [activeTab]);

  const loadJobs = async () => {
    setLoading(true);
    try { const res = await companyAPI.getJobs(); setJobs(res.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadApplicants = async () => {
    setLoading(true);
    try {
      if (selectedJob) {
        const res = await companyAPI.getApplicants(selectedJob.id);
        setApplicants(res.data);
      } else {
        const allApps = [];
        for (const job of jobs) {
          const res = await companyAPI.getApplicants(job.id);
          allApps.push(...res.data.map(app => ({ ...app, jobTitle: job.title, jobId: job.id })));
        }
        setApplicants(allApps);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadAllApplicants = async () => {
    setLoading(true);
    try {
      const allApps = [];
      for (const job of jobs) {
        const res = await companyAPI.getApplicants(job.id);
        allApps.push(...res.data.map(app => ({ ...app, jobTitle: job.title })));
      }
      setAllApplicants(allApps);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadAnalytics = async () => {
    try { const res = await companyAPI.getAnalytics(); setAnalytics(res.data); }
    catch (e) { console.error(e); }
  };

  const loadProfile = async () => {
    try {
      const res = await companyAPI.getProfile();
      setProfile(res.data);
      setApprovalStatus(res.data.status);
      setEditProfileForm({
        companyName: res.data.companyName || '',
        website: res.data.website || '',
        hrName: res.data.hrName || '',
        hrEmail: res.data.hrEmail || '',
        description: res.data.description || '',
      });
    } catch (e) { console.error(e); }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job? All applications will also be removed.')) return;
    try { await companyAPI.deleteJob(jobId); loadJobs(); } catch (e) { alert('Failed to delete job'); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await companyAPI.updateProfile(editProfileForm);
      setProfileSuccess('Profile updated successfully!');
      loadProfile();
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (e) { alert(e.response?.data?.message || 'Failed to update profile'); }
  };

  const updateStatus = async (appId, status, jobId = null) => {
    try { 
      const targetJobId = jobId || selectedJob?.id || applicants.find(a => a.id === appId)?.jobId;
      if (!targetJobId) { alert('Job ID not found'); return; }
      await companyAPI.updateApplicationStatus(targetJobId, appId, status); 
      loadApplicants(); 
      loadAllApplicants();
    }
    catch (e) { alert('Failed to update status'); }
  };

  const handleJobField = (field, value) => setJobForm(p => ({ ...p, [field]: value }));

  const submitJob = async (e, isDraft = false) => {
    e.preventDefault();
    setJobError('');
    setJobSuccess('');
    if (!jobForm.title || !jobForm.salaryPackage || !jobForm.location) {
      setJobError('Title, Package and Location are required.');
      return;
    }
    try {
      setLoading(true);
      const jobData = {
        title: jobForm.title,
        salaryPackage: jobForm.salaryPackage,
        location: jobForm.location,
        minCgpa: parseFloat(jobForm.minCgpa) || 0,
        interviewDate: jobForm.interviewDate || null,
        requiredSkills: jobForm.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        description: jobForm.description,
        status: isDraft ? 'DRAFT' : 'ACTIVE',
      };
      
      if (selectedJob && selectedJob.id) {
        await companyAPI.updateJob(selectedJob.id, jobData);
        setJobSuccess('Job updated successfully!');
        setSelectedJob(null);
      } else {
        await companyAPI.createJob(jobData);
        setJobSuccess(isDraft ? 'Job saved as draft!' : 'Job posted successfully!');
      }
      
      setJobForm({ title: '', salaryPackage: '', location: '', minCgpa: '', interviewDate: '', hrEmail: '', requiredSkills: '', description: '' });
      loadJobs();
      if (!isDraft) setTimeout(() => setActiveTab('jobs'), 1500);
    } catch (err) {
      setJobError(err.response?.data?.message || 'Failed to save job. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const ApprovalBanner = () => {
    if (!approvalStatus || approvalStatus === 'APPROVED') return null;
    if (approvalStatus === 'REJECTED') return (
      <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6">
        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-300">Account Rejected</p>
          <p className="text-xs text-red-400/70 mt-0.5">Your company registration was rejected by the Placement Cell. Contact <span className="text-red-300">placementcell@sece.ac.in</span> for more info.</p>
        </div>
      </div>
    );
    return (
      <div className="flex items-start gap-3 p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl mb-6">
        <Clock className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-primary-300">Pending Approval</p>
          <p className="text-xs text-primary-400/70 mt-0.5">Your account is awaiting approval from the Placement Cell. You can post jobs once approved. Contact <span className="text-primary-300">placementcell@sece.ac.in</span> to expedite.</p>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <ApprovalBanner />
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-1">Company Dashboard</h2>
        <p className="text-primary-100 text-sm">Manage your job postings and applicants</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Jobs" value={jobs.length} color="text-primary-400" />
        <StatCard label="Total Applicants" value={jobs.reduce((s, j) => s + (j.applicantCount || 0), 0)} color="text-blue-400" />
        <StatCard label="Active Jobs" value={jobs.filter(j => j.status === 'ACTIVE').length} color="text-green-400" />
        <StatCard label="Avg Applicants" value={jobs.length ? Math.round(jobs.reduce((s, j) => s + (j.applicantCount || 0), 0) / jobs.length) : 0} color="text-yellow-400" />
      </div>
      <Card>
        <h3 className="text-base font-semibold text-white mb-4">Recent Job Postings</h3>
        <div className="space-y-3">
          {jobs.slice(0, 3).map(job => (
            <div key={job.id} className="flex justify-between items-center p-4 bg-dark-hover rounded-lg border border-dark-border">
              <div>
                <p className="font-medium text-white text-sm">{job.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{job.location} · {job.salaryPackage} · {job.applicantCount || 0} applicants</p>
              </div>
              <button onClick={() => { setSelectedJob(job); setActiveTab('applicants'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-dark-border text-slate-300 rounded-lg hover:bg-dark-card transition-colors">
                <Users className="w-3 h-3" />View
              </button>
            </div>
          ))}
          {jobs.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No jobs posted yet</p>}
        </div>
      </Card>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">My Jobs</h2>
        <button onClick={() => setActiveTab('post-job')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />Post New Job
        </button>
      </div>
      {loading ? <Spinner /> : (
        <div className="space-y-4">
          {jobs.map(job => (
            <Card key={job.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-3">
                    <span>{job.salaryPackage}</span>
                    <span>{job.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{job.applicantCount || 0} applicants</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="ml-6 flex items-center gap-2">
                  <button onClick={() => { setSelectedJob(job); setActiveTab('applicants'); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">
                    <Users className="w-4 h-4" />Applicants
                  </button>
                  <button onClick={() => {
                    setJobForm({
                      title: job.title,
                      salaryPackage: job.salaryPackage,
                      location: job.location,
                      minCgpa: job.minCgpa || '',
                      interviewDate: job.interviewDate || '',
                      hrEmail: job.hrEmail || '',
                      requiredSkills: job.requiredSkills?.join(', ') || '',
                      description: job.description || ''
                    });
                    setSelectedJob(job);
                    setActiveTab('post-job');
                  }} className="p-2 border border-dark-border text-slate-400 rounded-lg hover:bg-dark-hover transition-colors" title="Edit job"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => deleteJob(job.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete job"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
          {jobs.length === 0 && <p className="text-slate-500 text-center py-12">No jobs posted yet</p>}
        </div>
      )}
    </div>
  );

  const renderPostJob = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">{selectedJob ? 'Edit Job' : 'Post New Job'}</h2>
        {selectedJob && (
          <button onClick={() => { setSelectedJob(null); setJobForm({ title: '', salaryPackage: '', location: '', minCgpa: '', interviewDate: '', hrEmail: '', requiredSkills: '', description: '' }); }}
            className="px-3 py-1.5 text-xs border border-dark-border text-slate-400 rounded-lg hover:bg-dark-hover transition-colors">Cancel Edit</button>
        )}
      </div>
      {approvalStatus !== 'APPROVED' ? (
        <div className="flex items-start gap-3 p-6 bg-primary-500/10 border border-primary-500/30 rounded-xl">
          <AlertTriangle className="w-6 h-6 text-primary-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-primary-300 mb-1">Approval Required</p>
            <p className="text-sm text-primary-400/70">You cannot post jobs until the Placement Cell approves your company account. Contact <span className="text-primary-300">placementcell@sece.ac.in</span>.</p>
          </div>
        </div>
      ) : (
        <Card>
          <form className="space-y-5" onSubmit={submitJob}>
            {jobError && <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">{jobError}</div>}
            {jobSuccess && <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg">{jobSuccess}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Job Title *</label>
                <input type="text" placeholder="e.g. Software Engineer" value={jobForm.title}
                  onChange={e => handleJobField('title', e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Package *</label>
                <input type="text" placeholder="e.g. 12 LPA" value={jobForm.salaryPackage}
                  onChange={e => handleJobField('salaryPackage', e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Location *</label>
                <input type="text" placeholder="e.g. Bangalore" value={jobForm.location}
                  onChange={e => handleJobField('location', e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Min CGPA</label>
                <input type="number" step="0.1" min="0" max="10" placeholder="e.g. 7.0" value={jobForm.minCgpa}
                  onChange={e => handleJobField('minCgpa', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Interview Date</label>
                <input type="date" value={jobForm.interviewDate}
                  onChange={e => handleJobField('interviewDate', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">HR Email</label>
                <input type="email" placeholder="hr@company.com" value={jobForm.hrEmail}
                  onChange={e => handleJobField('hrEmail', e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Required Skills</label>
              <input type="text" placeholder="e.g. Java, Spring Boot, React" value={jobForm.requiredSkills}
                onChange={e => handleJobField('requiredSkills', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Job Description</label>
              <textarea rows="5" placeholder="Describe the role and responsibilities..." value={jobForm.description}
                onChange={e => handleJobField('description', e.target.value)} className={inputCls} />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={e => submitJob(e, true)} disabled={loading}
                className="px-4 py-2 text-sm border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors disabled:opacity-50">
                Save as Draft
              </button>
              <button type="submit" disabled={loading}
                className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : (selectedJob ? 'Update Job' : 'Post Job')}
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );

  const renderApplicants = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">All Applicants</h2>
          <p className="text-slate-400 text-sm mt-0.5">{applicants.length} total applicants</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search applicants..."
              value={searchApplicants} onChange={e => setSearchApplicants(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-dark-card border border-dark-border text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-dark-border text-slate-400 rounded-lg hover:bg-dark-hover transition-colors">
            <Filter className="w-4 h-4" />Filter
          </button>
        </div>
      </div>
      {loading ? <Spinner /> : (
        <div className="space-y-4">
          {applicants.filter(a => !searchApplicants || a.studentName?.toLowerCase().includes(searchApplicants.toLowerCase())).map(a => (
            <Card key={a.id} className="cursor-pointer hover:border-primary-500/50 transition-all" onClick={() => setViewingApplicant(a)}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{a.studentName}</h3>
                    {a.jobTitle && <span className="px-2 py-0.5 bg-primary-500/10 text-primary-400 text-xs rounded-full">{a.jobTitle}</span>}
                  </div>
                  <div className="flex gap-4 text-slate-400 text-sm mt-1">
                    <span>CGPA: {a.cgpa || a.studentCgpa || 'N/A'}</span>
                    <span>{a.department || a.studentDepartment || 'N/A'}</span>
                    <span>Applied: {a.appliedDate ? new Date(a.appliedDate).toLocaleDateString() : (a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : 'N/A')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {a.skills?.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-dark-hover border border-dark-border text-slate-400 text-xs rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="ml-6 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setViewingApplicant(a)} className="p-2 border border-primary-500 text-primary-400 rounded-lg hover:bg-primary-500/10 transition-colors" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <StatusBadge status={a.status} />
                  <select value={a.status} onChange={e => updateStatus(a.id, e.target.value, a.jobId)}
                    className="px-3 py-1.5 bg-dark-hover border border-dark-border text-slate-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </Card>
          ))}
          {applicants.length === 0 && <p className="text-slate-500 text-center py-12">No applicants yet</p>}
        </div>
      )}

      {/* Applicant Details Modal */}
      {viewingApplicant && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingApplicant(null)}>
          <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{viewingApplicant.studentName}</h2>
                <div className="flex items-center gap-3">
                  <StatusBadge status={viewingApplicant.status} />
                  <span className="text-slate-400 text-sm">Applied: {viewingApplicant.appliedDate ? new Date(viewingApplicant.appliedDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <button onClick={() => setViewingApplicant(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-3">
                <button onClick={() => { updateStatus(viewingApplicant.id, 'SHORTLISTED', viewingApplicant.jobId); setViewingApplicant(null); }}
                  className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors">
                  Shortlist
                </button>
                <button onClick={() => { updateStatus(viewingApplicant.id, 'INTERVIEW', viewingApplicant.jobId); setViewingApplicant(null); }}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Interview
                </button>
                <button onClick={() => { updateStatus(viewingApplicant.id, 'SELECTED', viewingApplicant.jobId); setViewingApplicant(null); }}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                  Select
                </button>
                <button onClick={() => { updateStatus(viewingApplicant.id, 'REJECTED', viewingApplicant.jobId); setViewingApplicant(null); }}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                  Reject
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-dark-hover rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Email</p>
                    <p className="text-white font-medium">{viewingApplicant.studentEmail || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-dark-hover rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">CGPA</p>
                    <p className="text-white font-medium text-lg">{viewingApplicant.cgpa || viewingApplicant.studentCgpa || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-dark-hover rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Department</p>
                    <p className="text-white font-medium">{viewingApplicant.department || viewingApplicant.studentDepartment}</p>
                  </div>
                  <div className="p-3 bg-dark-hover rounded-lg">
                    <p className="text-xs text-slate-400 mb-1">Year</p>
                    <p className="text-white font-medium">{viewingApplicant.year || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {viewingApplicant.skills && viewingApplicant.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingApplicant.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Resume</h3>
                {viewingApplicant.resumeUrl ? (
                  <div className="flex items-center gap-3 p-4 bg-dark-hover border border-dark-border rounded-lg">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Resume.pdf</p>
                      <p className="text-slate-400 text-xs">Click to view or download</p>
                    </div>
                    <button onClick={() => window.open(`http://localhost:8080${viewingApplicant.resumeUrl}`, '_blank')}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                      View Resume
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">No resume uploaded</p>
                  </div>
                )}
              </div>

              {viewingApplicant.aiScore && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Compatibility Score</h3>
                  <div className="p-4 bg-gradient-to-r from-primary-500/10 to-blue-500/10 border border-primary-500/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-primary-400">{Math.round(viewingApplicant.aiScore)}%</p>
                        <p className="text-xs text-slate-400 mt-1">Match Score</p>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-dark-hover rounded-full h-3">
                          <div className="bg-gradient-to-r from-primary-500 to-blue-500 h-3 rounded-full transition-all" style={{ width: `${viewingApplicant.aiScore}%` }} />
                        </div>
                        <p className="text-slate-400 text-xs mt-2">Calculated based on skills match, CGPA, and job requirements</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-dark-card border-t border-dark-border p-6 flex justify-end">
              <button onClick={() => setViewingApplicant(null)}
                className="px-6 py-2 border border-dark-border text-slate-300 rounded-lg hover:bg-dark-hover transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => {
    const totalApplicants = jobs.reduce((s, j) => s + (j.applicantCount || 0), 0);
    const avgApplicants = jobs.length ? Math.round(totalApplicants / jobs.length) : 0;
    
    // Generate data for line graph (last 7 days) - using real applicant data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      // Count applicants who applied on this date
      const applicantsOnDate = allApplicants.filter(app => {
        const appliedDate = app.appliedDate || app.appliedAt;
        if (!appliedDate) return false;
        const appDateStr = new Date(appliedDate).toISOString().split('T')[0];
        return appDateStr === dateStr;
      }).length;
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applicants: applicantsOnDate
      };
    });

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Jobs" value={jobs.length} color="text-primary-400" />
          <StatCard label="Total Applicants" value={totalApplicants} color="text-blue-400" />
          <StatCard label="Avg Applicants/Job" value={avgApplicants} color="text-green-400" />
          <StatCard label="Active Jobs" value={jobs.filter(j => j.status === 'ACTIVE').length} color="text-yellow-400" />
        </div>

        <Card>
          <h3 className="text-base font-semibold text-white mb-4">Application Trends (Last 7 Days)</h3>
          <div className="h-72 flex flex-col">
            <div className="flex-1 relative px-4 pb-2">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 pr-2">
                {[...Array(5)].map((_, i) => {
                  const maxValue = Math.max(...last7Days.map(d => d.applicants));
                  const value = Math.round(maxValue - (maxValue / 4) * i);
                  return <span key={i}>{value}</span>;
                })}
              </div>
              
              {/* Graph area */}
              <div className="ml-8 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-t border-dark-border/50" />
                  ))}
                </div>
                
                {/* Line graph */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area under line */}
                  <path
                    d={(() => {
                      const maxValue = Math.max(...last7Days.map(d => d.applicants));
                      const points = last7Days.map((day, i) => {
                        const x = (i / (last7Days.length - 1)) * 100;
                        const y = 100 - (day.applicants / maxValue) * 100;
                        return `${x},${y}`;
                      }).join(' ');
                      const firstX = 0;
                      const lastX = 100;
                      return `M ${firstX},100 L ${points} L ${lastX},100 Z`;
                    })()}
                    fill="url(#areaGradient)"
                    vectorEffect="non-scaling-stroke"
                  />
                  
                  {/* Line */}
                  <polyline
                    points={(() => {
                      const maxValue = Math.max(...last7Days.map(d => d.applicants));
                      return last7Days.map((day, i) => {
                        const x = (i / (last7Days.length - 1)) * 100;
                        const y = 100 - (day.applicants / maxValue) * 100;
                        return `${x},${y}`;
                      }).join(' ');
                    })()}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                
                {/* Interactive hover areas with data points */}
                <div className="absolute inset-0 flex">
                  {last7Days.map((day, i) => {
                    const maxValue = Math.max(...last7Days.map(d => d.applicants));
                    const yPercent = 100 - (day.applicants / maxValue) * 100;
                    return (
                      <div key={i} className="flex-1 relative group cursor-pointer">
                        {/* Data point circle */}
                        <div 
                          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-primary-500 border-2 border-dark-card rounded-full group-hover:w-4 group-hover:h-4 transition-all"
                          style={{ top: `${yPercent}%`, transform: 'translate(-50%, -50%)' }}
                        />
                        {/* Tooltip on hover */}
                        <div 
                          className="absolute left-1/2 -translate-x-1/2 bg-dark-card border border-primary-500 px-3 py-2 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10 pointer-events-none"
                          style={{ top: `${yPercent}%`, transform: 'translate(-50%, calc(-100% - 12px))' }}
                        >
                          <div className="font-semibold text-primary-400">{day.applicants} applicants</div>
                          <div className="text-slate-400 text-[10px] mt-0.5">{day.date}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between gap-3 px-4 ml-8 pt-3 border-t border-dark-border">
              {last7Days.map((day, i) => (
                <div key={i} className="flex-1 text-center">
                  <span className="text-xs text-slate-400">{day.date}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Application Status Distribution</h3>
            <div className="space-y-3">
              {[
                { label: 'Applied', count: allApplicants.filter(a => a.status === 'APPLIED').length, color: 'bg-slate-500' },
                { label: 'Shortlisted', count: allApplicants.filter(a => a.status === 'SHORTLISTED').length, color: 'bg-yellow-500' },
                { label: 'Interview', count: allApplicants.filter(a => a.status === 'INTERVIEW').length, color: 'bg-blue-500' },
                { label: 'Selected', count: allApplicants.filter(a => a.status === 'SELECTED').length, color: 'bg-green-500' },
                { label: 'Rejected', count: allApplicants.filter(a => a.status === 'REJECTED').length, color: 'bg-red-500' },
              ].map(({ label, count, color }) => {
                const total = allApplicants.length || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-white font-medium">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-dark-hover rounded-full h-2">
                      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-white mb-4">Top Performing Jobs</h3>
            <div className="space-y-3">
              {jobs
                .sort((a, b) => (b.applicantCount || 0) - (a.applicantCount || 0))
                .slice(0, 5)
                .map((job, i) => (
                  <div key={job.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{job.title}</p>
                      <p className="text-slate-400 text-xs">{job.applicantCount || 0} applicants</p>
                    </div>
                  </div>
                ))}
              {jobs.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No jobs posted yet</p>}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Company Profile</h2>
      <Card>
        <form className="space-y-5" onSubmit={saveProfile}>
          {profileSuccess && <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg">{profileSuccess}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Company Name', key: 'companyName', type: 'text' },
              { label: 'Website', key: 'website', type: 'url' },
              { label: 'HR Name', key: 'hrName', type: 'text' },
              { label: 'HR Email', key: 'hrEmail', type: 'email' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                <input type={type} value={editProfileForm[key] || ''}
                  onChange={e => setEditProfileForm(p => ({ ...p, [key]: e.target.value }))}
                  className={inputCls} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Company Description</label>
            <textarea rows="4" value={editProfileForm.description || ''}
              onChange={e => setEditProfileForm(p => ({ ...p, description: e.target.value }))}
              className={inputCls} />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">Save Changes</button>
          </div>
        </form>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'jobs': return renderJobs();
      case 'post-job': return renderPostJob();
      case 'applicants': return renderApplicants();
      case 'analytics': return renderAnalytics();
      case 'profile': return renderProfile();
      case 'shortlisted': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Shortlisted Candidates</h2>
          {applicants.filter(a => a.status === 'SHORTLISTED').length === 0 ? (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Shortlisted candidates will appear here</p>
              <button onClick={() => setActiveTab('applicants')} className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg">View Applicants</button>
            </Card>
          ) : (
            <div className="space-y-4">
              {applicants.filter(a => a.status === 'SHORTLISTED').map(a => (
                <Card key={a.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{a.studentName}</h3>
                      <div className="flex gap-4 text-slate-400 text-sm mt-1">
                        <span>CGPA: {a.cgpa}</span>
                        <span>{a.department}</span>
                        <span>Applied: {new Date(a.appliedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {a.skills?.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-dark-hover border border-dark-border text-slate-400 text-xs rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                    <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}
                      className="px-3 py-1.5 bg-dark-hover border border-dark-border text-slate-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      {['SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
      case 'interviews': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Interview Schedule</h2>
          {applicants.filter(a => a.status === 'INTERVIEW').length === 0 ? (
            <Card>
              <h3 className="font-semibold text-white mb-4">Upcoming Interviews</h3>
              <p className="text-slate-400 text-sm mb-4">Schedule and manage candidate interviews</p>
              <button onClick={() => setActiveTab('applicants')} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">View Applicants</button>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card><p className="text-sm text-slate-400">Scheduled</p><p className="text-2xl font-bold text-blue-400">{applicants.filter(a => a.status === 'INTERVIEW').length}</p></Card>
                <Card><p className="text-sm text-slate-400">This Week</p><p className="text-2xl font-bold text-yellow-400">{applicants.filter(a => a.status === 'INTERVIEW').length}</p></Card>
                <Card><p className="text-sm text-slate-400">Completed</p><p className="text-2xl font-bold text-green-400">{applicants.filter(a => a.status === 'SELECTED').length}</p></Card>
              </div>
              {applicants.filter(a => a.status === 'INTERVIEW').map(a => (
                <Card key={a.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{a.studentName}</h3>
                      <div className="flex gap-4 text-slate-400 text-sm mt-1">
                        <span>CGPA: {a.cgpa}</span>
                        <span>{a.department}</span>
                      </div>
                    </div>
                    <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}
                      className="px-3 py-1.5 bg-dark-hover border border-dark-border text-slate-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      {['INTERVIEW', 'SELECTED', 'REJECTED'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
      case 'selected': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Selected Candidates ({allApplicants.filter(a => a.status === 'SELECTED').length})</h2>
          {loading ? <Spinner /> : allApplicants.filter(a => a.status === 'SELECTED').length === 0 ? (
            <Card className="text-center py-12">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Selected candidates will appear here</p>
              <button onClick={() => setActiveTab('applicants')} className="mt-4 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg">View Applicants</button>
            </Card>
          ) : (
            <div className="space-y-4">
              {allApplicants.filter(a => a.status === 'SELECTED').map(a => (
                <Card key={a.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{a.studentName}</h3>
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">SELECTED</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">Applied for: {a.jobTitle}</p>
                      <div className="flex gap-4 text-slate-400 text-sm">
                        <span>CGPA: {a.studentCgpa}</span>
                        <span>{a.studentDepartment}</span>
                        <span>Email: {a.studentEmail}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
      case 'reports': return (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Hiring Reports</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Jobs" value={jobs.length} color="text-primary-400" />
            <StatCard label="Total Applicants" value={allApplicants.length} color="text-blue-400" />
            <StatCard label="Selected" value={allApplicants.filter(a => a.status === 'SELECTED').length} color="text-green-400" />
          </div>
          <Card>
            <h3 className="font-semibold text-white mb-4">Generate Reports</h3>
            <div className="space-y-3">
              <button onClick={() => {
                const csv = 'Name,Email,CGPA,Department,Job,Status,Applied Date\n' + allApplicants.map(a => `${a.studentName},${a.studentEmail},${a.studentCgpa},${a.studentDepartment},${a.jobTitle},${a.status},${new Date(a.appliedAt).toLocaleDateString()}`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'applicant_report.csv';
                link.click();
              }} className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-left transition-colors">Download Applicant Report (CSV) - {allApplicants.length} records</button>
              <button onClick={() => alert('Generating interview report...')} className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-left transition-colors">Download Interview Report (PDF) - {allApplicants.filter(a => a.status === 'INTERVIEW').length} scheduled</button>
              <button onClick={() => alert('Generating hiring analytics...')} className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-left transition-colors">Download Hiring Analytics (Excel) - {jobs.length} jobs</button>
            </div>
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
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Message</label>
                <textarea rows="5" placeholder="Enter your message" value={contactForm.message}
                  onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  className={inputCls} />
              </div>
              <button onClick={async () => {
                if (!contactForm.subject || !contactForm.message) { alert('Please fill in all fields'); return; }
                try {
                  await companyAPI.contactAdmin(contactForm);
                  setContactForm({ subject: '', message: '' });
                  alert('Message sent to admin successfully!');
                } catch (e) { alert('Failed to send message'); }
              }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                <Send className="w-4 h-4" />Send Message
              </button>
            </div>
          </Card>
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="COMPANY" />
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

