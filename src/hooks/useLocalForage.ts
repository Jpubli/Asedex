import { useState, useEffect } from 'react';
import { modulesStore, clientsStore, budgetsStore, authStore } from '../config/localForage';
import { migrateData } from '../utils/dataMigration';
import { logError } from '../utils/errorHandling';

export function useLocalForage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const getStore = (key: string) => {
    switch (key) {
      case 'modules':
        return modulesStore;
      case 'clients':
        return clientsStore;
      case 'budgets':
        return budgetsStore;
      case 'authState':
        return authStore;
      default:
        throw new Error(`No store defined for key: ${key}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const store = getStore(key);
        const value = await store.getItem<T>(key);
        if (value === null) {
          const initialData = migrateData({ [key]: initialValue }, key);
          await store.setItem(key, initialData[key]);
          setStoredValue(initialData[key]);
        } else {
          const migratedValue = migrateData({ [key]: value }, key);
          await store.setItem(key, migratedValue[key]);
          setStoredValue(migratedValue[key]);
        }
      } catch (error) {
        logError(error as Error, `useLocalForage initialization for ${key}`);
      }
    };

    loadData();
  }, [key, initialValue]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const store = getStore(key);
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await store.setItem(key, valueToStore);
    } catch (error) {
      logError(error as Error, `useLocalForage setValue for ${key}`);
    }
  };

  return [storedValue, setValue];
}