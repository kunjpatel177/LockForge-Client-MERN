import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';

import Home from './pages/public/Home';
import Features from './pages/public/Features';
import Security from './pages/public/Security';
import About from './pages/public/About';
import UserGuide from './pages/public/UserGuide';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

import Dashboard from './pages/dashboard/Dashboard';
import Vault from './pages/dashboard/Vault';
import AddCredential, { EditCredential } from './pages/dashboard/CredentialForm';
import CredentialDetails from './pages/dashboard/CredentialDetails';
import Folders from './pages/dashboard/Folders';
import FolderDetail from './pages/dashboard/FolderDetail';
import Favorites from './pages/dashboard/Favorites';
import SecureNotes from './pages/dashboard/SecureNotes';
import PasswordGenerator from './pages/dashboard/PasswordGenerator';
import SecurityDashboard from './pages/dashboard/SecurityDashboard';
import Sessions from './pages/dashboard/Sessions';
import ActivityLogs from './pages/dashboard/ActivityLogs';
import BackupRestore from './pages/dashboard/BackupRestore';
import Trash from './pages/dashboard/Trash';
import Settings from './pages/dashboard/Settings';
import Profile from './pages/dashboard/Profile';
import ChangeMasterPassword from './pages/dashboard/ChangeMasterPassword';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/security" element={<Security />} />
              <Route path="/about" element={<About />} />
              <Route path="/guide" element={<UserGuide />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Route>
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/vault/add" element={<AddCredential />} />
              <Route path="/vault/:id" element={<CredentialDetails />} />
              <Route path="/vault/:id/edit" element={<EditCredential />} />
              <Route path="/folders" element={<Folders />} />
              <Route path="/folders/:id" element={<FolderDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/notes" element={<SecureNotes />} />
              <Route path="/generator" element={<PasswordGenerator />} />
              <Route path="/security-dashboard" element={<SecurityDashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/activity" element={<ActivityLogs />} />
              <Route path="/backup" element={<BackupRestore />} />
              <Route path="/trash" element={<Trash />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-master-password" element={<ChangeMasterPassword />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={4000} theme="colored" />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
