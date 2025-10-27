// Server plugin to polyfill localStorage for SSR/prerendering
// Filename starts with 00 to ensure it loads first
// This MUST run before any other code that imports @vue/devtools-kit

// Add localStorage polyfill to globalThis if it doesn't exist
if (typeof globalThis.localStorage === 'undefined') {
  const storage = new Map<string, string>()

  ;(globalThis as any).localStorage = {
    getItem(key: string): string | null {
      return storage.get(key) ?? null
    },
    setItem(key: string, value: string): void {
      storage.set(key, String(value))
    },
    removeItem(key: string): void {
      storage.delete(key)
    },
    clear(): void {
      storage.clear()
    },
    get length(): number {
      return storage.size
    },
    key(index: number): string | null {
      return Array.from(storage.keys())[index] ?? null
    }
  }
}

// Empty Nitro plugin - the polyfill is applied at module load time above
export default defineNitroPlugin(() => {})
