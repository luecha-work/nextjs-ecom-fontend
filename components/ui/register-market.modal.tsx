import { Box, styled, Theme } from "@mui/system";
import Fade from "@mui/material/Fade";
import { Button, FormControl, FormHelperText, InputLabel, Modal, Stack, TextField } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { NextPage } from "next";
import ButtonLogin from "./button";
import { RegisterForm } from "@/common/models/register.interface";
import AuthService from "@/service/auth.sevice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { generateRandomCode } from "@/common/class/random-code";
import { Textarea } from "@mui/joy";

interface RegisterMarketProps {
  validateForm: () => boolean;
  registerFormData: RegisterForm;
  AddUser: boolean;
}

interface MarketFormErrors {
  marketName?: string;
}

const RegisterMarketModal: NextPage<RegisterMarketProps> = ({ validateForm, registerFormData, AddUser }) => {
  const router = useRouter();
  const authService = new AuthService();

  const [open, setOpen] = useState(false);
  const [isStatusChange, setIsStatusChange] = useState(true);
  const [marketForm, setMarketForm] = useState({
    marketName: "",
    marketCode: "",
    discription: "",
  });

  const [formErrors, setFormErrors] = useState<MarketFormErrors>({
    marketName: "",
  });

  const validateMarketForm = () => {
    let errors: MarketFormErrors = {};
    let isValid = true;

    if (!formErrors.marketName) {
      errors.marketName = "กรุณากรอกชื่อร้านค้า";

      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleOpen = () => {
    if (validateForm()) {
      if (registerFormData.roleCode === "2") {
        setOpen(true);
      } else {
        handleSubmit();
      }
    }
  };

  const handleClose = () => {
    setMarketForm({
      marketName: "",
      marketCode: "",
      discription: "",
    });
    setIsStatusChange(true);
    setOpen(false);
  };

  const handleSubmit = async () => {
    const dataToRegister = {
      ...registerFormData,
      market: marketForm,
    };

    if (validateForm() && validateMarketForm()) {
      const registerUser = await authService.register(dataToRegister);
      if (registerUser && registerUser !== undefined) {
        Cookies.set("email", registerFormData.email, { expires: 3 }); // Set cookie to expire in 7 days
        Cookies.set("password", registerFormData.password, { expires: 3 });
        Cookies.set("rememberMe", "true", { expires: 3 });
        Cookies.remove("jwt_token");
        if (AddUser) {
          router.push("/");
        } else router.push("/login");
      } else {
        Cookies.remove("email");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }

      handleClose();
    }
  };

  useEffect(() => {
    setMarketForm({
      ...marketForm,
      marketCode: generateRandomCode("MARKET"),
    });
  }, [isStatusChange]);

  return (
    <div>
      <ButtonLogin onClick={handleOpen} background={"color"}>
        ยืนยันการสมัคร
      </ButtonLogin>

      <StyledModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}>
        <Fade in={open}>
          <Box sx={style}>
            <h2 id="transition-modal-title">เพิ่มข้อมูลร้านค้า</h2>
            <InputLabel sx={{ color: "black", marginBottom: "0.2rem" }} htmlFor="input-market-name">
              ชื่อร้านค้า
            </InputLabel>
            <FormControl fullWidth size="small" required error={!!formErrors.marketName}>
              <TextField
                id="input-market-name"
                fullWidth
                label=""
                variant="outlined"
                size="small"
                onChange={(e) =>
                  setMarketForm({
                    ...marketForm,
                    marketName: e.target.value,
                  })
                }
                error={!!formErrors.marketName}
              />
              {formErrors.marketName && <FormHelperText>{formErrors.marketName}</FormHelperText>}
            </FormControl>

            <InputLabel
              sx={{
                color: "black",
                marginBottom: "0.2rem",
                marginTop: "2rem",
              }}
              htmlFor="input-market-address">
              รายละเอียดร้านค้า
            </InputLabel>
            <Textarea
              id="input-market-address"
              placeholder="รายละเอียดที่อยู่"
              minRows={4}
              maxRows={4}
              onChange={(e) =>
                setMarketForm({
                  ...marketForm,
                  discription: e.target.value,
                })
              }
            />

            <span>{!isStatusChange && <p style={{ color: "red" }}>***รายการข้อมูลห้ามว่าง</p>}</span>
            <Stack direction="row" spacing={2} mt={5} alignItems="center" justifyContent="flex-end">
              <Button variant="outlined" color="error" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
                ตกลง
              </Button>
            </Stack>
          </Box>
        </Fade>
      </StyledModal>
    </div>
  );
};

// eslint-disable-next-line react/display-name
const Backdrop = forwardRef<HTMLDivElement, { open?: boolean }>((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});

const blue = {
  200: "#99CCF3",
  400: "#3399FF",
  500: "#007FFF",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme: Theme) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: "10px",
  padding: "16px 32px 24px 32px",
  backgroundColor: theme.palette.mode === "dark" ? "#0A1929" : "white",
  boxShadow: `0px 2px 24px ${theme.palette.mode === "dark" ? "#000" : "#383838"}`,
});

export default RegisterMarketModal;
