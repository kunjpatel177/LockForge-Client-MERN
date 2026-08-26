import { useState } from 'react';

const PasswordReveal = ({
  value,
  emptyLabel = 'No Password',
  buttonClassName = 'btn btn-link btn-sm p-0 ms-1',
  codeClassName,
  onCopy,
  copyLabel = 'Password',
}) => {
  const [show, setShow] = useState(false);

  if (!value) return <span className="text-muted">{emptyLabel}</span>;

  return (
    <>
      <code className={codeClassName}>{show ? value : '••••••••'}</code>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setShow((v) => !v)}
        title={show ? 'Hide password' : 'Show password'}
      >
        <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
      </button>
      {onCopy && (
        <button
          type="button"
          className={buttonClassName}
          onClick={() => onCopy(value, copyLabel)}
          title={`Copy ${copyLabel}`}
        >
          <i className="fas fa-copy" />
        </button>
      )}
    </>
  );
};

export default PasswordReveal;
