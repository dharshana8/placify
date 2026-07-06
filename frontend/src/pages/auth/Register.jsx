import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, GraduationCap, Building2, BookOpen, ShieldCheck, CheckCircle } from 'lucide-react';
import logo from '../../assets/placify-logo.jpeg';

const ROLE_META = {
  STUDENT: { icon: GraduationCap, label: 'Student', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/30', desc: 'Browse jobs, apply & track applications' },
  COMPANY: { icon: Building2, label: 'Company / Recruiter', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/30', desc: 'Post jobs, manage applicants & hire talent' },
  DEPARTMENT: { icon: BookOpen, label: 'Department Staff', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/30', desc: 'Manage department students & analytics' },
  ADMIN: { icon: ShieldCheck, label: 'Admin / Placement Cell', color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/30', desc: 'Full platform control & oversight' },
};

const DEPARTMENTS = ['CSE', 'CSE(CY)', 'AIDS', 'AIML', 'IT', 'CCE', 'ECE', 'EEE', 'CSBS', 'MECH'];

const detectRole = (email) => {
  if (!email || !email.includes('@')) return null;
  const [local, domain] = email.toLowerCase().split('@');
  if (!domain) return null;
  if (domain === 'sece.ac.in') {
    if (local === 'placementcell') return 'ADMIN';
    if (/^(hod\.|dept\.)/.test(local)) return 'DEPARTMENT';
    return 'STUDENT';
  }
  return 'COMPANY';
};

const extractDept = (email) => {
  if (!email || !email.includes('@')) return '';
  const local = email.toLowerCase().split('@')[0];
  // extract dept from email e.g. dharshana.s2024csbs -> CSBS
  const deptMatch = local.match(/(\d{4})([a-z]+)$/);
  if (deptMatch) return deptMatch[2].toUpperCase();
  const hodMatch = local.match(/^(?:hod|dept)\.(.+)$/);
  if (hodMatch) return hodMatch[1].toUpperCase();
  return '';
};

const inputCls = 'w-full px-4 py-3 bg-dark-hover border border-dark-border text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-slate-500 text-sm';
const selectCls = 'w-full px-4 py-3 bg-dark-hover border border-dark-border text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm';
const labelCls = 'block text-sm font-medium text-slate-300 mb-1.5';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: '', department: '', companyName: '', rollNumber: '',
    year: '', semester: '', phone: '',
  });
  const [detectedRole, setDetectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const role = detectRole(formData.email);
    setDetectedRole(role);
    const dept = extractDept(formData.email);
    setFormData(prev => ({ ...prev, role: role || '', department: dept || prev.department }));
  }, [formData.email]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) { setError('Enter a valid email so we can detect your role'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (detectedRole === 'STUDENT' && !formData.department) { setError('Please select your department'); return; }
    if (detectedRole === 'STUDENT' && !formData.year) { setError('Please select your year'); return; }
    if (detectedRole === 'STUDENT' && !formData.semester) { setError('Please select your semester'); return; }
    setLoading(true);
    setError('');
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        departmentName: formData.department,
        companyName: formData.companyName,
        rollNumber: formData.rollNumber,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Registration failed. Try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const roleMeta = detectedRole ? ROLE_META[detectedRole] : null;
  const RoleIcon = roleMeta?.icon;

  if (success) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-slate-400 text-sm mt-1">
            {detectedRole === 'STUDENT' && 'Please upload your resume after logging in to apply for jobs.'}
          </p>
          <p className="text-slate-500 text-sm mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 bg-white rounded-2xl p-6">
            <img src={logo} alt="Placify" className="w-32 h-32 object-cover object-left" style={{objectPosition: 'left center', maxWidth: '120px'}} />
          </div>
          <p className="text-slate-400 mt-1 text-sm">Campus Placement Management System</p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-1">Create your account</h2>
          <p className="text-slate-400 text-sm mb-6">Role is auto-detected — use <span className="text-slate-300">@sece.ac.in</span> for college accounts</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-5 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className={labelCls}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputCls} placeholder="Your full name" />
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="e.g. name@sece.ac.in or hr@company.com" />
            </div>

            {/* Role badge */}
            {roleMeta && (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${roleMeta.bg}`}>
                <RoleIcon className={`w-5 h-5 ${roleMeta.color} shrink-0`} />
                <div>
                  <p className={`text-sm font-semibold ${roleMeta.color}`}>{roleMeta.label}</p>
                  <p className="text-xs text-slate-400">{roleMeta.desc}</p>
                </div>
                <span className="ml-auto text-xs text-slate-500 bg-dark-bg px-2 py-0.5 rounded-full">Auto-detected</span>
              </div>
            )}

            {/* STUDENT fields */}
            {detectedRole === 'STUDENT' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Roll Number *</label>
                    <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required className={inputCls} placeholder="e.g. 24CB012" />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="e.g. 9876543210" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Department *</label>
                  <select name="department" value={formData.department} onChange={handleChange} required className={selectCls}>
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Year *</label>
                    <select name="year" value={formData.year} onChange={handleChange} required className={selectCls}>
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Semester *</label>
                    <select name="semester" value={formData.semester} onChange={handleChange} required className={selectCls}>
                      <option value="">Select Semester</option>
                      {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                  <span className="text-primary-400 text-xs mt-0.5">ℹ</span>
                  <p className="text-primary-300 text-xs">After registering, you must upload your resume before applying to any job.</p>
                </div>
              </>
            )}

            {/* COMPANY fields */}
            {detectedRole === 'COMPANY' && (
              <div>
                <label className={labelCls}>Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputCls} placeholder="Your company name" />
              </div>
            )}

            {/* DEPARTMENT fields */}
            {detectedRole === 'DEPARTMENT' && (
              <div>
                <label className={labelCls}>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className={inputCls} placeholder="e.g. CSBS" />
              </div>
            )}

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required className={`${inputCls} pr-12`} placeholder="Min. 6 characters" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelCls}>Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                  className={`${inputCls} pr-12 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500/50' : ''}`}
                  placeholder="Re-enter password" autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords don't match</p>
              )}
            </div>

            <button type="submit" disabled={loading || !detectedRole}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
