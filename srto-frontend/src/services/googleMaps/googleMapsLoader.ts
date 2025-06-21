import { Loader } from '@googlemaps/js-api-loader';

// Default map options
export const DEFAULT_CENTER = {
  lat: Number(import.meta.env.VITE_DEFAULT_MAP_CENTER_LAT || 12.9716),
  lng: Number(import.meta.env.VITE_DEFAULT_MAP_CENTER_LNG || 77.5946)
};

export const DEFAULT_ZOOM = Number(import.meta.env.VITE_DEFAULT_MAP_ZOOM || 12);

// Map styles for light mode
export const LIGHT_MODE_STYLES: google.maps.MapTypeStyle[] = [];

// Map styles for dark mode
export const DARK_MODE_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Create a singleton loader instance
const loader = new Loader({
  apiKey: apiKey || '',
  version: 'weekly',
  libraries: ['maps', 'places', 'geometry', 'drawing', 'visualization'],
  region: 'IN', // Set region to India for better performance
});

// Track loading state
let isLoading = false;
let loadPromise: Promise<typeof google.maps> | null = null;

/**
 * Loads the Google Maps JavaScript API
 * @returns Promise that resolves with the google.maps object
 */
export const loadGoogleMaps = (): Promise<typeof google.maps> => {
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (!apiKey) {
    console.error('Google Maps API key is missing:', apiKey);
    return Promise.reject(new Error('Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.'));
  }

  console.log('Loading Google Maps with API key:', apiKey?.substring(0, 10) + '...');

  if (!isLoading) {
    isLoading = true;

    // Use the traditional loader method which is more reliable
    loadPromise = loader.load()
      .then(() => {
        console.log('Google Maps script loaded, waiting for API to be ready...');

        // Wait for the API to be fully ready
        return new Promise<typeof google.maps>((resolve, reject) => {
          const checkReady = () => {
            if (window.google?.maps?.Map) {
              isLoading = false;
              console.log('Google Maps API fully loaded and ready');
              console.log('Available constructors:', Object.keys(window.google.maps));
              resolve(window.google.maps);
            } else {
              console.log('Waiting for Google Maps API to be ready...');
              setTimeout(checkReady, 100);
            }
          };

          // Start checking immediately
          checkReady();

          // Timeout after 10 seconds
          setTimeout(() => {
            isLoading = false;
            reject(new Error('Timeout waiting for Google Maps API to be ready'));
          }, 10000);
        });
      })
      .catch((error) => {
        isLoading = false;
        console.error('Error loading Google Maps API:', error);
        console.error('API Key used:', apiKey?.substring(0, 10) + '...');
        throw error;
      });
  }

  return loadPromise as Promise<typeof google.maps>;
};

export default loadGoogleMaps;

// Alternative direct loading method
export const loadGoogleMapsDirectly = (): Promise<typeof google.maps> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,drawing,visualization&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    (window as any).initGoogleMaps = () => {
      if (window.google?.maps) {
        console.log('Direct loading successful');
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps failed to load'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  });
};

// Debug function to test API key
export const testGoogleMapsAPI = async () => {
  console.log('Testing Google Maps API...');
  console.log('API Key:', apiKey?.substring(0, 10) + '...');

  try {
    console.log('Trying modern loader...');
    const maps = await loadGoogleMaps();
    console.log('✅ Google Maps API loaded successfully!', maps);
    console.log('Available constructors:', {
      Map: typeof maps.Map,
      Marker: typeof maps.Marker,
      InfoWindow: typeof maps.InfoWindow
    });
    return true;
  } catch (error) {
    console.error('❌ Modern loader failed:', error);

    try {
      console.log('Trying direct loader...');
      const maps = await loadGoogleMapsDirectly();
      console.log('✅ Direct loader succeeded!', maps);
      return true;
    } catch (directError) {
      console.error('❌ Direct loader also failed:', directError);
      return false;
    }
  }
};

// Make it available globally for testing
(window as any).testGoogleMapsAPI = testGoogleMapsAPI;