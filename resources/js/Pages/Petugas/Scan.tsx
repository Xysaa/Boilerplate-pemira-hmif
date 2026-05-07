import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { QrCode, CheckCircle2, XCircle, Camera, Loader2, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface ScanResult {
    success: boolean;
    message: string;
    voter?: { id: number; name: string; email: string; avatar?: string };
}

interface ScanPageProps {
    session: { id: number; name: string } | null;
}

export default function ScanPage({ session }: ScanPageProps) {
    const [scanning,    setScanning]    = useState(false);
    const [processing,  setProcessing]  = useState(false);
    const [result,      setResult]      = useState<ScanResult | null>(null);
    const [manualToken, setManualToken] = useState('');
    const [tab,         setTab]         = useState<'camera' | 'manual'>('camera');
    const videoRef  = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            setScanning(true);
        } catch {
            alert('Tidak dapat mengakses kamera. Gunakan mode manual.');
            setTab('manual');
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        setScanning(false);
    };

    const processToken = async (token: string) => {
        if (!token.trim()) return;
        setProcessing(true);
        try {
            const res = await axios.post(route('petugas.scan.process'), { token });
            setResult(res.data);
            stopCamera();
        } catch (e: any) {
            setResult({
                success: false,
                message: e?.response?.data?.message || 'Terjadi kesalahan.',
            });
        } finally {
            setProcessing(false);
        }
    };

    const reset = () => {
        setResult(null);
        setManualToken('');
    };

    if (!session) {
        return (
            <AppLayout title="Scan Presensi">
                <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-20 gap-4">
                    <AlertCircle className="w-12 h-12 text-emerald-900" />
                    <p className="text-emerald-700">Tidak ada sesi pemilihan aktif saat ini.</p>
                    <Link href={route('petugas.dashboard')}>
                        <Button variant="outline" className="border-emerald-800 text-emerald-400">
                            Kembali
                        </Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Scan Presensi">
            <div className="max-w-lg mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-2xl font-bold text-white"
                        style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Scan QR Presensi
                    </h2>
                    <p className="text-emerald-500/50 text-sm">{session.name}</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}>
                            <Card className={cn(
                                'border',
                                result.success
                                    ? 'bg-emerald-950/60 border-emerald-700/50'
                                    : 'bg-red-950/40 border-red-800/50'
                            )}>
                                <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
                                    {result.success
                                        ? <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                                        : <XCircle className="w-16 h-16 text-red-400" />
                                    }
                                    <p className={cn('font-bold text-lg', result.success ? 'text-white' : 'text-red-300')}>
                                        {result.success ? 'Presensi Berhasil!' : 'QR Tidak Valid'}
                                    </p>
                                    <p className={cn('text-sm', result.success ? 'text-emerald-400/70' : 'text-red-400/70')}>
                                        {result.message}
                                    </p>

                                    {result.success && result.voter && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-emerald-900/30 w-full">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={result.voter.avatar} />
                                                <AvatarFallback className="bg-emerald-800 text-emerald-200">
                                                    {result.voter.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-left">
                                                <p className="text-white text-sm font-medium">{result.voter.name}</p>
                                                <p className="text-emerald-600/50 text-xs font-mono">{result.voter.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    <Button onClick={reset}
                                        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white gap-2 mt-2">
                                        <QrCode className="w-4 h-4" /> Scan Berikutnya
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Tab Switch */}
                            <div className="flex gap-2 mb-4">
                                {(['camera', 'manual'] as const).map(t => (
                                    <button key={t}
                                        onClick={() => { setTab(t); stopCamera(); }}
                                        className={cn(
                                            'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
                                            tab === t
                                                ? 'bg-emerald-700/40 text-emerald-300 border border-emerald-700/40'
                                                : 'text-emerald-600 hover:text-emerald-400 border border-transparent'
                                        )}
                                    >
                                        {t === 'camera' ? '📷 Kamera' : '⌨️ Manual'}
                                    </button>
                                ))}
                            </div>

                            <Card className="bg-[#0f2318]/60 border-emerald-900/30">
                                <CardContent className="p-6">
                                    {tab === 'camera' ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative w-full aspect-square max-w-[320px] bg-black rounded-2xl overflow-hidden border border-emerald-900/40">
                                                <video ref={videoRef} autoPlay playsInline
                                                    className="w-full h-full object-cover" />
                                                {!scanning && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                                        <div className="text-center">
                                                            <Camera className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
                                                            <p className="text-emerald-700 text-sm">Kamera belum aktif</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {scanning && (
                                                    <div className="absolute inset-0 pointer-events-none">
                                                        <div className="absolute inset-8 border-2 border-emerald-400/50 rounded-xl" />
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                onClick={scanning ? stopCamera : startCamera}
                                                className={cn(
                                                    'w-full gap-2 h-12',
                                                    scanning
                                                        ? 'bg-red-800 hover:bg-red-700'
                                                        : 'bg-emerald-700 hover:bg-emerald-600'
                                                )}
                                            >
                                                <Camera className="w-5 h-5" />
                                                {scanning ? 'Hentikan Kamera' : 'Aktifkan Kamera'}
                                            </Button>
                                            {scanning && (
                                                <p className="text-emerald-700/60 text-xs text-center">
                                                    Arahkan kamera ke QR Code milik pemilih
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-emerald-400/70 text-sm block mb-2">
                                                    Token QR (Paste dari QR)
                                                </label>
                                                <textarea
                                                    value={manualToken}
                                                    onChange={e => setManualToken(e.target.value)}
                                                    rows={4}
                                                    className="w-full bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3 text-white text-xs font-mono resize-none focus:outline-none focus:border-emerald-600"
                                                    placeholder="Paste token QR di sini..."
                                                />
                                            </div>
                                            <Button
                                                onClick={() => processToken(manualToken)}
                                                disabled={!manualToken.trim() || processing}
                                                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white gap-2 h-12"
                                            >
                                                {processing
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : <CheckCircle2 className="w-4 h-4" />
                                                }
                                                {processing ? 'Memproses...' : 'Validasi Token'}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}
