/**
 * Store for managing custom user-created modules in LocalStorage.
 * Key: 'english-app-custom-modules'
 * Schema: Record<Level, Module[]>
 */

const STORAGE_KEY = "english-app-custom-modules";

export function getCustomModules() {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function addCustomModule(level, module) {
  const allModules = getCustomModules();
  if (!allModules[level]) {
    allModules[level] = [];
  }
  allModules[level].push(module);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allModules));
  window.dispatchEvent(new Event("custom-modules-updated"));
}

export function deleteCustomModule(level, moduleId) {
  const allModules = getCustomModules();
  if (allModules[level]) {
    allModules[level] = allModules[level].filter((m) => m.id !== moduleId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allModules));
    window.dispatchEvent(new Event("custom-modules-updated"));
  }
}
