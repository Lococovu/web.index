// Importing modules
import axios from "axios";
import config from "../../../config/api/default.json";

// Exporting default function
export default async (id, pincode) => {
  try {
    let response = await axios.get(`${config.apiURI.internal}/profile/${id}/authorize/${pincode}`);

    return response.data;
  } catch {
    throw new Error(JSON.stringify({ error: "InvalidPincode" }));
  }
};