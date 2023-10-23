import {
  Box,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import classec from "./login-form.module.css";
import { useRouter } from "next/router";
import WorningMessage from "./worning-message";
import ButtonLogin from "../ui/button";
import Cookies from "js-cookie";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthService from "../../service/auth.sevice";
import { useDispatch, useSelector } from "react-redux";
import {
  updateLoggedInStatus,
  updateUserRoleStatus,
} from "../../redux-store/actions/auth";
import { NextPage } from "next";

const LoginForm: NextPage = () => {
  const pathImage = "images/";
  const router = useRouter();
  const authService = new AuthService();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [rememberStatus, setRememberStatus] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleLoginFacebook = async () => {};

  const handleLoginGoogle = async () => {};

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  async function handleSubmit(): Promise<void> {
    if (rememberStatus.rememberMe) {
      Cookies.set("email", rememberStatus.email, { expires: 3 });
      Cookies.set("password", rememberStatus.password, { expires: 3 });
      Cookies.set("rememberMe", "true", { expires: 3 });
    } else {
      Cookies.remove("email");
      Cookies.remove("password");
      Cookies.remove("rememberMe");
    }

    if (loginForm.email && loginForm.password) {
      const postData = {
        ...loginForm,
      };

      authService.login(postData).then((res) => {
        if (res?.status === 201) {
          dispatch(updateUserRoleStatus(res?.data.result.role.roleCode));
          dispatch(updateLoggedInStatus(true));

          Cookies.set("jwt_token", res?.data.JWT_Token, { expires: 3 });
          router.push("/");
        } else {
          setIsLoggedIn(false);
        }
      });
    } else {
      setIsLoggedIn(true);
      // console.log(`Error: ${loginForm.email} ${loginForm.password}`);
    }
  }

  useEffect(() => {
    const emailFromCookie = Cookies.get("email");
    const passwordFromCookie = Cookies.get("password");
    const rememberMeFromCookie = Cookies.get("rememberMe");

    if (
      emailFromCookie &&
      passwordFromCookie &&
      rememberMeFromCookie === "true"
    ) {
      setLoginForm({
        email: emailFromCookie,
        password: passwordFromCookie,
      });

      setRememberStatus({
        email: emailFromCookie,
        password: passwordFromCookie,
        rememberMe: true,
      });
    }
  }, [showPassword]);

  return (
    <>
      {/* <Box
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
        </Box> */}

      <div className={classec.item}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              marginBottom: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              เข้าสู่ระบบ
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                className={classec.textFieldContent}
                margin="normal"
                fullWidth
                autoFocus
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={rememberStatus.email}
                onChange={(e) => {
                  setRememberStatus({
                    ...rememberStatus,
                    email: e.target.value,
                  });

                  setLoginForm({
                    ...loginForm,
                    email: e.target.value,
                  });
                }}
                error={!isLoggedIn}
              />
              <TextField
                className={classec.textFieldContent}
                margin="normal"
                fullWidth
                autoFocus
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={rememberStatus.password}
                autoComplete="current-password"
                onChange={(e) => {
                  setRememberStatus({
                    ...rememberStatus,
                    password: e.target.value,
                  });

                  setLoginForm({
                    ...loginForm,
                    password: e.target.value,
                  });
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!isLoggedIn}
              />

              <WorningMessage isLoggedIn={isLoggedIn} />

              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberStatus.rememberMe}
                    onChange={(e) =>
                      setRememberStatus({
                        ...rememberStatus,
                        rememberMe: e.target.checked,
                      })
                    }
                  />
                }
                label="Remember me"
              />
              {/* <Grid container>
                <Grid item xs>
                  <div className={(classec.actions, classec.btnLogin)}>
                    <ButtonLogin onClick={handleLoginFacebook} background={""}>
                      <span>
                        <img
                          className={classec.img}
                          src={`${pathImage}/facebook.png`}
                          alt={"FaceBook"}
                          loading="lazy"
                        />
                      </span>
                      <span>Facebook</span>
                    </ButtonLogin>
                  </div>
                </Grid>
                <Grid item xs>
                  <div className={(classec.actions, classec.btnLogin)}>
                    <ButtonLogin onClick={handleLoginGoogle} background={""}>
                      <span>
                        <img
                          className={classec.img}
                          src={`${pathImage}/google.webp`}
                          alt={"Google"}
                          loading="lazy"
                        />
                      </span>
                      <span>Facebook</span>
                    </ButtonLogin>
                  </div>
                </Grid>
              </Grid> */}
              <Box mt={6}></Box>

              <div className={classec.actions}>
                <ButtonLogin onClick={handleSubmit} background={"color"}>
                  Login
                </ButtonLogin>
              </div>
              <Grid container>
                <Grid item xs mt={1}>
                  <Link href="/forgot-password?email=">Forgot password?</Link>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs>
                  <p className={classec.registerText}>
                    สมาชิกใหม่?&nbsp;
                    <Link className={classec.registerLink} href="/register">
                      ลงทะเบียน
                    </Link>
                    &nbsp; ที่นี่
                  </p>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default LoginForm;
