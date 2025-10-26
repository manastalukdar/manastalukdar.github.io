// Stub for @vue/devtools-kit, @vue/devtools-api, and @vue/devtools-core
// This file replaces the actual devtools packages during build to avoid localStorage SSR errors

// Create a proxy that returns no-op functions for any property access
const createNoOpProxy = (): any => {
  return new Proxy(() => {}, {
    get: () => createNoOpProxy(),
    apply: () => createNoOpProxy(),
    construct: () => createNoOpProxy(),
  })
}

// Export default as no-op proxy
export default createNoOpProxy()

// Export common devtools functions as no-ops (for named imports)
export const setupDevtoolsPlugin = createNoOpProxy()
export const addCustomCommand = createNoOpProxy()
export const addCustomTab = createNoOpProxy()
export const removeCustomCommand = createNoOpProxy()
export const setupDevtools = createNoOpProxy()
export const createDevtools = createNoOpProxy()
export const devtoolsContext = createNoOpProxy()
export const getDevtoolsContext = createNoOpProxy()
export const addTimelineEvent = createNoOpProxy()
export const addInspector = createNoOpProxy()
export const inspectorState = createNoOpProxy()
