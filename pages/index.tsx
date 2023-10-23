import { NextPage } from "next";
import HomePage from "@/components/home/home";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HomeLoginPage from "./home-logedin";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux-store/store";
import OrdersCheckPayment from "./admin-market/orders/orders-check-payment";

const Home: NextPage<any> = () => {
  const router = useRouter();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.auth.userRole);

  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    const access_token = Cookies.get("jwt_token");

    if (access_token && access_token !== undefined && access_token !== "") {
      setAccessToken(accessToken ?? undefined);
    }
  }, [accessToken]);

  return (
    <>
      {isLoggedIn && userRole === 1 && <HomePage />}
      {isLoggedIn && userRole === 2 && <OrdersCheckPayment />}
      {isLoggedIn && userRole === 3 && <HomeLoginPage />}
      {!isLoggedIn && <HomePage />}
    </>
  );
};
export default Home;
