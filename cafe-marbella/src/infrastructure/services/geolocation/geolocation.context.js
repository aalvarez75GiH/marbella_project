import React, { useState, createContext, useEffect } from "react";
import * as Location from "expo-location";

export const geolocationContext = createContext();

export const Geolocation_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      setIsLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setIsLoading(false);
          return;
        }

        let userLocation = await Location.getCurrentPositionAsync({});
        console.log("USER LOCATION:", JSON.stringify(userLocation, null, 2));
        // You can use userLocation.coords.latitude and userLocation.coords.longitude as needed
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <geolocationContext.Provider
      value={{
        isLoading,
      }}
    >
      {children}
    </geolocationContext.Provider>
  );
};
