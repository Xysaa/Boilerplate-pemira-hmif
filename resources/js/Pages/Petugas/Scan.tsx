import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { QrCode, CheckCircle2, XCircle, Camera, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@inertiajs/react';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from '@/components/ui/toaster';
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
    const [scanning, setScanning] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [manualToken, setManualToken] = useState('');
    const [tab, setTab] = useState<'camera' | 'manual'>('camera');
    const videoRef = useRef<HTMLVideoElement>(null);
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
            toast.error('Tidak dapat mengakses kamera. Gunakan mode manual.');
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
            if (res.data.success) toast.success('Presensi berhasil!');
        } catch (e: any) {
            setResult({
                success: false,
                message: e?.response?.data?.message || 'Terjadi kesalahan.',
            });
            toast.error('QR tidak valid atau sudah kedaluwarsa.');
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
                <div className="max-w-lg mx-auto">
                    <Card>
                        <EmptyState
                            icon={AlertCircle}
                            title="Tidak ada sesi aktif"
                            description="Tunggu admin mengaktifkan sesi pemilihan."
                            action={
                                <Link href={route('petugas.dashboard')}>
                                    <Button variant="outline">Kembali</Button>
                                </Link>
                            }
                        />
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Scan Presensi" subtitle={session.name}>
            <div className="max-w-lg mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <Link href={route('petugas.dashboard')}>
                        <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2 mb-1 gap-1">
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Scan QR Presensi</h2>
                    <p className="text-muted-foreground text-sm">{session.name}</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}>
                            <Card className={cn(
                                'border-2',
                                result.success
                                    ? 'border-hmif-green-300 bg-hmif-green-50'
                                    : 'border-red-200 bg-red-50'
                            )}>
                                <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
                                    {result.success
                                        ? <div className="w-20 h-20 rounded-full bg-hmif-green-100 flex items-center justify-center">
                                            <CheckCircle2 className="w-10 h-10 text-hmif-green-700" />
                                        </div>
                                        : <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                                            <XCircle className="w-10 h-10 text-red-600" />
                                        </div>
                                    }
                                    <p className={cn('font-bold text-lg',
                                        result.success ? 'text-hmif-green-900' : 'text-red-900'
                                    )}>
                                        {result.success ? 'Presensi Berhasil!' : 'QR Tidak Valid'}
                                    </p>
                                    <p className={cn('text-sm',
                                        result.success ? 'text-hmif-green-700' : 'text-red-600'
                                    )}>
                                        {result.message}
                                    </p>

                                    {result.success && result.voter && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-hmif-green-200 w-full">
                                            <Avatar className="w-10 h-10 border border-border">
                                                <AvatarImage src={result.voter.avatar} />
                                                <AvatarFallback>
                                                    {result.voter.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-left">
                                                <p className="text-foreground text-sm font-semibold">{result.voter.name}</p>
                                                <p className="text-muted-foreground text-xs font-mono">{result.voter.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    <Button onClick={reset} className="w-full gap-2 mt-2">
                                        <QrCode className="w-4 h-4" /> Scan Berikutnya
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Tab Switch */}
                            <div className="flex gap-1 p-1 bg-muted rounded-xl mb-4">
                                {(['camera', 'manual'] as const).map(t => (
                                    <button key={t}
                                        onClick={() => { setTab(t); stopCamera(); }}
                                        className={cn(
                                            'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all',
                                            tab === t
                                                ? 'bg-white text-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {t === 'camera' ? '📷 Kamera' : '⌨️ Manual'}
                                    </button>
                                ))}
                            </div>

                            <Card>
                                <CardContent className="p-6">
                                    {tab === 'camera' ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative w-full aspect-square max-w-[320px] bg-foreground/5 rounded-2xl overflow-hidden border border-border">
                                                <video ref={videoRef} autoPlay playsInline
                                                    className="w-full h-full object-cover" />
                                                {!scanning && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                                                        <div className="text-center">
                                                            <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                                                            <p className="text-muted-foreground text-sm">Kamera belum aktif</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {scanning && (
                                                    <div className="absolute inset-0 pointer-events-none">
                                                        <div className="absolute inset-8 border-2 border-hmif-green-500/60 rounded-xl" />
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                onClick={scanning ? stopCamera : startCamera}
                                                size="lg"
                                                variant={scanning ? 'destructive' : 'default'}
                                                className="w-full gap-2"
                                            >
                                                <Camera className="w-5 h-5" />
                                                {scanning ? 'Hentikan Kamera' : 'Aktifkan Kamera'}
                                            </Button>
                                            {scanning && (
                                                <p className="text-muted-foreground text-xs text-center">
                                                    Arahkan kamera ke QR Code milik pemilih
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-foreground text-sm font-semibold block mb-2">
                                                    Token QR (Paste dari QR)
                                                </label>
                                                <textarea
                                                    value={manualToken}
                                                    onChange={e => setManualToken(e.target.value)}
                                                    rows={4}
                                                    className="w-full border border-input bg-white rounded-xl p-3 text-foreground text-xs font-mono resize-none focus:outline-none focus:border-hmif-green-500 focus:ring-2 focus:ring-hmif-green-500/20 transition-colors"
                                                    placeholder="Paste token QR di sini..."
                                                />
                                            </div>
                                            <Button
                                                onClick={() => processToken(manualToken)}
                                                disabled={!manualToken.trim() || processing}
                                                size="lg"
                                                className="w-full gap-2"
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
