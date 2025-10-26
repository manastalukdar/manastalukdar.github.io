// Stub for @vue/devtools-kit and @vue/devtools-api to prevent SSR errors
// This file replaces the actual devtools packages during build to avoid localStorage access issues

export default {}

// Export common devtools functions as no-ops
export const setupDevtoolsPlugin = () => {}
export const addCustomCommand = () => {}
export const addCustomTab = () => {}
export const removeCustomCommand = () => {}
export const setupDevtools = () => {}
export const createDevtools = () => ({})
