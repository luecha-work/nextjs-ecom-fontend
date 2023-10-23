import axios from "axios";
import AbstractService from "./abstract.service";
import { loginBody, registerBody } from "./models/auth.interface";
import { BaseUserInfoResult } from "./models/base-userinfo-result";

class AuthService extends AbstractService {
  constructor() {
    super();
  }

  login = async (body: loginBody) => {
    const url: string = `${this.base_url}/auth/login`;

    try {
      const data = JSON.stringify(body);

      const response = await axios.post(url, data, this.options);

      return response;
    } catch (error) {
      console.error("Error fetching loginService:", error);
    }
  };

  register = async (body: registerBody) => {
    try {
      const url: string = `${this.base_url}/auth/register`;

      const data = JSON.stringify(body);

      const response = await axios.post(url, data, this.options);

      return response;
    } catch (error) {
      console.error("Error fetching registerService:", error);

      // return error;
    }
  };

  userInfo = async () => {
    try {
      const url: string = `${this.base_url}/auth/user-info`;

      const response = await axios.get(url, this.options);

      return response.data;
    } catch (error) {
      console.error("Error fetching registerService --> userInfo:", error);
      // throw error;
      return undefined;
    }
  };

  getUserList = async (page: number, search: string) => {
    try {
      const param = `?search=${search}&page=${page}`;
      const url: string = `${this.base_url}/users${param}`;
      const response = await axios.get(url, this.options);
      return response;
    } catch (error) {
      console.error("Error fetching registerService -> getUserList:", error);
    }
  };

  findUserByEmail = async (email: string) => {
    try {
      const url: string = `${this.base_url}/auth/user-by-email?email=${email}`;
      const response = await axios.get(url, this.options);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching registerService -> findUserByEmail:",
        error
      );
    }
  };

  forgotPassword = async (userId: string, data: any) => {
    try {
      const url: string = `${this.base_url}/auth/forgot-password/${userId}`;

      const response = await axios.patch(url, data, this.options);

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching registerService -> findUserByEmail:",
        error
      );
    }
  };
}

export default AuthService;
