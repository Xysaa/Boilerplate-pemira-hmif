import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/toaster';

const appName = import.meta.env.VITE_APP_NAME || 'PEMIRA HMIF';

createInertiaApp({
    title: (title) => `${title} — ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                {/* Toaster portal lives outside App — no Inertia context needed */}
                <Toaster />
                <App {...props} />
            </>
        );
    },
    progress: {
        color: '#CBCF1A',
        showSpinner: false,
    },
});
