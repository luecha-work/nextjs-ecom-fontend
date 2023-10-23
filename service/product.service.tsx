import axios from "axios";
import AbstractService from "./abstract.service";
import { json } from "stream/consumers";

export class ProductService extends AbstractService {
  constructor() {
    super();
  }

  getallProduct = async (page: number) => {
    try {
      const url = `${this.base_url}/products?page=${page}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api ProductService -> getRolesToRegister failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error ProductService -> getRolesToRegister:", error);
    }
  };

  getProductById = async (id: string) => {
    try {
      const url = `${this.base_url}/products/${id}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api ProductService -> getRolesToRegister failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error ProductService -> findProductInCurrenUser:", error);
    }
  };
  getSettingProduct = async (check: boolean) => {
    try {
      const url = `${this.base_url}/products/findProductsByisLogin/${check}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api ProductService -> findProductsByisLogin failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error ProductService -> findProductsByisLogin:", error);
    }
  };

  findProductInCurrenUser = async (page: number = 1, search: string = "") => {
    try {
      const url = `${this.base_url}/products/products-in-user?page=${page}&search=${search}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api ProductService -> findProductInCurrenUser failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error ProductService -> findProductInCurrenUser:", error);
    }
  };

  getProductbyCategory = async (id: string, page: number, search: string) => {
    try {
      const url = `${this.base_url}/products/product-by-category?search=${search}&categoryId=${id}&page=${page}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api ProductService -> getRolesToRegister failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error ProductService -> getRolesToRegister:", error);
    }
  };

  delete = async (productId: string = "") => {
    try {
      const url = `${this.base_url}/products/${productId}`;

      const response = await axios.delete(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api ProductService -> findProductInCurrenUser failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error ProductService -> findProductInCurrenUser:", error);
    }
  };

  uploadingImage = async (data: any) => {
    try {
      const url = `${this.base_url}/upload-product/image`;

      const response = await axios.post(url, data);

      if (response.status !== 201) {
        console.error(
          "call api ProductService -> uploadingImage failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error ProductService -> uploadingImage:", error);
    }
  };

  uploadingImagePayment = async (data: any) => {
    try {
      const url = `${this.base_url}/upload-product/imagepayment`;

      const response = await axios.post(url, data);

      if (response.status !== 201) {
        console.error(
          "call api ProductService -> uploadingImage failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error ProductService -> uploadingImage:", error);
    }
  };

  create = async (data: any, category_id: string) => {
    try {
      const url = `${this.base_url}/products?category_id=${category_id}`;
      const body = JSON.stringify(data);

      const response = await axios.post(url, body, this.options);

      if (response.status !== 201) {
        console.error(
          "call api ProductService -> create failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error ProductService -> create:", error);
    }
  };

  update = async (id: string, data: any) => {
    try {
      const url = `${this.base_url}/products/${id}`;

      const body = JSON.stringify(data);

      const response = await axios.patch(url, body, this.options);

      if (response.status !== 200) {
        console.error(
          "call api ProductService -> update failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error ProductService -> update:", error);
    }
  };

  findAllProducts = async () => {
    try {
      const url = `${this.base_url}/products/find-all`;

      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api ProductService -> update failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error ProductService -> update:", error);
    }
  };

  findProductInListSettings = async (data: any) => {
    try {
      const url = `${this.base_url}/products/get-in-list-settings`;

      const response = await axios.post(url, data, this.options);

      if (response.status !== 201) {
        console.error(
          "call api ProductService -> findProductInListSettings failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error(
        "Error ProductService -> findProductInListSettings:",
        error
      );
    }
  };
}
