import { updateKeys } from '@/lib/warp';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only run on server-side
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.warn('[Instrumentation] KV environment variables missing. Skipping startup update.');
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
