import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Leaf, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { normalizeRole, roleHomeRoute } from '../config/roleRoutes';

const loginSchema = z.object({
  email: z.string().min(1, 'Email or mobile is required'),
  password: z.string().min(1, 'Password is required'),
});

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');

  const onSubmit = async (values) => {
    setStatus('');
    const response = await login(values.email, values.password);

    if (response.success) {
      const role = normalizeRole(response.user?.role ?? response.role);
      setStatus('Login successful. Redirecting...');
      setTimeout(() => navigate(roleHomeRoute(role)), 600);
    } else {
      setStatus(response.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Left panel — image ── */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80"
          alt="Agriculture field"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gray-900/60" />
        {/* Content on top of image */}
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold text-white">FarmVerse</span>
          </div>
          {/* Tagline */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Modern agriculture intelligence for every field.
            </h2>
            <p className="text-sm leading-relaxed text-gray-300">
              Access your personalized farm dashboard with weather, crop, and operational signals designed for sustainable growth.
            </p>
            <div className="mt-4 space-y-2">
              {[
                'Real-time field monitoring and smart irrigation guidance',
                'Secure role-based access for your entire team',
                'AI-powered recommendations tailored to every crop cycle',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:px-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold text-gray-900">FarmVerse</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to your FarmVerse account to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email or mobile
              </label>
              <div
                className={`flex items-center rounded-lg border bg-white px-3 py-2.5 shadow-sm transition focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  {...register('email')}
                  className="ml-2.5 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="name@farmverse.com or +91 98765 43210"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600" role="alert">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div
                className={`flex items-center rounded-lg border bg-white px-3 py-2.5 shadow-sm transition focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 ${
                  errors.password ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <Lock className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="ml-2.5 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  placeholder="Enter your password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                <button
                  type="button"
                  className="ml-2 text-gray-400 transition hover:text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600" role="alert">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                Remember me
              </label>
              <a href="#" className="text-sm font-medium text-green-600 hover:text-green-700">
                Forgot password?
              </a>
            </div>

            {/* Status message */}
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg px-4 py-3 text-sm ${
                  status.includes('successful')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
                role="status"
                aria-live="polite"
              >
                {status}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-base"
            >
              {loading && <LoadingSpinner />}
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
