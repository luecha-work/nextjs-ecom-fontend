import React from "react";
import classec from "./home_login.module.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/common/class/stateManagement";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ProductModal from "../ui/modal-detail";
import { ProductService } from "@/service/product.service";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Home_Login = () => {
  const productService = new ProductService();
  const [randomData, setRandomData] = useState<any[]>([]);
  const router = useRouter();
  const isLoading_status = useStore((state) => state.spin_status);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const getProduct = () => {
    productService.getSettingProduct(true).then((res) => {
      if (res !== undefined) {
        setRandomData(res);
      } else {
        console.error("Call Product-Api error");
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    getProduct();
  }, []);

  const onClickButton = async (id: string) => {
    setIsModalOpen(true);
    setSelectedProductId(id);
    let viewsOld;
    const res = await productService.getProductById(id).then((res) => {
      viewsOld = res.result.views + 1;
    });
    await productService.update(id, { views: viewsOld });
  };

  return (
    <Container>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedProductId={selectedProductId}
      />
      {isLoading ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
              fontSize: "1rem",
              color: "#9b9090",
            }}
          >
            <CircularProgress size={60} disableShrink={isLoading_status} />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "50vh",
            fontSize: "1rem",
            color: "#9b9090",
          }}
        >
          <div className={classec.container}>
            <div className={classec.head_box}>
              <h1>สินค้าแนะนำ</h1>
            </div>
            <div className={classec.content_box}>
              <div className={classec.content_sub}>
                <div className={classec.content_btn}>
                  <Card sx={{ height: "52vh", width: "20vw" }}>
                    {randomData[0]?.productAmount === 0 ? (
                      <CardMedia
                        sx={{ height: "27vh" }}
                        image={randomData[0]?.pathPicture[0]?.url ?? ""}
                        title={randomData[0]?.productName}
                        style={{ opacity: 0.5 }}
                      />
                    ) : (
                      <CardMedia
                        sx={{ height: "27vh" }}
                        image={randomData[0]?.pathPicture[0]?.url ?? ""}
                        title={randomData[0]?.productName}
                      />
                    )}
                    <CardContent sx={{ height: "18vh" }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "1vw",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "13vw",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {randomData[0]?.productName}
                        </div>
                        <div>{randomData[0]?.productPrice} B.</div>
                      </Typography>
                      <span>
                        <hr />
                      </span>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          height: "9.4vh",
                          fontSize: "0.8vw",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxHeight: "5.5vw",
                          maxWidth: "20vw",
                        }}
                      >
                        {randomData[0]?.productDetail}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        height: "8vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {randomData[0]?.productAmount === 0 ? (
                        <Button
                          style={{
                            backgroundColor: "whitesmoke",
                            color: "gray",
                            borderColor: "gray",
                            border: "0.1px solid gray",
                          }}
                          disabled
                          onClick={() => onClickButton(randomData[0]?.id)}
                        >
                          <div className={classec.cartbox}>ขออภัยสินค้าหมด</div>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => onClickButton(randomData[0]?.id)}
                          className={classec.btn_sup}
                        >
                          <div className={classec.cartbox}>
                            ดูรายระเอียดสินค้า
                          </div>
                          <VisibilityIcon></VisibilityIcon>
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </div>
              </div>
              <div className={classec.content_main}>
                <div className={classec.content_btn}>
                  <Card sx={{ height: "52vh", width: "20vw" }}>
                    {randomData[1]?.productAmount === 0 ? (
                      <CardMedia
                        sx={{ height: "27vh" }}
                        image={randomData[1]?.pathPicture[0]?.url ?? ""}
                        title={randomData[1]?.productName}
                        style={{ opacity: 0.5 }}
                      />
                    ) : (
                      <CardMedia
                        sx={{ height: "27vh" }}
                        image={randomData[1]?.pathPicture[0]?.url ?? ""}
                        title={randomData[1]?.productName}
                      />
                    )}
                    <CardContent sx={{ height: "18vh" }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "1vw",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "13vw",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {randomData[1]?.productName}
                        </div>
                        <div>{randomData[1]?.productPrice} B.</div>
                      </Typography>
                      <span>
                        <hr />
                      </span>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          height: "9.4vh",
                          fontSize: "0.8vw",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxHeight: "5.5vw",
                          maxWidth: "20vw",
                        }}
                      >
                        {randomData[1]?.productDetail}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        height: "7vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {randomData[1]?.productAmount === 0 ? (
                        <Button
                          style={{
                            backgroundColor: "whitesmoke",
                            color: "gray",
                            borderColor: "gray",
                            border: "0.1px solid gray",
                          }}
                          disabled
                          onClick={() => onClickButton(randomData[1]?.id)}
                        >
                          <div className={classec.cartbox}>ขออภัยสินค้าหมด</div>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => onClickButton(randomData[1]?.id)}
                          className={classec.btn_sup}
                        >
                          <div className={classec.cartbox}>
                            ดูรายระเอียดสินค้า
                          </div>
                          <VisibilityIcon></VisibilityIcon>
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </div>
              </div>
              <div className={classec.content_sub}>
                <div className={classec.content_btn}>
                  <Card sx={{ height: "52vh", width: "20vw" }}>
                    {randomData[2]?.productAmount === 0 ? (
                      <CardMedia
                        sx={{ height: "27vh" }}
                        image={randomData[2]?.pathPicture[0]?.url ?? ""}
                        title={randomData[2]?.productName}
                        style={{ opacity: 0.5 }}
                      />
                    ) : (
                      <CardMedia
                        sx={{ height: "27vh" }}
                        image={randomData[2]?.pathPicture[0]?.url ?? ""}
                        title={randomData[2]?.productName}
                      />
                    )}
                    <CardContent sx={{ height: "18vh" }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "1vw",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "13vw",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {randomData[2]?.productName}
                        </div>
                        <div>{randomData[2]?.productPrice} B.</div>
                      </Typography>
                      <span>
                        <hr />
                      </span>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          height: "9.4vh",
                          fontSize: "0.8vw",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxHeight: "5.5vw",
                          maxWidth: "20vw",
                        }}
                      >
                        {randomData[2]?.productDetail}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        height: "7vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {randomData[2]?.productAmount === 0 ? (
                        <Button
                          style={{
                            backgroundColor: "whitesmoke",
                            color: "gray",
                            borderColor: "gray",
                            border: "0.1px solid gray",
                          }}
                          disabled
                          onClick={() => onClickButton(randomData[2]?.id)}
                        >
                          <div className={classec.cartbox}>ขออภัยสินค้าหมด</div>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => onClickButton(randomData[2]?.id)}
                          className={classec.btn_sup}
                        >
                          <div className={classec.cartbox}>
                            ดูรายระเอียดสินค้า
                          </div>
                          <VisibilityIcon></VisibilityIcon>
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          <Button
            className={classec.btn_main}
            variant="contained"
            onClick={() => router.push("/all-products")}
          >
            {" "}
            ดูสินค้าทั้งหมด
            <NavigateNextIcon />
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Home_Login;
