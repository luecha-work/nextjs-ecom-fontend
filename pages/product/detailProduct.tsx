import { OrdersService } from "@/service/order.service";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
  makeStyles,
  styled,
} from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OrderProductProfile from "@/components/order-detail/order-product-profile";
import OrderTransfer from "@/components/order-detail/order-transfer";
import ButtonBack from "@/components/ui/button-back";
import DetailsAtEnd from "@/components/order-detail/details-at-end";
import convertIsoToLocalDateTime from "@/common/class/convert-datetime-local";
import { OrderDetailModel } from "@/common/models/orders-result.interface";
import { ProductService } from "@/service/product.service";
import { Product } from "@/service/models/product.interface";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { UserType } from "@/service/models/auth.interface";
import AuthService from "@/service/auth.sevice";

interface DetailProductProps {
  selectedProductId: string | null;
}
const ProductDetail: React.FC<DetailProductProps> = ({ selectedProductId }) => {
  const router = useRouter();
  const callProductsService = new ProductService();
  const callService = new AuthService();
  const [countProduct, setCountProduct] = useState<number>(1);
  const [selectedMenuItem, setSelectedMenuItem] = useState<number | null>(0);
  const [productData, setProductData] = useState<Product>();
  const [user_Info, setUserInfo] = useState<UserType>();

  interface Product {
    productPrice: number;
    product_name: string;
    pathPicture: string;
    product_detail: string;
    productAmount: string;
    id: string;
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const { id } = router.query;
    callService.userInfo().then((res) => {
      setUserInfo(res?.result.data);
    });
    if (typeof id === "string") {
      let productId = selectedProductId ? selectedProductId : id;
      callProductsService.getProductById(productId).then((res) => {
        if (res?.result) {
          setProductData(res?.result);
        } else {
          setProductData(undefined);
        }
      });
    }
  };

  const countAddOne = () => {
    setCountProduct(countProduct + 1);
  };
  const countDeleteOne = () => {
    countProduct <= 1 ? setCountProduct(1) : setCountProduct(countProduct - 1);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={16}>
          <Box display="flex" justifyContent="center" flexDirection="row" alignItems="center">
            <ButtonBack />
          </Box>
        </Grid>
        <Container maxWidth="xl" sx={{ marginTop: "20px", padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Card
                sx={{
                  minWidth: 300,
                  minHeight: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <CardMedia component="img" alt="Description of the image" image={productData?.pathPicture} sx={{}} />
              </Card>
            </Grid>
            <Grid item xs={6} md={6}>
              <div>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita officia sunt blanditiis reprehenderit quasi ex iusto saepe natus
                minima et. Quasi illum dolor minus neque placeat facere, doloribus debitis impedit?
              </div>
              <h2>{productData?.productPrice + " บาท"}</h2>

              {user_Info?.role.roleName ? (
                <>
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={4}>
                      <h3>สี : </h3>
                    </Grid>
                    <Grid item xs={4}>
                      <Button variant="outlined">สีแดง</Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button variant="outlined">สีดำ</Button>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                      <Button variant="outlined">สีเขียว</Button>
                    </Grid>
                    <Grid item xs={4}>
                      <Button variant="outlined">สีขาว</Button>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              <div style={{ marginTop: "20px" }}>
                <p>
                  คลังสินค้า &nbsp; : &nbsp;
                  <span>{productData?.productAmount}</span>
                </p>{" "}
                &nbsp;&nbsp;
              </div>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}>
                <p> จำวน &nbsp; : </p> &nbsp;&nbsp;&nbsp;
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  <Button
                    sx={{ maxHeight: 30, maxWidth: 20, marginRight: 10 }}
                    style={{ backgroundColor: "#8d6e63" }}
                    onClick={() => countDeleteOne()}>
                    <RemoveIcon />
                  </Button>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}>
                    {" "}
                    {countProduct}
                  </div>
                  <Button
                    variant="contained"
                    sx={{ maxHeight: 30, maxWidth: 20, marginLeft: 10 }}
                    onClick={() => countAddOne()}
                    style={{ backgroundColor: "#8d6e63" }}>
                    <AddIcon />
                  </Button>
                </ButtonGroup>
              </div>
            </Grid>

            <Grid
              item
              xs={6}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gridGap: "20px",
              }}>
              <Card
                sx={{
                  maxWidth: 170,
                  maxHeight: 170,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <CardMedia component="img" alt="Description of the image" image={productData?.pathPicture} sx={{}} />
              </Card>
              <Card
                sx={{
                  maxWidth: 170,
                  maxHeight: 170,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <CardMedia component="img" alt="Description of the image" image={productData?.pathPicture} sx={{}} />
              </Card>
              <Card
                sx={{
                  maxWidth: 170,
                  maxHeight: 170,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <CardMedia component="img" alt="Description of the image" image={productData?.pathPicture} sx={{}} />
              </Card>
              <Card
                sx={{
                  maxWidth: 170,
                  maxHeight: 170,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <CardMedia component="img" alt="Description of the image" image={productData?.pathPicture} sx={{}} />
              </Card>
            </Grid>
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "right",
                alignItems: "end",
              }}>
              {user_Info?.role.roleName === "user" ? (
                <>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#8d6e63", marginTop: "20px" }}
                    startIcon={<AddShoppingCartIcon />}
                    sx={{
                      marginLeft: "4rem",
                    }}>
                    หยิบใส่ตะกร้า
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ProductDetail;
