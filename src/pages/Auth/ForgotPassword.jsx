import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateEmail } from '../../utils/validation';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPass } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setLocalError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPass(email);
      setSuccess(true);
    } catch (err) {
      setLocalError(err.message || 'Failed to send password reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-neutral-light px-6 py-10 flex flex-col justify-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-neutral-dark">
          Reset Password
        </h2>
        <p className="text-xs font-semibold text-neutral-dark opacity-60 mt-1">
          Get instructions to retrieve access to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-neutral-border flex flex-col gap-4 shadow-sm">
        {localError && (
          <div className="p-3.5 rounded-md bg-red-50 border border-primary/20 text-xs font-semibold text-primary text-center">
            {localError}
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-md bg-green-50 border border-green-600/20 text-xs font-semibold text-green-600 text-center">
            Password reset link has been sent to your email.
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          required={true}
        />

        <Button type="submit" loading={submitting} className="w-full mt-2">
          Send Instructions
        </Button>

        <p className="text-center text-xs text-neutral-dark opacity-75 mt-2">
          Back to{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};
export default ForgotPassword;
