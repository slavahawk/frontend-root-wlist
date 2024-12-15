import axios from "axios";
import { AuthService } from "@/service/AuthService.ts";
import router, { AppRoutes } from "@/router";

const API_URL = "https://api.w-list.ru";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  else delete config.headers.Authorization;
  return config;
});

let isRefreshing = false;
const subscribers = new Set();

function subscribeTokenRefresh(callback) {
  subscribers.add(callback);
}

function onRefreshed(accessToken) {
  subscribers.forEach((callback) => callback(accessToken));
  subscribers.clear();
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((accessToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await AuthService.refresh(
          localStorage.getItem("refreshToken"),
        );

        localStorage.setItem("accessToken", response.details.accessToken);
        localStorage.setItem("refreshToken", response.details.refreshToken);

        api.defaults.headers["Authorization"] =
          `Bearer ${response.details.accessToken}`;

        onRefreshed(response.details.accessToken);

        originalRequest.headers["Authorization"] =
          `Bearer ${response.details.accessToken}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        await router.push({ name: AppRoutes.LOGIN });
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

const initializeAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export { api, initializeAuth };
