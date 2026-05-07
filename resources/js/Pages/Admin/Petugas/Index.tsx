import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, router } from '@inertiajs/react';
import { Plus, Trash2, UserCheck, Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Petugas {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface PetugasPageProps {
    petugas: Petugas[];
}

export default function PetugasPage({ petugas }: PetugasPageProps) {
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Petugas | null>(null);

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleCreate = () => {
        form.post(route('admin.petugas.store'), {
            onSuccess: () => { setCreateOpen(false); form.reset(); },
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('admin.petugas.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AppLayout title="Manajemen Petugas">
            <div className="max-w-3xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-white"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            Manajemen Petugas
                        </h2>
                        <p className="text-emerald-500/50 text-sm mt-1">{petugas.length} akun petugas</p>
                    </div>
                    <Button onClick={() => setCreateOpen(true)}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2">
                        <Plus className="w-4 h-4" /> Tambah Petugas
                    </Button>
                </motion.div>

                <div className="space-y-3">
                    {petugas.length === 0 ? (
                        <Card className="bg-[#0f2318]/40 border-emerald-900/20">
                            <CardContent className="flex flex-col items-center py-16 gap-3">
                                <UserCheck className="w-10 h-10 text-emerald-900" />
                                <p className="text-emerald-700 text-sm">Belum ada akun petugas</p>
                            </CardContent>
                        </Card>
                    ) : petugas.map((p, i) => (
                        <motion.div key={p.id}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}>
                            <Card className="bg-[#0f2318]/60 border-emerald-900/30 hover:border-emerald-800/40 transition-all">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10 border border-emerald-800/40">
                                                <AvatarFallback className="bg-blue-900/60 text-blue-300">
                                                    {p.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-white font-medium text-sm">{p.name}</p>
                                                <p className="text-emerald-600/50 text-xs font-mono">{p.email}</p>
                                                <p className="text-emerald-900/60 text-xs mt-0.5">
                                                    Dibuat: {new Date(p.created_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                        <Button onClick={() => setDeleteTarget(p)} variant="outline" size="sm"
                                            className="border-red-900 text-red-500 hover:bg-red-950/30">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="bg-[#0f2318] border-emerald-800/50 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Akun Petugas</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-emerald-300/80 text-sm">Nama Lengkap</Label>
                            <Input value={form.data.name} onChange={e => form.setData('name', e.target.value)}
                                className="bg-emerald-950/30 border-emerald-900/50 text-white"
                                placeholder="Nama Petugas" />
                            {form.errors.name && <p className="text-red-400 text-xs">{form.errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-emerald-300/80 text-sm">Email</Label>
                            <Input type="email" value={form.data.email} onChange={e => form.setData('email', e.target.value)}
                                className="bg-emerald-950/30 border-emerald-900/50 text-white"
                                placeholder="petugas@itera.ac.id" />
                            {form.errors.email && <p className="text-red-400 text-xs">{form.errors.email}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-emerald-300/80 text-sm">Password</Label>
                            <Input type="password" value={form.data.password}
                                onChange={e => form.setData('password', e.target.value)}
                                className="bg-emerald-950/30 border-emerald-900/50 text-white"
                                placeholder="Minimal 8 karakter" />
                            {form.errors.password && <p className="text-red-400 text-xs">{form.errors.password}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-emerald-300/80 text-sm">Konfirmasi Password</Label>
                            <Input type="password" value={form.data.password_confirmation}
                                onChange={e => form.setData('password_confirmation', e.target.value)}
                                className="bg-emerald-950/30 border-emerald-900/50 text-white" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}
                            className="border-emerald-800 text-emerald-400 hover:bg-emerald-900/30">Batal</Button>
                        <Button onClick={handleCreate} disabled={form.processing}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2">
                            {form.processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            Buat Akun
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent className="bg-[#0f2318] border-red-900/50 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Akun Petugas?</AlertDialogTitle>
                        <AlertDialogDescription className="text-emerald-500/50">
                            Akun "<span className="text-white">{deleteTarget?.name}</span>" akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-emerald-800 text-emerald-400 bg-transparent">Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-800 hover:bg-red-700">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
