import axios from "axios";
import AbstractService from "./abstract.service";

export class MarketService extends AbstractService {
  constructor() {
    super();
  }

  findUsersInMarket = async (page: number = 1) => {
    try {
      const param = `?page=${page}`;
      const url = `${this.base_url}/market/user-in-market${param}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api MarketService -> findUsersInMarket failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error MarketService -> findUsersInMarket:", error);
    }
  };

  createAdminMarket = async (data: any) => {
    try {
      const url = `${this.base_url}/admin-market`;
      const response = await axios.post(url, data, this.options);

      if (response.status !== 201) {
        console.error(
          "call api MarketService -> createAdminMarket failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error MarketService -> createAdminMarket:", error);
    }
  };

  deleteAdminMarket = async (userId: string) => {
    try {
      const url = `${this.base_url}/admin-market/${userId}`;
      const response = await axios.delete(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api MarketService -> deleteAdminMarket failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error MarketService -> deleteAdminMarket:", error);
    }
  };
}
