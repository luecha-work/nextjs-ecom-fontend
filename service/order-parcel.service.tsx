import axios from "axios";
import AbstractService from "./abstract.service";

export class OrderParcelStatusService extends AbstractService {
  getPendingStatus = async () => {
    try {
      const url = `${this.base_url}/parcel-status`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api OrdersStatusService -> getOrdersStatus failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error OrdersStatusService -> paginate:", error);
      throw error;
    }
  };

  getParcelStatusOnOrderSuccess = async () => {
    try {
      const url = `${this.base_url}/parcel-status/order-success`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api OrdersStatusService -> getOrdersStatus failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error OrdersStatusService -> paginate:", error);
      throw error;
    }
  };
}
