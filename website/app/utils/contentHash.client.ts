/**
 * Get build timestamp for cache busting
 * Client-safe - no Node.js modules
 */
export function getBuildTimestamp(): string {
  return process.env.NODE_ENV === 'production' 
    ? Date.now().toString()
    : 'dev'
}