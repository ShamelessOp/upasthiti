
// Local storage service for persisting data
const PREFIX = "upastithi_";

export const localStorageService = {
  set<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(`${PREFIX}${key}`, serializedData);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  },

  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const serializedData = localStorage.getItem(`${PREFIX}${key}`);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData) as T;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  clear(): void {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
};
