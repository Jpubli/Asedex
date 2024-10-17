import localforage from 'localforage';

const modulesStore = localforage.createInstance({
  name: 'AsedexPresupuestos',
  storeName: 'modules'
});

const clientsStore = localforage.createInstance({
  name: 'AsedexPresupuestos',
  storeName: 'clients'
});

const budgetsStore = localforage.createInstance({
  name: 'AsedexPresupuestos',
  storeName: 'budgets'
});

const authStore = localforage.createInstance({
  name: 'AsedexPresupuestos',
  storeName: 'auth'
});

export { modulesStore, clientsStore, budgetsStore, authStore };