import axios from "axios";
import AbstractService from "./abstract.service";
import { Cart } from "./models/cart.interface";

export class CartService extends AbstractService {
  constructor() {
    super();
  }
  getCartByUserId = async (check: boolean) => {
    try {
      const param = `?check=${check}`;
      const url = `${this.base_url}/cart${param}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api CategoryService -> getCategory failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error CategoryService -> getCategory:", error);
    }
  };
  deleteCart = async (id: string) => {
    try {
      const url = `${this.base_url}/cart/${id}`;
      const response = await axios.delete(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api CategoryService -> deleteCart failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error CategoryService -> deleteCart:", error);
    }
  };
  createCart = async (body: Cart) => {
    try {
      const url = `${this.base_url}/cart`;
      const response = await axios.post(url, body, this.options);

      if (response.status !== 201) {
        console.error(
          "call api CartService -> createCart failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error CartService -> CartService:", error);
    }
  };

  updateCart = async (id: string, data: any) => {
    try {
      const url = `${this.base_url}/cart/${id}`;
      const response = await axios.patch(url, data, this.options);

      if (response.status !== 200) {
        console.error(
          "call api CartService -> updateCart failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error CartService -> updateCart:", error);
    }
  };
}
