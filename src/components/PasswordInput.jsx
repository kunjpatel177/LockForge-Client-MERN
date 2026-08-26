import { useState } from 'react';

const PasswordInput = ({
  value,
  onChange,
  className = 'form-control',
  wrapperClassName = '',
  id,
  placeholder,
  required,
  autoFocus,
  style,
  disabled,
  addonAfter,
  useInputGroup = false,
}) => {
  const [show, setShow] = useState(false);

  const toggle = (
    <button
      type="button"
      className={useInputGroup ? 'btn btn-ghost' : 'password-input-toggle'}
      onClick={() => setShow((v) => !v)}
      title={show ? 'Hide password' : 'Show password'}
      tabIndex={-1}
    >
      <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
    </button>
  );

  const input = (
    <input
      id={id}
      type={show ? 'text' : 'password'}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoFocus={autoFocus}
      style={style}
      disabled={disabled}
    />
  );

  if (useInputGroup) {
    return (
      <div className={`input-group ${wrapperClassName}`.trim()}>
        {input}
        {toggle}
        {addonAfter}
      </div>
    );
  }

  return (
    <div className={`password-input-wrap ${wrapperClassName}`.trim()}>
      {input}
      {toggle}
    </div>
  );
};

export default PasswordInput;
