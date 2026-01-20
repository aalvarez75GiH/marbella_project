/* eslint-disable */

const axios = require("axios");

const key = process.env.GOOGLE_MAPS_API_KEY;
const express = require("express");
const geolocationRouter = express.Router();

// Geocoding endpoint
geolocationRouter.get("/geocoding", async (req, res) => {
  //   (async () => {
  const { lat, lng } = req.query;
  console.log("Lat:", lat, "Lng:", lng);

  var config = {
    method: "get",
    // url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address&key=${process.env.GOOGLE_KEY}`,
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address&key=${key}`,
    headers: {},
  };

  await axios(config)
    .then((responseFromGoogle) => {
      res.json(responseFromGoogle.data.results[0]);
    })
    .catch((error) => {
      console.log("ERROR:", error);
    });
  //   })();
});

// Forward geocoding: address -> lat/lng
geolocationRouter.get("/geocode-address", async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address,
          key,
        },
      }
    );

    if (response.data.status !== "OK") {
      return res.status(400).json({
        error: response.data.status,
        details: response.data.error_message,
      });
    }

    const result = response.data.results[0];

    res.json({
      formatted_address: result.formatted_address,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      place_id: result.place_id,
      location_type: result.geometry.location_type,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Geocoding failed" });
  }
});

module.exports = geolocationRouter;
