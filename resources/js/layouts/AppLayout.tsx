import { ReactNode, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Vote, QrCode, BarChart3,
    LogOut, Menu, ChevronRight, UserCheck, ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/brand/Logo';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

const adminNav = [
    { href: 'admin.dashboard',        label: 'Dashboard',      icon: LayoutDashboard },
    { href: 'admin.sessions.index',   label: 'Sesi Pemilihan', icon: ClipboardList },
    { href: 'admin.candidates.index', label: 'Kandidat',       icon: Users },
    { href: 'admin.petugas.index',    label: 'Petugas',        icon: UserCheck },
    { href: 'admin.report',           label: 'Laporan',        icon: BarChart3 },
];

const petugasNav = [
    { href: 'petugas.dashboard', label: 'Dashboard',      icon: LayoutDashboard },
    { href: 'petugas.scan',      label: 'Scan Presensi',  icon: QrCode },
];

const voterNav = [
    { href: 'voter.dashboard', label: 'Dashboard',          icon: LayoutDashboard },
    { href: 'voter.vote',      label: 'Pemungutan Suara',   icon: Vote },
];

function getRoleNav(role: string) {
    if (role === 'admin')   return adminNav;
    if (role === 'petugas') return petugasNav;
    return voterNav;
}

function getRoleLabel(role: string) {
    if (role === 'admin')   return 'Administrator';
    if (role === 'petugas') return 'Petugas';
    return 'Pemilih';
}

function getRoleBadgeCls(role: string) {
    if (role === 'admin')   return 'bg-hmif-yellow-100 text-hmif-yellow-800 border-hmif-yellow-300';
    if (role === 'petugas') return 'bg-hmif-blue-100 text-hmif-blue-800 border-hmif-blue-300';
    return 'bg-hmif-green-100 text-hmif-green-800 border-hmif-green-300';
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const nav  = getRoleNav(user.role);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-border">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <Logo size={32} />
                    <div>
                        <p className="text-foreground font-bold text-base leading-none font-serif">
                            PEMIRA
                        </p>
                        <p className="text-muted-foreground text-xs font-mono">HMIF ITERA</p>
                    </div>
                </div>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-border flex-shrink-0">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="text-foreground text-sm font-medium truncate">{user.name}</p>
                        <Badge
                            variant="outline"
                            className={cn('text-[10px] mt-0.5 font-mono py-0', getRoleBadgeCls(user.role))}
                        >
                            {getRoleLabel(user.role)}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {nav.map((item) => {
                    const Icon     = item.icon;
                    const isActive = route().current(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={route(item.href)}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                                isActive
                                    ? 'bg-hmif-green-700 text-white shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            )}
                        >
                            <Icon className={cn(
                                'w-4 h-4 flex-shrink-0',
                                isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                            )} />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight className="w-3 h-3 text-white/70" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                >
                    <LogOut className="w-4 h-4" />
                    Keluar
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-col fixed left-0 top-0 h-full z-30 w-64">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-hmif-green-950/30 z-40 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed left-0 top-0 h-full w-72 z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="lg:hidden text-muted-foreground hover:text-foreground"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                            <div>
                                {title && <h1 className="text-foreground font-semibold text-lg">{title}</h1>}
                                {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-hmif-green-500 animate-pulse" />
                            <span className="text-muted-foreground text-xs font-mono">Online</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>

                <footer className="border-t border-border py-4 px-8 text-center">
                    <p className="text-muted-foreground text-xs font-mono">
                        PEMIRA HMIF &copy; 2025 &middot; HMIF ITERA
                    </p>
                </footer>
            </div>
        </div>
    );
}
