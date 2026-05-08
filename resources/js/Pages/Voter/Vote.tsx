import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, router } from '@inertiajs/react';
import {
    CheckCircle2, ChevronRight, Shield,
    Loader2, ArrowLeft
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { Candidate, ElectionSession, User } from '@/types';

interface VotePageProps {
    voter:      Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
    session:    Pick<ElectionSession, 'id' | 'name'>;
    candidates: Candidate[];
}

function CandidateCard({
    candidate,
    selected,
    onSelect,
}: {
    candidate: Candidate;
    selected:  boolean;
    onSelect:  () => void;
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onSelect}
            type="button"
            className={cn(
                'w-full text-left rounded-2xl border p-5 transition-all cursor-pointer',
                selected
                    ? 'bg-emerald-950/60 border-emerald-600/60 shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-600/30'
                    : 'bg-[#0f2318]/40 border-emerald-900/30 hover:border-emerald-800/50 hover:bg-[#0f2318]/60'
            )}
        >
            <div className="flex items-start gap-4">
                {/* Nomor urut */}
                <div
                    className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold transition-all',
                        selected ? 'bg-emerald-700 text-white' : 'bg-emerald-950/60 text-emerald-600'
                    )}
                    style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                    {candidate.number}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                            <p className={cn(
                                'font-bold text-base leading-tight',
                                selected ? 'text-white' : 'text-emerald-200/80'
                            )}>
                                {candidate.name}
                            </p>
                            {candidate.vice_name && (
                                <p className="text-emerald-500/60 text-xs mt-0.5 font-mono">
                                    & {candidate.vice_name}
                                </p>
                            )}
                        </div>

                        {/* Foto */}
                        <div className="flex -space-x-2">
                            <Avatar className="w-10 h-10 border-2 border-emerald-900">
                                <AvatarImage src={candidate.photo ? `/storage/${candidate.photo}` : undefined} />
                                <AvatarFallback className="bg-emerald-800/60 text-emerald-300 text-xs">
                                    {candidate.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            {candidate.vice_name && (
                                <Avatar className="w-10 h-10 border-2 border-emerald-900">
                                    <AvatarImage src={candidate.vice_photo ? `/storage/${candidate.vice_photo}` : undefined} />
                                    <AvatarFallback className="bg-emerald-900/60 text-emerald-400 text-xs">
                                        {candidate.vice_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </div>

                    {candidate.vision && (
                        <p className="text-emerald-600/50 text-xs mt-2 line-clamp-2 leading-relaxed">
                            {candidate.vision}
                        </p>
                    )}

                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1.5 mt-2"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-semibold">Dipilih</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.button>
    );
}

export default function VotePage({ voter, session, candidates }: VotePageProps) {
    const [selectedId,   setSelectedId]   = useState<number | null>(null);
    const [confirmOpen,  setConfirmOpen]  = useState(false);
    const [submitting,   setSubmitting]   = useState(false);

    const selectedCandidate = candidates.find(c => c.id === selectedId);

    const handleConfirm = () => {
        if (!selectedId || submitting) return;

        setSubmitting(true);

        // Gunakan router.post langsung — lebih reliable dari useForm untuk kasus ini
        router.post(
            route('voter.vote.submit'),
            { candidate_id: selectedId },
            {
                onSuccess: () => {
                    setConfirmOpen(false);
                    setSubmitting(false);
                },
                onError: () => {
                    setSubmitting(false);
                },
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout title="Pemungutan Suara">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                >
                    <Link href={route('voter.dashboard')}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-400 -ml-2 mb-1 gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Button>
                    </Link>
                    <h2
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                        {session.name}
                    </h2>
                    <p className="text-emerald-500/50 text-sm">
                        Pilih salah satu kandidat di bawah ini
                    </p>
                </motion.div>

                {/* Privacy reminder */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/30">
                        <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <p className="text-emerald-700 text-xs">
                            Suara bersifat rahasia. Pilihan tidak dapat diubah setelah dikonfirmasi.
                        </p>
                    </div>
                </motion.div>

                {/* Daftar Kandidat */}
                <div className="space-y-3">
                    {candidates.map((candidate, i) => (
                        <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.07 }}
                        >
                            <CandidateCard
                                candidate={candidate}
                                selected={selectedId === candidate.id}
                                onSelect={() => setSelectedId(candidate.id)}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Tombol Lanjutkan */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Button
                        onClick={() => selectedId && setConfirmOpen(true)}
                        disabled={!selectedId}
                        className={cn(
                            'w-full h-13 text-base font-semibold gap-2 transition-all',
                            selectedId
                                ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                                : 'bg-emerald-950 text-emerald-800 cursor-not-allowed'
                        )}
                    >
                        {selectedId
                            ? <><span>Lanjutkan ke Konfirmasi</span><ChevronRight className="w-5 h-5" /></>
                            : 'Pilih Kandidat Terlebih Dahulu'
                        }
                    </Button>
                </motion.div>
            </div>

            {/* Dialog Konfirmasi */}
            <Dialog open={confirmOpen} onOpenChange={open => {
                if (!submitting) setConfirmOpen(open);
            }}>
                <DialogContent className="bg-[#0f2318] border-emerald-800/50 text-white max-w-sm mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2 text-lg">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            Konfirmasi Pilihan
                        </DialogTitle>
                        <DialogDescription className="text-emerald-500/60 text-sm">
                            Pastikan pilihan Anda sudah benar. Suara tidak dapat diubah setelah dikonfirmasi.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedCandidate && (
                        <div className="my-2 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/40">
                            <p className="text-emerald-400/60 text-xs font-mono mb-2">Kandidat yang Dipilih</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {selectedCandidate.number}
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{selectedCandidate.name}</p>
                                    {selectedCandidate.vice_name && (
                                        <p className="text-emerald-500/50 text-xs">
                                            & {selectedCandidate.vice_name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 flex-row justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                            disabled={submitting}
                            className="border-emerald-800 text-emerald-400 hover:bg-emerald-900/30"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={submitting}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2"
                        >
                            {submitting
                                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Memproses...</span></>
                                : <><CheckCircle2 className="w-4 h-4" /><span>Ya, Konfirmasi</span></>
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}