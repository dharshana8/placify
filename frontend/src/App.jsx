import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import DepartmentDashboard from './pages/department/DepartmentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-gray-600">You don't have permission to access this page.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected routes */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company" 
            element={
              <ProtectedRoute allowedRoles={['COMPANY']}>
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/department" 
            element={
              <ProtectedRoute allowedRoles={['DEPARTMENT']}>
                <DepartmentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;