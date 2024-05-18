import "dotenv/config";

import axios from "axios";

export const getUserLocationInfo = async (ipAddress?: string) => {
  const API_KEY = process.env.LOCATION_API_KEY;
  const fields = "geo,time_zone";
  //const security = "security";
  const ipResponse =
    ipAddress || (await axios.get("https://api.ipify.org?format=json")).data.ip;
  const URL = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ipResponse}&fields=${fields}`;

  const response = await axios.get(URL);
  return response.data;
};
