
import { Site } from "@/models/site";
import { apiRequest } from "./api";
import { localStorageService } from "./localStorage";

// Local storage key
const SITES_STORAGE_KEY = "sites";

// Mock initial data
const INITIAL_SITES_DATA: Site[] = [
  {
    id: "1",
    name: "Site A - Residential Complex",
    location: "Andheri East, Mumbai",
    description: "15-floor residential building with amenities",
    supervisor: "Rajesh Kumar",
    workersCount: 75,
    status: "active",
    startDate: "2025-01-15",
    createdAt: "2025-01-10T10:30:00Z",
    updatedAt: "2025-01-10T10:30:00Z"
  },
  {
    id: "2",
    name: "Site B - Commercial Building",
    location: "Bandra Kurla Complex, Mumbai",
    description: "Office complex with 3 towers",
    supervisor: "Sunil Sharma",
    workersCount: 120,
    status: "active",
    startDate: "2025-02-01",
    createdAt: "2025-01-20T14:45:00Z",
    updatedAt: "2025-01-20T14:45:00Z"
  },
  {
    id: "3",
    name: "Site C - Highway Project",
    location: "Thane-Borivali Highway",
    description: "Highway expansion and maintenance project",
    supervisor: "Amit Singh",
    workersCount: 95,
    status: "active",
    startDate: "2024-12-10",
    createdAt: "2024-12-01T09:15:00Z",
    updatedAt: "2024-12-01T09:15:00Z"
  }
];

// Initialize local storage with mock data if empty
const initializeSitesData = (): Site[] => {
  const existingData = localStorageService.get<Site[]>(SITES_STORAGE_KEY);
  if (!existingData) {
    localStorageService.set(SITES_STORAGE_KEY, INITIAL_SITES_DATA);
    return INITIAL_SITES_DATA;
  }
  return existingData;
};

export const siteService = {
  // Get all sites
  async getAllSites(): Promise<Site[]> {
    return apiRequest<Site[]>(async () => {
      return initializeSitesData();
    }, "Failed to retrieve sites").then(response => response.data || []);
  },

  // Get site by ID
  async getSiteById(id: string): Promise<Site | null> {
    return apiRequest<Site>(async () => {
      const sites = initializeSitesData();
      const site = sites.find(s => s.id === id);
      
      if (!site) {
        throw new Error("Site not found");
      }
      
      return site;
    }, "Failed to retrieve site").then(response => response.data);
  },

  // Create new site
  async createSite(siteData: Partial<Site>): Promise<Site | null> {
    return apiRequest<Site>(async () => {
      const sites = initializeSitesData();
      const now = new Date();
      const nowIso = now.toISOString();
      
      const newSite: Site = {
        id: `${Date.now()}`,
        name: siteData.name || "",
        location: siteData.location || "",
        description: siteData.description,
        supervisor: siteData.supervisor || "",
        workersCount: siteData.workersCount || 0,
        status: siteData.status || "active",
        startDate: siteData.startDate || now.toISOString().split('T')[0],
        endDate: siteData.endDate,
        createdAt: nowIso,
        updatedAt: nowIso
      };
      
      sites.push(newSite);
      localStorageService.set(SITES_STORAGE_KEY, sites);
      
      return newSite;
    }, "Failed to create site").then(response => response.data);
  },

  // Update site
  async updateSite(id: string, siteData: Partial<Site>): Promise<Site | null> {
    return apiRequest<Site>(async () => {
      const sites = initializeSitesData();
      const siteIndex = sites.findIndex(s => s.id === id);
      
      if (siteIndex === -1) {
        throw new Error("Site not found");
      }
      
      const updatedSite: Site = {
        ...sites[siteIndex],
        ...siteData,
        updatedAt: new Date().toISOString()
      };
      
      sites[siteIndex] = updatedSite;
      localStorageService.set(SITES_STORAGE_KEY, sites);
      
      return updatedSite;
    }, "Failed to update site").then(response => response.data);
  },

  // Delete site
  async deleteSite(id: string): Promise<boolean> {
    return apiRequest<boolean>(async () => {
      const sites = initializeSitesData();
      const siteIndex = sites.findIndex(s => s.id === id);
      
      if (siteIndex === -1) {
        throw new Error("Site not found");
      }
      
      sites.splice(siteIndex, 1);
      localStorageService.set(SITES_STORAGE_KEY, sites);
      
      return true;
    }, "Failed to delete site").then(response => response.success);
  }
};
