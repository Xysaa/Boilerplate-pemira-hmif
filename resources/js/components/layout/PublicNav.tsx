import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PublicNavProps {
    sections?: { href: string; label: string }[];
    className?: string;
}

export function PublicNav({ sections = [], className }: PublicNavProps) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={cn('fixed top-0 inset-x-0 z-40 transition-all', scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-border' : 'bg-transparent border-b border-transparent', className)}>
            <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center"><Logo withText size={36} /></Link>
                <div className="hidden md:flex items-center gap-1">
                    {sections.map((s) => (
                        <a key={s.href} href={s.href} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-hmif-green-700 transition-colors">{s.label}</a>
                    ))}
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <Link href={route('login')}><Button variant="default" className="gap-2"><LogIn className="w-4 h-4" />Masuk</Button></Link>
                </div>
                <button className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground" onClick={() => setOpen(v => !v)} aria-label="Menu">
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </nav>
            {open && (
                <div className="md:hidden border-t border-border bg-white">
                    <div className="px-4 py-3 flex flex-col gap-1">
                        {sections.map((s) => (
                            <a key={s.href} href={s.href} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-hmif-green-700">{s.label}</a>
                        ))}
                        <Link href={route('login')} className="mt-2"><Button className="w-full gap-2"><LogIn className="w-4 h-4" />Masuk</Button></Link>
                    </div>
                </div>
            )}
        </header>
    );
}
