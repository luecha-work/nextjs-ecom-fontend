import { PaymentType } from "@/service/models/paymentType.interface";
import PaymentService from "@/service/paymentType.service";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import router from "next/router";
import React, { useEffect, useState } from "react";
interface ShowProductDetailProp {
  stepDataProduct: any;
  setSendPaymentType: React.Dispatch<React.SetStateAction<any>>;
}

const SendPayment: NextPage<ShowProductDetailProp> = ({ stepDataProduct, setSendPaymentType }) => {
  const callPayment = new PaymentService();
  const [paymentData, setPaymentData] = useState<PaymentType[]>();
  const [slideIndex, setSlideIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const [selectPaymentType, setSelectPaymentType] = useState<boolean>(false);
  const [numberItem, setnumberitem] = useState<number>();
  const totalProductWeight: number = stepDataProduct?.reduce((accumulator: any, currentValue: { product: { productWeight: any } }) => {
    return accumulator + currentValue?.product?.productWeight;
  }, 0);

  const totalProductPrice: number = stepDataProduct?.reduce((accumulator: any, currentValue: { product: { productPrice: any }; amount: any }) => {
    return accumulator + currentValue?.product?.productPrice * currentValue?.amount;
  }, 0);

  useEffect(() => {
    fetchData();
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  }, []);

  const fetchData = async () => {
    await callPayment.getAllPayment().then((res) => {
      if (res?.result.data) {
        setPaymentData(res?.result.data);
      } else {
        setPaymentData(undefined);
      }
    });
  };

  const plusSlides = (n: number) => {
    setSlideIndex((prevIndex) => (prevIndex + n + stepDataProduct.length) % stepDataProduct.length);
  };

  const selectPaymentTypeBtn = async (item: any, index: number) => {
    setSelectPaymentType(true);
    setnumberitem(index);
    setSendPaymentType(item);
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
                <h3>2 การชำระเงิน</h3>
                <div>
                  <span style={{ marginLeft: "20px" }}>เลือกวิธีการชำระเงิน</span>
                </div>
                <Box
                  sx={{
                    width: "100%",
                    height: "auto",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}>
                  <FormControl>
                    <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group">
                      {paymentData?.map((item, index) => (
                        <FormControlLabel
                          key={item?.id}
                          value={item?.id}
                          color="default"
                          control={<Radio />}
                          label={item?.paymentName + "    " + (item?.bankAccount ? item?.bankAccount : "")}
                          onClick={() => selectPaymentTypeBtn(item, index)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
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
                    <Card sx={{ display: "flex", objectFit: "cover" }}>
                      <CardMedia
                        component="img"
                        sx={{ maxWidth: 300, maxHeight: 300, padding: "10px", objectFit: "fill" }}
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
                    <div style={{ display: "flex", justifyContent: "left", alignContent: "center", marginTop: "40px" }}>
                      ค่าจัดส่ง : {totalProductWeight * 0.5 + 30} บาท
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "20px" }}>
                      <h3>
                        ราคาสุทธิ &nbsp; &nbsp; &nbsp; {totalProductPrice + (totalProductWeight * 0.5 + 30)}
                        &nbsp; &nbsp; บาท
                      </h3>
                    </div>
                  </Box>
                  <Button onClick={() => plusSlides(1)} style={{ color: "black" }}>
                    ❯
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  );
};

export default SendPayment;
