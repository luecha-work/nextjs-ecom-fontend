import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { NextPage } from "next";
import router from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import { convertTimestampToFormattedDate } from "@/service/abstract.service";
interface ShowProductDetailProp {
  stepDataProduct: any;
  sendPaymentType: any;
  sendNotiPayment: any;
  stepAddress: any;
  setSendNotiPayment: React.Dispatch<React.SetStateAction<any>>;
}

const NotiPayment: NextPage<ShowProductDetailProp> = ({ stepDataProduct, stepAddress, sendPaymentType, sendNotiPayment, setSendNotiPayment }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const [notiPayment, setNotiPayment] = useState();
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const totalProductWeight: number = stepDataProduct?.reduce((accumulator: any, currentValue: { product: { productWeight: any } }) => {
    return accumulator + currentValue?.product?.productWeight;
  }, 0);

  const totalProductPrice: number = stepDataProduct?.reduce((accumulator: any, currentValue: { product: { productPrice: any }; amount: any }) => {
    return accumulator + currentValue?.product?.productPrice * currentValue?.amount;
  }, 0);

  useEffect(() => {
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  }, []);

  const plusSlides = (n: number) => {
    setSlideIndex((prevIndex) => (prevIndex + n + stepDataProduct.length) % stepDataProduct.length);
  };

  const price = (data: any) => {
    if (data.target.value === "") {
    } else {
      setSendNotiPayment({
        ...sendNotiPayment,
        price: data.target.value || 0,
        path_picture: "null",
      });
    }
  };
  const time = (data: any) => {
    if (data.target.value === "") {
    } else {
      setSendNotiPayment({
        ...sendNotiPayment,
        time: data.target.value,
      });
    }
  };
  const note = (data: any) => {
    if (data.target.value === "") {
    } else {
      setSendNotiPayment({
        ...sendNotiPayment,
        note: data.target.value,
      });
    }
  };
  const date = async (data: any) => {
    if (data.target.value === "") {
    } else {
      setSendNotiPayment({
        ...sendNotiPayment,
        date: await convertTimestampToFormattedDate(data.target.value),
      });
    }
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      //if can select profile
      let data = new FormData();
      data.append("imagepayment", file);
      // handleSetProfile(data);
      setSendNotiPayment({
        ...sendNotiPayment,
        path_picture: data,
      });
    }
  };

  return (
    <>
      {open ? (
        <>
          {" "}
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <>
          {" "}
          <Container maxWidth="xl" sx={{ marginTop: "20px", padding: "20px", backgroundColor: "#cecece", borderRadius: "12px" }}>
            <Grid container spacing={2}>
              <Grid xs={6} sx={{ padding: "10px" }}>
                <h3>3 แจ้งชำระเงิน</h3>
                <Box
                  sx={{
                    width: "100%",
                    height: "auto",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}>
                  <h4>สถานะออเดอร์</h4>
                  <p style={{ marginLeft: "30px", color: "red" }}>รอยืนยันคำสั่งซื้อ</p>
                  <div>
                    <h4>ช่องทางการชำระเงิน</h4>{" "}
                  </div>
                  <div style={{ marginLeft: "30px", display: "flex" }}>
                    <CheckCircleOutlineIcon /> &nbsp; &nbsp; &nbsp;
                    {sendPaymentType?.paymentName}&nbsp; &nbsp; {sendPaymentType?.bankAccount}
                  </div>
                  {sendPaymentType?.paymentName == "ชำระเงินปลายทาง" ? (
                    <></>
                  ) : (
                    <>
                      <div>
                        <h4>กรอกรายละเอียดการโอนเงิน</h4>{" "}
                      </div>
                      <div style={{ marginLeft: "30px", display: "flex" }}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            จำวนเงินที่โอน
                          </Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            <TextField
                              id="standard-search"
                              variant="standard"
                              helperText="Please enter your name"
                              onChange={(e) => price(e)}
                              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                            />
                          </Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            วันที่โอน
                          </Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            <TextField id="standard-search" type="date" variant="standard" onChange={(e) => date(e)} />
                          </Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            เวลา
                          </Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            <TextField id="standard-search" type="time" variant="standard" onChange={(e) => time(e)} />
                          </Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            หมายเหตุ
                          </Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            <textarea id="standard-search" onChange={(e) => note(e)} />
                          </Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            รูปภาพหลักฐานการโอน
                          </Grid>

                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}>
                            <input accept="image/*" id="file" type="file" style={{ display: "none" }} onChange={handleImageChange} />
                            <label htmlFor="file" style={{ width: "100%" }}>
                              {sendPaymentType?.paymentName != "ชำระเงินปลายทาง" && (
                                <Button
                                  variant="contained"
                                  component="span"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    padding: 0,
                                    background: "#8d6e63",
                                    display: "flex",
                                  }}>
                                  <AddIcon />
                                </Button>
                              )}
                            </label>
                          </Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "left", alignItems: "center" }}></Grid>
                          <Grid xs={6} sx={{ marginTop: "30px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            {" "}
                            {selectedImage && (
                              <img
                                src={selectedImage}
                                alt="Selected"
                                style={{ display: "flex", marginTop: "20px", maxWidth: "100%", boxShadow: "10px 10px 10px rgba(0, 0, 0,1);" }}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </div>
                    </>
                  )}
                </Box>
              </Grid>

              <Grid xs={6}>
                <h3 style={{ margin: "30px" }}>รายละเอียดสินค้า</h3>
                <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                  <Button onClick={() => plusSlides(-1)} style={{ color: "black" }}>
                    ❮
                  </Button>
                  <Box
                    sx={{
                      width: "100%",
                      height: "auto",
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "8px",
                    }}>
                    <Card sx={{ display: "flex" }}>
                      <CardMedia
                        component="img"
                        sx={{ maxWidth: 300, maxHeight: 300, padding: "10px" }}
                        image={stepDataProduct[slideIndex]?.product?.pathPicture[0].url}
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography component="div">
                            {stepDataProduct[slideIndex]?.product?.productDetail.length > 50
                              ? stepDataProduct[slideIndex]?.product?.productDetail.substring(0, 120) + "..."
                              : stepDataProduct[slideIndex]?.product?.productDetail}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>

                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "30px" }}>
                      {" "}
                      <h3>จำนวน {stepDataProduct[slideIndex]?.amount} ชิ้น</h3>
                    </div>
                    <div style={{ display: "flex", justifyContent: "left", alignContent: "center", marginTop: "20px" }}>
                      ราคาสินค้า : {stepDataProduct[slideIndex]?.product?.productPrice} บาท
                    </div>
                    <div style={{ display: "flex", justifyContent: "left", alignContent: "center", marginTop: "10px" }}>
                      ราคารวม : {stepDataProduct[slideIndex]?.product?.productPrice * stepDataProduct[slideIndex]?.amount} บาท
                    </div>
                  </Box>

                  <Button onClick={() => plusSlides(1)} style={{ color: "black" }}>
                    ❯
                  </Button>
                </Box>
                <Box style={{ width: "100%", height: "auto", backgroundColor: "white", padding: "20px", borderRadius: "8px", marginTop: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "left", alignContent: "center" }}>
                    ค่าจัดส่ง : {totalProductWeight * 0.5 + 30} บาท
                  </div>
                  <div style={{ display: "flex", justifyContent: "left", alignContent: "center" }}>
                    <h3>
                      ราคาสุทธิ &nbsp; &nbsp; &nbsp; {totalProductPrice + (totalProductWeight * 0.5 + 30)}
                      &nbsp; &nbsp; บาท
                    </h3>
                  </div>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  );
};

export default NotiPayment;
