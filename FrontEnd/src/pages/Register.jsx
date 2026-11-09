import { motion } from 'framer-motion';
import {
  AlertCircle,
  ChevronDown,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

// Supported roles: ADMIN, FARM_MANAGER, GUEST (FARMER removed)
const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'FARM_MANAGER', label: 'Farm Manager' },
  { value: 'GUEST', label: 'Guest User' },
];

const InputWrapper = ({ icon: Icon, children, error }) => (
  <div
    className={`flex items-center rounded-lg border bg-white px-3 py-2.5 shadow-sm transition focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 ${
      error ? 'border-red-400' : 'border-gray-200'
    }`}
  >
    <Icon className="h-4 w-4 shrink-0 text-gray-400" />
    {children}
  </div>
);

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState('');

  const password = watch('password', '');

  const getPasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    if (score <= 2) return { label: 'Weak', width: '25%', color: 'bg-red-500' };
    if (score <= 3) return { label: 'Fair', width: '50%', color: 'bg-amber-500' };
    if (score <= 4) return { label: 'Strong', width: '75%', color: 'bg-blue-500' };
    return { label: 'Excellent', width: '100%', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(password);

  const onSubmit = async (values) => {
    console.log('=== REGISTRATION DEBUG: Submitting Form Values ===', values);
    try {
      const response = await registerUser(values);
      console.log('=== REGISTRATION DEBUG: API Response ===', response);
      if (response.success) {
        setStatus('Registration successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        // Show real backend error message; include field-level validation details if present
        const details = response.details;
        const detailMsg = Array.isArray(details) && details.length
          ? ' — ' + details.join(', ')
          : '';
        const realError = (response.message || 'Registration failed') + detailMsg;
        console.error('=== REGISTRATION FAILURE ===', realError, response);
        setStatus(realError);
      }
    } catch (err) {
      console.error('=== REGISTRATION ERROR ===', err);
      setStatus(err?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Left panel — image ── */}
      <div className="relative hidden w-2/5 lg:block">
        <img
          src="https://images.unsplash.com/photo-1760635165251-5a3a81425a89?auto=format&fit=crop&w=1800&q=80"
          alt="Farming landscape"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/65" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold text-white">FarmVerse</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Join a smarter agricultural platform.
            </h2>
            <p className="text-sm leading-relaxed text-gray-300">
              Secure, role-aware workspace designed for modern farms, field managers, agricultural experts, and enterprise admins.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-10 sm:px-8 lg:px-12"
      >
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold text-gray-900">FarmVerse</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to get started with FarmVerse.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name + Phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                <InputWrapper icon={UserRound} error={errors.fullName}>
                  <input
                    {...register('fullName', {
                      required: 'Full name is required',
                      minLength: { value: 3, message: 'Minimum 3 characters' },
                    })}
                    className="ml-2.5 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    placeholder="Asha Nair"
                  />
                </InputWrapper>
                {errors.fullName && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone</label>
                <InputWrapper icon={Phone} error={errors.phone}>
                  <input
                    {...register('phone', {
                      required: 'Phone is required',
                      pattern: { value: /^[0-9+\- ]{10,15}$/, message: 'Enter a valid phone number' },
                    })}
                    className="ml-2.5 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    placeholder="+91 9876543210"
                  />
                </InputWrapper>
                {errors.phone && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <InputWrapper icon={Mail} error={errors.email}>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /.+@.+\..+/, message: 'Enter a valid email' },
                  })}
                  className="ml-2.5 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="name@farmverse.com"
                />
              </InputWrapper>
              {errors.email && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
              <div
                className={`relative flex items-center rounded-lg border bg-white px-3 py-2.5 shadow-sm transition focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 ${
                  errors.role ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <select
                  defaultValue=""
                  {...register('role', { required: 'Select your role' })}
                  className="w-full appearance-none bg-transparent pr-7 text-sm text-gray-700 outline-none"
                >
                  <option value="" disabled>Select your role</option>
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-gray-400" />
              </div>
              {errors.role && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <InputWrapper icon={Lock} error={errors.password}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    validate: (value) =>
                      /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/.test(value) ||
                      'Use 8+ chars incl. uppercase, lowercase, number, and special character',
                  })}
                  className="ml-2.5 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </InputWrapper>
              {errors.password ? (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.password.message}
                </p>
              ) : password ? (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Password strength</span>
                    <span
                      className={`font-medium ${
                        strength.label === 'Weak'
                          ? 'text-red-600'
                          : strength.label === 'Fair'
                          ? 'text-amber-600'
                          : strength.label === 'Strong'
                          ? 'text-blue-600'
                          : 'text-green-600'
                      }`}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm Password</label>
              <InputWrapper icon={Lock} error={errors.confirmPassword}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className="ml-2.5 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600 transition"
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </InputWrapper>
              {errors.confirmPassword && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Status */}
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg px-4 py-3 text-sm ${
                  status.includes('successful')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {status}
              </motion.div>
            )}

            <Button type="submit" className="w-full py-2.5 text-base">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
