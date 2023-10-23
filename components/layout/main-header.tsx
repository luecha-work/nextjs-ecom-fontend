import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import classec from "./main-header.module.css";
import { FC, useEffect, useState } from "react";
import { RootState } from "../../redux-store/store";
import { useRouter } from "next/router";
import { IconButton } from "@mui/material";
import Link from "next/link";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "js-cookie";
import { AccountCircle } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../../service/auth.sevice";
import {
  updateLoggedInStatus,
  updateUserRoleStatus,
} from "../../redux-store/actions/auth";

import NotificationsIconUI from "../ui/notifications-icon";
import ShoppingCartUI from "../ui/shopping-cart";
const drawerWidth = 280;

const menuNotLogin = [
  { label: "หน้าหลัก", link: "/" },
  { label: "สินค้าทั้งหมด", link: "/all-products" },
];

const menuLoggedIn = [
  { label: "หน้าหลัก", link: "/" },
  { label: "สินค้าทั้งหมด", link: "/all-products" },
  // { label: "แจ้งชำระเงิน", link: "/payment-notification" },
  // { label: "รายละเอียดคำสั่งซื้อ", link: "/order-details" },
  // { label: "สถานะการสั่งซื้อ", link: "/order-status", icon: "" },
  { label: "ประวัติการสั่งซื้อ", link: "/history-order", icon: "" },
];

const userMenu = [
  { label: "เข้าสู่ระบบ", link: "/login", icon: "login" },
  { label: "สมัครสมาชิก", link: "/register", icon: "register" },
];

const settings = [
  { label: "ข้อมูลส่วนบุคคล", link: "/profile", icon: "" },
  { label: "เปลี่ยนรหัสผ่าน", link: "/forgot-password?email=", icon: "" },
  { label: "ออกจากระบบ", link: "/", icon: "" },
];

const settingsAdmin = [
  { label: "ข้อมูลส่วนบุคคล", link: "/profile", icon: "" },
  { label: "เปลี่ยนรหัสผ่าน", link: "/forgot-password?email=", icon: "" },
  { label: "ออกจากระบบ", link: "/", icon: "" },
];

const MainHeader: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const authService = new AuthService();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.auth.userRole);
  const cartLength = useSelector(
    (state: RootState) => state.notifications.cart
  );
  const [userInfo, setUserInfo] = useState<any>();

  const [anchorElNav, setAnchorElNav] = useState<{
    user: HTMLElement | null;
    settings: HTMLElement | null;
    menu: HTMLElement | null;
  }>({
    user: null,
    settings: null,
    menu: null,
  });

  const [message, setMessage] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const access_token = Cookies.get("jwt_token");

  useEffect(() => {
    const jwt_token = Cookies.get("jwt_token");

    if (jwt_token && jwt_token !== undefined && jwt_token !== "") {
      const userInfo = authService.userInfo().then(async (res) => {
        if (res !== undefined) {
          setUserInfo(res?.result);
        } else {
          Cookies.remove("jwt_token");
          // router.push('/');
        }
      });
    }
  }, [access_token, userRole]);

  function handleProfileSettingClick(setting: {
    label: string;
    link: string;
  }): void {
    if (setting.label !== "" && setting.link !== "") {
      if (setting.label === "ออกจากระบบ") {
        Cookies.remove("jwt_token");
        Cookies.remove("access_token");

        dispatch(updateUserRoleStatus(3));
        dispatch(updateLoggedInStatus(false));

        router.push(setting.link);
      } else if (setting.label === "เปลี่ยนรหัสผ่าน") {
        router.push(setting.link + userInfo.email);
      } else {
        router.push(setting.link);
      }
    }
  }

  function handleUserMenuIconClick(userMenu: {
    label: string;
    link: string;
    icon: string;
  }): void {
    if (userMenu.label !== "" && userMenu.link !== "") {
      if (userMenu.label === "ออกจากระบบ") {
        Cookies.remove("jwt_token");
        Cookies.remove("access_token");

        dispatch(updateUserRoleStatus(3));
        dispatch(updateLoggedInStatus(false));

        router.push(userMenu.link);
      } else {
        router.push(userMenu.link);
      }
    }
  }

  function handleMenuIconClick(item: { label: string; link: string }): void {
    if (item.link !== "") {
      router.push(item.link);
    }
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="static"
          sx={{
            width: userRole !== 3 ? `calc(100% - ${drawerWidth}px)` : "100%",
            height: "100%",
            ml: userRole !== 3 ? `${drawerWidth}px` : "initial",
          }}
          className={classec.header}
        >
          <Toolbar
            disableGutters
            sx={{
              marginY: "0.5rem",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div className={classec.logo}>
                <span className={classec.logoBig}>PE</span>
                <span className={classec.logoSmall}>Shop</span>
              </div>
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) => {
                  setAnchorElNav({
                    ...anchorElNav,
                    menu: event.currentTarget as HTMLElement,
                  });
                }}
                color="inherit"
              >
                <MenuIcon style={{ width: "2.5rem", height: "2.5rem" }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav.menu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav.menu)}
                onClick={() => {
                  setAnchorElNav({
                    ...anchorElNav,
                    menu: null,
                  });
                }}
                sx={{
                  display: { xs: "block", md: "none" },
                  width: "1100px",
                }}
              >
                {(isLoggedIn === true ? menuLoggedIn : menuNotLogin).map(
                  (item) => (
                    <MenuItem
                      key={item.label}
                      onClick={() => {
                        setAnchorElNav({
                          ...anchorElNav,
                          menu: null,
                        });
                      }}
                    >
                      <Typography
                        textAlign="center"
                        onClick={() => handleMenuIconClick(item)}
                      >
                        {item.label}
                      </Typography>
                    </MenuItem>
                  )
                )}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                // Center align the content
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <div className={classec.logoPhone}>
                <span className={classec.logoBigPhone}>PE</span>
                <span className={classec.logoSmallPhone}>Shop</span>
              </div>
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "none",
                  md: "flex",
                },
              }}
            >
              {userRole !== 3
                ? null
                : (isLoggedIn === false ? menuNotLogin : menuLoggedIn).map(
                    (item) => (
                      <Button
                        key={item.label}
                        style={{
                          color: "#1a1919",
                          fontSize: "1.5rem",
                          margin: "0px",
                        }}
                        onClick={(event) => {
                          setAnchorElNav({
                            ...anchorElNav,
                            menu: null,
                          });
                        }}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        <nav className={classec.navigation}>
                          <ul>
                            <li>
                              <Link href={item.link}>{item.label}</Link>
                            </li>
                          </ul>
                        </nav>
                      </Button>
                    )
                  )}
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                flexDirection: "row-reverse",
              }}
            >
              {isLoggedIn ? (
                <>
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    {userRole === 3 ? (
                      <Box sx={{ flexGrow: 0, marginLeft: "2rem" }}>
                        <ShoppingCartUI />
                      </Box>
                    ) : null}

                    <Box sx={{ flexGrow: 0, marginLeft: "2rem" }}>
                      <NotificationsIconUI />
                    </Box>

                    <Box sx={{ flexGrow: 0, marginLeft: "2rem" }}>
                      <Tooltip
                        title="Open settings"
                        className={classec.navBarIcon}
                      >
                        <IconButton
                          onClick={(event) => {
                            setAnchorElNav({
                              ...anchorElNav,
                              settings: event.currentTarget as HTMLElement,
                            });
                          }}
                        >
                          <Avatar
                            className={classec.settingIcon}
                            alt="Icon User"
                            src={`https://xsgames.co/randomusers/avatar.php?g=pixel`}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ flexGrow: 0 }}>
                    <Menu
                      sx={{ mt: "45px" }}
                      id="menu-appbar-settings"
                      anchorEl={anchorElNav.settings}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElNav.settings)}
                      onClick={() => {
                        setAnchorElNav({
                          ...anchorElNav,
                          settings: null,
                        });
                      }}
                    >
                      {userRole !== 3 ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            marginX: "1rem",
                            marginY: "1rem",
                            borderBottom: "1px solid ",
                          }}
                          key={`setting-profile`}
                        >
                          <Box
                            display="grid"
                            alignItems="center"
                            alignContent="center"
                            justifyContent="center"
                            justifyItems="center"
                          >
                            <div className="profileContainer">
                              <img
                                className="profileImage"
                                src={`https://xsgames.co/randomusers/avatar.php?g=pixel`}
                                alt="setting-profile"
                                loading="lazy"
                              />
                            </div>
                            <p style={{ margin: "0" }}>{userInfo?.email}</p>

                            {userRole === 2 ? (
                              <p style={{ margin: "0rem 0rem 1rem 0rem" }}>
                                owner(เจ้าของร้า)
                              </p>
                            ) : (
                              <p style={{ margin: "0rem 0rem 1rem 0rem" }}>
                                admin(ผู้ดูแลระบบ)
                              </p>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            marginX: "1rem",
                            marginY: "1rem",
                            borderBottom: "1px solid ",
                          }}
                          key={`setting-profile`}
                        >
                          <Box
                            display="grid"
                            alignItems="center"
                            alignContent="center"
                            justifyContent="center"
                            justifyItems="center"
                          >
                            <div className="profileContainer">
                              <img
                                className="profileImage"
                                src={`https://xsgames.co/randomusers/avatar.php?g=pixel`}
                                alt="setting-profile"
                                loading="lazy"
                              />
                            </div>
                            <p style={{ margin: "0" }}>{userInfo?.email}</p>

                            <p style={{ margin: "0rem 0rem 1rem 0rem" }}>
                              user(ผู้ใช้งาน)
                            </p>
                          </Box>
                        </Box>
                      )}

                      {(userRole === 3 ? settings : settingsAdmin).map(
                        (setting, index) => (
                          <MenuItem
                            key={setting.label}
                            onClick={() => {
                              setAnchorElNav({
                                ...anchorElNav,
                                settings: null,
                              });

                              handleProfileSettingClick(setting);
                            }}
                          >
                            <Typography
                              textAlign="start"
                              // onClick={() => handleProfileSettingClick(setting)}
                            >
                              {setting.label}
                            </Typography>
                          </MenuItem>
                        )
                      )}
                    </Menu>
                  </Box>
                </>
              ) : (
                <>
                  {userMenu.map((item) => (
                    <Button
                      key={item.label}
                      style={{
                        color: "#1a1919",
                        fontSize: "1.5rem",
                        margin: "0px",
                      }}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          justifyItems: "center",
                          alignItems: "center",
                          marginRight: "5px",
                        }}
                      >
                        {item.icon === "login" ? (
                          <LoginIcon />
                        ) : (
                          <PersonAddIcon />
                        )}
                        <nav className={classec.navigation}>
                          <ul>
                            <li>
                              <Link href={item.link}>{item.label}</Link>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </Button>
                  ))}
                </>
              )}
            </Box>
            {/* icon user */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                flexDirection: "row-reverse",
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar-user"
                aria-haspopup="true"
                onClick={(event) => {
                  setAnchorElNav({
                    ...anchorElNav,
                    user: event.currentTarget as HTMLElement,
                  });
                }}
                color="inherit"
              >
                <AccountCircle style={{ width: "2.5rem", height: "2.5rem" }} />
              </IconButton>
              <Menu
                id="menu-appbar-user"
                anchorEl={anchorElNav.user}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav.user)}
                onClose={() => {
                  setAnchorElNav({
                    ...anchorElNav,
                    user: null,
                  });
                }}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {(isLoggedIn
                  ? userRole !== 3
                    ? settingsAdmin
                    : settings
                  : userMenu
                ).map((item) => (
                  <MenuItem
                    key={item.label}
                    onClick={() => {
                      setAnchorElNav({
                        ...anchorElNav,
                        user: null,
                      });
                    }}
                  >
                    <Typography
                      textAlign="center"
                      onClick={() => handleUserMenuIconClick(item)}
                    >
                      {item.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default MainHeader;
