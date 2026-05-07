import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { QrCode, Users, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface PetugasDashboardProps {
    session: {
        id: number;
        name: string;
        participations_count: number;
        ballot_boxes_count: number;
    } | null;
    recentScans: Array<{
        id: number;
        user: { id: number; name: string; email: string; avatar?: string };
        status: string;
        present_at: string;
    }>;
}

export default function PetugasDashboard({ session, recentScans }: PetugasDashboardProps) {
    return (
        <AppLayout title="Dashboard Petugas">
            <div className="max-w-3xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-2xl font-bold text-white"
                        style={{ fontFamily: "'DM Serif Display', serif" }}>
                        Panel Petugas
                    </h2>
                    <p className="text-emerald-500/50 text-sm mt-1">Kelola presensi pemilih</p>
                </motion.div>

                {/* Session Info */}
                {session ? (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                        <Card className="bg-gradient-to-br from-emerald-950/80 to-[#0f2318]/60 border-emerald-700/40">
                            <CardHeader>
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <CardTitle className="text-white text-base">{session.name}</CardTitle>
                                    <Badge className="bg-emerald-700/30 text-emerald-300 border-emerald-700 font-mono text-xs animate-pulse">
                                        AKTIF
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-black/20 rounded-xl p-4 border border-emerald-900/20">
                                        <p className="text-emerald-500/50 text-xs font-mono mb-1">Sudah Presensi</p>
                                        <p className="text-3xl font-bold text-white"
                                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                                            {session.participations_count}
                                        </p>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-4 border border-emerald-900/20">
                                        <p className="text-emerald-500/50 text-xs font-mono mb-1">Suara Masuk</p>
                                        <p className="text-3xl font-bold text-white"
                                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                                            {session.ballot_boxes_count}
                                        </p>
                                    </div>
                                </div>
                                <Link href={route('petugas.scan')}>
                                    <Button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white gap-2 h-12">
                                        <QrCode className="w-5 h-5" />
                                        Buka Scanner QR
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                        <Card className="bg-[#0f2318]/40 border-emerald-900/20">
                            <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                                <AlertCircle className="w-10 h-10 text-emerald-900" />
                                <p className="text-emerald-700 text-sm">Tidak ada sesi pemilihan aktif</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Recent Scans */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="bg-[#0f2318]/60 border-emerald-900/30">
                        <CardHeader>
                            <CardTitle className="text-white text-base flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-500" />
                                Presensi Terkini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentScans.length === 0 ? (
                                <p className="text-emerald-800 text-sm text-center py-6">Belum ada presensi</p>
                            ) : (
                                <div className="space-y-2">
                                    {recentScans.map((scan, i) => (
                                        <motion.div
                                            key={scan.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.15 + i * 0.04 }}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-emerald-900/20"
                                        >
                                            <Avatar className="w-9 h-9 border border-emerald-800/40">
                                                <AvatarImage src={scan.user.avatar} />
                                                <AvatarFallback className="bg-emerald-900/60 text-emerald-300 text-xs">
                                                    {scan.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{scan.user.name}</p>
                                                <p className="text-emerald-600/50 text-xs font-mono truncate">{scan.user.email}</p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'text-xs font-mono flex-shrink-0',
                                                    scan.status === 'voted'
                                                        ? 'bg-blue-900/40 text-blue-300 border-blue-800'
                                                        : 'bg-emerald-900/40 text-emerald-300 border-emerald-800'
                                                )}
                                            >
                                                {scan.status === 'voted' ? 'Voted' : 'Hadir'}
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
