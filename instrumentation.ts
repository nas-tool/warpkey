import { updateKeys } from '@/lib/warp';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only run on server-side
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('[Instrumentation] BLOB_READ_WRITE_TOKEN missing. Skipping startup update.');
      return;
    }

    console.log('[Instrumentation] Triggering initial key update...');
    try {
      // Run updateKeys in the background without awaiting to not block startup
      updateKeys()
        .then((result) => {
          console.log('[Instrumentation] Initial key update successful:', {
            full: result.full.length,
            lite: result.lite.length,
            added: result.diff.added.length,
            removed: result.diff.removed.length
          });
        })
        .catch((err) => {
          console.error('[Instrumentation] Initial key update failed:', err);
        });
    } catch (error) {
      console.error('[Instrumentation] Error triggering update:', error);
    }
  }
}
