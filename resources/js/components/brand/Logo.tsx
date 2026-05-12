import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    size?: number;
    withText?: boolean;
    variant?: 'default' | 'light' | 'mono';
}

export function Logo({ className, size = 40, withText = false, variant = 'default' }: LogoProps) {
    const mark = (
        <svg
            width={size} height={size}
            viewBox="0 0 48 48" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
            aria-hidden="true"
        >
            <rect x="2" y="2" width="44" height="44" rx="12"
                fill={variant === 'light' ? '#ffffff' : '#4D5B37'} />
            <rect x="2" y="2" width="44" height="44" rx="12"
                fill="url(#hmif-grad)" fillOpacity={variant === 'light' ? 0 : 0.9} />
            <path
                d="M14 25.5l6 6 14-14"
                stroke={variant === 'light' ? '#4D5B37' : '#CBCF1A'}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="36" cy="12" r="2.6"
                fill={variant === 'light' ? '#17579F' : '#ffffff'} />
            <defs>
                <linearGradient id="hmif-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#4D5B37" />
                    <stop offset="100%" stopColor="#17579F" stopOpacity="0.55" />
                </linearGradient>
            </defs>
        </svg>
    );

    if (!withText) {
        return <span className={cn('inline-block', className)}>{mark}</span>;
    }

    return (
        <span className={cn('inline-flex items-center gap-2.5', className)}>
            {mark}
            <span className="flex flex-col leading-none">
                <span
                    className={cn(
                        'font-bold tracking-tight',
                        variant === 'light' ? 'text-white' : 'text-hmif-green-700'
                    )}
                    style={{ fontSize: size * 0.45 }}
                >
                    PEMIRA
                </span>
                <span
                    className={cn(
                        'font-mono text-[10px] tracking-[0.2em]',
                        variant === 'light' ? 'text-white/70' : 'text-hmif-green-700/60'
                    )}
                >
                    HMIF · ITERA
                </span>
            </span>
        </span>
    );
}
