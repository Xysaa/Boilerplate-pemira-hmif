import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    CheckCircle2, ChevronRight, Clock, Shield, Sparkles, Users,
    Vote, BarChart3, QrCode, Activity, Calendar, ArrowRight, Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { cn } from '@/lib/utils';

interface LandingProps {
    activeSession: any;
    upcomingSession: any;
    latestEnded: any;
    candidates: any[];
    stats: { total_voters: number; total_sessions: number; total_candidates: number };
}

const NAV_SECTIONS = [
    { href: '#about', label: 'Tentang' },
    { href: '#candidates', label: 'Kandidat' },
    { href: '#how', label: 'Cara' },
];

function formatDate(d?: string | null) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Landing({ activeSession, upcomingSession, latestEnded, candidates, stats }: LandingProps) {
    const featuredSession = activeSession ?? upcomingSession;
    const isLive = !!activeSession;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <PublicNav sections={NAV_SECTIONS} />

            {/* Hero */}
            <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-hero-mesh overflow-hidden">
                <div className="absolute inset-0 bg-dotgrid opacity-60 pointer-events-none" />
                <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-hmif-yellow-500/10 blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border shadow-sm">
                            {isLive ? (
                                <>
                                    <span className="relative flex w-2 h-2">
                                        <span className="absolute inline-flex w-full h-full rounded-full bg-hmif-green-500 opacity-75 animate-ping" />
                                        <span className="relative inline-flex w-2 h-2 rounded-full bg-hmif-green-700" />
                                    </span>
                                    <span className="text-xs font-semibold text-hmif-green-800">Pemilihan Sedang Berlangsung</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3 h-3 text-hmif-yellow-600" />
                                    <span className="text-xs font-semibold text-foreground">PEMIRA HMIF · Edisi 2025</span>
                                </>
                            )}
                        </div>

                        <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05]">
                            Suaramu, masa depan{' '}
                            <span className="text-hmif-green-700">Informatika</span>.
                        </h1>

                        <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                            Platform resmi Pemilihan Raya Himpunan Mahasiswa Informatika Institut Teknologi Sumatera.
                            Aman, transparan, dan menjunjung kerahasiaan suara.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link href={route('login')}>
                                <Button size="lg" className="gap-2 shadow-lg shadow-hmif-green-900/20">
                                    <Vote className="w-5 h-5" /> Masuk untuk Memilih
                                </Button>
                            </Link>
                            <a href="#about">
                                <Button size="lg" variant="outline" className="gap-2">
                                    Pelajari Lebih Lanjut <ChevronRight className="w-4 h-4" />
                                </Button>
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-hmif-green-700" /><span>Suara Anonim</span></div>
                            <div className="flex items-center gap-2"><QrCode className="w-4 h-4 text-hmif-green-700" /><span>QR Verification</span></div>
                            <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-hmif-green-700" /><span>Real-time</span></div>
                        </div>
                    </motion.div>

                    {/* Session Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-hmif-yellow-500/20 via-hmif-green-700/10 to-hmif-blue-700/20 rounded-3xl blur-2xl" />
                        <Card className="relative p-8 bg-white/80 backdrop-blur-sm shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{isLive ? 'Sesi Aktif' : 'Sesi Mendatang'}</p>
                                {isLive && <Badge className="bg-hmif-green-700 text-white gap-1.5"><Activity className="w-3 h-3" />LIVE</Badge>}
                            </div>
                            {featuredSession ? (
                                <>
                                    <h3 className="text-2xl font-bold text-foreground mb-4">{featuredSession.name}</h3>
                                    <div className="space-y-2 py-4 border-t border-b border-border my-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" />Mulai</span>
                                            <span className="font-semibold">{formatDate(featuredSession.start_at)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" />Berakhir</span>
                                            <span className="font-semibold">{formatDate(featuredSession.end_at)}</span>
                                        </div>
                                    </div>
                                    <Link href={route('login')}>
                                        <Button className="w-full gap-2" size="lg">
                                            {isLive ? 'Gunakan Hak Suara' : 'Masuk'} <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <Clock className="w-10 h-10 text-hmif-green-700 mx-auto mb-3" />
                                    <p className="font-semibold">Belum ada sesi aktif</p>
                                    <p className="text-sm text-muted-foreground mt-1">Nantikan pengumuman berikutnya.</p>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-border bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-hmif-green-100 flex items-center justify-center"><Users className="w-5 h-5 text-hmif-green-700" /></div>
                        <div><p className="text-2xl font-bold">{stats.total_voters}</p><p className="text-xs text-muted-foreground">Pemilih</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-hmif-blue-100 flex items-center justify-center"><Vote className="w-5 h-5 text-hmif-blue-700" /></div>
                        <div><p className="text-2xl font-bold">{stats.total_sessions}</p><p className="text-xs text-muted-foreground">Sesi</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-hmif-yellow-100 flex items-center justify-center"><Award className="w-5 h-5 text-hmif-yellow-700" /></div>
                        <div><p className="text-2xl font-bold">{stats.total_candidates}</p><p className="text-xs text-muted-foreground">Kandidat</p></div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="about" className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge variant="secondary" className="mb-4">Tentang PEMIRA</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">Demokrasi digital HMIF.</h2>
                        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                            PEMIRA HMIF adalah momentum demokrasi mahasiswa informatika dalam memilih pemimpin himpunan secara langsung, umum, bebas, rahasia, jujur, dan adil.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-hmif-green-50 text-hmif-green-700 flex items-center justify-center mb-5"><Shield className="w-6 h-6" /></div>
                            <h3 className="text-lg font-bold mb-2">Aman & Anonim</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Suara Anda tidak terikat pada identitas. Sistem memisahkan data presensi dengan ballot.</p>
                        </Card>
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-hmif-blue-50 text-hmif-blue-700 flex items-center justify-center mb-5"><QrCode className="w-6 h-6" /></div>
                            <h3 className="text-lg font-bold mb-2">Presensi QR Code</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Verifikasi kehadiran cepat dan akurat lewat QR code yang berputar otomatis.</p>
                        </Card>
                        <Card className="p-8 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-hmif-yellow-50 text-hmif-yellow-700 flex items-center justify-center mb-5"><BarChart3 className="w-6 h-6" /></div>
                            <h3 className="text-lg font-bold mb-2">Real-Time Result</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">Hasil pemilihan dihitung secara instan dengan audit trail yang dapat diverifikasi.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Candidates */}
            {candidates.length > 0 && (
                <section id="candidates" className="py-20 md:py-28 bg-muted/40">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <Badge variant="secondary" className="mb-4">Kandidat</Badge>
                            <h2 className="text-3xl md:text-4xl font-bold">Bakal Calon</h2>
                        </div>
                        <div className={cn('grid gap-6', candidates.length <= 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3')}>
                            {candidates.map((c: any, i: number) => (
                                <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                    <Card className="group h-full hover:border-hmif-green-300 hover:shadow-lg transition-all overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-brand-gradient text-white font-bold text-lg flex items-center justify-center">{c.number}</div>
                                                <Avatar className="w-10 h-10 border-2 border-white ring-1 ring-border">
                                                    <AvatarImage src={c.photo ? `/storage/${c.photo}` : undefined} />
                                                    <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <h3 className="font-bold text-foreground">{c.name}</h3>
                                            {c.vice_name && <p className="text-sm text-muted-foreground">& {c.vice_name}</p>}
                                            {c.vision && <p className="text-xs text-muted-foreground mt-3 line-clamp-3 leading-relaxed">{c.vision}</p>}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* How */}
            <section id="how" className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <Badge variant="secondary" className="mb-4">Cara Memilih</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">Tiga langkah mudah</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { n: 1, icon: Users, title: 'Masuk dengan email ITERA', body: 'Gunakan email student.itera.ac.id prodi Informatika.' },
                            { n: 2, icon: QrCode, title: 'Presensi dengan QR', body: 'Tampilkan QR Code kepada petugas di TPS.' },
                            { n: 3, icon: CheckCircle2, title: 'Pilih dengan yakin', body: 'Pilih kandidat terbaik. Suara langsung tercatat anonim.' },
                        ].map(s => (
                            <Card key={s.n} className="p-8 text-center relative">
                                <span className="absolute top-4 right-5 text-5xl font-bold text-hmif-yellow-500/30">{s.n}</span>
                                <div className="w-14 h-14 rounded-2xl bg-hmif-green-700 text-white mx-auto flex items-center justify-center mb-5 shadow-lg shadow-hmif-green-900/20">
                                    <s.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold mb-2">{s.title}</h3>
                                <p className="text-sm text-muted-foreground">{s.body}</p>
                            </Card>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <Link href={route('login')}>
                            <Button size="lg" className="gap-2">Mulai Sekarang <ArrowRight className="w-4 h-4" /></Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20">
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-10 md:p-14 text-center">
                        <div className="absolute inset-0 bg-dotgrid opacity-20 pointer-events-none" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Jadilah bagian dari perubahan HMIF.</h2>
                            <p className="text-white/80 mb-8 max-w-xl mx-auto">Satu suara Anda menentukan arah himpunan untuk satu tahun ke depan.</p>
                            <Link href={route('login')}>
                                <Button size="lg" className="gap-2 bg-hmif-yellow-500 text-hmif-green-950 hover:bg-hmif-yellow-400 shadow-xl">
                                    Masuk & Gunakan Hak Suara <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
}
