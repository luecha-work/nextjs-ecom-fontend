import axios from "axios";
import AbstractService from "./abstract.service";

export class CommonService extends AbstractService {
  constructor() {
    super();
  }

  uploadingVideo = async (data: any) => {
    try {
      const url = `${this.base_url}/common-upload/upload-video`;

      const response = await axios.post(url, data);

      if (response.status !== 201) {
        console.error(
          "call api CommonService -> uploadingVideo failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error CommonService -> uploadingVideo:", error);
    }
  };

  getVideoPath = async () => {
    try {
      const url = `${this.base_url}/common-upload/video-path`;

      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api CommonService -> getVideoPath failed statusCode:",
          response.status
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error CommonService -> getVideoPath:", error);
    }
  };
}
