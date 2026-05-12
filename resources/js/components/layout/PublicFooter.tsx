import { Logo } from '@/components/brand/Logo';

export function PublicFooter() {
    return (
        <footer className="border-t border-border bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-3 gap-8">
                <div className="space-y-3">
                    <Logo withText size={40} />
                    <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                        Sistem Pemilihan Raya Himpunan Mahasiswa Informatika Institut Teknologi Sumatera.
                    </p>
                </div>
                <div>
                    <p className="text-foreground font-semibold text-sm mb-3">Informasi</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a className="hover:text-hmif-green-700" href="#about">Tentang PEMIRA</a></li>
                        <li><a className="hover:text-hmif-green-700" href="#timeline">Timeline</a></li>
                        <li><a className="hover:text-hmif-green-700" href="#candidates">Kandidat</a></li>
                    </ul>
                </div>
                <div>
                    <p className="text-foreground font-semibold text-sm mb-3">Kontak</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>Himpunan Mahasiswa Informatika</li>
                        <li>Institut Teknologi Sumatera</li>
                        <li className="font-mono text-xs">hmif@itera.ac.id</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-border">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground font-mono">PEMIRA HMIF © 2025</p>
                    <p className="text-xs text-muted-foreground">Dibuat oleh Divisi IT HMIF</p>
                </div>
            </div>
        </footer>
    );
}
