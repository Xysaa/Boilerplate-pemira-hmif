import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { CheckCircle2, AlertCircle, Info as InfoIcon } from 'lucide-react';

export function Toaster() {
    const page = usePage<any>();
    const flash = page?.props?.flash as
        | { success?: string; error?: string; info?: string }
        | undefined;

    useEffect(() => {
        if (!flash) return;
        if (flash.success) toast.success(flash.success);
        if (flash.error)   toast.error(flash.error);
        if (flash.info)    toast(flash.info);
    }, [flash?.success, flash?.error, flash?.info]);

    return (
        <SonnerToaster
            position="top-right"
            expand
            richColors={false}
            closeButton
            toastOptions={{
                classNames: {
                    toast: 'group rounded-2xl border border-hmif-green-200 bg-white text-foreground shadow-lg',
                    title: 'font-semibold text-sm',
                    description: 'text-sm text-muted-foreground',
                    success: '!border-hmif-green-300 !bg-hmif-green-50 !text-hmif-green-900',
                    error: '!border-red-200 !bg-red-50 !text-red-900',
                    info: '!border-hmif-blue-200 !bg-hmif-blue-50 !text-hmif-blue-900',
                    actionButton: 'bg-hmif-green-700 text-white',
                    cancelButton: 'bg-muted text-foreground',
                    closeButton: 'border-hmif-green-200 bg-white text-hmif-green-700',
                },
            }}
            icons={{
                success: <CheckCircle2 className="w-4 h-4 text-hmif-green-700" />,
                error:   <AlertCircle  className="w-4 h-4 text-red-600" />,
                info:    <InfoIcon     className="w-4 h-4 text-hmif-blue-700" />,
            }}
        />
    );
}

export { toast };
