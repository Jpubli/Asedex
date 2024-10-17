import { useState, useEffect } from 'react';
import { migrateData } from '../utils/dataMigration';
import { logError } from '../utils/errorHandling';

export function useMigratedData<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        const migratedItem = migrateData(parsedItem, key);
        window.localStorage.setItem(key, JSON.stringify(migratedItem));
        return migratedItem[key];
      }
      // If no item found, initialize with the provided initial value
      const initialData = migrateData({ [key]: initialValue }, key);
      window.localStorage.setItem(key, JSON.stringify(initialData));
      return initialData[key];
    } catch (error) {
      logError(error as Error, `useMigratedData initialization for ${key}`);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      const dataToStore = migrateData({ [key]: valueToStore }, key);
      window.localStorage.setItem(key, JSON.stringify(dataToStore));
    } catch (error) {
      logError(error as Error, `useMigratedData setValue for ${key}`);
    }
  };

  return [storedValue, setValue];
}