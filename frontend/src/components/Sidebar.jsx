import React from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/placify-logo.jpeg';
import {
  Home, Users, Building2, Briefcase, FileText, BarChart3,
  MessageSquare, Settings, LogOut, GraduationCap, UserCheck,
  Clock, CheckCircle, Upload, Bell, Zap, Brain, TrendingUp, Calendar, ClipboardList, Award
} from 'lucide-react';

const MENUS = {
  STUDENT: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Browse Jobs', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'interview-schedule', label: 'Interview Schedule', icon: Clock },
    { id: 'placement-prep', label: 'Placement Prep', icon: GraduationCap },
    { id: 'quizzes', label: 'Quizzes', icon: ClipboardList },
    { id: 'achievements', label: 'My Achievements', icon: Award },
    { id: 'peer-comparison', label: 'Peer Comparison', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: Settings },
  ],
  COMPANY: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'post-job', label: 'Post Job', icon: FileText },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'shortlisted', label: 'Shortlisted', icon: UserCheck },
    { id: 'interviews', label: 'Interview Schedule', icon: Clock },
    { id: 'selected', label: 'Selected Candidates', icon: CheckCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Hiring Reports', icon: FileText },
    { id: 'profile', label: 'Company Profile', icon: Settings },
  ],
  DEPARTMENT: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'placement-drive', label: 'Placement Drives', icon: Briefcase },
    { id: 'training-programs', label: 'Training Programs', icon: GraduationCap },
    { id: 'quizzes', label: 'Quizzes', icon: ClipboardList },
    { id: 'achievements', label: 'Student Achievements', icon: Award },
    { id: 'performance-tracking', label: 'Performance Tracking', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'announcements', label: 'Announcements', icon: Bell },
  ],
  ADMIN: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'pending', label: 'Pending Approvals', icon: Clock },
    { id: 'jobs', label: 'All Jobs', icon: Briefcase },
    { id: 'placements', label: 'Placements', icon: CheckCircle },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'placement-calendar', label: 'Placement Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'system-settings', label: 'System Settings', icon: Settings },
    { id: 'announcements', label: 'Announcements', icon: Bell },
  ],
};

const ROLE_COLORS = {
  STUDENT: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  COMPANY: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  DEPARTMENT: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  ADMIN: 'text-green-400 bg-green-500/10 border-green-500/30',
};

const Sidebar = ({ activeTab, setActiveTab, role }) => {
  const { logout, user } = useAuth();
  const items = MENUS[role] || [];

  return (
    <div className="w-64 bg-dark-card border-r border-dark-border h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-dark-border">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-white rounded-lg p-2">
            <img src={logo} alt="Placify" className="w-12 h-12 object-cover object-left" style={{objectPosition: 'left center'}} />
          </div>
        </div>
        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full border ${ROLE_COLORS[role]}`}>
          {role}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                : 'text-slate-400 hover:bg-dark-hover hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-dark-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
