import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import QRCode from 'qrcode';
import {
    CheckCircle2, Clock, QrCode, Vote, AlertCircle,
    RefreshCw, ChevronRight, Loader2
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
        <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <AlertCircle className="w-5 h-5 text-zinc-500 flex-shrink-0" />
            <div>
                <p className="text-zinc-400 font-medium text-sm">Tidak Ada Sesi Aktif</p>
                <p className="text-zinc-600 text-xs mt-0.5">Belum ada sesi pemilihan yang dibuka</p>
            </div>
        </div>
    );

    const map: Record<ParticipationStatus, {
        icon: React.ElementType;
        label: string;
        desc: string;
        cls: string;
        iconCls: string;
    }> = {
        registered: {
            icon: Clock,
            label: 'Belum Presensi',
            desc: 'Tampilkan QR Code ke petugas untuk melakukan presensi',
            cls: 'bg-amber-950/40 border-amber-800/40',
            iconCls: 'text-amber-400',
        },
        present: {
            icon: CheckCircle2,
            label: 'Siap Memilih',
            desc: 'Presensi telah dicatat. Anda dapat melakukan pemungutan suara',
            cls: 'bg-emerald-950/40 border-emerald-700/40',
            iconCls: 'text-emerald-400',
        },
        voted: {
            icon: CheckCircle2,
            label: 'Sudah Memilih',
            desc: 'Terima kasih! Suara Anda telah berhasil dicatat secara anonim',
            cls: 'bg-blue-950/40 border-blue-800/40',
            iconCls: 'text-blue-400',
        },
    };

    const { icon: Icon, label, desc, cls, iconCls } = map[status];

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex items-start gap-3 p-4 rounded-xl border', cls)}
        >
            <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconCls)} />
            <div>
                <p className={cn('font-semibold text-sm', iconCls)}>{label}</p>
                <p className="text-emerald-500/50 text-xs mt-0.5">{desc}</p>
            </div>
        </motion.div>
    );
}

function QrDisplay({ voterId }: { voterId: number }) {
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [countdown, setCountdown]  = useState(100);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState('');

    // Simpan ttl dari backend tanpa trigger re-render interval
    const ttlRef       = useRef(100);
    const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchQr = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(route('voter.qr.generate'));
            const { token, ttl } = res.data;

            const dataUrl = await QRCode.toDataURL(token, {
                width: 280,
                margin: 2,
                color: { dark: '#d1fae5', light: '#0a1a0f' },
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

    // Auto-refresh — interval mengikuti ttl dari backend
    useEffect(() => {
        fetchQr();

        const startInterval = () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                fetchQr();
            }, ttlRef.current * 1000);
        };

        // Tunggu fetch pertama selesai baru set interval
        const initTimeout = setTimeout(startInterval, 500);

        return () => {
            clearTimeout(initTimeout);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchQr]);

    // Countdown timer — hitung mundur dari ttl
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
                            className="w-[280px] h-[280px] flex items-center justify-center bg-[#0a1a0f] rounded-2xl border border-emerald-900/40"
                        >
                            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="w-[280px] h-[280px] flex flex-col items-center justify-center bg-[#0a1a0f] rounded-2xl border border-red-900/40 gap-3 p-4 text-center"
                        >
                            <AlertCircle className="w-8 h-8 text-red-500" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </motion.div>
                    ) : qrDataUrl ? (
                        <motion.div
                            key={qrDataUrl}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="rounded-2xl overflow-hidden border-2 border-emerald-700/40 shadow-lg shadow-emerald-900/30"
                        >
                            <img src={qrDataUrl} alt="QR Code Presensi" className="w-[280px] h-[280px]" />
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {/* Countdown badge */}
                {!loading && !error && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                        <div className="flex items-center gap-1.5 bg-[#0f2318] border border-emerald-800/40 rounded-full px-3 py-1">
                            <RefreshCw
                                className="w-3 h-3 text-emerald-500 animate-spin"
                                style={{ animationDuration: '3s' }}
                            />
                            <span className="text-emerald-400 text-xs font-mono">{countdown}s</span>
                        </div>
                    </div>
                )}
            </div>

            <Button
                onClick={fetchQr}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-emerald-800 text-emerald-400 hover:bg-emerald-900/30 gap-2 mt-2"
            >
                <RefreshCw className={cn('w-3 h-3', loading && 'animate-spin')} />
                Perbarui QR
            </Button>
            <p className="text-emerald-700/60 text-xs text-center font-mono">
                QR Code berubah setiap {ttlRef.current} detik untuk keamanan
            </p>
        </div>
    );
}

export default function VoterDashboard({ voter, session, participation }: VoterDashboardProps) {
    const status   = participation?.status ?? null;
    const canVote  = status === 'present';
    const hasVoted = status === 'voted';
    const showQr   = !!session && status === 'registered';

    return (
        <AppLayout title="Dashboard Pemilih">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <Avatar className="w-14 h-14 border-2 border-emerald-700/40 shadow-lg">
                        <AvatarImage src={voter.avatar} />
                        <AvatarFallback className="bg-emerald-900/60 text-emerald-300 text-xl">
                            {voter.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-white font-bold text-lg leading-tight">{voter.name}</p>
                        <p className="text-emerald-500/50 text-sm font-mono">{voter.email}</p>
                    </div>
                </motion.div>

                {/* Session Info */}
                {session && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                    >
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-900/10 border border-emerald-900/30">
                            <div>
                                <p className="text-emerald-500/50 text-xs font-mono uppercase">Sesi Aktif</p>
                                <p className="text-white font-medium text-sm mt-0.5">{session.name}</p>
                            </div>
                            <Badge className="bg-emerald-700/30 text-emerald-300 border-emerald-700 text-xs font-mono animate-pulse">
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
                        <Card className="bg-[#0f2318]/60 border-emerald-900/30">
                            <CardHeader>
                                <CardTitle className="text-white text-base flex items-center gap-2">
                                    <QrCode className="w-5 h-5 text-emerald-400" />
                                    QR Code Presensi
                                </CardTitle>
                                <p className="text-emerald-500/50 text-xs">
                                    Tunjukkan QR ini kepada petugas untuk presensi
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
                        'border transition-all',
                        canVote
                            ? 'bg-gradient-to-br from-emerald-950/80 to-[#0f2318]/60 border-emerald-700/50 shadow-lg shadow-emerald-900/20'
                            : 'bg-[#0f2318]/30 border-emerald-900/20 opacity-60'
                    )}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'w-12 h-12 rounded-xl flex items-center justify-center',
                                        canVote ? 'bg-emerald-700/40' : 'bg-emerald-950/40'
                                    )}>
                                        <Vote className={cn(
                                            'w-6 h-6',
                                            canVote ? 'text-emerald-300' : 'text-emerald-800'
                                        )} />
                                    </div>
                                    <div>
                                        <p className={cn(
                                            'font-semibold',
                                            canVote ? 'text-white' : 'text-emerald-800'
                                        )}>
                                            Pemungutan Suara
                                        </p>
                                        <p className="text-emerald-600/50 text-xs mt-0.5">
                                            {hasVoted
                                                ? 'Suara telah dicatat'
                                                : canVote
                                                    ? 'Pilih kandidat favoritmu'
                                                    : 'Lakukan presensi terlebih dahulu'
                                            }
                                        </p>
                                    </div>
                                </div>

                                {canVote && !hasVoted ? (
                                    <Link href={route('voter.vote')}>
                                        <Button className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2 shadow-lg shadow-emerald-900/40">
                                            Mulai Memilih
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                ) : hasVoted ? (
                                    <Badge className="bg-blue-900/40 text-blue-300 border-blue-800 font-mono">
                                        ✓ Selesai
                                    </Badge>
                                ) : (
                                    <Button disabled className="bg-emerald-950 text-emerald-800 cursor-not-allowed">
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
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/20">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <p className="text-emerald-700 text-xs leading-relaxed">
                            Suara Anda dijamin anonim. Sistem tidak menyimpan hubungan antara identitas pemilih dengan pilihan kandidat.
                        </p>
                    </div>
                </motion.div>

            </div>
        </AppLayout>
    );
}