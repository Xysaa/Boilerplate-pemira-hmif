import { ReactNode, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Vote, QrCode, BarChart3,
    LogOut, Menu, ChevronRight, Leaf, UserCheck, ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
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
    if (role === 'admin')   return 'bg-amber-900/60 text-amber-300 border-amber-800';
    if (role === 'petugas') return 'bg-blue-900/60 text-blue-300 border-blue-800';
    return 'bg-emerald-900/60 text-emerald-300 border-emerald-800';
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const nav  = getRoleNav(user.role);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#0a1a0f] border-r border-emerald-900/30">
            {/* Logo */}
            <div className="p-6 border-b border-emerald-900/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-base leading-none"
                            style={{ fontFamily: "'DM Serif Display', serif" }}>
                            E-Vote
                        </p>
                        <p className="text-emerald-500/60 text-xs font-mono">ITERA</p>
                    </div>
                </div>
            </div>

            {/* User info */}
            <div className="p-4 border-b border-emerald-900/20">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-emerald-700/40 flex-shrink-0">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-emerald-900/60 text-emerald-300 text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{user.name}</p>
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
                                    ? 'bg-emerald-700/30 text-emerald-300 border border-emerald-700/40'
                                    : 'text-emerald-600 hover:text-emerald-300 hover:bg-emerald-900/40'
                            )}
                        >
                            <Icon className={cn(
                                'w-4 h-4 flex-shrink-0',
                                isActive ? 'text-emerald-400' : 'text-emerald-700 group-hover:text-emerald-500'
                            )} />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight className="w-3 h-3 text-emerald-500" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-emerald-900/30">
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-emerald-700 hover:text-red-400 hover:bg-red-950/30"
                >
                    <LogOut className="w-4 h-4" />
                    Keluar
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#07130b] flex">
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
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
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
                <header className="sticky top-0 z-20 bg-[#07130b]/90 backdrop-blur-sm border-b border-emerald-900/20 px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-emerald-600 hover:text-emerald-400"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                            {title && <h1 className="text-white font-semibold text-lg">{title}</h1>}
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-500/60 text-xs font-mono">Live</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>

                <footer className="border-t border-emerald-900/20 py-4 px-8 text-center">
                    <p className="text-emerald-900/50 text-xs font-mono">
                        E-Vote ITERA © 2025 · Himpunan Mahasiswa Informatika
                    </p>
                </footer>
            </div>
        </div>
    );
}
