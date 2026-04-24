import axios from "axios";

const bitacoraApi = axios.create({
  baseURL: process.env.URL_API_CEA,
});

export default bitacoraApi;
