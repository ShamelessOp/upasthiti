
import { Worker, WorkerFilter } from "@/models/worker";

// Utility for filtering workers
export function filterWorkers(workers: Worker[], filter?: WorkerFilter): Worker[] {
  if (!filter) return workers;
  
  return workers.filter(worker => {
    if (filter.siteId && worker.site_id !== filter.siteId) {
      return false;
    }
    if (filter.status && worker.status !== filter.status) {
      return false;
    }
    if (filter.skill && !worker.skills.includes(filter.skill)) {
      return false;
    }
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      return (
        worker.name.toLowerCase().includes(query) ||
        worker.worker_id.toLowerCase().includes(query)
      );
    }
    return true;
  });
}
