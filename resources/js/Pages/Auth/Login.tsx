import { useEffect, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/brand/Logo';

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
    const { errors: pageErrors } = usePage<{ errors: Record<string, string> }>().props;

    const turnstileRef    = useRef<HTMLDivElement>(null);
    const widgetIdRef     = useRef<string>('');
    const hasTurnstileKey = !!turnstileSiteKey;

    const { data, setData, post, processing, errors } = useForm({
        email:                 '',
        password:              '',
        cf_turnstile_response: '',
        remember:              false,
    });

    useEffect(() => {
        if (!hasTurnstileKey) return;

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
                    theme:             'light',
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

    const isSubmitDisabled = processing || (hasTurnstileKey && !data.cf_turnstile_response);

    const errorMessage = pageErrors.oauth
        ?? pageErrors.email
        ?? pageErrors.cf_turnstile_response
        ?? null;

    return (
        <div className="min-h-screen bg-hero-mesh flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background dot grid */}
            <div className="absolute inset-0 pointer-events-none bg-dotgrid" />

            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-hmif-green-200/30 rounded-full blur-3xl pointer-events-none" />

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
                        className="inline-flex items-center justify-center mb-4"
                    >
                        <Logo size={56} />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight font-serif">
                        PEMIRA HMIF
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1 font-mono">
                        Sistem Pemilihan Elektronik
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-md border border-border rounded-2xl p-8 shadow-xl">

                    {/* Error banner */}
                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </motion.div>
                    )}

                    {/* Google OAuth - Voter */}
                    <div className="mb-6">
                        <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-3 text-center">
                            Pemilih (Mahasiswa)
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { window.location.href = route('auth.google'); }}
                            className="w-full h-12 bg-white border-border text-foreground hover:bg-muted gap-3"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Masuk dengan Google
                        </Button>
                        <p className="text-muted-foreground text-xs text-center mt-2">
                            Khusus email @student.itera.ac.id &middot; Prodi Informatika
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <Separator className="flex-1" />
                        <span className="text-muted-foreground text-xs font-mono">ATAU</span>
                        <Separator className="flex-1" />
                    </div>

                    {/* Staff Login */}
                    <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-4 text-center">
                        Admin & Petugas
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="pl-10"
                                    placeholder="admin@itera.ac.id"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-600 text-xs">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="pl-10"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Cloudflare Turnstile */}
                        {hasTurnstileKey && (
                            <div className="flex flex-col items-center gap-1">
                                <div ref={turnstileRef} />
                                {errors.cf_turnstile_response && (
                                    <p className="text-red-600 text-xs">{errors.cf_turnstile_response}</p>
                                )}
                            </div>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="w-full h-12 gap-2"
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

                <p className="text-muted-foreground text-xs text-center mt-6 font-mono">
                    Institut Teknologi Sumatera &middot; Himpunan Mahasiswa Informatika
                </p>
            </motion.div>
        </div>
    );
}
