
import { toast } from "sonner";

// Base API configuration
const API_DELAY = 300; // Simulate network delay for testing

// Generic API response interface
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Base API request wrapper with error handling
export async function apiRequest<T>(
  handler: () => Promise<T>,
  errorMessage = "Operation failed"
): Promise<ApiResponse<T>> {
  try {
    // Add artificial delay to simulate network requests
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    const data = await handler();
    return { data, error: null, success: true };
  } catch (error) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : errorMessage;
    toast.error(message);
    return { data: null, error: message, success: false };
  }
}
