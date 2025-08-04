import React from 'react';

const ResponsiveForm = ({ children, title, onSubmit, submitText = "Gönder" }) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: '15px',
      padding: isMobile ? '20px' : '30px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      margin: isMobile ? '10px 0' : '20px 0'
    }}>
      {title && (
        <h2 style={{
          color: 'var(--primary-dark)',
          fontSize: isMobile ? '20px' : '24px',
          marginBottom: isMobile ? '20px' : '30px',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          {title}
        </h2>
      )}

      <form onSubmit={onSubmit}>
        <div style={{
          display: 'grid',
          gap: isMobile ? '15px' : '20px',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))'
        }}>
          {children}
        </div>

        <div style={{
          marginTop: isMobile ? '25px' : '30px',
          textAlign: 'center'
        }}>
          <button 
            type="submit"
            className="btn btn-primary"
            style={{
              width: isMobile ? '100%' : 'auto',
              minWidth: isMobile ? 'auto' : '200px',
              padding: isMobile ? '15px 20px' : '12px 24px',
              fontSize: isMobile ? '16px' : '14px'
            }}
          >
            {submitText}
          </button>
        </div>
      </form>
    </div>
  );
};

export const ResponsiveFormGroup = ({ label, children, required = false }) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="form-group">
      <label style={{
        display: 'block',
        marginBottom: '8px',
        color: 'var(--text-dark)',
        fontWeight: '500',
        fontSize: isMobile ? '14px' : '13px'
      }}>
        {label} {required && <span style={{ color: '#dc3545' }}>*</span>}
      </label>
      {children}
    </div>
  );
};

export const ResponsiveInput = ({ type = "text", placeholder, value, onChange, required = false, ...props }) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="form-control"
      style={{
        padding: isMobile ? '15px' : '12px 15px',
        fontSize: isMobile ? '16px' : '14px',
        minHeight: isMobile ? '50px' : 'auto'
      }}
      {...props}
    />
  );
};

export const ResponsiveSelect = ({ value, onChange, children, required = false, ...props }) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="form-control"
      style={{
        padding: isMobile ? '15px' : '12px 15px',
        fontSize: isMobile ? '16px' : '14px',
        minHeight: isMobile ? '50px' : 'auto'
      }}
      {...props}
    >
      {children}
    </select>
  );
};

export const ResponsiveTextarea = ({ placeholder, value, onChange, rows = 4, required = false, ...props }) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={isMobile ? 3 : rows}
      className="form-control"
      style={{
        padding: isMobile ? '15px' : '12px 15px',
        fontSize: isMobile ? '16px' : '14px',
        minHeight: isMobile ? '80px' : 'auto',
        resize: 'vertical'
      }}
      {...props}
    />
  );
};

export default ResponsiveForm;