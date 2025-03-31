class AbstractService {
  base_url: string = "https://nestjs-ecom-backend.onrender.com/api";

  options = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };
}

export function convertTimestampToFormattedDate(timestamp: any) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default AbstractService;
