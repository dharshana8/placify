import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => {
    if (data instanceof FormData) {
      return api.put('/student/profile', data, {
        headers: { 'Content-Type': undefined }, // Let browser set multipart boundary
      });
    }
    return api.put('/student/profile', data);
  },
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/student/resume', formData, {
      headers: { 'Content-Type': undefined },
    });
  },
  getJobs: (filters) => api.get('/jobs', { params: filters }),
  applyJob: (jobId) => api.post(`/student/apply/${jobId}`),
  getApplications: () => api.get('/student/applications'),
  getNotifications: () => api.get('/student/notifications'),
  getUnreadCount: () => api.get('/student/notifications/unread-count'),
  markAsRead: (id) => api.put(`/student/notifications/${id}/read`),
  markAllAsRead: () => api.put('/student/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/student/notifications/${id}`),
  requestPermission: (data) => api.post('/student/request-permission', data),
  contactAdmin: (data) => api.post('/student/contact-admin', data),
  submitAchievement: (data) => api.post('/student/achievements', data),
  getMyAchievements: () => api.get('/student/achievements'),
  deleteAchievement: (id) => api.delete(`/student/achievements/${id}`),
};

export const companyAPI = {
  getJobs: () => api.get('/company/jobs'),
  createJob: (jobData) => api.post('/company/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/company/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/company/jobs/${id}`),
  getApplicants: (jobId, filters) => api.get(`/company/jobs/${jobId}/applicants`, { params: filters }),
  updateApplicationStatus: (jobId, applicationId, status) =>
    api.put(`/company/jobs/${jobId}/applicants/${applicationId}`, { status }),
  bulkUpdateStatus: (jobId, applicationIds, status) =>
    api.post(`/company/jobs/${jobId}/bulk-action`, { applicationIds, status }),
  getProfile: () => api.get('/company/profile'),
  updateProfile: (data) => api.put('/company/profile', data),
  getAnalytics: () => api.get('/company/analytics'),
  contactAdmin: (data) => api.post('/company/contact-admin', data),
  getEmailTemplates: () => api.get('/company/email-templates'),
  updateEmailTemplate: (templateId, subject, body) => api.put(`/company/email-templates/${templateId}`, { subject, body }),
  sendBulkEmail: (templateName, applicationIds) => api.post('/company/send-bulk-email', { templateName, applicationIds }),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getStudents: (filters) => api.get('/admin/students', { params: filters }),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  updateStudentPermission: (id, canApply) => api.put(`/admin/students/${id}/permission`, { canApply }),
  getCompanies: (filters) => api.get('/admin/companies', { params: filters }),
  deleteCompany: (id) => api.delete(`/admin/companies/${id}`),
  getPendingCompanies: () => api.get('/admin/companies/pending'),
  approveCompany: (id) => api.put(`/admin/companies/${id}/approve`),
  rejectCompany: (id) => api.put(`/admin/companies/${id}/reject`),
  getAllJobs: () => api.get('/admin/jobs'),
  getAllApplications: () => api.get('/admin/applications'),
  getPlacements: () => api.get('/admin/placements'),
  getDepartmentStats: () => api.get('/admin/department-stats'),
  getRiskStudents: () => api.get('/admin/risk-students'),
  sendAnnouncement: (message) => api.post('/admin/announcements', { message }),
  getAnnouncements: () => api.get('/announcements'),
  createAnnouncement: (data) => api.post('/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
  sendEmailCampaign: (data) => api.post('/email-campaigns', data),
  getEmailCampaigns: () => api.get('/email-campaigns'),
  fixDepartments: () => api.post('/admin/fix-departments'),
  seedCompaniesJobs: () => api.post('/admin/seed-data'),
};

export const departmentAPI = {
  getProfile: () => api.get('/department/info'),
  getStudents: (filters) => api.get('/department/students', { params: filters }),
  filterStudents: (filters) => api.get('/department/students/filter', { params: filters }),
  addStudentNote: (studentId, notes) => api.put(`/department/students/${studentId}/notes`, { notes }),
  updateStudentMarks: (studentId, mockScore, codingScore) =>
    api.put(`/department/students/${studentId}/marks`, { mockScore, codingScore }),
  recommendStudent: (studentId) => api.put(`/department/students/${studentId}/recommend`),
  uploadExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/department/upload-excel', formData, {
      headers: { 'Content-Type': undefined },
    });
  },
  getAnalytics: () => api.get('/department/analytics'),
  sendAnnouncement: (message) => api.post('/department/announcements', { message }),
  getPlacementDrives: () => api.get('/department/placement-drives'),
  createPlacementDrive: (data) => api.post('/department/placement-drives', data),
  deletePlacementDrive: (id) => api.delete(`/department/placement-drives/${id}`),
  getTrainingPrograms: () => api.get('/department/training-programs'),
  createTrainingProgram: (data) => api.post('/department/training-programs', data),
  deleteTrainingProgram: (id) => api.delete(`/department/training-programs/${id}`),
  getStudentGroups: () => api.get('/department/student-groups'),
  createStudentGroup: (data) => api.post('/department/student-groups', data),
  deleteStudentGroup: (id) => api.delete(`/department/student-groups/${id}`),
  getQuizzes: () => api.get('/department/quizzes'),
  createQuiz: (data) => api.post('/department/quizzes', data),
  deleteQuiz: (id) => api.delete(`/department/quizzes/${id}`),
  getQuizAttempts: (quizId) => api.get(`/department/quizzes/${quizId}/attempts`),
  getDepartmentAchievements: () => api.get('/department/achievements'),
  getPendingAchievements: () => api.get('/department/achievements/pending'),
  approveAchievement: (id, comments) => api.put(`/department/achievements/${id}/approve`, { comments }),
  rejectAchievement: (id, comments) => api.put(`/department/achievements/${id}/reject`, { comments }),
};

export const quizAPI = {
  getAvailableQuizzes: () => api.get('/student/quizzes'),
  getQuizQuestions: (quizId) => api.get(`/student/quizzes/${quizId}`),
  submitQuiz: (quizId, answers) => api.post(`/student/quizzes/${quizId}/submit`, { answers }),
  getMyAttempts: () => api.get('/student/quiz-attempts'),
};

export default api;