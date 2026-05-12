import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import QRCode from 'qrcode';
import {
    CheckCircle2, Clock, QrCode, Vote, AlertCircle,
    RefreshCw, ChevronRight, Loader2, Shield, Sparkles,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { VoterDashboardProps } from '@/types';

type ParticipationStatus = 'registered' | 'present' | 'voted';

function StatusBanner({ status }: { status: ParticipationStatus | null }) {
    if (!status) return (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted border border-border">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
                <p className="text-foreground font-semibold text-sm">Tidak Ada Sesi Aktif</p>
                <p className="text-muted-foreground text-xs mt-0.5">Belum ada sesi pemilihan yang dibuka</p>
            </div>
        </div>
    );

    const map: Record<ParticipationStatus, {
        icon: React.ElementType;
        label: string;
        desc: string;
        bg: string;
        border: string;
        iconCls: string;
        labelCls: string;
    }> = {
        registered: {
            icon: Clock,
            label: 'Belum Presensi',
            desc: 'Tampilkan QR Code ke petugas untuk melakukan presensi',
            bg: 'bg-hmif-yellow-50',
            border: 'border-hmif-yellow-300',
            iconCls: 'text-hmif-yellow-700',
            labelCls: 'text-hmif-yellow-900',
        },
        present: {
            icon: Sparkles,
            label: 'Siap Memilih',
            desc: 'Presensi telah dicatat. Anda dapat melakukan pemungutan suara sekarang!',
            bg: 'bg-hmif-green-50',
            border: 'border-hmif-green-300',
            iconCls: 'text-hmif-green-700',
            labelCls: 'text-hmif-green-900',
        },
        voted: {
            icon: CheckCircle2,
            label: 'Sudah Memilih',
            desc: 'Terima kasih! Suara Anda telah berhasil dicatat secara anonim',
            bg: 'bg-hmif-blue-50',
            border: 'border-hmif-blue-300',
            iconCls: 'text-hmif-blue-700',
            labelCls: 'text-hmif-blue-900',
        },
    };

    const { icon: Icon, label, desc, bg, border, iconCls, labelCls } = map[status];

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex items-start gap-3 p-4 rounded-2xl border', bg, border)}
        >
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconCls)} />
            <div>
                <p className={cn('font-bold text-sm', labelCls)}>{label}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
            </div>
        </motion.div>
    );
}

function QrDisplay({ voterId }: { voterId: number }) {
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [countdown, setCountdown] = useState(100);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const ttlRef = useRef(100);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchQr = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(route('voter.qr.generate'));
            const { token, ttl } = res.data;

            const dataUrl = await QRCode.toDataURL(token, {
                width: 280,
                margin: 2,
                color: { dark: '#4D5B37', light: '#ffffff' },
            });

            setQrDataUrl(dataUrl);
            setCountdown(ttl);
            ttlRef.current = ttl;
        } catch (e: any) {
            setError(e?.response?.data?.error || 'Gagal membuat QR Code');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQr();

        const startInterval = () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                fetchQr();
            }, ttlRef.current * 1000);
        };

        const initTimeout = setTimeout(startInterval, 500);

        return () => {
            clearTimeout(initTimeout);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchQr]);

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setInterval(() => {
            setCountdown(c => Math.max(0, c - 1));
        }, 1000);
        return () => clearInterval(t);
    }, [countdown]);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="w-[280px] h-[280px] flex items-center justify-center bg-white rounded-2xl border border-border"
                        >
                            <Loader2 className="w-8 h-8 text-hmif-green-700 animate-spin" />
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="w-[280px] h-[280px] flex flex-col items-center justify-center bg-white rounded-2xl border border-red-200 gap-3 p-4 text-center"
                        >
                            <AlertCircle className="w-8 h-8 text-red-500" />
                            <p className="text-red-600 text-sm">{error}</p>
                        </motion.div>
                    ) : qrDataUrl ? (
                        <motion.div
                            key={qrDataUrl}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="rounded-2xl overflow-hidden border-2 border-hmif-green-300 shadow-lg shadow-hmif-green-900/10"
                        >
                            <img src={qrDataUrl} alt="QR Code Presensi" className="w-[280px] h-[280px]" />
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {!loading && !error && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                        <div className="flex items-center gap-1.5 bg-white border border-border rounded-full px-3 py-1 shadow-sm">
                            <RefreshCw
                                className="w-3 h-3 text-hmif-green-700 animate-spin"
                                style={{ animationDuration: '3s' }}
                            />
                            <span className="text-hmif-green-800 text-xs font-mono font-semibold">{countdown}s</span>
                        </div>
                    </div>
                )}
            </div>

            <Button
                onClick={fetchQr}
                disabled={loading}
                variant="outline"
                size="sm"
                className="gap-2 mt-2"
            >
                <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
                Perbarui QR
            </Button>
            <p className="text-muted-foreground text-xs text-center font-mono">
                QR Code berubah setiap {ttlRef.current} detik untuk keamanan
            </p>
        </div>
    );
}

export default function VoterDashboard({ voter, session, participation }: VoterDashboardProps) {
    const status = participation?.status ?? null;
    const canVote = status === 'present';
    const hasVoted = status === 'voted';
    const showQr = !!session && status === 'registered';

    return (
        <AppLayout title="Dashboard Pemilih" subtitle="Selamat datang di PEMIRA HMIF">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="bg-gradient-to-br from-hmif-green-50 to-white border-hmif-green-200">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14 border-2 border-white ring-2 ring-hmif-green-200 shadow-md">
                                    <AvatarImage src={voter.avatar} />
                                    <AvatarFallback className="bg-hmif-green-700 text-white text-xl font-bold">
                                        {voter.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-foreground font-bold text-lg leading-tight truncate">{voter.name}</p>
                                    <p className="text-muted-foreground text-sm font-mono truncate">{voter.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Session Info */}
                {session && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                    >
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-border">
                            <div>
                                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">Sesi Aktif</p>
                                <p className="text-foreground font-bold text-sm mt-0.5">{session.name}</p>
                            </div>
                            <Badge className="bg-hmif-green-700 text-white gap-1.5">
                                <span className="relative flex w-1.5 h-1.5">
                                    <span className="absolute inline-flex w-full h-full rounded-full bg-hmif-yellow-300 opacity-75 animate-ping" />
                                    <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-hmif-yellow-300" />
                                </span>
                                LIVE
                            </Badge>
                        </div>
                    </motion.div>
                )}

                {/* Status Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <StatusBanner status={status} />
                </motion.div>

                {/* QR Code Section */}
                {showQr && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <QrCode className="w-5 h-5 text-hmif-green-700" />
                                    QR Code Presensi
                                </CardTitle>
                                <p className="text-muted-foreground text-xs">
                                    Tunjukkan QR ini kepada petugas di TPS untuk verifikasi kehadiran
                                </p>
                            </CardHeader>
                            <CardContent className="flex justify-center pb-6">
                                <QrDisplay voterId={voter.id} />
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Vote Button */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className={cn(
                        'transition-all overflow-hidden',
                        canVote
                            ? 'border-hmif-green-300 bg-gradient-to-br from-hmif-green-50 to-white shadow-lg shadow-hmif-green-900/10'
                            : hasVoted
                                ? 'border-hmif-blue-200 bg-hmif-blue-50/50'
                                : 'border-border opacity-60'
                    )}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'w-12 h-12 rounded-2xl flex items-center justify-center',
                                        canVote ? 'bg-hmif-green-700 shadow-md shadow-hmif-green-900/20' :
                                        hasVoted ? 'bg-hmif-blue-100' : 'bg-muted'
                                    )}>
                                        <Vote className={cn(
                                            'w-6 h-6',
                                            canVote ? 'text-white' :
                                            hasVoted ? 'text-hmif-blue-700' : 'text-muted-foreground'
                                        )} />
                                    </div>
                                    <div>
                                        <p className={cn(
                                            'font-bold',
                                            canVote ? 'text-hmif-green-900' :
                                            hasVoted ? 'text-hmif-blue-900' : 'text-muted-foreground'
                                        )}>
                                            Pemungutan Suara
                                        </p>
                                        <p className="text-muted-foreground text-xs mt-0.5">
                                            {hasVoted
                                                ? 'Suara telah dicatat secara anonim'
                                                : canVote
                                                    ? 'Pilih kandidat terbaik menurutmu'
                                                    : 'Lakukan presensi terlebih dahulu'
                                            }
                                        </p>
                                    </div>
                                </div>

                                {canVote && !hasVoted ? (
                                    <Link href={route('voter.vote')}>
                                        <Button className="gap-2 shadow-lg shadow-hmif-green-900/20">
                                            Mulai Memilih
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                ) : hasVoted ? (
                                    <Badge variant="info" className="gap-1.5">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Selesai
                                    </Badge>
                                ) : (
                                    <Button disabled variant="outline" className="cursor-not-allowed">
                                        Terkunci
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Privacy Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-hmif-green-50 border border-hmif-green-100">
                        <Shield className="w-4 h-4 text-hmif-green-700 flex-shrink-0 mt-0.5" />
                        <p className="text-hmif-green-800 text-xs leading-relaxed">
                            Suara Anda dijamin anonim. Sistem tidak menyimpan hubungan antara identitas pemilih dengan pilihan kandidat.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}
