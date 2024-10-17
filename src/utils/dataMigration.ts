interface MigrationFunction {
  (data: any): any;
}

const migrations: Record<string, MigrationFunction[]> = {
  modules: [
    // Initial migration
    (data) => {
      if (!Array.isArray(data.modules)) return { version: 1, modules: [] };
      return { version: 1, modules: data.modules };
    },
    // Migration to add imageData to modules
    (data) => {
      const updatedModules = data.modules.map((module: any) => ({
        ...module,
        imageData: module.imageData || ''
      }));
      return { ...data, version: 2, modules: updatedModules };
    },
  ],
  clients: [
    // Initial migration
    (data) => {
      if (!Array.isArray(data.clients)) return { version: 1, clients: [] };
      return { version: 1, clients: data.clients };
    },
  ],
  budgets: [
    // Initial migration
    (data) => {
      if (!Array.isArray(data.budgets)) return { version: 1, budgets: [] };
      return { version: 1, budgets: data.budgets };
    },
  ],
};

export function migrateData(data: any, key: string): any {
  if (!migrations[key]) {
    console.warn(`No migrations found for key: ${key}`);
    return { [key]: data };
  }

  let currentVersion = data?.version || 0;
  let migratedData = { ...data };

  while (currentVersion < migrations[key].length) {
    migratedData = migrations[key][currentVersion](migratedData);
    currentVersion++;
  }

  return migratedData;
}