
import { workerCrud } from "./workerCrud";
import { addSampleWorkers } from "./workerSample";
import { filterWorkers } from "./workerFilter";

// Export the main workerService object that combines all the functionality
export const workerService = {
  ...workerCrud,
  // Add any other worker-related functions here
  filterWorkers,
  addSampleWorkers
};

// Also export these individually
export { addSampleWorkers, filterWorkers };
export * from "./workerCrud";
export * from "./workerFilter";
