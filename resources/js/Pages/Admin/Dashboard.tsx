import { motion } from 'framer-motion';
import { Users, Vote, ClipboardList, UserCheck, Activity } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { AdminDashboardProps, ElectionSession } from '@/types';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

function StatCard({
  label, value, icon: Icon, accent, delay = 0,
}: {
  label: string; value: number | string; icon: React.ElementType; accent: string; delay?: number;
}) {
  return (
    <motion.div {...fadeUp(delay)}>
      <Card className="hover:shadow-md transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest mb-2">{label}</p>
              <p className="text-4xl font-bold text-foreground font-serif">
                {value}
              </p>
            </div>
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', accent)}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SessionStatusBadge({ status }: { status: ElectionSession['status'] }) {
  const map = {
    draft:  { label: 'Draft',   variant: 'outline' as const },
    active: { label: 'Aktif',   variant: 'success' as const },
    ended:  { label: 'Selesai', variant: 'secondary' as const },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant} className="text-xs font-mono">{label}</Badge>;
}

export default function AdminDashboard({ stats, sessions }: AdminDashboardProps) {
  const active = stats.active_session;
  const votePercent = active && active.total_voters > 0
    ? Math.round((active.total_votes / active.total_voters) * 100)
    : 0;
  const presentPercent = active && active.total_voters > 0
    ? Math.round((active.total_present / active.total_voters) * 100)
    : 0;

  return (
    <AppLayout title="Dashboard Admin" subtitle="Pantau dan kelola seluruh aktivitas pemilihan">
      {/* Hero Banner */}
      <motion.div {...fadeUp(0)} className="mb-8 rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold font-serif">
          Selamat Datang, Administrator
        </h2>
        <p className="text-white/70 text-sm mt-1">
          Pantau dan kelola seluruh aktivitas pemilihan
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Pemilih" value={stats.total_voters} icon={Users}
          accent="bg-hmif-green-100 text-hmif-green-700" delay={0.05} />
        <StatCard label="Total Petugas" value={stats.total_petugas} icon={UserCheck}
          accent="bg-hmif-blue-100 text-hmif-blue-700" delay={0.1} />
        <StatCard label="Total Sesi" value={stats.total_sessions} icon={ClipboardList}
          accent="bg-hmif-yellow-100 text-hmif-yellow-700" delay={0.15} />
        <StatCard
          label="Suara Masuk"
          value={active ? active.total_votes : '\u2014'}
          icon={Vote}
          accent="bg-hmif-green-100 text-hmif-green-700"
          delay={0.2}
        />
      </div>

      {/* Active Session Card */}
      {active && (
        <motion.div {...fadeUp(0.25)} className="mb-8">
          <Card className="border-hmif-green-200 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-hmif-green-600 animate-pulse" />
                  Sesi Aktif
                </CardTitle>
                <Badge variant="success" className="font-mono text-xs">
                  LIVE
                </Badge>
              </div>
              <p className="text-hmif-green-700 font-semibold mt-1">{active.name}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {/* Total Voters */}
                <div className="bg-muted rounded-xl p-4 border border-border">
                  <p className="text-muted-foreground text-xs font-mono mb-1">Terdaftar</p>
                  <p className="text-2xl font-bold text-foreground">{active.total_voters}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">pemilih</p>
                </div>

                {/* Present */}
                <div className="bg-muted rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground text-xs font-mono">Hadir</p>
                    <span className="text-hmif-green-700 text-xs font-mono">{presentPercent}%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{active.total_present}</p>
                  <div className="mt-2 h-1.5 bg-hmif-green-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${presentPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-full bg-hmif-green-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Voted */}
                <div className="bg-muted rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-muted-foreground text-xs font-mono">Sudah Vote</p>
                    <span className="text-hmif-green-700 text-xs font-mono">{votePercent}%</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{active.total_votes}</p>
                  <div className="mt-2 h-1.5 bg-hmif-green-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${votePercent}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full bg-hmif-green-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Sessions */}
      <motion.div {...fadeUp(0.3)}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-hmif-green-600" />
                Sesi Pemilihan Terkini
              </CardTitle>
              <Link href={route('admin.sessions.index')}>
                <Button variant="outline" size="sm" className="text-xs">
                  Kelola Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Belum ada sesi pemilihan</p>
                <Link href={route('admin.sessions.index')}>
                  <Button size="sm" className="mt-3">
                    Buat Sesi Pertama
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session, i) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border hover:border-hmif-green-200 transition-all flex-wrap gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        session.status === 'active' ? 'bg-hmif-green-500 animate-pulse' :
                        session.status === 'draft' ? 'bg-gray-400' : 'bg-gray-300'
                      )} />
                      <p className="text-foreground text-sm font-medium truncate">{session.name}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-muted-foreground text-xs font-mono hidden sm:block">
                        {session.participations_count ?? 0} pemilih &middot; {session.ballot_boxes_count ?? 0} suara
                      </span>
                      <SessionStatusBadge status={session.status} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
