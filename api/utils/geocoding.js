import opencage from "opencage-api-client"

export const geocodeAddress = async (address) => {
    try {
      const data = await opencage.geocode({ q: address });
      if (data.status.code === 200 && data.results.length > 0) {
        return data.results[0];
      } else {
        throw new Error('Geocoding failed');
      }
    } catch (error) {
      throw new Error(`Error during geocoding: ${error.message}`);
    }
  };