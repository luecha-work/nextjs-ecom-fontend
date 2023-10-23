import axios from "axios";
import AbstractService from "./abstract.service";
import { OrderDetailResult } from "@/common/models/orders-result.interface";

export class OrdersService extends AbstractService {
  constructor() {
    super();
  }

  getOrderById = async (orderId: string): Promise<OrderDetailResult> => {
    try {
      const url = `${this.base_url}/orders/${orderId}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error("call api OrdersService -> paginate failed statusCode:", response.status);
      }

      return response.data;
    } catch (error) {
      console.error("Error OrdersService -> paginate:", error);
      throw error;
    }
  };

  getOrdersCheckPayment = async (page: number = 1, search: string = "") => {
    try {
      const url = `${this.base_url}/orders/check-payment?page=${page}&search=${search}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error("call api OrdersService -> paginate failed statusCode:", response.status);
      }

      return response.data;
    } catch (error) {
      console.error("Error OrdersService -> paginate:", error);
      throw error;
    }
  };

  getOrdersSuccess = async (page: number = 1, search: string = "", searchCompany: string = "") => {
    try {
      const url = `${this.base_url}/orders/orders-success?page=${page}&search=${search}&search_company=${searchCompany}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error("call api OrdersService -> getOrdersSuccess failed statusCode:", response.status);
      }

      return response.data;
    } catch (error) {
      console.error("Error OrdersService -> getOrdersSuccess:", error);
      throw error;
    }
  };

  getOrdersPending = async (page: number = 1, search: string = "") => {
    try {
      const url = `${this.base_url}/orders/orders-pending?page=${page}&search=${search}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error("call api OrdersService -> paginate failed statusCode:", response.status);
      }

      return response.data;
    } catch (error) {
      console.error("Error OrdersService -> paginate:", error);
      throw error;
    }
  };

  update = async (body: any, orderId: string) => {
    try {
      const url = `${this.base_url}/orders/${orderId}`;

      const data = JSON.stringify(body);

      const response = await axios.patch(url, data, this.options);

      if (response.status !== 200) {
        console.error("call api OrdersService -> paginate failed statusCode:", response.status);
      }


      return response.data;
    } catch (error) {
      console.error("Error OrdersService -> paginate:", error);
      throw error;
    }
  };

  getAllOrder = async (page: number, search: string) => {
    try {
      const param = `?search=${search}&page=${page}`;
      const url = `${this.base_url}/orders/all-orders${param}`;
      const response = await axios.get(url, this.options);
      if (response.status !== 200) {
        console.error("call api OrdersService -> paginate failed statusCode:", response.status);
      }
      return response.data.result;
    } catch (error) {
      throw error;
    }
  };

  delete = async (orderId: string) => {
    try {
      const id = orderId;
      const url: string = `${this.base_url}/orders/${id}`;
      const response = await axios.delete(url, this.options).then((res) => {
        return res?.data;
      });
      return response;
    } catch (error) {
      console.error("Error fetching OrdersService => delete:", error);
    }
  };

  getToDashbordSalesOverall = async (filter: string, start_date: string = "", end_date: string = "") => {
    try {
      const query = `?filter=${filter}&start_date=${start_date}&end_date=${end_date}`;
      const url = `${this.base_url}/orders/dashbord-sales-sverall${query}`;
      const response = await axios.get(url, this.options);
      if (response.status !== 200) {
        console.error("call api OrdersService -> getToDashbordSalesOverall failed statusCode:", response.status);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching OrdersService => getToDashbordSalesOverall:", error);
    }
  };

  getDashbordSalesByCategory = async (filter: string, start_date: string = "", end_date: string = "") => {
    try {
      const query = `?filter=${filter}&start_date=${start_date}&end_date=${end_date}`;
      const url = `${this.base_url}/orders/dashbord-sales-category${query}`;
      const response = await axios.get(url, this.options);
      if (response.status !== 200) {
        console.error("call api OrdersService -> getDashbordSalesByCategory failed statusCode:", response.status);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching OrdersService => getDashbordSalesByCategory:", error);
    }
  };

  getDashbordRepeatPurchase = async (filter: string, start_date: string = "", end_date: string = "") => {
    try {
      const query = `?filter=${filter}&start_date=${start_date}&end_date=${end_date}`;
      const url = `${this.base_url}/orders/dashbord-repeat-purchase${query}`;
      const response = await axios.get(url, this.options);
      if (response.status !== 200) {
        console.error("call api OrdersService -> getDashbordRepeatPurchase failed statusCode:", response.status);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching OrdersService => getDashbordRepeatPurchase:", error);
    }
  };

  createOrder = async (body: any) => {
    try {
      const url = `${this.base_url}/orders`;

      const response = await axios.post(url, body, this.options);

      if (response.status !== 201) {
        console.error("call api ProductService -> create failed statusCode:", response.status);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching OrdersService => delete:", error);
    }
  };

  cancelCreateOrder = async () => {
    try {
      const url = `${this.base_url}/orders/cancel-create-order`;


      const response = await axios.get(url, this.options);

      if (response.status !== 201) {
        console.error("call api ProductService -> create failed statusCode:", response.status);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching OrdersService => delete:", error);
    }
  };

  getOrderByCurrentUserId = async (page: number) => {
    try {
      const url = `${this.base_url}/orders/getByUserId?page=${page}`;


      const response = await axios.get(url, this.options);

      if (response.status !== 201) {
        console.error("call api ProductService -> create failed statusCode:", response.status);
      }
      return response;
    } catch (error) {
      console.error("Error fetching OrdersService => delete:", error);
    }
  };
}
