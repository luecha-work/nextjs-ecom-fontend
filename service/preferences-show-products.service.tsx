import axios from "axios";
import AbstractService from "./abstract.service";

export class PreferencesShowProductsService extends AbstractService {
  constructor() {
    super();
  }

  getIntroductionPageSetting = async () => {
    try {
      const url = `${this.base_url}/preferences-show-products/introduction-page`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api PreferencesShowProductsService -> getIntroductionPageSetting failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Error PreferencesShowProductsService -> getIntroductionPageSetting:",
        error
      );
    }
  };

  getFirstPageSetting = async () => {
    try {
      const url = `${this.base_url}/preferences-show-products/first-page`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api PreferencesShowProductsService -> getFirstPageSetting failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Error PreferencesShowProductsService -> getFirstPageSetting:",
        error
      );
    }
  };

  update = async (id: string, data: any) => {
    try {
      const url = `${this.base_url}/preferences-show-products/${id}`;
      const response = await axios.patch(url, data, this.options);

      if (response.status !== 200) {
        console.error(
          "call api PreferencesShowProductsService -> update failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error PreferencesShowProductsService -> update:", error);
    }
  };
}
