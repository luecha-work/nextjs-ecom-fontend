import { NextPage } from "next";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/common/class/stateManagement";
import { Box, CircularProgress } from "@mui/material";
import Home_Login from "@/components/home/home_login";

const HomeLoginPage: NextPage = () => {
  const router = useRouter();

  const access_token = Cookies.get("jwt_token");

  const isLoading_status = useStore((state) => state.spin_status);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!(access_token && access_token !== undefined && access_token !== "")) {
      router.push("/");
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Replace with your actual data loading code
  });

  return (
    <div>
      <>
        <Home_Login />
      </>
    </div>
  );
};

export default HomeLoginPage;
