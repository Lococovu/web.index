// Importing modules
import axios from "axios";
import config from "../../../../config/api/default.json";

// Exporting default function
export default async (code) => {
  try {
    let response = await axios.get(`${config.apiURI.internal}/security/code/${code}`);

    return response.data;
  } catch {
    throw new Error(JSON.stringify({ status: 400, error: "InvalidCode" }));
  }
};