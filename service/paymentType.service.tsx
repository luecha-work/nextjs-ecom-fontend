import axios from "axios";
import AbstractService from "./abstract.service";
import { loginBody, registerBody } from "./models/auth.interface";
import { BaseUserInfoResult } from "./models/base-userinfo-result";
import { PaymentType } from "./models/paymentType.interface";

class PaymentService extends AbstractService {
  constructor() {
    super();
  }

  getAllPayment = async (page: number = 1, search: string = "") => {
    try {
      const url = `${this.base_url}/payments-type?page=${page}&search=${search}`;
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

  createPaymentType = async (body: PaymentType) => {
    try {
      let data = {
        bankAccount: body?.bankAccount,
        paymentCode: body?.paymentCode,
        paymentName: body?.paymentName,
        active: true,
      };
      const url = `${this.base_url}/payments-type`;
      const response = await axios.post(url, data, this.options);
      if (response.status !== 200) {
        console.error("call api OrdersService -> paginate failed statusCode:", response.status);
      }

      return response.data;
    } catch (error) {
      console.error("Error OrdersService -> paginate:", error);
      throw error;
    }
  };

  updatePaymentType = async (body: PaymentType) => {
    try {
      let Id = body?.id;
      let data = {
        paymentCode: body?.paymentCode,
        paymentName: body?.paymentName,
        active: body?.active,
      };
      const url = `${this.base_url}/payments-type/${Id}`;
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

  delete = async (Id: string) => {
    try {
      const id = Id;
      const url: string = `${this.base_url}/payments-type/${id}`;
      const response = await axios.delete(url, this.options).then((res) => {
        return res?.data;
      });
      return response;
    } catch (error) {
      console.error("Error fetching registerService:", error);
    }
  };
}

export default PaymentService;
