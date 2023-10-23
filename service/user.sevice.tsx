import axios from "axios";
import AbstractService from "./abstract.service";
import { loginBody, registerBody } from "./models/auth.interface";

class CrudUser extends AbstractService {
  constructor() {
    super();
  }

  delete = async (Id: string) => {
    try {
      const id = Id;
      const url: string = `${this.base_url}/users/${id}`;
      const response = await axios.delete(url, this.options).then((res) => {
        return res?.data;
      });
      return response;
    } catch (error) {
      console.error("Error fetching registerService:", error);
    }
  };

  getUserById = async (Id: string) => {
    try {
      const id = Id;
      const url: string = `${this.base_url}/users/${id}`;
      const response = await axios.get(url, this.options).then((res) => {
        return res?.data;
      });
      return response;
    } catch (error) {
      console.error("Error fetching registerService:", error);
    }
  };

  updateById = async (userId: string, body: any) => {
    try {
      const url: string = `${this.base_url}/users/${userId}`;
      const response = await axios
        .patch(url, body, this.options)
        .then((res) => {
          return res?.data;
        });
      return response;
    } catch (error) {
      console.error("Error fetching registerService:", error);
    }
  };

  getAddressUser = async (userId: string) => {
    try {
      const url: string = `${this.base_url}/user-address/${userId}`;
      const response = await axios.get(url, this.options).then((res) => {
        return res?.data;
      });
      return response;
    } catch (error) {
      console.error("Error fetching registerService:", error);
    }
  };

  findUsersToAdminMarket = async (data: any) => {
    try {
      const url: string = `${this.base_url}/users/users-to-adminmarket`;
      const response = await axios.post(url, data, this.options).then((res) => {
        return res?.data;
      });
      return response;
    } catch (error) {
      console.error("Error fetching registerService:", error);
    }
  };
}

export default CrudUser;
