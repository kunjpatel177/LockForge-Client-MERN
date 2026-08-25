import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';
import VaultUnlockModal from './VaultUnlockModal';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { vaultUnlocked } = useAuth();
  const [showUnlock, setShowUnlock] = useState(false);

  return (
    <div className="dashboard-layout">
      <DashboardNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="dashboard-body">
        <Sidebar show={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && <div className="sidebar-overlay d-lg-none" onClick={() => setSidebarOpen(false)} />}
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
