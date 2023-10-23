import axios from "axios";
import AbstractService from "./abstract.service";

export class NotificationsService extends AbstractService {
  constructor() {
    super();
  }

  getAllNotification = async () => {
    try {
      const url = `${this.base_url}/notifications`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api NotificationsService -> getAllNotification failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error NotificationsService -> getAllNotification:", error);
    }
  };

  countNotifications = async () => {
    try {
      const url = `${this.base_url}/notifications/get-amount`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api NotificationsService -> countNotifications failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error NotificationsService -> countNotifications:", error);
    }
  };

  getNotificationById = async (id: string) => {
    try {
      const url = `${this.base_url}/notifications/${id}`;
      const response = await axios.get(url, this.options);

      if (response.status !== 200) {
        console.error(
          "call api NotificationsService -> getNotificationById failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error(
        "Error NotificationsService -> getNotificationById:",
        error
      );
    }
  };

  createNotification = async (data: any) => {
    try {
      const url: string = `${this.base_url}/notifications`;

      const response = await axios.post(url, data, this.options);

      if (response.status !== 201) {
        console.error(
          "call api NotificationsService -> create failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching NotificationsService --> create:", error);
    }
  };

  updateNotification = async (id: string, data: any) => {
    try {
      const url = `${this.base_url}/notifications/${id}`;
      const response = await axios.patch(url, data, this.options);

      if (response.status !== 200) {
        console.error(
          "call api NotificationsService -> updateNotification failed statusCode:",
          response.status
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error NotificationsService -> updateNotification:", error);
    }
  };
}
