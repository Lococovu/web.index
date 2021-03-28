// Importing modules
import axios from "axios";
import config from "../../../config/api/default.json";

// Exporting default function
export default async (token, pincode) => {
  try {
    let response = await axios.post(`${config.apiURI.internal}/profile/${token}/information/pincode`, { pincode });

    return response.data;
  } catch {
    throw new Error(JSON.stringify({ error: "ServerError" }));
  }
};