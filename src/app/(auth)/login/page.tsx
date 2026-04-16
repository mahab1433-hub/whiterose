'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, UserPlus, LogIn, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const LoginContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/orders';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (!isForgotPassword && !password)) return toast.error('Please fill in all fields');
    
    setLoading(true);
    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) throw error;
        toast.success('Password reset link sent to your email!');
        setIsForgotPassword(false);
      } else if (isSignUp) {
        if (password.length < 6) return toast.error('Password must be at least 6 characters');
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });
        if (error) throw error;
        toast.success('Account created successfully!');
        router.push(redirectTo);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Successfully signed in!');
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-950 border border-white/5 p-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">Authentication</h2>
          <h1 className="text-3xl font-serif uppercase tracking-widest leading-tight">
            {isForgotPassword ? 'Reset <br /> Password' : isSignUp ? 'Create <br /> Account' : 'Sign In'}
          </h1>
          <p className="text-xs text-zinc-500 tracking-wide font-light pt-2">
            {isForgotPassword 
              ? 'Enter your email to receive a reset link.' 
              : isSignUp 
                ? 'Join White Rose for exclusive beauty perks.' 
                : 'Welcome back. Please enter your credentials.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white" size={16} />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 pl-8 py-4 text-white text-xs tracking-[0.2em] focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>

            {!isForgotPassword && (
              <div className="relative group">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 pl-8 pr-10 py-4 text-white text-xs tracking-[0.2em] focus:outline-none focus:border-white transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors p-2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}
          </div>

          {!isForgotPassword && !isSignUp && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-white !text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-pink transition-all flex items-center justify-center space-x-3"
          >
            <span className="!text-black">
              {loading ? 'Processing...' : isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
            </span>
            {!loading && (
              isForgotPassword ? <KeyRound size={14} className="!text-black" /> :
              isSignUp ? <UserPlus size={14} className="!text-black" /> : 
              <LogIn size={14} className="!text-black" />
            )}
          </button>
          
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                if (isForgotPassword) {
                  setIsForgotPassword(false);
                } else {
                  setIsSignUp(!isSignUp);
                }
              }}
              className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              {isForgotPassword ? 'Back to Sign In' : isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-[10px] text-center text-zinc-600 tracking-widest leading-relaxed">
          By continuing, you agree to our <br />
          <span className="text-zinc-400">Terms of Service</span> and <span className="text-zinc-400">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-[10px] uppercase tracking-[0.4em] text-zinc-500">Loading Secure Portal...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
