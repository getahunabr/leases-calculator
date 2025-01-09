// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Adjust according to your setup
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
