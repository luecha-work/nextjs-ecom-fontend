import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ButtonBack from "@/components/ui/button-back";
import { ProductService } from "@/service/product.service";
import { Product } from "@/service/models/product.interface";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { UserType } from "@/service/models/auth.interface";
import AuthService from "@/service/auth.sevice";
import { CartService } from "@/service/cart.service";
import { Cart } from "@/service/models/cart.interface";
import CancelIcon from "@mui/icons-material/Cancel";
import ConfirmProcessModal from "@/components/ui/confirm-process-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCartStatus,
  updateNotifStatus,
} from "../../redux-store/actions/notifications";
interface DetailProductProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductId: string | null;
}
const ProductDetailbyUser: React.FC<DetailProductProps> = ({
  isOpen,
  onClose,
  selectedProductId,
}) => {
  const router = useRouter();
  const callProductsService = new ProductService();
  const callService = new AuthService();
  const [countProduct, setCountProduct] = useState<number>(1);
  const [selectedMenuItem, setSelectedMenuItem] = useState<number | null>(0);
  const [productData, setProductData] = useState<Product>();
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);
  const [user_Info, setUserInfo] = useState<UserType>();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedOptionID, setSelectedOptionID] = useState<string>("");
  const cartService = new CartService();
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getDetailProduct();
  }, []);

  const getDetailProduct = async () => {
    const { id } = router.query;

    await callService.userInfo().then((res) => {
      setUserInfo(res?.result);
    });

    if (id || selectedProductId) {
      let productId = "";
      if (typeof selectedProductId === "string") productId = selectedProductId;
      if (typeof id === "string") productId = id;
      await callProductsService.getProductById(productId).then((res) => {
        if (res?.result) {
          setProductData(res?.result);
          setSelectedOptionID(res?.result?.productsOption[0]?.id);
        } else {
          setProductData(undefined);
        }
      });
    }
  };

  const countAddOne = () => {
    if (selectedOption === null) {
      console.error("กรุณาเลือกตัวเลือก");
    } else {
      if (
        countProduct >=
        (productData?.productsOption[selectedOption]?.optionsAmount as number)
      ) {
        console.error("เกินจำนวนสูงสุด");
      } else {
        setCountProduct(countProduct + 1);
      }
    }
  };
  const countDeleteOne = () => {
    countProduct <= 1 ? setCountProduct(1) : setCountProduct(countProduct - 1);
  };
  const onClickPhoto = (photo: number) => {
    setSelectedPhoto(photo);
  };
  const onClickOption = (option: number, opID: string) => {
    setCountProduct(1);
    setSelectedOption(option);
    setSelectedOptionID(opID);
  };
  const saveTable = async () => {
    const cartItem: Cart = {
      amount: countProduct,
      product: productData?.id ?? "",
      productsOption: selectedOptionID,
    };
    const response = await cartService.createCart(cartItem);
    const responseStatus = response?.status_code;
    if (responseStatus == 201) {
      checkCart();
      openModal();
    } else {
      console.error(`API Error: ${responseStatus}`);
    }
  };
  const backModal = () => {
    onClose();
  };
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const checkCart = () => {
    const cartByID = cartService.getCartByUserId(false).then((res) => {
      if (res !== undefined) {
        dispatch(updateCartStatus(res.result.length));
      } else {
        console.log("Fail APICart");
      }
    });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, width: "100%", height: "100%" }}>
        {!productData ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <CircularProgress />
            </div>
          </>
        ) : (
          <>
            {" "}
            {user_Info?.role.roleName === "admin_manager" ? (
              <>
                {" "}
                <Box
                  display="flex"
                  justifyContent="start"
                  flexDirection="row"
                  alignItems="center"
                  width="100%"
                >
                  <ButtonBack />
                </Box>
              </>
            ) : (
              <></>
            )}
            {user_Info?.role.roleName != "admin_manager" && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <ConfirmProcessModal
                  open={modalOpen}
                  text="เพิ่มข้อมูลในตะกร้าสินค้าสำเร็จ"
                  colorIcon="green"
                  nextStepFunction={() => {
                    closeModal();
                    onClose();
                  }}
                />
                <button
                  onClick={backModal}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "100%",
                    padding: "0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CancelIcon
                    sx={{
                      fontSize: "1.8rem",
                      borderRadius: "100%",
                      color: "#8d6e63",
                    }}
                  />
                </button>
              </div>
            )}
            <Container
              maxWidth="xl"
              sx={{ marginTop: "20px", padding: "20px", height: "95%" }}
            >
              <Grid container spacing={2} sx={{ height: "100%" }}>
                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Card
                    sx={{
                      minWidth: 500,
                      minHeight: 500,
                      maxHeight: 500,
                      maxWidth: 500,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt="Description of the image"
                      image={productData?.pathPicture[selectedPhoto]?.url}
                      style={{
                        width: "70%",
                        height: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </Card>
                </Grid>
                <Grid item xs={6} md={6}>
                  <div style={{ width: "100%", height: "8%" }}>
                    {/* <p>sss</p> */}
                    <h2>{productData?.productName}</h2>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "12%",

                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {productData?.productDetail}
                  </div>
                  <div
                    style={{
                      marginTop: "3%",
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      width: "100%",
                      height: "10%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "20%",
                        height: "100%",
                      }}
                    >
                      <h2>ราคา :</h2>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "20%",
                        height: "100%",
                      }}
                    >
                      <h2>{productData?.productPrice + " บาท"}</h2>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "3%",
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "start",
                      width: "100%",
                      height: "35%",
                    }}
                  >
                    <div style={{ width: "20%", height: "30%" }}>
                      <h2>ตัวเลือก:</h2>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "0.5vw",
                        width: "80%",
                        height: "30%",
                        alignItems: "End",
                        justifyItems: "center",
                      }}
                    >
                      {productData?.productsOption.map((data, index) => (
                        <Button
                          key={index}
                          variant={
                            selectedOption === index ? "contained" : "outlined"
                          }
                          style={{
                            width: "9vw",
                            height: "2vw",
                            paddingLeft: "1vw",
                            paddingRight: "1vw",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "statr",
                            backgroundColor:
                              selectedOption !== index
                                ? data?.optionsAmount === 0
                                  ? "whitesmoke"
                                  : "white"
                                : "#8d6e63",
                            color:
                              selectedOption !== index
                                ? data?.optionsAmount === 0
                                  ? "gray"
                                  : "#8d6e63"
                                : "white",
                            borderColor:
                              selectedOption !== index
                                ? data?.optionsAmount === 0
                                  ? "gray"
                                  : "#8d6e63"
                                : "white",
                          }}
                          onClick={() => onClickOption(index, data.id)}
                          disabled={data?.optionsAmount === 0}
                        >
                          <div style={{ marginRight: "0.5rem" }}>
                            {data.optionName}
                          </div>
                          <div>({data?.optionsAmount})</div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div>
                      <p>
                        คลังสินค้า &nbsp; : &nbsp;
                        <span>{productData?.productAmount}</span>
                      </p>{" "}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <p> จำนวน &nbsp; : </p> &nbsp;&nbsp;&nbsp;
                      <ButtonGroup
                        variant="contained"
                        aria-label="outlined primary button group"
                      >
                        <Button
                          disabled={selectedOption === null}
                          sx={{ maxHeight: 30, maxWidth: 20, marginRight: 10 }}
                          style={{
                            backgroundColor:
                              selectedOption === null ? "gray" : "#8d6e63",
                            color: "white",
                          }}
                          onClick={() => countDeleteOne()}
                        >
                          <RemoveIcon />
                        </Button>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                          }}
                        >
                          {" "}
                          {countProduct}
                        </div>
                        <Button
                          variant="contained"
                          sx={{ maxHeight: 30, maxWidth: 20, marginLeft: 10 }}
                          onClick={() => countAddOne()}
                          disabled={selectedOption === null}
                          style={{
                            backgroundColor:
                              selectedOption === null ? "gray" : "#8d6e63",
                            color: "white",
                          }}
                        >
                          <AddIcon />
                        </Button>
                      </ButtonGroup>
                    </div>
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
                    gridGap: "1vw",
                  }}
                >
                  {productData?.pathPicture.map((data, index) => (
                    <Button
                      key={index}
                      variant="contained"
                      sx={{
                        minWidth: 100,
                        minHeight: 100,
                        maxHeight: 100,
                        maxWidth: 100,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow:
                          selectedPhoto === index
                            ? "rgba(0, 0, 0, 0.16) 0px 1px 4px, #8d6e63 0px 0px 3px 3px"
                            : "none",
                        transition: "box-shadow 0.3s",
                      }}
                      onClick={() => onClickPhoto(index)}
                    >
                      <img
                        src={data.url}
                        alt="Description of the image"
                        style={{
                          minWidth: 100,
                          minHeight: 100,
                          maxHeight: 100,
                          maxWidth: 100,
                        }}
                      />
                    </Button>
                  ))}
                </Grid>
                <Grid
                  item
                  xs={6}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "end",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {user_Info?.role.roleName === "admin_manager" ? (
                      <></>
                    ) : (
                      <>
                        <Button
                          disabled={selectedOption === null}
                          onClick={saveTable}
                          variant="contained"
                          style={{
                            backgroundColor:
                              selectedOption === null ? "white" : "#8d6e63",
                            border: `1px solid ${
                              selectedOption === null ? "gray" : "#8d6e63"
                            }`,
                          }}
                          startIcon={<AddShoppingCartIcon />}
                          sx={{
                            marginLeft: "4rem",
                          }}
                        >
                          หยิบใส่ตะกร้า
                        </Button>
                      </>
                    )}
                  </div>
                </Grid>
              </Grid>
            </Container>
          </>
        )}
        <Grid container spacing={2} columns={16}></Grid>
      </Box>
    </>
  );
};

export default ProductDetailbyUser;
