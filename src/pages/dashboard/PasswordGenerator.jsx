import { useState } from 'react';
import { securityAPI } from '../../api';
import { handleApiError } from '../../api/axios';
import { toast } from 'react-toastify';
import DashboardPageHeader from '../../components/DashboardPageHeader';
import PasswordReveal from '../../components/PasswordReveal';

const PasswordGenerator = () => {
  const [options, setOptions] = useState({
    length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: false,
  });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await securityAPI.generatePassword(options);
      setPassword(res.data.data.password);
      setStrength(res.data.data.strength);
    } catch (err) { toast.error(handleApiError(err).message); }
    finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
    toast.success('Password copied!');
  };

  const strengthColors = ['danger', 'danger', 'warning', 'info', 'success', 'success'];

  return (
    <div>
      <DashboardPageHeader
        icon="fa-wand-magic-sparkles"
        title="Password Generator"
        subtitle="Create strong, unique passwords with customizable options"
      />

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="generator-panel">
            <h5 className="fw-bold mb-3"><i className="fas fa-sliders text-primary me-2" />Options</h5>
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <label className="form-label mb-0">Password Length</label>
                <span className="dash-badge primary">{options.length} chars</span>
              </div>
              <input type="range" className="form-range" min="8" max="64" value={options.length} onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })} />
            </div>
            {[
              { key: 'uppercase', label: 'Uppercase (A-Z)' },
              { key: 'lowercase', label: 'Lowercase (a-z)' },
              { key: 'numbers', label: 'Numbers (0-9)' },
              { key: 'symbols', label: 'Symbols (!@#$...)' },
              { key: 'excludeAmbiguous', label: 'Exclude ambiguous (il1Lo0O)' },
            ].map((opt) => (
              <div key={opt.key} className="generator-option">
                <label className="form-check-label">{opt.label}</label>
                <div className="form-check form-switch mb-0">
                  <input type="checkbox" className="form-check-input" checked={options[opt.key]} onChange={(e) => setOptions({ ...options, [opt.key]: e.target.checked })} />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-primary btn-modern w-100 mt-4" onClick={generate} disabled={loading}>
              <i className="fas fa-rotate me-1" />{loading ? 'Generating...' : 'Generate Password'}
            </button>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="generator-panel">
            <h5 className="fw-bold mb-3"><i className="fas fa-key text-primary me-2" />Generated Password</h5>
            {password ? (
              <>
                <div className="generator-output-box">
                  <PasswordReveal
                    value={password}
                    buttonClassName="btn btn-ghost btn-sm"
                    codeClassName="fs-5 word-break"
                  />
                </div>
                {strength && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">Strength</span>
                      <strong className={`text-${strengthColors[strength.score]}`}>{strength.label}</strong>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div className={`progress-bar bg-${strengthColors[strength.score]}`} style={{ width: `${(strength.score / 5) * 100}%` }} />
                    </div>
                  </div>
                )}
                <button type="button" className="btn btn-primary btn-modern" onClick={copy}>
                  <i className="fas fa-copy me-1" />Copy to Clipboard
                </button>
              </>
            ) : (
              <div className="generator-output-box justify-content-center">
                <p className="text-muted mb-0 small">Click generate to create a secure password</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
