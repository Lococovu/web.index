// Importing modules
import axios from "axios";
import config from "../../config/api/default.json";

// Exporting default function
export default async (id) => {
  // Let's now get this account
  let response = await axios.get(`${config.apiURI.internal}/profile/${id}`)

  return response.data;
};