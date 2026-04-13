'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return toast.error('Please enter your phone number');
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.startsWith('+') ? phone : `+91${phone}`, // Defaulting to India
      });
      
      if (error) throw error;
      
      setStep('otp');
      toast.success('OTP sent to your phone!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP');
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone.startsWith('+') ? phone : `+91${phone}`,
        token: otp,
        type: 'sms',
      });
      
      if (error) throw error;
      
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
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
          <h1 className="text-3xl font-serif uppercase tracking-widest">{step === 'phone' ? 'Sign In' : 'Verify OTP'}</h1>
          <p className="text-xs text-zinc-500 tracking-wide font-light">
            {step === 'phone' 
              ? 'Enter your mobile number to receive a one-way password.' 
              : `Enter the 6-digit code sent to ${phone}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form
              key="phone-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <div className="relative group">
                <Phone className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white" size={16} />
                <input
                  type="tel"
                  placeholder="PHONE NUMBER (e.g. 9876543210)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 pl-8 py-4 text-xs tracking-[0.2em] focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-white text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-pink transition-all flex items-center justify-center space-x-3"
              >
                <span>{loading ? 'Sending...' : 'Send OTP'}</span>
                {!loading && <ArrowRight size={14} />}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <div className="relative group">
                <CheckCircle2 className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white" size={16} />
                <input
                  type="text"
                  placeholder="6-DIGIT OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 pl-8 py-4 text-xs tracking-[0.2em] focus:outline-none focus:border-white transition-colors text-center"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full border border-white/10 text-white py-5 text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                >
                  Edit Number
                </button>
                <button
                  disabled={loading}
                  className="w-full bg-white text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-pink transition-all"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </motion.form>
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
