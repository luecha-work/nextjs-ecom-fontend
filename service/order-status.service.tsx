import axios from "axios";
import AbstractService from "./abstract.service";
export class OrdersStatusService extends AbstractService {
  constructor() {
    super();
  }

  getOrdersStatus = async (action: string) => {
    try {
      const url = `${this.base_url}/order-status?action=${action}`;
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
