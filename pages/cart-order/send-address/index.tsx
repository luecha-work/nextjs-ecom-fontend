import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Collapse,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import router from "next/router";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Product } from "@/service/models/product.interface";
import CrudUser from "@/service/user.sevice";
import AuthService from "@/service/auth.sevice";
import { UserType } from "@/service/models/auth.interface";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { RegisterForm, RegisterFormErrors } from "@/common/models/register.interface";
import classec from "../../../components/register-form/resiter-form.module.css";
import { Textarea } from "@mui/joy";
import Dropdown from "@/components/ui/dropdown";
import dayjs from "dayjs";
import TambonsService from "@/service/tambons.service";
import ButtonLogin from "@/components/ui/button";
import CheckIcon from "@mui/icons-material/Check";
interface ShowProductDetailProp {
  stepDataProduct: any;
  stepAddress: any;
  setStepAddress: React.Dispatch<React.SetStateAction<any>>;
  setSendAddress: React.Dispatch<React.SetStateAction<any>>;
}

const SendAddress: NextPage<ShowProductDetailProp> = ({ stepDataProduct, stepAddress, setStepAddress, setSendAddress }) => {
  const tambonsService = new TambonsService();
  const callService = new AuthService();
  const callUserService = new CrudUser();
  const [slideIndex, setSlideIndex] = useState(0);
  const [open, setOpen] = useState(true);
  const [selecetAddress, setSelectAddress] = useState<boolean>(false);
  const [openAddAddress, setOpenAddAddress] = React.useState(true);
  const [numberItem, setnumberitem] = useState<number>();
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    gender: "",
    detailAddress: "",
    password: "",
    confirmPassword: "",
    roleCode: "",
    province: "",
    amphoe: "",
    district: "",
    zipCode: "",
  });
  const [registerFormData, setRegisterFormData] = useState<RegisterForm>({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: dayjs().toISOString(),
    gender: "",
    detailAddress: "",
    password: "",
    confirmPassword: "",
    roleCode: "",
    province: "",
    amphoe: "",
    district: "",
    zipCode: "",
  });
  const [provinceItems, setProvinceItems] = useState([]);
  const [amphoeItems, setAmphoeItems] = useState([{ value: "", label: "กรุณาเลือกจังหวัด" }]);
  const [districtItems, setDistrictItems] = useState([{ value: "", label: "กรุณาเลือกอำเภอ" }]);

  const plusSlides = (n: number) => {
    setSlideIndex((prevIndex) => (prevIndex + n + stepDataProduct.length) % stepDataProduct.length);
  };

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
  }, [totalProductWeight]);

  const fetchData = async () => {
    const responseProvince = await tambonsService.getProvince();
    setProvinceItems(responseProvince.result);
    await callService.userInfo().then(async (res) => {
      await callUserService.getAddressUser(res?.result?.id!).then((res) => {
        setStepAddress(res?.result);
      });
    });
  };

  const selectAddresBtn = (selectItem: any, index: number) => {
    setSelectAddress(true);
    setnumberitem(index);
    setSendAddress(selectItem);
  };

  const handleClick = () => {
    setOpenAddAddress(!openAddAddress);
  };

  const handleChangeProvince = async (event: SelectChangeEvent) => {
    setRegisterFormData({
      ...registerFormData,
      province: event.target.value as string,
      zipCode: "",
      amphoe: "",
      district: "",
    });

    const responseAmphoe = await tambonsService.getAmphoe(event.target.value as string);
    setAmphoeItems(responseAmphoe.result);
  };

  const handleChangeAmphoe = async (event: SelectChangeEvent) => {
    setRegisterFormData({
      ...registerFormData,
      amphoe: event.target.value,
      district: "",
      zipCode: "",
    });

    const responseDistrict = await tambonsService.getDistrict(registerFormData.province, event.target.value as string);

    setDistrictItems(responseDistrict.result);
  };

  const handleChangeDistrict = async (event: SelectChangeEvent) => {
    const responseZipCode = await tambonsService.getZipCode(event.target.value as string, registerFormData.amphoe, registerFormData.province);

    setRegisterFormData({
      ...registerFormData,
      district: event.target.value,
      zipCode: responseZipCode.result[0].zipcode,
    });
  };

  const handleSubmitAddAddress = async () => {
    await tambonsService.addAddressUser(registerFormData).then((_res) => {
      fetchData();
      setOpenAddAddress(false);
      setRegisterFormData({
        firstname: "",
        lastname: "",
        phoneNumber: "",
        email: "",
        dateOfBirth: dayjs().toISOString(),
        gender: "",
        detailAddress: "",
        password: "",
        confirmPassword: "",
        roleCode: "",
        province: "",
        amphoe: "",
        district: "",
        zipCode: "",
      });
    });
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
                <h3>1 ที่อยู่จัดส่ง</h3>
                <div>
                  <span style={{ marginLeft: "20px" }}>กรอกข้อมูลผู้รับสินค้า</span>
                </div>
                <Box
                  sx={{
                    margin: "20px",
                  }}>
                  {stepAddress.map((item: any, index: number) => (
                    <Button
                      key={index}
                      endIcon={numberItem === index ? <CheckIcon sx={{ color: "red" }} /> : <></>}
                      onClick={() => selectAddresBtn(item, index)}
                      sx={{
                        display: "flex",
                        marginTop: "10px",
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "20px",
                        alignItems: "flex-start",
                        justifyContent: "left",
                        borderColor: "#8d6e63",
                        color: "black",
                        fontSize: 12,
                        boxShadow: numberItem === index ? "rgba(0, 0, 0, 0.16) 0px 1px 1px, #8d6e63 0px 0px 1px 1px" : "none",
                        transition: "box-shadow 0.3s",
                      }}>
                      <Box>
                        {item?.detailAddress +
                          "  " +
                          item?.tambons.tambon +
                          "  " +
                          item?.tambons.amphoe +
                          "  " +
                          item?.tambons.province +
                          "  " +
                          item?.tambons.zipcode}
                      </Box>
                    </Button>
                  ))}

                  <List
                    sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", margin: "20px", borderRadius: "12px" }}
                    component="nav"
                    aria-labelledby="nested-list-subheader">
                    <ListItemButton onClick={handleClick}>
                      <ListItemIcon>
                        <AddCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="เพิ่มที่อยู่ใหม่" />
                      {openAddAddress ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openAddAddress} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: "20px" }}>
                        <FormControl fullWidth size="small" required error={!!formErrors.firstname}>
                          <Textarea
                            placeholder="รายละเอียดที่อยู่"
                            minRows={2}
                            maxRows={4}
                            value={registerFormData.detailAddress}
                            className={classec.textarea}
                            onChange={(e) =>
                              setRegisterFormData({
                                ...registerFormData,
                                detailAddress: e.target.value,
                              })
                            }
                            error={!!formErrors.detailAddress}
                          />
                          {formErrors.detailAddress && <FormHelperText>{formErrors.detailAddress}</FormHelperText>}
                        </FormControl>
                        <div style={{ marginTop: "15px" }}></div>
                        <Dropdown
                          label="จังหวัด"
                          items={provinceItems}
                          value={registerFormData.province}
                          handleChange={handleChangeProvince}
                          validateError={formErrors.province}
                        />
                        <div style={{ marginTop: "15px" }}></div>
                        <Dropdown
                          label="อำเภอ/เขต"
                          items={amphoeItems}
                          value={registerFormData.amphoe}
                          handleChange={handleChangeAmphoe}
                          validateError={formErrors.amphoe}
                        />
                        <div style={{ marginTop: "15px" }}></div>
                        <Dropdown
                          label="ตำบล/แขวง"
                          items={districtItems}
                          value={registerFormData.district}
                          handleChange={handleChangeDistrict}
                          validateError={formErrors.district}
                        />
                        <div style={{ marginTop: "15px" }}></div>
                        <TextField
                          label="รหัสไปรษณีย์"
                          variant="outlined"
                          className={classec.textField}
                          size="small"
                          disabled
                          value={registerFormData.zipCode}
                        />
                      </Box>
                      <div style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}>
                        {registerFormData.zipCode === "" ? (
                          <></>
                        ) : (
                          <>
                            <Button onClick={handleSubmitAddAddress} style={{ backgroundColor: "#8d6e63", color: "white" }}>
                              ตกลง
                            </Button>
                          </>
                        )}
                      </div>
                    </Collapse>
                  </List>
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

export default SendAddress;
