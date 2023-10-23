import axios from "axios";
import AbstractService from "./abstract.service";
import { RegisterForm } from "@/common/models/register.interface";

class TambonsService extends AbstractService {
  constructor() {
    super();
  }

  getProvince = async () => {
    try {
      const url = `${this.base_url}/tambons/providers`;

      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error("call api TambonsService -> getProvince failed statusCode:", response.status);
      }

      return response.data;
    } catch (error) {
      console.error("Error TambonsService -> getProvince:", error);
    }
  };

  getAmphoe = async (provinceCode: string) => {
    try {
      const url = `${this.base_url}/tambons/amphoes?provinceCode=${provinceCode}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error("call api TambonsService -> getAmphoe failed statusCode:", response.status);

        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error TambonsService -> getAmphoe:", error);
    }
  };

  getDistrict = async (provinceCode: string, amphoeCode: string) => {
    try {
      const url = `${this.base_url}/tambons/districts?provinceCode=${provinceCode}&amphoeCode=${amphoeCode}`;

      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error("call api TambonsService -> getDistrict failed statusCode:", response.status);

        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error TambonsService -> getDistrict:", error);
    }
  };

  getZipCode = async (districtCode: string, amphoeCode: string, provinceCode: string) => {
    try {
      const url = `${this.base_url}/tambons/zipcode?amphoeCode=${amphoeCode}&districtCode=${districtCode}&provinceCode=${provinceCode}`;

      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error("call api TambonsService -> getDistrict failed statusCode:", response.status);

        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error TambonsService -> getDistrict:", error);
    }
  };

  addAddressUser = async (body: RegisterForm) => {
    try {
      // const data = JSON.stringify(body);
      let data = {
        amphoe: body?.amphoe,
        detailAddress: body?.detailAddress,
        district: body?.district,
        province: body?.province,
        zipCode: body?.zipCode,
      };
      const url = `${this.base_url}/user-address`;
      const response = await axios.post(url, data, this.options);
      if (response.status !== 200) {
        console.error("call api CategoryService -> createCategory failed statusCode:", response.status);
      }

      return response.data;
    } catch (error) {
      console.error("Error CategoryService -> createCategory:", error);
    }
  };
}

export default TambonsService;
