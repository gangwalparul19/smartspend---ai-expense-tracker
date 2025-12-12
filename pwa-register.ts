// Extend Navigator interface to include iOS Safari's standalone property
declare global {
    interface Navigator {
        standalone?: boolean;
    }
}

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker registered successfully:', registration.scope);

                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
            })
            .catch((error) => {
                console.error('❌ Service Worker registration failed:', error);
            });
    });

    // Listen for service worker updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 New service worker activated');
        window.location.reload();
    });
}

// Handle install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;

    // Show custom install button/banner if needed
    console.log('💾 App can be installed');

    // You can show a custom install UI here
    // document.getElementById('install-button').style.display = 'block';
});

// Handle successful installation
window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA was installed');
    deferredPrompt = null;
});

// Function to trigger install prompt (can be called from UI button)
export function promptInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted the install prompt');
            } else {
                console.log('❌ User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Check if app is running in standalone mode (installed)
export function isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
}

console.log('📱 PWA mode:', isInstalled() ? 'INSTALLED' : 'BROWSER');
