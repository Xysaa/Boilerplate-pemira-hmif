import { useEffect, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronRight, Leaf, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface LoginProps {
    turnstileSiteKey: string;
}

declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement, options: object) => string;
            reset: (widgetId?: string) => void;
        };
    }
}

export default function Login({ turnstileSiteKey }: LoginProps) {
    // errors dari Inertia shared props (dari withErrors() Laravel)
    const { errors: pageErrors } = usePage<{ errors: Record<string, string> }>().props;

    const turnstileRef    = useRef<HTMLDivElement>(null);
    const widgetIdRef     = useRef<string>('');
    const hasTurnstileKey = !!turnstileSiteKey;

    // PENTING: nama field harus sama persis dengan yang divalidate di StaffLoginController
    const { data, setData, post, processing, errors } = useForm({
        email:                 '',
        password:              '',
        cf_turnstile_response: '', // ← harus cocok dengan controller
        remember:              false,
    });

    useEffect(() => {
        if (!hasTurnstileKey) return; // skip jika tidak ada site key (dev/test)

        const script    = document.createElement('script');
        script.src      = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async    = true;
        script.defer    = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (turnstileRef.current && window.turnstile) {
                widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
                    sitekey:           turnstileSiteKey,
                    callback:          (token: string) => setData('cf_turnstile_response', token),
                    'expired-callback': () => setData('cf_turnstile_response', ''),
                    theme:             'dark',
                });
            }
        };

        return () => {
            if (document.head.contains(script)) document.head.removeChild(script);
        };
    }, [hasTurnstileKey]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login.store'));
    };

    // Tombol disabled HANYA jika ada turnstile key tapi belum diisi
    const isSubmitDisabled = processing || (hasTurnstileKey && !data.cf_turnstile_response);

    // Kumpulkan semua pesan error yang ada
    const errorMessage = pageErrors.oauth
        ?? pageErrors.email
        ?? pageErrors.cf_turnstile_response
        ?? null;

    return (
        <div className="min-h-screen bg-[#0a1a0f] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background dot grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #4ade80 1px, transparent 0)',
                        backgroundSize:  '40px 40px',
                    }}
                />
            </div>

            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring' }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 mb-4 shadow-lg shadow-emerald-900/40"
                    >
                        <Leaf className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <h1
                        className="text-3xl font-bold text-white tracking-tight"
                        style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                        E-Vote ITERA
                    </h1>
                    <p className="text-emerald-400/70 text-sm mt-1 font-mono">
                        Sistem Pemilihan Elektronik
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#0f2318]/80 backdrop-blur-sm border border-emerald-900/40 rounded-2xl p-8 shadow-2xl">

                    {/* Error banner — tampil untuk semua error dari server */}
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-800/50 text-red-300 text-sm flex items-start gap-2"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </motion.div>
                    )}

                    {/* ── Google OAuth — Voter ────────────────────────────── */}
                    <div className="mb-6">
                        <p className="text-emerald-300/60 text-xs font-mono uppercase tracking-widest mb-3 text-center">
                            Pemilih (Mahasiswa)
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { window.location.href = route('auth.google'); }}
                            className="w-full h-12 bg-white/5 border-emerald-800/40 text-white hover:bg-white/10 hover:border-emerald-600 gap-3"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Masuk dengan Google
                        </Button>
                        <p className="text-emerald-400/40 text-xs text-center mt-2">
                            Khusus email @student.itera.ac.id · Prodi Informatika
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <Separator className="flex-1 bg-emerald-900/40" />
                        <span className="text-emerald-400/30 text-xs font-mono">ATAU</span>
                        <Separator className="flex-1 bg-emerald-900/40" />
                    </div>

                    {/* ── Staff Login ─────────────────────────────────────── */}
                    <p className="text-emerald-300/60 text-xs font-mono uppercase tracking-widest mb-4 text-center">
                        Admin & Petugas
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-emerald-300/80 text-sm">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="pl-10 bg-emerald-950/30 border-emerald-900/50 text-white placeholder:text-emerald-800 focus-visible:ring-emerald-600"
                                    placeholder="admin@itera.ac.id"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-xs">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-emerald-300/80 text-sm">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="pl-10 bg-emerald-950/30 border-emerald-900/50 text-white placeholder:text-emerald-800 focus-visible:ring-emerald-600"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Cloudflare Turnstile — hanya render jika ada site key */}
                        {hasTurnstileKey && (
                            <div className="flex flex-col items-center gap-1">
                                <div ref={turnstileRef} />
                                {errors.cf_turnstile_response && (
                                    <p className="text-red-400 text-xs">{errors.cf_turnstile_response}</p>
                                )}
                            </div>
                        )}

                        {/* Tombol submit */}
                        <Button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="w-full h-12 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold gap-2 transition-all"
                        >
                            {processing ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Masuk sebagai Staff</span>
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-emerald-900/60 text-xs text-center mt-6 font-mono">
                    Institut Teknologi Sumatera · Himpunan Mahasiswa Informatika
                </p>
            </motion.div>
        </div>
    );
}
