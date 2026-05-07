import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, ClipboardList, Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { ElectionSession } from '@/types';

interface SessionsPageProps {
    sessions: (ElectionSession & {
        participations_count: number;
        ballot_boxes_count: number;
        candidates_count: number;
    })[];
}

function StatusBadge({ status }: { status: ElectionSession['status'] }) {
    const map = {
        draft:  { label: 'Draft',   cls: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
        active: { label: 'Aktif',   cls: 'bg-emerald-900/60 text-emerald-300 border-emerald-700' },
        ended:  { label: 'Selesai', cls: 'bg-slate-800 text-slate-400 border-slate-700' },
    };
    const { label, cls } = map[status];
    return <Badge variant="outline" className={cn('text-xs font-mono', cls)}>{label}</Badge>;
}

export default function SessionsPage({ sessions }: SessionsPageProps) {
    const [createOpen,  setCreateOpen]  = useState(false);
    const [editSession, setEditSession] = useState<ElectionSession | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ElectionSession | null>(null);

    const createForm = useForm({ name: '', description: '', start_at: '', end_at: '' });

    const editForm = useForm({
        name: '', description: '',
        status: 'draft' as ElectionSession['status'],
        start_at: '', end_at: '',
    });

    const handleCreate = () => {
        createForm.post(route('admin.sessions.store'), {
            onSuccess: () => { setCreateOpen(false); createForm.reset(); },
        });
    };

    const openEdit = (s: ElectionSession) => {
        setEditSession(s);
        editForm.setData({
            name:        s.name,
            description: s.description ?? '',
            status:      s.status,
            start_at:    s.start_at ?? '',
            end_at:      s.end_at   ?? '',
        });
    };

    const handleEdit = () => {
        if (!editSession) return;
        editForm.put(route('admin.sessions.update', editSession.id), {
            onSuccess: () => setEditSession(null),
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('admin.sessions.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AppLayout title="Sesi Pemilihan">
            <div className="max-w-4xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-white"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            Sesi Pemilihan
                        </h2>
                        <p className="text-emerald-500/50 text-sm mt-1">{sessions.length} sesi terdaftar</p>
                    </div>
                    <Button onClick={() => setCreateOpen(true)}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2">
                        <Plus className="w-4 h-4" /> Buat Sesi Baru
                    </Button>
                </motion.div>

                <div className="space-y-3">
                    {sessions.length === 0 ? (
                        <Card className="bg-[#0f2318]/40 border-emerald-900/20">
                            <CardContent className="flex flex-col items-center py-16 gap-3">
                                <ClipboardList className="w-10 h-10 text-emerald-900" />
                                <p className="text-emerald-700 text-sm">Belum ada sesi pemilihan</p>
                            </CardContent>
                        </Card>
                    ) : sessions.map((s, i) => (
                        <motion.div key={s.id}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}>
                            <Card className="bg-[#0f2318]/60 border-emerald-900/30 hover:border-emerald-800/40 transition-all">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <StatusBadge status={s.status} />
                                                <h3 className="text-white font-semibold">{s.name}</h3>
                                            </div>
                                            {s.description && (
                                                <p className="text-emerald-500/40 text-xs mb-2 line-clamp-1">{s.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs font-mono text-emerald-700/50">
                                                <span>{s.candidates_count} kandidat</span>
                                                <span>{s.participations_count} pemilih</span>
                                                <span>{s.ballot_boxes_count} suara</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button onClick={() => openEdit(s)} variant="outline" size="sm"
                                                className="border-emerald-800 text-emerald-400 hover:bg-emerald-900/30 gap-1.5">
                                                <Pencil className="w-3.5 h-3.5" /> Edit
                                            </Button>
                                            {s.status !== 'active' && (
                                                <Button onClick={() => setDeleteTarget(s)} variant="outline" size="sm"
                                                    className="border-red-900 text-red-500 hover:bg-red-950/30">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            )}
                                        </div>
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
                    <DialogHeader><DialogTitle>Buat Sesi Baru</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-emerald-300/80 text-sm">Nama Sesi *</Label>
                            <Input value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)}
                                className="bg-emerald-950/30 border-emerald-900/50 text-white"
                                placeholder="Pemilihan Ketua Himpunan 2025" />
                            {createForm.errors.name && <p className="text-red-400 text-xs">{createForm.errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-emerald-300/80 text-sm">Deskripsi</Label>
                            <Textarea value={createForm.data.description}
                                onChange={e => createForm.setData('description', e.target.value)}
                                className="bg-emerald-950/30 border-emerald-900/50 text-white resize-none" rows={3} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-emerald-300/80 text-sm">Mulai</Label>
                                <Input type="datetime-local" value={createForm.data.start_at}
                                    onChange={e => createForm.setData('start_at', e.target.value)}
                                    className="bg-emerald-950/30 border-emerald-900/50 text-white text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-emerald-300/80 text-sm">Berakhir</Label>
                                <Input type="datetime-local" value={createForm.data.end_at}
                                    onChange={e => createForm.setData('end_at', e.target.value)}
                                    className="bg-emerald-950/30 border-emerald-900/50 text-white text-sm" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}
                            className="border-emerald-800 text-emerald-400 hover:bg-emerald-900/30">Batal</Button>
                        <Button onClick={handleCreate} disabled={createForm.processing}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2">
                            {createForm.processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editSession} onOpenChange={() => setEditSession(null)}>
                <DialogContent className="bg-[#0f2318] border-emerald-800/50 text-white max-w-md">
                    <DialogHeader><DialogTitle>Edit Sesi</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-emerald-300/80 text-sm">Nama Sesi</Label>
                            <Input value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)}
                                className="bg-emerald-950/30 border-emerald-900/50 text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-emerald-300/80 text-sm">Status</Label>
                            <Select value={editForm.data.status}
                                onValueChange={(v: ElectionSession['status']) => editForm.setData('status', v)}>
                                <SelectTrigger className="bg-emerald-950/30 border-emerald-900/50 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f2318] border-emerald-800">
                                    <SelectItem value="draft"  className="text-white">Draft</SelectItem>
                                    <SelectItem value="active" className="text-emerald-300">Aktif</SelectItem>
                                    <SelectItem value="ended"  className="text-slate-400">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-emerald-300/80 text-sm">Mulai</Label>
                                <Input type="datetime-local" value={editForm.data.start_at}
                                    onChange={e => editForm.setData('start_at', e.target.value)}
                                    className="bg-emerald-950/30 border-emerald-900/50 text-white text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-emerald-300/80 text-sm">Berakhir</Label>
                                <Input type="datetime-local" value={editForm.data.end_at}
                                    onChange={e => editForm.setData('end_at', e.target.value)}
                                    className="bg-emerald-950/30 border-emerald-900/50 text-white text-sm" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditSession(null)}
                            className="border-emerald-800 text-emerald-400 hover:bg-emerald-900/30">Batal</Button>
                        <Button onClick={handleEdit} disabled={editForm.processing}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white gap-2">
                            {editForm.processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            Perbarui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent className="bg-[#0f2318] border-red-900/50 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Sesi?</AlertDialogTitle>
                        <AlertDialogDescription className="text-emerald-500/50">
                            Sesi "<span className="text-white">{deleteTarget?.name}</span>" dan semua data terkait akan dihapus permanen.
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
