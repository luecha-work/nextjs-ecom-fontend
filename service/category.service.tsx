import axios from "axios";
import AbstractService from "./abstract.service";
import { Category } from "./models/category.interface";

export class CategoryService extends AbstractService {
  constructor() {
    super();
  }
  getCategory = async (page: number) => {
    try {
      const param = `?page=${page}`;
      const url = `${this.base_url}/category-product${param}`;
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
  getAllCategory = async () => {
    try {
      const url = `${this.base_url}/category-product/all-category`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api CategoryService -> getAllCategory failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error CategoryService -> getAllCategory:", error);
    }
  };

  getCategoryById = async (id: string) => {
    try {
      const url = `${this.base_url}/category-product/${id}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api CategoryService -> getCategoryById failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error CategoryService -> getCategoryById:", error);
    }
  };

  createCategory = async (body: Category) => {
    try {
      // const data = JSON.stringify(body);
      let data = {
        categoryCode: body?.categoryCode,
        categoryName: body?.categoryName,
        categoryDetail: body?.categoryDetail,
      };
      const url = `${this.base_url}/category-product`;
      const response = await axios.post(url, data, this.options);

      if (response.status !== 200) {
        console.error(
          "call api CategoryService -> createCategory failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error CategoryService -> createCategory:", error);
    }
  };

  updateCategory = async (body: Category) => {
    try {
      // const data = JSON.stringify(body);
      let data = {
        id: body?.id,
        categoryCode: body?.categoryCode,
        categoryName: body?.categoryName,
        categoryDetail: body?.categoryDetail,
        active: body?.active,
      };

      const url = `${this.base_url}/category-product/${data?.id}`;
      const response = await axios.patch(url, data, this.options);

      if (response.status !== 200) {
        console.error(
          "call api CategoryService -> updateCategory failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error CategoryService -> updateCategory:", error);
    }
  };

  deleteCategory = async (id: string) => {
    try {
      const Id = id;
      const url = `${this.base_url}/category-product/${Id}`;
      const response = await axios.delete(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api CategoryService -> deleteCategory failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error CategoryService -> deleteCategory:", error);
    }
  };
}
