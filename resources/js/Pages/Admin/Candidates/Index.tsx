import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Users, Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Candidate, ElectionSession } from '@/types';

interface CandidatesPageProps {
    sessions:   ElectionSession[];
    candidates: (Candidate & { election_session: ElectionSession; ballot_boxes_count: number })[];
}

export default function CandidatesPage({ sessions, candidates }: CandidatesPageProps) {
    const [createOpen,    setCreateOpen]    = useState(false);
    const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
    const [deleteTarget,  setDeleteTarget]  = useState<Candidate | null>(null);

    const createForm = useForm({
        election_session_id: '',
        number:     '1',
        name:       '',
        vice_name:  '',
        vision:     '',
        mission:    '',
    });

    const editForm = useForm({
        number:    '1',
        name:      '',
        vice_name: '',
        vision:    '',
        mission:   '',
    });

    const handleCreate = () => {
        createForm.post(route('admin.candidates.store'), {
            onSuccess: () => { setCreateOpen(false); createForm.reset(); },
        });
    };

    const openEdit = (c: Candidate) => {
        setEditCandidate(c);
        editForm.setData({
            number:    String(c.number),
            name:      c.name,
            vice_name: c.vice_name ?? '',
            vision:    c.vision   ?? '',
            mission:   c.mission  ?? '',
        });
    };

    const handleEdit = () => {
        if (!editCandidate) return;
        editForm.put(route('admin.candidates.update', editCandidate.id), {
            onSuccess: () => setEditCandidate(null),
        });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('admin.candidates.destroy', deleteTarget.id), {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <AppLayout title="Kandidat" subtitle={`${candidates.length} kandidat terdaftar`}>
            <div className="max-w-5xl mx-auto space-y-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground font-serif">
                            Manajemen Kandidat
                        </h2>
                        <p className="text-muted-foreground text-sm mt-1">{candidates.length} kandidat terdaftar</p>
                    </div>
                    <Button onClick={() => setCreateOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> Tambah Kandidat
                    </Button>
                </motion.div>

                {/* Grid */}
                {candidates.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center py-16 gap-3">
                            <Users className="w-10 h-10 text-muted-foreground/30" />
                            <p className="text-muted-foreground text-sm">Belum ada kandidat</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {candidates.map((c, i) => (
                            <motion.div key={c.id}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}>
                                <Card className="hover:shadow-md hover:border-hmif-green-200 transition-all">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between gap-4 flex-wrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-hmif-green-100 flex items-center justify-center text-hmif-green-800 font-bold flex-shrink-0">
                                                    {c.number}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-10 h-10 border border-border">
                                                        <AvatarImage src={c.photo ? `/storage/${c.photo}` : undefined} />
                                                        <AvatarFallback>
                                                            {c.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-foreground font-semibold text-sm">{c.name}</p>
                                                        {c.vice_name && (
                                                            <p className="text-muted-foreground text-xs">& {c.vice_name}</p>
                                                        )}
                                                        <p className="text-muted-foreground text-xs font-mono mt-0.5">
                                                            {(c as any).election_session?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground text-xs font-mono">{c.ballot_boxes_count} suara</span>
                                                <Button onClick={() => openEdit(c)} variant="outline" size="icon-sm">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button onClick={() => setDeleteTarget(c)} variant="outline" size="icon-sm"
                                                    className="border-red-200 text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                        {c.vision && (
                                            <p className="text-muted-foreground text-xs mt-3 line-clamp-2 pl-14">
                                                <span className="font-medium text-foreground">Visi:</span> {c.vision}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tambah Kandidat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label>Sesi Pemilihan *</Label>
                            <Select value={createForm.data.election_session_id}
                                onValueChange={v => createForm.setData('election_session_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih sesi..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {sessions.map(s => (
                                        <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {createForm.errors.election_session_id && <p className="text-red-600 text-xs">{createForm.errors.election_session_id}</p>}
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="space-y-1.5">
                                <Label>No. Urut</Label>
                                <Input type="number" min="1" value={createForm.data.number}
                                    onChange={e => createForm.setData('number', e.target.value)} />
                            </div>
                            <div className="col-span-3 space-y-1.5">
                                <Label>Nama Ketua *</Label>
                                <Input value={createForm.data.name}
                                    onChange={e => createForm.setData('name', e.target.value)}
                                    placeholder="Nama lengkap" />
                                {createForm.errors.name && <p className="text-red-600 text-xs">{createForm.errors.name}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Nama Wakil (opsional)</Label>
                            <Input value={createForm.data.vice_name}
                                onChange={e => createForm.setData('vice_name', e.target.value)}
                                placeholder="Nama wakil" />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Visi</Label>
                            <Textarea value={createForm.data.vision}
                                onChange={e => createForm.setData('vision', e.target.value)}
                                className="resize-none" rows={2} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Misi</Label>
                            <Textarea value={createForm.data.mission}
                                onChange={e => createForm.setData('mission', e.target.value)}
                                className="resize-none" rows={2} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
                        <Button onClick={handleCreate} disabled={createForm.processing} className="gap-2">
                            {createForm.processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editCandidate} onOpenChange={() => setEditCandidate(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Kandidat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-4 gap-3">
                            <div className="space-y-1.5">
                                <Label>No. Urut</Label>
                                <Input type="number" min="1" value={editForm.data.number}
                                    onChange={e => editForm.setData('number', e.target.value)} />
                            </div>
                            <div className="col-span-3 space-y-1.5">
                                <Label>Nama Ketua</Label>
                                <Input value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Nama Wakil</Label>
                            <Input value={editForm.data.vice_name}
                                onChange={e => editForm.setData('vice_name', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Visi</Label>
                            <Textarea value={editForm.data.vision}
                                onChange={e => editForm.setData('vision', e.target.value)}
                                className="resize-none" rows={2} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Misi</Label>
                            <Textarea value={editForm.data.mission}
                                onChange={e => editForm.setData('mission', e.target.value)}
                                className="resize-none" rows={2} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditCandidate(null)}>Batal</Button>
                        <Button onClick={handleEdit} disabled={editForm.processing} className="gap-2">
                            {editForm.processing && <Loader2 className="w-4 h-4 animate-spin" />}
                            Perbarui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Kandidat?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Kandidat &ldquo;<span className="font-medium text-foreground">{deleteTarget?.name}</span>&rdquo; akan dihapus beserta semua suara terkait.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
