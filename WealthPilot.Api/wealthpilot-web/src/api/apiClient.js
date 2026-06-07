import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://localhost:7219/api",
});

export default apiClient;