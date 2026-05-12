import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

type Tone = 'green' | 'blue' | 'yellow' | 'neutral';

const TONE_MAP: Record<Tone, { iconBg: string; iconColor: string; accent: string }> = {
    green:   { iconBg: 'bg-hmif-green-100',  iconColor: 'text-hmif-green-700',  accent: 'from-hmif-green-50 to-white' },
    blue:    { iconBg: 'bg-hmif-blue-100',   iconColor: 'text-hmif-blue-700',   accent: 'from-hmif-blue-50 to-white' },
    yellow:  { iconBg: 'bg-hmif-yellow-100', iconColor: 'text-hmif-yellow-700', accent: 'from-hmif-yellow-50 to-white' },
    neutral: { iconBg: 'bg-muted',           iconColor: 'text-muted-foreground',accent: 'from-muted to-white' },
};

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ElementType;
    tone?: Tone;
    delay?: number;
    trend?: { value: number; positive?: boolean; label?: string };
    subtitle?: string;
}

export function StatCard({ label, value, icon: Icon, tone = 'green', delay = 0, trend, subtitle }: StatCardProps) {
    const t = TONE_MAP[tone];
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
            <Card className={cn('relative overflow-hidden bg-gradient-to-br border-border p-6', t.accent)}>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2 truncate">{label}</p>
                        <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{value}</p>
                        {subtitle && <p className="text-muted-foreground text-xs mt-1 truncate">{subtitle}</p>}
                        {trend && (
                            <p className={cn("text-xs font-medium mt-2", trend.positive !== false ? 'text-emerald-700' : 'text-red-600')}>
                                {trend.positive !== false ? '↑' : '↓'} {trend.value}%
                                {trend.label && <span className="text-muted-foreground ml-1 font-normal">{trend.label}</span>}
                            </p>
                        )}
                    </div>
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', t.iconBg)}>
                        <Icon className={cn('w-5 h-5', t.iconColor)} />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
