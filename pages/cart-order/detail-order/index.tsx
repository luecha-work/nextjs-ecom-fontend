import formatDateThai from "@/common/class/convert-date-thai";
import convertIsoToLocalDateTime from "@/common/class/convert-datetime-local";
import { generateRandomCode } from "@/common/class/random-code";
import { convertTimestampToFormattedDate } from "@/service/abstract.service";
import { OrderType } from "@/service/models/order.interface";
import { OrdersService } from "@/service/order.service";
import { ProductService } from "@/service/product.service";
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
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import router from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
interface ShowProductDetailProp {
  stepDataProduct: any;
  sendPaymentType: any;
  sendNotiPayment: any;
  stepAddress: any;
  activeStep: any;
  setSendNotiPayment: React.Dispatch<React.SetStateAction<any>>;
}

const ImageContainer = styled.div`
  width: 100%;
  justify-content: left;
  align-items: center;
  border-radius: 12px;
  margin: 10px 10px;
  padding: 5px;
  background-color: #fff;
`;

const DetailOrder: NextPage<ShowProductDetailProp> = ({
  stepDataProduct,
  stepAddress,
  sendPaymentType,
  sendNotiPayment,
  setSendNotiPayment,
}) => {
  const callProductsService = new ProductService();
  const callOrderService = new OrdersService();
  const [slideIndex, setSlideIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const [code, setCode] = useState<string>(generateRandomCode("ORDER"));
  const [slipPath, setSlipPath] = useState<string>();
  const currentDate = new Date();

  const totalProductWeight: number = stepDataProduct?.reduce((accumulator: any, currentValue: { product: { productWeight: any } }) => {
    return accumulator + currentValue?.product?.productWeight;
  }, 0);

  const totalProductPrice: number = stepDataProduct?.reduce((accumulator: any, currentValue: { product: { productPrice: any }; amount: any }) => {
    return accumulator + currentValue?.product?.productPrice * currentValue?.amount;
  }, 0);

  const fetchData = async () => {};

  useEffect(() => {
    fetchData();
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  }, []);

  const plusSlides = (n: number) => {
    setSlideIndex(
      (prevIndex) =>
        (prevIndex + n + stepDataProduct.length) % stepDataProduct.length
    );
  };

  return (
    <>
      {open ? (
        <>
          {" "}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <>
          {" "}
          <Container
            maxWidth="xl"
            sx={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#cecece",
              borderRadius: "12px",
            }}
          >
            <Grid container spacing={2}>
              <Grid xs={6} sx={{ padding: "10px" }}>
                <h3>4 รายละเอียดคำสั้งซื้อ</h3>
                <Box
                  sx={{
                    width: "100%",
                    height: "auto",
                    backgroundColor: "#cecece",
                    padding: "10px",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                >
                  <ImageContainer>
                    <h4 style={{ marginLeft: "20px" }}>สถานะออเดอร์</h4>
                    <p style={{ marginLeft: "30px", color: "red" }}>
                      รอยืนยันคำสั่งซื้อ
                    </p>
                  </ImageContainer>
                  <ImageContainer style={{}}>
                    <h4 style={{ marginLeft: "20px" }}>สถานะพัสดุ</h4>{" "}
                    <p style={{ marginLeft: "30px", color: "red" }}>
                      กำลังจัดเตรียมสินค้า
                    </p>{" "}
                  </ImageContainer>
                  <ImageContainer>
                    <h4 style={{ marginLeft: "20px" }}> วิธีชำระเงิน</h4>{" "}
                    <p style={{ marginLeft: "30px", color: "red" }}>
                      {" "}
                      {sendPaymentType?.paymentName +
                        "    " +
                        (sendPaymentType?.bankAccount
                          ? sendPaymentType?.bankAccount
                          : "")}
                    </p>{" "}
                  </ImageContainer>
                  <ImageContainer>
                    <Grid container spacing={1} sx={{ padding: "20px" }}>
                      <Grid xs={4} sx={{ justifyContent: "left" }}>
                        {" "}
                        <p style={{ margin: "10px" }}>หมายเลขคำสั้งซื้อ</p>
                        <p style={{ margin: "10px" }}>วันที่ที่สั้งซื้อ</p>
                        <p style={{ margin: "10px" }}>วันที่ชำระเงิน</p>
                        <p style={{ margin: "10px" }}>วันที่จัดส่ง</p>
                        <p style={{ margin: "10px" }}>วันที่ได้รับ</p>
                        <p style={{ margin: "10px" }}>หมายเหตุ</p>
                      </Grid>
                      <Grid xs={8} sx={{ justifyContent: "right" }}>
                        <p style={{ margin: "10px" }}>{code}</p>
                        <p style={{ margin: "10px" }}>{convertTimestampToFormattedDate(currentDate.toISOString())}</p>
                        <p style={{ margin: "10px" }}>รออัพเดท</p>
                        <p style={{ margin: "10px" }}>-</p>
                        <p style={{ margin: "10px" }}>-</p>
                        <p style={{ margin: "10px" }}>
                          {sendNotiPayment?.note}
                        </p>
                      </Grid>
                    </Grid>
                  </ImageContainer>
                </Box>
              </Grid>

              <Grid xs={6}>
                <h3 style={{ margin: "30px" }}>รายละเอียดสินค้า</h3>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  <Button
                    onClick={() => plusSlides(-1)}
                    style={{ color: "black" }}
                  >
                    ❮
                  </Button>
                  <Box
                    sx={{
                      width: "100%",
                      height: "auto",
                      backgroundColor: "white",
                      padding: "20px",
                      borderRadius: "8px",
                    }}
                  >
                    <Card sx={{ display: "flex" }}>
                      <CardMedia
                        component="img"
                        sx={{ maxWidth: 300, maxHeight: 300, padding: "10px" }}
                        image={
                          stepDataProduct[slideIndex]?.product?.pathPicture[0]
                            .url
                        }
                      />
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography component="div">
                            {stepDataProduct[slideIndex]?.product?.productDetail
                              .length > 50
                              ? stepDataProduct[
                                  slideIndex
                                ]?.product?.productDetail.substring(0, 120) +
                                "..."
                              : stepDataProduct[slideIndex]?.product
                                  ?.productDetail}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        marginTop: "30px",
                      }}
                    >
                      {" "}
                      <h3>จำนวน {stepDataProduct[slideIndex]?.amount} ชิ้น</h3>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        alignContent: "center",
                        marginTop: "20px",
                      }}
                    >
                      ราคาสินค้า :{" "}
                      {stepDataProduct[slideIndex]?.product?.productPrice} บาท
                    </div>
                    <div style={{ display: "flex", justifyContent: "left", alignContent: "center", marginTop: "10px" }}>
                      ค่าจัดส่ง : {stepDataProduct[slideIndex]?.product?.productWeight * 0.5 + 30} บาท
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "20px" }}>
                      <h3>
                        ราคาสุทธิ &nbsp; &nbsp; &nbsp;{" "}
                        {stepDataProduct[slideIndex]?.product?.productPrice * stepDataProduct[slideIndex]?.amount +
                          (stepDataProduct[slideIndex]?.product?.productWeight * 0.5 + 30)}
                        &nbsp; &nbsp; บาท
                      </h3>
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

export default DetailOrder;
