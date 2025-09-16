import React from 'react';

const EmailCaptureForm = ({ 
  email, 
  setEmail, 
  emailError, 
  handleEmailSubmit, 
  title = "🎯 Email Capture",
  message = "Please enter your email address to begin",
  buttonText = "Continue"
}) => {
  return (
    <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mt-6">
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`input input-md ${emailError ? 'input-error' : ''}`}
          placeholder="Enter your email address"
          required
        />
        {emailError && (
          <p className="form-error">{emailError}</p>
        )}
      </div>
      
      <button type="submit" className="btn btn-primary btn-md w-full">
        {buttonText}
      </button>
    </form>
  );
};

export default EmailCaptureForm;
