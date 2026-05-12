import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center text-center py-14 px-6', className)}>
            <div className="w-14 h-14 rounded-2xl bg-hmif-green-50 border border-hmif-green-100 flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-hmif-green-600" />
            </div>
            <p className="text-foreground font-semibold text-sm">{title}</p>
            {description && <p className="text-muted-foreground text-xs mt-1 max-w-xs">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
