import { motion } from 'framer-motion';
import { Users, Vote, ClipboardList, UserCheck, TrendingUp, Activity, CheckCircle2, Clock } from 'lucide-react';
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
      <Card className="bg-[#0f2318]/60 border-emerald-900/30 hover:border-emerald-700/40 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-500/60 text-xs font-mono uppercase tracking-widest mb-2">{label}</p>
              <p className="text-4xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
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
    draft:  { label: 'Draft',  cls: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
    active: { label: 'Aktif',  cls: 'bg-emerald-900/60 text-emerald-300 border-emerald-700 animate-pulse' },
    ended:  { label: 'Selesai', cls: 'bg-slate-800 text-slate-400 border-slate-700' },
  };
  const { label, cls } = map[status];
  return <Badge variant="outline" className={cn('text-xs font-mono', cls)}>{label}</Badge>;
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
    <AppLayout title="Dashboard Admin">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="mb-8">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Selamat Datang, Administrator
        </h2>
        <p className="text-emerald-500/50 text-sm mt-1 font-mono">
          Pantau dan kelola seluruh aktivitas pemilihan
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Pemilih" value={stats.total_voters} icon={Users}
          accent="bg-emerald-900/40 text-emerald-400" delay={0.05} />
        <StatCard label="Total Petugas" value={stats.total_petugas} icon={UserCheck}
          accent="bg-blue-900/40 text-blue-400" delay={0.1} />
        <StatCard label="Total Sesi" value={stats.total_sessions} icon={ClipboardList}
          accent="bg-amber-900/40 text-amber-400" delay={0.15} />
        <StatCard
          label="Suara Masuk"
          value={active ? active.total_votes : '—'}
          icon={Vote}
          accent="bg-emerald-700/40 text-emerald-300"
          delay={0.2}
        />
      </div>

      {/* Active Session Card */}
      {active && (
        <motion.div {...fadeUp(0.25)} className="mb-8">
          <Card className="bg-gradient-to-br from-emerald-950/80 to-[#0f2318]/60 border-emerald-700/40 shadow-lg shadow-emerald-900/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  Sesi Aktif
                </CardTitle>
                <Badge className="bg-emerald-700/40 text-emerald-300 border-emerald-600 font-mono text-xs">
                  LIVE
                </Badge>
              </div>
              <p className="text-emerald-300/80 font-semibold mt-1">{active.name}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {/* Total Voters */}
                <div className="bg-black/20 rounded-xl p-4 border border-emerald-900/20">
                  <p className="text-emerald-500/50 text-xs font-mono mb-1">Terdaftar</p>
                  <p className="text-2xl font-bold text-white">{active.total_voters}</p>
                  <p className="text-emerald-500/40 text-xs mt-0.5">pemilih</p>
                </div>

                {/* Present */}
                <div className="bg-black/20 rounded-xl p-4 border border-emerald-900/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-emerald-500/50 text-xs font-mono">Hadir</p>
                    <span className="text-emerald-400 text-xs font-mono">{presentPercent}%</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{active.total_present}</p>
                  <div className="mt-2 h-1.5 bg-emerald-950/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${presentPercent}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-full bg-emerald-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Voted */}
                <div className="bg-black/20 rounded-xl p-4 border border-emerald-900/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-emerald-500/50 text-xs font-mono">Sudah Vote</p>
                    <span className="text-emerald-400 text-xs font-mono">{votePercent}%</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{active.total_votes}</p>
                  <div className="mt-2 h-1.5 bg-emerald-950/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${votePercent}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full bg-emerald-400 rounded-full"
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
        <Card className="bg-[#0f2318]/60 border-emerald-900/30">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-500" />
                Sesi Pemilihan Terkini
              </CardTitle>
              <Link href={route('admin.sessions.index')}>
                <Button variant="outline" size="sm"
                  className="border-emerald-800 text-emerald-400 hover:bg-emerald-900/30 text-xs">
                  Kelola Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-10 h-10 text-emerald-900 mx-auto mb-3" />
                <p className="text-emerald-700 text-sm">Belum ada sesi pemilihan</p>
                <Link href={route('admin.sessions.index')}>
                  <Button size="sm" className="mt-3 bg-emerald-700 hover:bg-emerald-600 text-white">
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
                    className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-emerald-900/20 hover:border-emerald-800/40 transition-all flex-wrap gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        session.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                        session.status === 'draft' ? 'bg-zinc-500' : 'bg-slate-600'
                      )} />
                      <p className="text-white text-sm font-medium truncate">{session.name}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-emerald-500/50 text-xs font-mono hidden sm:block">
                        {session.participations_count ?? 0} pemilih · {session.ballot_boxes_count ?? 0} suara
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
