import { motion } from 'framer-motion';
import { BarChart3, Users, Vote, Trophy, Lock } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ElectionSession, Candidate } from '@/types';

interface ReportSession extends ElectionSession {
  participations_count: number;
  ballot_boxes_count: number;
  candidates: (Candidate & { ballot_boxes_count: number })[];
}

interface ReportPageProps {
  sessions: ReportSession[];
  activeSession: ReportSession | null;
}

function CandidateBar({
  candidate, totalVotes, rank
}: {
  candidate: Candidate & { ballot_boxes_count: number };
  totalVotes: number;
  rank: number;
}) {
  const pct = totalVotes > 0 ? (candidate.ballot_boxes_count / totalVotes) * 100 : 0;
  const isWinner = rank === 1 && totalVotes > 0;

  return (
    <div className={cn(
      'p-4 rounded-xl border transition-all',
      isWinner ? 'bg-emerald-950/60 border-emerald-700/50' : 'bg-black/20 border-emerald-900/20'
    )}>
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          {isWinner && <Trophy className="w-4 h-4 text-amber-400" />}
          <span className="text-white font-semibold text-sm">
            {candidate.number}. {candidate.name}
          </span>
          {candidate.vice_name && (
            <span className="text-emerald-600/50 text-xs">& {candidate.vice_name}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-mono text-sm font-bold">
            {candidate.ballot_boxes_count}
          </span>
          <span className="text-emerald-700/50 text-xs font-mono">({pct.toFixed(1)}%)</span>
        </div>
      </div>
      <div className="h-2 bg-emerald-950/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', isWinner ? 'bg-emerald-500' : 'bg-emerald-800')}
        />
      </div>
    </div>
  );
}

function SessionReport({ session, index }: { session: ReportSession; index: number }) {
  const sorted = [...session.candidates].sort((a, b) => b.ballot_boxes_count - a.ballot_boxes_count);
  const participation = session.participations_count > 0
    ? Math.round((session.ballot_boxes_count / session.participations_count) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Card className="bg-[#0f2318]/60 border-emerald-900/30">
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-white text-lg">{session.name}</CardTitle>
              {session.end_at && (
                <p className="text-emerald-600/40 text-xs font-mono mt-1">
                  Berakhir: {new Date(session.end_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="text-center">
                <p className="text-emerald-400 font-bold text-lg">{session.participations_count}</p>
                <p className="text-emerald-700/50">Terdaftar</p>
              </div>
              <div className="w-px h-8 bg-emerald-900/40" />
              <div className="text-center">
                <p className="text-emerald-400 font-bold text-lg">{session.ballot_boxes_count}</p>
                <p className="text-emerald-700/50">Suara</p>
              </div>
              <div className="w-px h-8 bg-emerald-900/40" />
              <div className="text-center">
                <p className="text-emerald-400 font-bold text-lg">{participation}%</p>
                <p className="text-emerald-700/50">Partisipasi</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sorted.map((candidate, i) => (
            <CandidateBar
              key={candidate.id}
              candidate={candidate}
              totalVotes={session.ballot_boxes_count}
              rank={i + 1}
            />
          ))}
          {session.candidates.length === 0 && (
            <p className="text-emerald-800 text-sm text-center py-4">Tidak ada kandidat</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ReportPage({ sessions, activeSession }: ReportPageProps) {
  return (
    <AppLayout title="Laporan Pemilihan">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Laporan Pemilihan
          </h2>
          <p className="text-emerald-500/50 text-sm mt-1">Rekap hasil seluruh sesi pemilihan</p>
        </motion.div>

        {/* Active session (locked) */}
        {activeSession && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="bg-amber-950/20 border-amber-800/30">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-900/40 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-300 font-semibold text-sm">{activeSession.name} — Sedang Berlangsung</p>
                    <p className="text-amber-600/50 text-xs mt-0.5">
                      Hasil real-time tidak ditampilkan. Laporan tersedia setelah sesi ditutup.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="text-right">
                      <p className="text-amber-300 font-bold">{activeSession.participations_count}</p>
                      <p className="text-amber-700/50">Terdaftar</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-300 font-bold">{activeSession.ballot_boxes_count}</p>
                      <p className="text-amber-700/50">Suara masuk</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Ended sessions */}
        {sessions.length === 0 && !activeSession ? (
          <Card className="bg-[#0f2318]/40 border-emerald-900/20">
            <CardContent className="flex flex-col items-center py-16 gap-3">
              <BarChart3 className="w-10 h-10 text-emerald-900" />
              <p className="text-emerald-700 text-sm">Belum ada sesi yang selesai</p>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session, i) => (
            <SessionReport key={session.id} session={session} index={i} />
          ))
        )}
      </div>
    </AppLayout>
  );
}
