import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateEmail } from '../../utils/validation';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loginPhone, error: authError } = useAuth();
  
  const [activeTab, setActiveTab] = useState('otp'); // 'otp' or 'email'
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // OTP state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpCodeMsg, setOtpCodeMsg] = useState('');

  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setLocalError('');
    setOtpCodeMsg('');

    if (!phone || phone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulate sending SMS
      setOtpSent(true);
      setOtpCodeMsg('Mock OTP sent successfully! Use demo code: 123456');
    } catch (err) {
      setLocalError(err.message || 'Failed to send OTP.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setLocalError('');

    if (!otp || otp !== '123456') {
      setOtpError('Invalid OTP. Please enter 123456.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await loginPhone(phone);
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

  const handleSubmitEmail = async (e) => {
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
          Welcome to Captain Bro
        </h2>
        <p className="text-xs font-semibold text-neutral-dark opacity-60 mt-1">
          Sign in to access your fresh meats & organic veggies
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border border-neutral-border rounded-lg overflow-hidden bg-white p-1 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setActiveTab('otp');
            setLocalError('');
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all ${
            activeTab === 'otp'
              ? 'bg-[#8B0000] text-white shadow-sm font-black'
              : 'text-neutral-dark/65 hover:bg-neutral-light/80'
          }`}
        >
          📱 Mobile OTP
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('email');
            setLocalError('');
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all ${
            activeTab === 'email'
              ? 'bg-[#8B0000] text-white shadow-sm font-black'
              : 'text-neutral-dark/65 hover:bg-neutral-light/80'
          }`}
        >
          ✉️ Email Sign In
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'otp' ? (
        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="bg-white p-5 rounded-lg border border-neutral-border flex flex-col gap-4 shadow-sm">
          {localError && (
            <div className="p-3.5 rounded-md bg-red-50 border border-primary/20 text-xs font-semibold text-primary text-center">
              {localError}
            </div>
          )}

          {otpCodeMsg && (
            <div className="p-3 rounded-md bg-green-50 border border-green-600/20 text-[10px] font-bold text-green-700 text-center">
              {otpCodeMsg}
            </div>
          )}

          {!otpSent ? (
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold text-neutral-dark opacity-50 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="flex border border-neutral-border rounded-lg overflow-hidden bg-neutral-light/40">
                <span className="bg-neutral-light px-3.5 flex items-center justify-center text-xs font-bold text-neutral-dark/60 border-r border-neutral-border">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3.5 py-3 outline-none text-xs font-semibold bg-white text-neutral-dark"
                  required
                />
              </div>
              {phoneError && <p className="text-[10px] text-primary font-bold mt-1">{phoneError}</p>}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-bold text-neutral-dark opacity-50 uppercase tracking-wider">
                Enter Verification Code (OTP)
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="px-3.5 py-3 border border-neutral-border rounded-lg outline-none text-xs font-semibold bg-white text-neutral-dark"
                required
              />
              {otpError && <p className="text-[10px] text-primary font-bold mt-1">{otpError}</p>}
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setOtpCodeMsg('');
                }}
                className="text-[10px] font-bold text-primary hover:underline text-right mt-1.5 self-end"
              >
                Change Mobile Number
              </button>
            </div>
          )}

          <Button type="submit" loading={submitting} className="w-full mt-2">
            {otpSent ? 'Verify & Login' : 'Send OTP'}
          </Button>

          <p className="text-center text-xs text-neutral-dark opacity-75 mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmitEmail} className="bg-white p-5 rounded-lg border border-neutral-border flex flex-col gap-4 shadow-sm">
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
      )}

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
