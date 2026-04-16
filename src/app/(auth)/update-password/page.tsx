'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return toast.error('Please fill in all fields');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
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
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent-pink">Security</h2>
          <h1 className="text-3xl font-serif uppercase tracking-widest leading-tight">
            Update <br /> Password
          </h1>
          <p className="text-xs text-zinc-500 tracking-wide font-light pt-2">
            Enter your new secure password below.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="NEW PASSWORD"
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

            <div className="relative group">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="CONFIRM NEW PASSWORD"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 pl-8 pr-10 py-4 text-white text-xs tracking-[0.2em] focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-white !text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-pink transition-all flex items-center justify-center space-x-3"
          >
            <span className="!text-black">{loading ? 'Updating...' : 'Update Password'}</span>
            {!loading && <Save size={14} className="!text-black" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdatePasswordPage;
