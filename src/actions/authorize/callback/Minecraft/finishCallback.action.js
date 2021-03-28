// Importing modules
import axios from "axios";
import config from "../../../../config/api/default.json";

// Exporting default function
export default async (code, token) => {
  try {
    let response = await axios.post(`${config.apiURI.internal}/callback/authorize/${code}/${token}`);

    return response.data;
  } catch {
    throw new Error(JSON.stringify({ error: "ServerError" }));
  } 
};