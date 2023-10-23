import { NextPage } from "next";
import { Fragment, useState } from "react";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/router";

import classec from "./main-header.module.css";
import MainHeader from "./main-header";
import AuthService from "@/service/auth.sevice";
import MenuBar from "./menu-bar";
import { RootState } from "../../redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  updateLoggedInStatus,
  updateUserRoleStatus,
} from "../../redux-store/actions/auth";
import { Box, CircularProgress } from "@mui/material";
import { useStore } from "@/common/class/stateManagement";

const Layout: NextPage<any> = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authService = new AuthService();

  const [isLoading, setIsLoading] = useState(true);
  const isLoading_status = useStore((state) => state.spin_status);

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.auth.userRole);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);

    const jwt_token = Cookies.get("jwt_token");
    if (jwt_token && jwt_token !== undefined && jwt_token !== "") {
      authService.userInfo().then((res) => {
        if (res !== undefined) {
          dispatch(updateUserRoleStatus(res?.result.role.roleCode));
          dispatch(updateLoggedInStatus(true));
          // router.push("/");
        } else {
          Cookies.remove("jwt_token");
          router.push("/");
        }
      });
    }
  }, []);

  return (
    <Fragment>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            fontSize: "1rem",
            color: "#9b9090",
          }}
        >
          <CircularProgress size={60} disableShrink={isLoading_status} />
        </Box>
      ) : (
        <>
          <MainHeader />
          <div
            style={{
              display: userRole !== 3 ? "grid" : "initial",
              gridTemplateColumns: "auto 1fr",
              padding: "1rem",
            }}
          >
            {userRole === 3 ? null : isLoggedIn ? <MenuBar /> : null}
            <div>
              <main>{props.children}</main>
            </div>
          </div>
        </>
      )}
    </Fragment>
  );
};

export default Layout;
