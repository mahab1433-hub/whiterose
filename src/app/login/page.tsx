'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error('Please enter a valid email');

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
      
      setIsSent(true);
      toast.success('Magic link sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send login link');
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
          <h1 className="text-3xl font-serif uppercase tracking-widest">
            {isSent ? 'Check Your Inbox' : 'Sign In'}
          </h1>
          <p className="text-xs text-zinc-500 tracking-wide font-light">
            {isSent 
              ? `We've sent a secure login link to ${email}. Please check your email and click the link to continue.` 
              : 'Enter your email address to receive a secure login link.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.form
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <div className="relative group">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white" size={16} />
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS (e.g. name@example.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 pl-8 py-4 text-white text-xs tracking-[0.2em] focus:outline-none focus:border-white transition-colors"
                  required
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-white text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-pink transition-all flex items-center justify-center space-x-3"
              >
                <span>{loading ? 'Sending Link...' : 'Send Magic Link'}</span>
                {!loading && <ArrowRight size={14} />}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="sent-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="flex justify-center pb-4">
                <CheckCircle2 size={48} className="text-accent-pink" />
              </div>
              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="w-full border border-white/10 text-white py-5 text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
              >
                Try Different Email
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-[10px] text-center text-zinc-600 tracking-widest leading-relaxed">
          By signing in, you agree to our <br />
          <span className="text-zinc-400">Terms of Service</span> and <span className="text-zinc-400">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
