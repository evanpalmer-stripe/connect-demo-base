import { useState } from 'react';
import { generateDemoEmail } from '../utils/emailGenerator';

// Email handling hook for account creation
export const useEmailSubmission = () => {
  const [email, setEmail] = useState(generateDemoEmail());
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [accountId, setAccountId] = useState(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    
    if (!email.trim()) {
      setEmailError('Please enter an email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('/api/onboarding/create-account-with-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setEmailError(errorData.error || 'Failed to create account');
        return;
      }
      
      const data = await response.json();
      setAccountId(data.id);
      setEmailSubmitted(true);
    } catch (error) {
      setEmailError('Failed to create account. Please try again.');
    }
  };

  return { email, setEmail, emailSubmitted, emailError, accountId, handleEmailSubmit };
};
