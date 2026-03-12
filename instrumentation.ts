export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Real-time mode: no background sync required
    console.log('[Instrumentation] Real-time mode enabled; skipping startup fetch.');
  }
}
