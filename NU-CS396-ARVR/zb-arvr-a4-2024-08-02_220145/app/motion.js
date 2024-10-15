class MotionTracker {
  constructor() {
    this.location = [-87.67493897142913, 42.05221625394806];
  }

  startTracking() {
    this.startGeoTracking();
  }

  startGeoTracking() {
    // GPT
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
          
          // Use latitude and longitude values as needed
          this.location = [longitude, latitude];
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          // Handle errors accordingly
        },
        {
          enableHighAccuracy: true, // Set to true for more accurate results, if available
          timeout: 10000, // Timeout in milliseconds
          maximumAge: 0, // Maximum age of a cached position, in milliseconds
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Handle the case when geolocation is not supported
    }
  }
}

// FROM chatGPT
// Function to calculate distance between two coordinates in meters
function getDistanceBetweenCoordinates(coord1, coord2) {
// Create a LineString connecting the two coordinates
//   const lineString = new ol.geom.LineString([coord1, coord2]);

// // Calculate the geodesic distance (great-circle distance) between the two points
//   const coordinates = lineString.getCoordinates();
//   const length = coordinates.length;
//   let distance = 0;

//   for (let i = 0; i < length - 1; i++) {
//     const start = ol.proj.transform(coordinates[i], 'EPSG:4326', 'EPSG:3857');
//     const end = ol.proj.transform(coordinates[i + 1], 'EPSG:4326', 'EPSG:3857');
//     const segment = new ol.geom.LineString([start, end]);
//     distance += segment.getLength();
//   }
  
  let d = ol.sphere.getDistance(coord1, coord2)
  
  return d;
}