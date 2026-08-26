import { useEffect, useState } from 'react';
import { userAPI } from '../api';
import { handleApiError } from '../api/axios';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';
import PasswordInput from './PasswordInput';

const METHOD_LABELS = {
  totp: 'Authenticator App',
  email: 'Email OTP',
};

const formatMethodsLabel = (methods = []) => {
  if (!methods.length) return 'Disabled';
  return methods.map((m) => METHOD_LABELS[m] || m).join(' + ');
};

const TwoFactorSettings = ({ enabled: initialEnabled, onStatusChange }) => {
  const [enabled, setEnabled] = useState(!!initialEnabled);
  const [activeMethods, setActiveMethods] = useState([]);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [selectedMethods, setSelectedMethods] = useState({ totp: true, email: false });
  const [mode, setMode] = useState('idle');
  const [manageMethod, setManageMethod] = useState(null);
  const [setupData, setSetupData] = useState(null);
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disableStep, setDisableStep] = useState('password');
  const [loading, setLoading] = useState(false);

  const chosenMethods = Object.entries(selectedMethods)
    .filter(([, on]) => on)
    .map(([method]) => method);

  const hasEmailActive = activeMethods.includes('email');
  const hasTotpActive = activeMethods.includes('totp');
  const hasBothActive = hasEmailActive && hasTotpActive;

  useEffect(() => {
    setEnabled(!!initialEnabled);
  }, [initialEnabled]);

  useEffect(() => {
    refreshStatus().catch(() => {});
  }, []);

  const refreshStatus = async () => {
    const res = await userAPI.getTwoFactorStatus();
    const isEnabled = !!res.data.data.enabled;
    const methods = res.data.data.methods || [];
    setMaskedEmail(res.data.data.maskedEmail || '');
    setActiveMethods(methods);
    setEnabled(isEnabled);
    onStatusChange?.(isEnabled);
    return isEnabled;
  };

  const resetFlow = () => {
    setMode('idle');
    setManageMethod(null);
    setSetupData(null);
    setPassword('');
    setTotpCode('');
    setEmailCode('');
    setVerifyCode('');
    setSelectedMethods({ totp: true, email: false });
  };

  const toggleMethod = (method) => {
    setSelectedMethods((prev) => {
      const next = { ...prev, [method]: !prev[method] };
      if (!next.totp && !next.email) return prev;
      return next;
    });
  };

  const startInitialSetup = async () => {
    if (!password.trim()) {
      toast.error('Enter your account password to continue');
      return;
    }
    if (!chosenMethods.length) {
      toast.error('Select at least one verification method');
      return;
    }
    setLoading(true);
    try {
      const res = await userAPI.setupTwoFactor(password, chosenMethods);
      setSetupData(res.data.data);
      setMode('initial-verify');
      setTotpCode('');
      setEmailCode('');
      if (chosenMethods.includes('email')) setMaskedEmail(res.data.data.maskedEmail || maskedEmail);
      toast.success(chosenMethods.length > 1
        ? 'Scan the QR code and check your email for codes'
        : chosenMethods.includes('email')
          ? 'Verification code sent to your email'
          : 'Scan the QR code with your authenticator app');
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const confirmInitialEnable = async () => {
    if (!password) {
      toast.error('Enter your account password');
      return;
    }
    if (chosenMethods.includes('totp') && totpCode.length !== 6) {
      toast.error('Enter the 6-digit authenticator code');
      return;
    }
    if (chosenMethods.includes('email') && emailCode.length !== 6) {
      toast.error('Enter the 6-digit email verification code');
      return;
    }
    setLoading(true);
    try {
      await userAPI.enableTwoFactor({
        password,
        methods: chosenMethods,
        totpToken: chosenMethods.includes('totp') ? totpCode : undefined,
        emailToken: chosenMethods.includes('email') ? emailCode : undefined,
      });
      await refreshStatus();
      resetFlow();
      toast.success('Two-factor authentication enabled');
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const startAddMethod = async (method) => {
    if (!password.trim()) {
      toast.error('Enter your account password');
      return;
    }
    setLoading(true);
    try {
      const res = await userAPI.setupAddMethod(password, method);
      setManageMethod(method);
      setSetupData(res.data.data);
      setMode('add-verify');
      setTotpCode('');
      setEmailCode('');
      if (method === 'email') setMaskedEmail(res.data.data.maskedEmail || maskedEmail);
      toast.success(method === 'email' ? 'Verification code sent to your email' : 'Scan the QR code with your authenticator app');
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const confirmAddMethod = async () => {
    if (!password.trim()) {
      toast.error('Enter your account password');
      return;
    }
    if (manageMethod === 'totp' && totpCode.length !== 6) {
      toast.error('Enter the 6-digit authenticator code');
      return;
    }
    if (manageMethod === 'email' && emailCode.length !== 6) {
      toast.error('Enter the 6-digit email verification code');
      return;
    }
    setLoading(true);
    try {
      await userAPI.confirmAddMethod({
        password,
        method: manageMethod,
        totpToken: manageMethod === 'totp' ? totpCode : undefined,
        emailToken: manageMethod === 'email' ? emailCode : undefined,
      });
      await refreshStatus();
      resetFlow();
      toast.success(`${METHOD_LABELS[manageMethod]} added`);
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const startRemoveMethod = async (method) => {
    if (!password.trim()) {
      toast.error('Enter your account password');
      return;
    }
    setLoading(true);
    try {
      const res = await userAPI.requestRemoveMethod(password, method);
      if (res.data.data.maskedEmail) setMaskedEmail(res.data.data.maskedEmail);
      setManageMethod(method);
      setMode('remove-verify');
      setVerifyCode('');
      if (hasEmailActive) toast.success('Verification code sent to your email');
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const confirmRemoveMethod = async () => {
    if (!password.trim() || verifyCode.length !== 6) {
      toast.error('Enter your password and 6-digit verification code');
      return;
    }
    setLoading(true);
    try {
      const res = await userAPI.removeMethod({ password, method: manageMethod, token: verifyCode });
      await refreshStatus();
      resetFlow();
      toast.success(res.data.message);
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const openDisableModal = () => {
    setDisableStep('password');
    setPassword('');
    setVerifyCode('');
    setShowDisableModal(true);
  };

  const closeDisableModal = () => {
    if (loading) return;
    setShowDisableModal(false);
    setDisableStep('password');
    setVerifyCode('');
  };

  const requestDisableCode = async () => {
    if (!password.trim()) {
      toast.error('Enter your account password');
      return;
    }
    setLoading(true);
    try {
      const res = await userAPI.requestDisableTwoFactor(password);
      if (res.data.data.maskedEmail) setMaskedEmail(res.data.data.maskedEmail);
      setDisableStep('verify');
      setVerifyCode('');
      if (hasEmailActive) toast.success('Verification code sent to your email');
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDisableAll = async () => {
    if (!password.trim() || verifyCode.length !== 6) {
      toast.error('Enter your password and 6-digit verification code');
      return;
    }
    setLoading(true);
    try {
      await userAPI.disableTwoFactor({ token: verifyCode, password });
      await refreshStatus();
      closeDisableModal();
      resetFlow();
      toast.success('Two-factor authentication disabled');
    } catch (err) {
      toast.error(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const renderAddVerifyFields = () => {
    if (manageMethod === 'totp') {
      return (
        <>
          <p className="small text-muted mb-3">Scan this QR code with your authenticator app.</p>
          <div className="text-center mb-3">
            <img src={setupData?.qrCodeDataUrl} alt="2FA QR code" className="two-factor-qr" />
          </div>
          <div className="mb-3">
            <label className="form-label small">Manual entry key</label>
            <input type="text" className="form-control form-control-sm font-monospace" value={setupData?.secret || ''} readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Authenticator Code</label>
            <input
              type="text"
              className="form-control"
              inputMode="numeric"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
            />
          </div>
        </>
      );
    }
    return (
      <>
        {maskedEmail && (
          <div className="two-factor-email-hint text-center mb-3">
            <small className="text-muted d-block">Email code sent to</small>
            <strong>{maskedEmail}</strong>
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Email Verification Code</label>
          <input
            type="text"
            className="form-control"
            inputMode="numeric"
            maxLength={6}
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
          />
        </div>
      </>
    );
  };

  return (
    <div className="two-factor-settings">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <div>
          <div className="fw-semibold">Two-Factor Authentication</div>
          <small className="text-muted">Enable one method, both, or turn off entirely</small>
        </div>
        <span className={`badge ${enabled ? 'bg-success' : 'bg-secondary'}`}>
          {enabled ? formatMethodsLabel(activeMethods) : 'Disabled'}
        </span>
      </div>

      {!enabled && mode === 'idle' && (
        <div className="two-factor-setup border rounded p-3">
          <div className="mb-3">
            <label className="form-label">Verification methods</label>
            <div className="d-flex flex-column gap-2">
              <label className="two-factor-method-option">
                <input type="checkbox" checked={selectedMethods.totp} onChange={() => toggleMethod('totp')} />
                <span>
                  <strong>Authenticator App</strong>
                  <small className="d-block text-muted">Google Authenticator, Authy, etc.</small>
                </span>
              </label>
              <label className="two-factor-method-option">
                <input type="checkbox" checked={selectedMethods.email} onChange={() => toggleMethod('email')} />
                <span>
                  <strong>Email OTP</strong>
                  <small className="d-block text-muted">Code sent to your registered email</small>
                </span>
              </label>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Account Password</label>
            <PasswordInput
              className="form-control form-control-modern"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Confirm with your password"
            />
          </div>
          <button type="button" className="btn btn-primary btn-modern" onClick={startInitialSetup} disabled={loading}>
            {loading ? 'Please wait...' : 'Enable 2FA'}
          </button>
        </div>
      )}

      {mode === 'initial-verify' && (
        <div className="two-factor-setup border rounded p-3">
          {chosenMethods.includes('totp') && setupData?.qrCodeDataUrl && (
            <>
              <p className="small text-muted mb-3">Scan this QR code with your authenticator app.</p>
              <div className="text-center mb-3">
                <img src={setupData.qrCodeDataUrl} alt="2FA QR code" className="two-factor-qr" />
              </div>
              <div className="mb-3">
                <label className="form-label small">Manual entry key</label>
                <input type="text" className="form-control form-control-sm font-monospace" value={setupData.secret || ''} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Authenticator Code</label>
                <input
                  type="text"
                  className="form-control"
                  inputMode="numeric"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                />
              </div>
            </>
          )}
          {chosenMethods.includes('email') && maskedEmail && (
            <div className="two-factor-email-hint text-center mb-3">
              <small className="text-muted d-block">Email code sent to</small>
              <strong>{maskedEmail}</strong>
            </div>
          )}
          {chosenMethods.includes('email') && (
            <div className="mb-3">
              <label className="form-label">Email Verification Code</label>
              <input
                type="text"
                className="form-control"
                inputMode="numeric"
                maxLength={6}
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
            </div>
          )}
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-primary btn-modern" onClick={confirmInitialEnable} disabled={loading}>
              {loading ? 'Enabling...' : 'Confirm & Enable'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={resetFlow} disabled={loading}>Cancel</button>
          </div>
        </div>
      )}

      {enabled && mode === 'idle' && (
        <div className="two-factor-manage border rounded p-3">
          <p className="small text-muted mb-3">Manage your active verification methods.</p>
          <div className="d-flex flex-column gap-2 mb-3">
            {['totp', 'email'].map((method) => (
              <div key={method} className="two-factor-active-method d-flex align-items-center justify-content-between gap-2 p-2 rounded">
                <div className="d-flex align-items-center gap-2">
                  <i className={`fas ${method === 'totp' ? 'fa-mobile-screen-button' : 'fa-envelope'} text-primary`} />
                  <span className="fw-medium">{METHOD_LABELS[method]}</span>
                </div>
                <span className={`badge ${activeMethods.includes(method) ? 'bg-success' : 'bg-secondary'}`}>
                  {activeMethods.includes(method) ? 'Active' : 'Off'}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Account Password</label>
            <PasswordInput
              className="form-control form-control-modern"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Required for changes"
            />
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            {!hasTotpActive && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => startAddMethod('totp')} disabled={loading}>
                <i className="fas fa-plus me-1" />Add Authenticator
              </button>
            )}
            {!hasEmailActive && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => startAddMethod('email')} disabled={loading}>
                <i className="fas fa-plus me-1" />Add Email OTP
              </button>
            )}
            {hasTotpActive && (
              <button type="button" className="btn btn-ghost btn-sm text-danger" onClick={() => startRemoveMethod('totp')} disabled={loading}>
                <i className="fas fa-minus me-1" />Remove Authenticator
              </button>
            )}
            {hasEmailActive && (
              <button type="button" className="btn btn-ghost btn-sm text-danger" onClick={() => startRemoveMethod('email')} disabled={loading}>
                <i className="fas fa-minus me-1" />Remove Email OTP
              </button>
            )}
          </div>

          <button type="button" className="btn btn-outline-danger btn-modern w-100" onClick={openDisableModal} disabled={loading}>
            Disable All 2FA
          </button>
        </div>
      )}

      {mode === 'add-verify' && manageMethod && (
        <div className="two-factor-setup border rounded p-3">
          <p className="fw-semibold mb-3">Add {METHOD_LABELS[manageMethod]}</p>
          {renderAddVerifyFields()}
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-primary btn-modern" onClick={confirmAddMethod} disabled={loading}>
              {loading ? 'Adding...' : 'Confirm'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={resetFlow} disabled={loading}>Cancel</button>
          </div>
        </div>
      )}

      {mode === 'remove-verify' && manageMethod && (
        <div className="two-factor-setup border rounded p-3">
          <p className="fw-semibold mb-2">Remove {METHOD_LABELS[manageMethod]}</p>
          <p className="small text-muted mb-3">
            {activeMethods.length === 1
              ? 'This is your only method. Removing it will disable 2FA entirely.'
              : hasBothActive
                ? 'Enter a code from your email or authenticator app to confirm.'
                : 'Enter your verification code to confirm.'}
          </p>
          {hasEmailActive && maskedEmail && (
            <div className="two-factor-email-hint text-center mb-3">
              <small className="text-muted d-block">Email code sent to</small>
              <strong>{maskedEmail}</strong>
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Verification Code</label>
            <input
              type="text"
              className="form-control"
              inputMode="numeric"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
            />
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-danger btn-modern" onClick={confirmRemoveMethod} disabled={loading}>
              {loading ? 'Removing...' : 'Confirm Remove'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={resetFlow} disabled={loading}>Cancel</button>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showDisableModal}
        title="Disable All Two-Factor Authentication"
        message={
          disableStep === 'password'
            ? hasEmailActive
              ? 'Enter your password to receive a verification code.'
              : 'Enter your password, then your authenticator code on the next step.'
            : hasBothActive
              ? 'Enter a code from your email or authenticator app to disable all 2FA.'
              : hasEmailActive
                ? 'Enter the email verification code to disable all 2FA.'
                : 'Enter your authenticator code to disable all 2FA.'
        }
        confirmLabel={disableStep === 'password' ? (hasEmailActive ? 'Send email code' : 'Continue') : 'Disable All 2FA'}
        variant="danger"
        icon="fa-shield-halved"
        loading={loading}
        onClose={closeDisableModal}
        onConfirm={disableStep === 'password' ? requestDisableCode : confirmDisableAll}
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="disable-all-password">Account Password</label>
          <PasswordInput
            id="disable-all-password"
            className="form-control form-control-modern"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoFocus={disableStep === 'password'}
          />
        </div>
        {disableStep === 'verify' && (
          <>
            {hasEmailActive && maskedEmail && (
              <div className="two-factor-email-hint text-center mb-3">
                <small className="text-muted d-block">Code sent to</small>
                <strong>{maskedEmail}</strong>
              </div>
            )}
            <div className="mb-0">
              <label className="form-label" htmlFor="disable-all-code">Verification Code</label>
              <input
                id="disable-all-code"
                type="text"
                className="form-control form-control-modern"
                inputMode="numeric"
                maxLength={6}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
              />
            </div>
          </>
        )}
      </ConfirmModal>
    </div>
  );
};

export default TwoFactorSettings;
