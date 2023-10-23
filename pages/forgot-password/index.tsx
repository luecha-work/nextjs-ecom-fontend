import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { NextPage } from "next";
import TextFieldPassword from "@/components/ui/textfield-password";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import AuthService from "@/service/auth.sevice";
import isEmail from "validator/lib/isEmail";
import Cookies from "js-cookie";

interface ForgotPasswordForm {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const ForgotPassword: NextPage = () => {
  const router = useRouter();
  const authService = new AuthService();

  const { email } = router.query;
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<ForgotPasswordForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isValidPasswordPattern, setIsValidPasswordPattern] = useState(true);
  const [isValidConfirmPasswordPattern, setIsValidConfirmPasswordPattern] =
    useState(true);
  const [isFoundEmail, setIsFoundEmail] = useState(true);

  const validatePasswordPattern = (value: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    const hasMinimumLength = value.length >= 8;
    return regex.test(value) && hasMinimumLength;
  };

  useEffect(() => {
    if (email !== undefined && email !== "") {
      setForgotPasswordForm({
        ...forgotPasswordForm,
        email: email?.toString() ?? "",
      });
    }
  }, []);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;

    setForgotPasswordForm({
      ...forgotPasswordForm,
      password: newPassword,
    });

    setIsValidPasswordPattern(validatePasswordPattern(newPassword));
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = event.target.value;

    setForgotPasswordForm({
      ...forgotPasswordForm,
      confirmPassword: newPassword,
    });

    setIsValidConfirmPasswordPattern(validatePasswordPattern(newPassword));
  };

  const validateError = () => {
    let errors: ForgotPasswordForm = {};
    let isValid = true;

    if (!forgotPasswordForm.email || !isEmail(forgotPasswordForm.email)) {
      errors.email = "กรุณากรอกอีเมล(ต้องมี @ และ .com)";

      isValid = false;
    }

    if (!forgotPasswordForm.password) {
      errors.password = "กรุณากรอกรหัสผ่าน";

      isValid = false;
    }

    if (!forgotPasswordForm.confirmPassword) {
      errors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChangePassword = () => {
    if (
      validateError() &&
      isValidPasswordPattern &&
      isValidConfirmPasswordPattern
    ) {
      authService.findUserByEmail(forgotPasswordForm.email).then((res) => {
        if (res !== undefined) {
          let data = {
            password: forgotPasswordForm.password,
            confirmPassword: forgotPasswordForm.confirmPassword,
          };
          authService.forgotPassword(res?.result.id, data).then((res) => {
            if (res !== undefined) {
              Cookies.remove("email");
              Cookies.remove("password");
              Cookies.remove("rememberMe");

              if (email === undefined) {
                router.push("/login");
              } else {
                router.back();
              }
            }
          });

          setIsFoundEmail(true);
        } else {
          setIsFoundEmail(false);
        }
      });
    }
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, marginY: "3rem" }}>
        <Grid container spacing={2} columns={16}>
          <Grid item xs={4}></Grid>
          <Grid item xs={8}>
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
            >
              <Box flexGrow={0} sx={{ width: "80%" }}>
                <Card sx={{ padding: "2rem" }}>
                  <CardHeader className="titlePages" title="เปลี่ยนรหัสผ่าน" />
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "start",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      flexGrow={0}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "50%",
                      }}
                    >
                      <Box flexGrow={0}>
                        <FormControl
                          fullWidth
                          size="small"
                          required
                          error={!!formErrors.email}
                        >
                          <TextField
                            label="ค้นหาอีเมล"
                            value={forgotPasswordForm.email}
                            size="small"
                            required
                            onChange={(e) => {
                              setForgotPasswordForm({
                                ...forgotPasswordForm,
                                email: e.target.value,
                              });
                            }}
                            error={!!formErrors.email}
                          />
                          {formErrors.email && (
                            <FormHelperText>{formErrors.email}</FormHelperText>
                          )}

                          {!isFoundEmail && (
                            <FormHelperText sx={{ color: "red" }}>
                              ไม่พบอีเมลนี้ในระบบ !
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                      <Box flexGrow={0} mt={4}>
                        <TextFieldPassword
                          label="password"
                          password={forgotPasswordForm.password}
                          handlePasswordChange={handlePasswordChange}
                          validateError={formErrors.password}
                          isValidPasswordPattern={isValidPasswordPattern}
                        />
                      </Box>
                      <Box flexGrow={0} mt={2}>
                        <TextFieldPassword
                          label="confirm password"
                          password={forgotPasswordForm.confirmPassword}
                          handlePasswordChange={handleConfirmPasswordChange}
                          validateError={formErrors.confirmPassword}
                          isValidPasswordPattern={isValidConfirmPasswordPattern}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions
                    sx={{
                      display: "flex",
                      marginTop: "2rem",
                      justifyContent: "center",
                    }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Button
                        className="forgot-password-btn"
                        variant="contained"
                        color="error"
                        onClick={() => {
                          router.push("/");
                        }}
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        className="forgot-password-btn"
                        variant="contained"
                        onClick={handleChangePassword}
                      >
                        ตกลง
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ForgotPassword;
