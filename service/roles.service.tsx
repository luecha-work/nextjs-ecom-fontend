import axios from "axios";
import AbstractService from "./abstract.service";

export class RolesService extends AbstractService {
  constructor() {
    super();
  }

  getRolesToRegister = async () => {
    try {
      const url = `${this.base_url}/roles/register`;

      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api RolesService -> getRolesToRegister failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error RolesService -> getRolesToRegister:", error);
    }
  };


}
