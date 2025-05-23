const getStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  try {
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return defaultValue;
  }
};

const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting localStorage key "${key}":`, e);
  }
};

const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing localStorage key "${key}":`, e);
  }
};

export { getStorage, setStorage, removeStorage };