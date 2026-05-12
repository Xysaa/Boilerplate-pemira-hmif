import { useState } from 'react';
import { motion } from 'framer-motion';
import { router } from '@inertiajs/react';
import {
    CheckCircle2, ChevronRight, Shield,
    Loader2, ArrowLeft,
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toaster';
import type { Candidate, ElectionSession, User } from '@/types';

interface VotePageProps {
    voter:      Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
    session:    Pick<ElectionSession, 'id' | 'name'>;
    candidates: Candidate[];
}

function CandidateCard({
    candidate, selected, onSelect,
}: {
    candidate: Candidate; selected: boolean; onSelect: () => void;
}) {
    return (
        <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            onClick={onSelect}
            type="button"
            className={cn(
                'w-full text-left rounded-2xl border p-5 transition-all cursor-pointer',
                selected
                    ? 'bg-hmif-green-50 border-hmif-green-500 shadow-lg shadow-hmif-green-900/10 ring-2 ring-hmif-green-500/30'
                    : 'bg-white border-border hover:border-hmif-green-300 hover:shadow-md hover:bg-hmif-green-50/30'
            )}
        >
            <div className="flex items-start gap-4">
                <div
                    className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-bold transition-all',
                        selected
                            ? 'bg-hmif-green-700 text-white shadow-md'
                            : 'bg-hmif-green-100 text-hmif-green-800'
                    )}
                >
                    {candidate.number}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                            <p className={cn(
                                'font-bold text-base leading-tight',
                                selected ? 'text-hmif-green-900' : 'text-foreground'
                            )}>
                                {candidate.name}
                            </p>
                            {candidate.vice_name && (
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    & {candidate.vice_name}
                                </p>
                            )}
                        </div>

                        <div className="flex -space-x-2">
                            <Avatar className="w-10 h-10 border-2 border-white ring-1 ring-border">
                                <AvatarImage src={candidate.photo ? `/storage/${candidate.photo}` : undefined} />
                                <AvatarFallback className="text-xs font-bold">
                                    {candidate.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            {candidate.vice_name && (
                                <Avatar className="w-10 h-10 border-2 border-white ring-1 ring-border">
                                    <AvatarImage src={candidate.vice_photo ? `/storage/${candidate.vice_photo}` : undefined} />
                                    <AvatarFallback className="bg-hmif-blue-100 text-hmif-blue-800 text-xs font-bold">
                                        {candidate.vice_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    </div>

                    {candidate.vision && (
                        <p className="text-muted-foreground text-xs mt-3 line-clamp-2 leading-relaxed">
                            <span className="font-semibold text-hmif-green-700">Visi:</span> {candidate.vision}
                        </p>
                    )}

                    {selected && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1.5 mt-3"
                        >
                            <CheckCircle2 className="w-4 h-4 text-hmif-green-700" />
                            <span className="text-hmif-green-700 text-xs font-bold">Dipilih</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.button>
    );
}

export default function VotePage({ voter, session, candidates }: VotePageProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const selectedCandidate = candidates.find(c => c.id === selectedId);

    const handleConfirm = () => {
        if (!selectedId || submitting) return;

        setSubmitting(true);

        router.post(
            route('voter.vote.submit'),
            { candidate_id: selectedId },
            {
                onSuccess: () => {
                    setConfirmOpen(false);
                    setSubmitting(false);
                    toast.success('Suara Anda berhasil dicatat!');
                },
                onError: () => {
                    setSubmitting(false);
                    toast.error('Gagal mengirim suara. Coba lagi.');
                },
                preserveScroll: true,
            }
        );
    };

    return (
        <AppLayout title="Pemungutan Suara" subtitle={session.name}>
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                >
                    <Link href={route('voter.dashboard')}>
                        <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2 mb-1 gap-1">
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Button>
                    </Link>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">
                        {session.name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Pilih salah satu kandidat di bawah ini
                    </p>
                </motion.div>

                {/* Privacy reminder */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-hmif-green-50 border border-hmif-green-100">
                        <Shield className="w-4 h-4 text-hmif-green-700 flex-shrink-0" />
                        <p className="text-hmif-green-800 text-xs">
                            Suara bersifat <b>rahasia</b>. Pilihan tidak dapat diubah setelah dikonfirmasi.
                        </p>
                    </div>
                </motion.div>

                {/* Candidates */}
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

                {/* Submit button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="sticky bottom-6"
                >
                    <Button
                        onClick={() => selectedId && setConfirmOpen(true)}
                        disabled={!selectedId}
                        size="lg"
                        className={cn(
                            'w-full gap-2 shadow-xl transition-all',
                            selectedId
                                ? 'shadow-hmif-green-900/20'
                                : 'opacity-60 cursor-not-allowed'
                        )}
                    >
                        {selectedId
                            ? <><span>Lanjutkan ke Konfirmasi</span><ChevronRight className="w-5 h-5" /></>
                            : 'Pilih Kandidat Terlebih Dahulu'
                        }
                    </Button>
                </motion.div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onOpenChange={open => {
                if (!submitting) setConfirmOpen(open);
            }}>
                <DialogContent className="max-w-sm mx-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <CheckCircle2 className="w-5 h-5 text-hmif-green-700" />
                            Konfirmasi Pilihan
                        </DialogTitle>
                        <DialogDescription>
                            Pastikan pilihan Anda sudah benar. <b>Suara tidak dapat diubah</b> setelah dikonfirmasi.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedCandidate && (
                        <div className="my-2 p-4 rounded-2xl bg-hmif-green-50 border border-hmif-green-200">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                                Kandidat yang Dipilih
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-hmif-green-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {selectedCandidate.number}
                                </div>
                                <div>
                                    <p className="text-foreground font-bold">{selectedCandidate.name}</p>
                                    {selectedCandidate.vice_name && (
                                        <p className="text-muted-foreground text-xs">
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
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={submitting}
                            className="gap-2"
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
