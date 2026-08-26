import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';
import VaultUnlockModal from './VaultUnlockModal';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { vaultUnlocked } = useAuth();
  const [showUnlock, setShowUnlock] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-layout">
      <DashboardNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="dashboard-body">
        <Sidebar show={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div
            className="sidebar-overlay d-lg-none"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <main className="dashboard-content">
          {!vaultUnlocked && (
            <div className="alert alert-warning vault-lock-banner d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <span><i className="fas fa-lock me-2" /><strong>Vault locked.</strong> Unlock to access and manage your credentials.</span>
              <button type="button" className="btn btn-warning btn-modern btn-sm" onClick={() => setShowUnlock(true)}>
                <i className="fas fa-unlock-keyhole me-1" />Unlock Vault
              </button>
            </div>
          )}
          <Outlet context={{ vaultUnlocked, requestUnlock: () => setShowUnlock(true) }} />
        </main>
      </div>
      <VaultUnlockModal show={showUnlock} onClose={() => setShowUnlock(false)} />
    </div>
  );
};

export default DashboardLayout;
