import axios from "axios";
import AbstractService from "./abstract.service";

export class ParcelDeliveryService extends AbstractService {
  constructor() {
    super();
  }

  get = async () => {
    try {
      const url = `${this.base_url}/parcel-delovery-detail`;

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

  update = async (data: any, id: string) => {
    try {
      const url = `${this.base_url}/parcel-delovery-detail/${id}`;

      const body = JSON.stringify(data);

      const response = await axios.patch(url, body, this.options);

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
