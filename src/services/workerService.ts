
// Re-export from the new location for backwards compatibility
export * from './workerService/index';
import { workerService as service } from './workerService/index';
export const workerService = service;
export const addSampleWorkers = service.addSampleWorkers;
