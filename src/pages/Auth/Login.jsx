import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateEmail } from '../../utils/validation';

export const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setLocalError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(email, password);
      // Route based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'rider') {
        navigate('/rider');
      } else {
        localStorage.setItem('just_logged_in', 'true');
        navigate('/home');
      }
    } catch (err) {
      setLocalError(err.message || 'Failed to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setSubmitting(true);
    setLocalError('');
    try {
      const user = await login(demoEmail, demoPassword);
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'rider') {
        navigate('/rider');
      } else {
        localStorage.setItem('just_logged_in', 'true');
        navigate('/home');
      }
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-neutral-light px-6 py-10 flex flex-col justify-center gap-6">
      {/* Title */}
      <div className="text-center">
        <span className="text-3xl">🍗</span>
        <h2 className="text-2xl font-extrabold text-neutral-dark mt-2">
          Welcome Back
        </h2>
        <p className="text-xs font-semibold text-neutral-dark opacity-60 mt-1">
          Login to access your fresh meats & groceries
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-neutral-border flex flex-col gap-4 shadow-sm">
        {localError && (
          <div className="p-3.5 rounded-md bg-red-50 border border-primary/20 text-xs font-semibold text-primary text-center">
            {localError}
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

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" loading={submitting} className="w-full mt-2">
          Sign In
        </Button>

        <p className="text-center text-xs text-neutral-dark opacity-75 mt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </form>

      {/* Demo logins */}
      <div className="bg-white p-4 rounded-lg border border-neutral-border flex flex-col gap-2 shadow-xs text-left">
        <h4 className="text-xs font-bold text-neutral-dark opacity-50 uppercase tracking-wider px-1 mb-1">
          Quick Demo Accounts
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleDemoLogin('customer@wfoods.com', 'customer123')}
            className="py-2.5 px-2 bg-neutral-light hover:bg-primary/5 border border-neutral-border text-[10px] font-bold rounded-md text-neutral-dark hover:text-primary transition-all text-center"
          >
            👨‍💼 Customer
          </button>
          <button
            onClick={() => handleDemoLogin('admin@wfoods.com', 'admin123')}
            className="py-2.5 px-2 bg-neutral-light hover:bg-primary/5 border border-neutral-border text-[10px] font-bold rounded-md text-neutral-dark hover:text-primary transition-all text-center"
          >
            🛡️ Admin
          </button>
          <button
            onClick={() => handleDemoLogin('rider@wfoods.com', 'rider123')}
            className="py-2.5 px-2 bg-neutral-light hover:bg-primary/5 border border-neutral-border text-[10px] font-bold rounded-md text-neutral-dark hover:text-primary transition-all text-center"
          >
            🛵 Rider
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
