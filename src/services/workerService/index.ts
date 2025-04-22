
import { workerCrud } from "./workerCrud";
import { addSampleWorkers } from "./workerSample";

// Export the main workerService object that combines all the functionality
export const workerService = {
  ...workerCrud,
  // Add any other worker-related functions here
};

// Also export these individually
export { addSampleWorkers };
export * from "./workerCrud";
export * from "./workerFilter";
