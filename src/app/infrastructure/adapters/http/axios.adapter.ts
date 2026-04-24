import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "./http.adapter";

interface Options {
  baseUrl: string;
  params: Record<string, unknown>;
}

export class AxiosAdapter implements HttpAdapter {
  private axiosInstance: AxiosInstance;

  constructor(options: Options) {
    this.axiosInstance = axios.create({
      baseURL: options.baseUrl,
      params: options.params,
    });
  }

  async get<T>(url: string, options?: Record<string, unknown>): Promise<T> {
    try {
      const { data } = await this.axiosInstance.get<T>(url, options);
      return data;
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  async post<T>(url: string, data: any, options?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, options);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  async put<T>(url: string, data: any, options?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, options);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  async delete<T>(url: string, data?: any, options?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, { ...options, data });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }
}
