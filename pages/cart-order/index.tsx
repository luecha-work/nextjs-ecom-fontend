import { Alert, AlertTitle, Box, Button, Container, Grid, Step, StepIconProps, StepLabel, Stepper, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ButtonBack from "@/components/ui/button-back";
import { ProductService } from "@/service/product.service";
import { Product } from "@/service/models/product.interface";
import { UserType } from "@/service/models/auth.interface";
import AuthService from "@/service/auth.sevice";
import React from "react";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InfoIcon from "@mui/icons-material/Info";
import { createContext, useContext } from "react";
import SendAddress from "./send-address";
import SendPayment from "./set-payment";
import NotiPayment from "./noti-payment";
import DetailOrder from "./detail-order";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux-store/store";
import { CartService } from "@/service/cart.service";
import CrudUser from "@/service/user.sevice";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { OrdersService } from "@/service/order.service";
import ConfirmProcessModal from "@/components/ui/confirm-process-modal";
import { NotificationsService } from "@/service/notifications.service";
import { updateCartStatus, updateNotifStatus } from "@/redux-store/actions/notifications";

const StepOrder = () => {
  const router = useRouter();
  const callCartService = new CartService();
  const callService = new AuthService();
  const callUserService = new CrudUser();
  const callProductsService = new ProductService();
  const callOrderService = new OrdersService();
  const notificationsService = new NotificationsService();
  const dispatch = useDispatch();

  const [stepAddress, setStepAddress] = useState();
  const [stepData, setStepData] = useState();
  const steps = ["จัดส่งที่อยู่", "การชำระเงิน", "แจ้งชำระเงิน", "รายละเอียดคำสั้งซื้อ"];
  const [activeStep, setActiveStep] = useState(1);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [slipPath, setSlipPath] = useState<string>();
  const [user_info, setUser_info] = useState();
  const [firstLoading, setFirstLoading] = useState<boolean>(true);

  // ตัวแปรสำหรับการ create order
  const [sendAddress, setSendAddress] = useState();
  const [sendPaymentType, setSendPaymentType] = useState<any>();
  const [sendNotiPayment, setSendNotiPayment] = useState<any>({
    price: "",
    date: "",
    time: "",
    path_picture: "",
    note: "",
  });

  //error
  const [errorSelectAddress, setErrorSelectAddress] = useState<boolean>(false);
  const [errorSelectPaymentType, setErrorSelectPaymentType] = useState<boolean>(false);
  const [errorSelectNoti, setErrorSelectNoti] = useState<boolean>(false);

  //error product amount 0
  const [openError, setOpenError] = useState(false);
  const [textModal, setTextModal] = useState<string>("");
  const [colorIconModal, setColorIconModal] = useState<string>("red");

  const fetchData = async () => {
    await callCartService.getCartByUserId(true).then((res) => {
      if (res?.result.length <= 0) {
        router.push("/");
      }
      setStepData(res?.result);
    });
    await callService.userInfo().then(async (res) => {
      setUser_info(res?.result?.id!);
      await callUserService.getAddressUser(res?.result?.id!).then((res) => {
        setStepAddress(res?.result);
      });
    });
    await callOrderService.cancelCreateOrder();
  };

  const saveOrder = async () => {
    if (activeStep === 4) {
      let pathImage = "";
      if (sendNotiPayment?.path_picture != "null") {
        await callProductsService.uploadingImagePayment(sendNotiPayment?.path_picture).then(async (res) => {
          setSlipPath(res?.url);
          pathImage = res?.url;
        });
      }
      const bodyOrder = {
        product: stepData,
        stepAddress: sendAddress,
        payment_type: sendPaymentType,
        noti_payment: sendNotiPayment,
        slipPath: pathImage,
      };
      await callOrderService.createOrder(bodyOrder).then((res) => {
        if (res?.status_code === "999999") {
          setOpenError(true);
          setTextModal(res?.messes);
        }

        if (res !== undefined) {
          notificationsService.countNotifications().then((count) => {
            dispatch(updateNotifStatus(count?.result.number));
          });
        }
      });
      await callCartService.getCartByUserId(false).then((res) => {
        if (res !== undefined) {
          dispatch(updateCartStatus(res.result.length));
        } else {
          console.error("Fail APICart");
        }
      });
    }
  };
  // สร้างตัวแปรสำหรับตรวจสอบการ refetch
  let isRefetch = false;

  useEffect(() => {
    fetchCountCart();
    if (firstLoading) {
      fetchData().then(() => {
        setFirstLoading(false);
      });
    }
  }, [activeStep, router]);

  const fetchCountCart = async () => {
    const handleRouteChangeStart = async (url: any) => {
      // การออกจากหน้าหรือการเริ่มเปลี่ยนหน้าจะทำงานที่นี่
      // console.log("ออกจากหน้าหรือเริ่มเปลี่ยนหน้า:", url);
      await callCartService.getCartByUserId(false).then((res) => {
        if (res !== undefined) {
          dispatch(updateCartStatus(res?.result?.length));
        } else {
          console.error("Fail APICart");
        }
      });
    };

    const handleRouteChangeComplete = async (url: any) => {};

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  };

  const handleNext = () => {
    if (sendAddress === undefined && activeStep === 1) {
      setErrorSelectAddress(true);
    } else if (sendPaymentType === undefined && activeStep === 2) {
      setErrorSelectPaymentType(true);
    } else if (
      activeStep === 3 &&
      (sendNotiPayment?.price == "" || sendNotiPayment?.date == "" || sendNotiPayment?.time == "" || sendNotiPayment?.path_picture == "")
    ) {
      if (sendPaymentType?.paymentName == "ชำระเงินปลายทาง") {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else setErrorSelectNoti(true);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setErrorSelectAddress(false);
      setErrorSelectPaymentType(false);
      setErrorSelectNoti(false);
    }

    if (activeStep === 4) {
      saveOrder();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 1) {
      setSendAddress(undefined);
      setErrorSelectAddress(false);
      setErrorSelectPaymentType(false);
      setErrorSelectNoti(false);
    }
    if (activeStep === 2) {
      setSendPaymentType(undefined);
      setErrorSelectAddress(false);
      setErrorSelectPaymentType(false);
      setErrorSelectNoti(false);
    }
    if (activeStep === 3) {
      setSendNotiPayment({ price: "", date: "", time: "", path_picture: "" });
      setErrorSelectAddress(false);
      setErrorSelectPaymentType(false);
      setErrorSelectNoti(false);
    }
  };

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: "linear-gradient( 95deg,#FFE7CC 0%, #D9C7B0  50%,  #8d6e63 100%)",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: "linear-gradient( 95deg,#FFE7CC 0%, #D9C7B0  50%,  #8d6e63 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  }));

  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage: "linear-gradient( 136deg, #D9C7B0 0%, #FFE7CC  50%,  #D9C7B0 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundImage: "linear-gradient( 136deg, #D9C7B0 0%, #FFE7CC  50%,  #D9C7B0 100%)",
    }),
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1: <ScheduleSendIcon sx={{ color: "#8d6e63" }} />,
      2: <MonetizationOnIcon sx={{ color: "#8d6e63" }} />,
      3: <ReceiptIcon sx={{ color: "#8d6e63" }} />,
      4: <InfoIcon sx={{ color: "#8d6e63" }} />,
    };

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  const nextStepFunction = () => {
    setOpenError(false);
    router.push("/cart-order");
    setActiveStep(1);
  };

  return (
    <>
      <ConfirmProcessModal open={openError} text={textModal} colorIcon={colorIconModal} nextStepFunction={nextStepFunction} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={16}>
          <Box display="flex" justifyContent="center" flexDirection="row" alignItems="center">
            {activeStep <= 3 && (
              <Button
                variant="contained"
                style={{ backgroundColor: "#8d6e63", marginTop: "20px" }}
                startIcon={<ArrowBackIosOutlinedIcon />}
                onClick={() => {
                  router.back();
                }}
                sx={{
                  marginLeft: "4rem",
                }}>
                เลือกสินค้าเพิ่มเติม
              </Button>
            )}
          </Box>
        </Grid>
        <Container maxWidth="xl" sx={{ marginTop: "20px", padding: "20px" }}>
          <Box sx={{ width: "100%" }}>
            <Stepper alternativeLabel activeStep={activeStep - 1} connector={<ColorlibConnector />}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <div style={{ marginTop: "50px" }}></div>
          {activeStep === 5 ? (
            <React.Fragment>
              <Box
                sx={{
                  mt: 2,
                  mb: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}>
                All steps completed - you&apos;re finished
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button
                  onClick={() => router.push("/")}
                  style={{
                    backgroundColor: "#8d6e63",
                    color: "white",
                    marginTop: "20px",
                  }}>
                  ดูสินค้าทั้งหมด
                </Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {activeStep <= 3 && activeStep > 1 ? (
                  <>
                    <Button
                      variant="contained"
                      disabled={activeStep === 1}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                      style={{
                        backgroundColor: "#8d6e63",
                        color: "white",
                        marginTop: "20px",
                      }}>
                      ย้อนกลับ
                    </Button>
                  </>
                ) : (
                  <></>
                )}

                <Box sx={{ flex: "1 1 auto" }} />
                <Button variant="contained" onClick={handleNext} style={{ backgroundColor: "#8d6e63", marginTop: "20px" }}>
                  {activeStep === steps.length ? "ยืนยันคำสั้งซื้อ" : "ถัดไป"}
                </Button>
              </Box>

              <Box sx={{ mt: 2, mb: 1 }}>
                {errorSelectAddress && (
                  <Alert severity="warning">
                    <AlertTitle>แจ้งเตือน</AlertTitle>
                    กรุณาเลือกที่อยู่
                  </Alert>
                )}
                {errorSelectPaymentType && (
                  <Alert severity="warning">
                    <AlertTitle>แจ้งเตือน</AlertTitle>
                    กรุณาเลือกวิธีการชำระเงิน
                  </Alert>
                )}
                {errorSelectNoti && (
                  <Alert severity="warning">
                    <AlertTitle>แจ้งเตือน</AlertTitle>
                    กรุณากรอกข้อมูลให้ครบ
                  </Alert>
                )}

                {activeStep === 1 && (
                  <SendAddress stepDataProduct={stepData} stepAddress={stepAddress} setStepAddress={setStepAddress} setSendAddress={setSendAddress} />
                )}
                {activeStep === 2 && <SendPayment stepDataProduct={stepData} setSendPaymentType={setSendPaymentType} />}
                {activeStep === 3 && (
                  <NotiPayment
                    stepDataProduct={stepData}
                    stepAddress={stepAddress}
                    sendPaymentType={sendPaymentType}
                    sendNotiPayment={sendNotiPayment}
                    setSendNotiPayment={setSendNotiPayment}
                  />
                )}
                {activeStep === 4 && (
                  <DetailOrder
                    stepDataProduct={stepData}
                    stepAddress={sendAddress}
                    sendPaymentType={sendPaymentType}
                    sendNotiPayment={sendNotiPayment}
                    activeStep={activeStep}
                    setSendNotiPayment={setSendNotiPayment}
                  />
                )}
              </Box>
            </React.Fragment>
          )}
        </Container>
      </Box>
    </>
  );
};

export default StepOrder;
