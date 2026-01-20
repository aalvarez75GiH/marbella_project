import React, { useState, createContext, useEffect } from "react";
import * as Location from "expo-location";

export const GeolocationContext = createContext();

export const Geolocation_Context_Provider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deviceLat, setDeviceLat] = useState(null);
  const [deviceLng, setDeviceLng] = useState(null);

  // useEffect(() => {
  //   const requestLocationPermission = async () => {
  //     setIsLoading(true);
  //     try {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         setError("Permission to access location was denied");
  //         setIsLoading(false);
  //         return;
  //       }

  //       let userLocation = await Location.getCurrentPositionAsync({});
  //       console.log("USER LOCATION:", JSON.stringify(userLocation, null, 2));
  //       setDeviceLat(userLocation.coords.latitude);
  //       setDeviceLng(userLocation.coords.longitude);
  //       // You can use userLocation.coords.latitude and userLocation.coords.longitude as needed
  //       setIsLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       setIsLoading(false);
  //     }
  //   };

  //   requestLocationPermission();
  // }, []);

  useEffect(() => {
    let subscription = null;
    let appStateSub = null;

    const start = async () => {
      setIsLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setIsLoading(false);
          return;
        }

        // 1) Set an initial location immediately
        const initial = await Location.getCurrentPositionAsync({});
        setDeviceLat(initial.coords.latitude);
        setDeviceLng(initial.coords.longitude);

        // 2) Live updates while app is open
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 50, // update every ~50 meters
            timeInterval: 5000, // or every 5 seconds (Android)
          },
          (loc) => {
            setDeviceLat(loc.coords.latitude);
            setDeviceLng(loc.coords.longitude);
          }
        );

        // 3) Refresh once when user returns to the app
        appStateSub = AppState.addEventListener("change", async (nextState) => {
          if (nextState === "active") {
            try {
              const latest = await Location.getCurrentPositionAsync({});
              setDeviceLat(latest.coords.latitude);
              setDeviceLng(latest.coords.longitude);
            } catch (e) {
              // ignore, keep last known location
            }
          }
        });

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    start();

    return () => {
      subscription?.remove?.();
      appStateSub?.remove?.();
    };
  }, []);

  return (
    <GeolocationContext.Provider
      value={{
        isLoading,
        deviceLat,
        deviceLng,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
};
