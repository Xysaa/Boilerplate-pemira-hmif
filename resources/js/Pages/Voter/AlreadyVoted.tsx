import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { User } from '@/types';

interface AlreadyVotedProps {
  voter: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
}

export default function AlreadyVoted({ voter }: AlreadyVotedProps) {
  return (
    <div className="min-h-screen bg-[#07130b] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #4ade80 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center relative z-10"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-emerald-900/40 border-2 border-emerald-700/40 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Terima Kasih!
        </h1>
        <p className="text-emerald-400/70 mb-8">Suara Anda telah berhasil dicatat</p>

        <Card className="bg-[#0f2318]/60 border-emerald-900/30 mb-6">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/20">
              <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-emerald-400/70 text-sm text-left">
                Suara Anda dijamin anonim. Tidak ada data yang menghubungkan identitas Anda dengan pilihan kandidat.
              </p>
            </div>
            <p className="text-emerald-700/50 text-xs font-mono">
              Akses sistem akan tersedia kembali setelah sesi pemilihan berikutnya dibuka oleh administrator.
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-emerald-800">
          <Leaf className="w-4 h-4" />
          <span className="text-xs font-mono">E-Vote ITERA · Himpunan Mahasiswa Informatika</span>
        </div>
      </motion.div>
    </div>
  );
}
