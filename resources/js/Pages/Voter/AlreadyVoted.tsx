import { motion } from 'framer-motion';
import { CheckCircle2, Shield, PartyPopper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/brand/Logo';
import type { User } from '@/types';

interface AlreadyVotedProps {
    voter: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
}

export default function AlreadyVoted({ voter }: AlreadyVotedProps) {
    return (
        <div className="min-h-screen bg-hero-mesh relative overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-dotgrid opacity-40 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-hmif-yellow-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-hmif-green-700/10 blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center relative z-10"
            >
                {/* Success icon */}
                <div className="mb-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2, stiffness: 200, damping: 15 }}
                        className="relative"
                    >
                        <div className="w-28 h-28 rounded-full bg-hmif-green-100 border-4 border-hmif-green-200 flex items-center justify-center">
                            <CheckCircle2 className="w-14 h-14 text-hmif-green-700" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-2 -right-2"
                        >
                            <PartyPopper className="w-8 h-8 text-hmif-yellow-600" />
                        </motion.div>
                    </motion.div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
                    Terima Kasih!
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                    Suara Anda telah berhasil dicatat
                </p>

                <Card className="mb-6 text-left">
                    <CardContent className="p-5 space-y-4">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-hmif-green-50 border border-hmif-green-100">
                            <Shield className="w-5 h-5 text-hmif-green-700 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-hmif-green-900 font-semibold text-sm">Suara Dijamin Anonim</p>
                                <p className="text-hmif-green-800/70 text-xs mt-0.5 leading-relaxed">
                                    Tidak ada data yang menghubungkan identitas Anda dengan pilihan kandidat.
                                </p>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-xs text-center">
                            Anda telah menyelesaikan proses pemungutan suara.
                            Hasil akan diumumkan setelah sesi pemilihan ditutup oleh administrator.
                        </p>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center">
                    <Logo size={36} withText />
                </div>
            </motion.div>
        </div>
    );
}
