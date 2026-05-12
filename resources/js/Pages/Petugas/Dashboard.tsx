import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { QrCode, Users, AlertCircle, Activity, Vote } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
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
        <AppLayout title="Panel Petugas" subtitle="Kelola presensi pemilih di TPS">
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Panel Petugas</h2>
                    <p className="text-muted-foreground text-sm mt-1">Verifikasi kehadiran pemilih</p>
                </motion.div>

                {session ? (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard
                                label="Sudah Presensi"
                                value={session.participations_count}
                                icon={Users}
                                tone="blue"
                                delay={0.05}
                                subtitle="Total hadir"
                            />
                            <StatCard
                                label="Suara Masuk"
                                value={session.ballot_boxes_count}
                                icon={Vote}
                                tone="green"
                                delay={0.1}
                                subtitle="Yang sudah vote"
                            />
                        </div>

                        {/* Session card with scan button */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <Card className="bg-gradient-to-br from-hmif-green-50 to-white border-hmif-green-200 overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-hmif-green-700 flex items-center justify-center">
                                                <Activity className="w-5 h-5 text-hmif-yellow-300" />
                                            </div>
                                            <div>
                                                <p className="text-foreground font-bold">{session.name}</p>
                                                <p className="text-muted-foreground text-xs">Sesi aktif</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-hmif-green-700 text-white gap-1.5">
                                            <span className="relative flex w-1.5 h-1.5">
                                                <span className="absolute inline-flex w-full h-full rounded-full bg-hmif-yellow-300 opacity-75 animate-ping" />
                                                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-hmif-yellow-300" />
                                            </span>
                                            AKTIF
                                        </Badge>
                                    </div>
                                    <Link href={route('petugas.scan')}>
                                        <Button className="w-full gap-2 h-12 shadow-lg shadow-hmif-green-900/15" size="lg">
                                            <QrCode className="w-5 h-5" />
                                            Buka Scanner QR
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                        <Card>
                            <EmptyState
                                icon={AlertCircle}
                                title="Tidak ada sesi pemilihan aktif"
                                description="Tunggu admin mengaktifkan sesi pemilihan untuk memulai scan presensi."
                            />
                        </Card>
                    </motion.div>
                )}

                {/* Recent Scans */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Users className="w-4 h-4 text-hmif-green-700" />
                                Presensi Terkini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentScans.length === 0 ? (
                                <EmptyState
                                    icon={Users}
                                    title="Belum ada presensi"
                                    description="Pemilih yang sudah di-scan akan muncul di sini."
                                />
                            ) : (
                                <div className="space-y-2">
                                    {recentScans.map((scan, i) => (
                                        <motion.div
                                            key={scan.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.25 + i * 0.04 }}
                                            className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-hmif-green-200 hover:bg-hmif-green-50/30 transition-all"
                                        >
                                            <Avatar className="w-9 h-9 border border-border">
                                                <AvatarImage src={scan.user.avatar} />
                                                <AvatarFallback className="text-xs">
                                                    {scan.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-foreground text-sm font-semibold truncate">{scan.user.name}</p>
                                                <p className="text-muted-foreground text-xs font-mono truncate">{scan.user.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-muted-foreground text-[10px] font-mono hidden sm:block">
                                                    {new Date(scan.present_at).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </span>
                                                <Badge
                                                    variant={scan.status === 'voted' ? 'info' : 'success'}
                                                    className="text-[10px]"
                                                >
                                                    {scan.status === 'voted' ? 'Voted' : 'Hadir'}
                                                </Badge>
                                            </div>
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
