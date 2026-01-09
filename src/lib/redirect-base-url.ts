import type { NavigateFunction } from "react-router-dom";

// Helper function to get current search params
export function getCurrentSearchParams(): URLSearchParams {
  // We can't use useLocation() directly in a non-component function
  // This function should be called from components with the location
  return new URLSearchParams(window.location.search);
}

export function navigateWithRedirect(
  path: string, 
  navigate: NavigateFunction,
) {
  const searchParams = getCurrentSearchParams();
  const searchString = searchParams.toString();
  
  // Navigate with search parameters
  navigate({
    pathname: path,
    search: searchString ? `?${searchString}` : ""
  });
}