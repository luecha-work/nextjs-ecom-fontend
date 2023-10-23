import Layout from "@/components/layout/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux-store/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useStore } from "@/common/class/stateManagement";
import AuthService from "@/service/auth.sevice";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const authService = new AuthService();
  const isLoading_status = useStore((state) => state.spin_status);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // setIsLoading(false);
    const access_token = Cookies.get("jwt_token");
    if (access_token && access_token !== undefined && access_token !== "") {
      authService.userInfo().then((res) => {
        if (res !== undefined) {
          // router.push("/");
          // window.location.reload()
        }
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
