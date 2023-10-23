import axios from "axios";
import AbstractService from "./abstract.service";

export class OptionService extends AbstractService {
  update = async (id: string, data: any) => {
    try {
      const url = `${this.base_url}/products-option/${id}`;

      const response = await axios.patch(url, data, this.options);

      if (response.status !== 200) {
        console.error(
          "call api OptionService -> update failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error OptionService -> update:", error);
      throw error;
    }
  };

  delete = async (id: string) => {
    try {
      const url = `${this.base_url}/products-option/${id}`;
      const response = await axios.delete(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api OptionService -> delete failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error OptionService -> delete:", error);
      throw error;
    }
  };
}
