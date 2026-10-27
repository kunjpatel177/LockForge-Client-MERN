import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded public pages for fast initial bundle loading
const Home = lazy(() => import('./pages/public/Home'));
const Features = lazy(() => import('./pages/public/Features'));
const Security = lazy(() => import('./pages/public/Security'));
const About = lazy(() => import('./pages/public/About'));
const UserGuide = lazy(() => import('./pages/public/UserGuide'));

// Lazy-loaded auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const VerifyEmailChange = lazy(() => import('./pages/auth/VerifyEmailChange'));

// Lazy-loaded dashboard pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Vault = lazy(() => import('./pages/dashboard/Vault'));
const AddCredential = lazy(() => import('./pages/dashboard/CredentialForm'));
const EditCredential = lazy(() =>
  import('./pages/dashboard/CredentialForm').then((m) => ({ default: m.EditCredential }))
);
const CredentialDetails = lazy(() => import('./pages/dashboard/CredentialDetails'));
const Folders = lazy(() => import('./pages/dashboard/Folders'));
const FolderDetail = lazy(() => import('./pages/dashboard/FolderDetail'));
const Favorites = lazy(() => import('./pages/dashboard/Favorites'));
const SecureNotes = lazy(() => import('./pages/dashboard/SecureNotes'));
const PasswordGenerator = lazy(() => import('./pages/dashboard/PasswordGenerator'));
const SecurityDashboard = lazy(() => import('./pages/dashboard/SecurityDashboard'));
const Sessions = lazy(() => import('./pages/dashboard/Sessions'));
const ActivityLogs = lazy(() => import('./pages/dashboard/ActivityLogs'));
const BackupRestore = lazy(() => import('./pages/dashboard/BackupRestore'));
const Trash = lazy(() => import('./pages/dashboard/Trash'));
const HiddenItems = lazy(() => import('./pages/dashboard/HiddenItems'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const ChangeMasterPassword = lazy(() => import('./pages/dashboard/ChangeMasterPassword'));

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<LoadingSpinner fullPage />}>
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
                <Route path="/verify-email-change" element={<VerifyEmailChange />} />
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
                <Route path="/hidden" element={<HiddenItems />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-master-password" element={<ChangeMasterPassword />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <ToastContainer position="top-right" autoClose={4000} theme="colored" />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
