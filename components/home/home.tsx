import React from "react";
import classec from "./home.module.css";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/common/class/stateManagement";
import { ProductService } from "@/service/product.service";

function HomePage() {
  const productService = new ProductService();
  const [randomData, setRandomData] = useState<any[]>([]);
  const router = useRouter();
  const isLoading_status = useStore((state) => state.spin_status);
  const [isLoading, setIsLoading] = useState(true);

  const getProduct = () => {
    productService.getSettingProduct(true).then((res) => {
      if (res !== undefined) {
        setRandomData(res);
        console.log(randomData);
      } else {
        console.error("Call Product-Api error");
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    const fetchData = async () => {
      getProduct();
    };
    fetchData();
  }, []);

  useEffect(() => {}, [randomData]);
  return (
    <>
      <Container>
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
          <>
            <Box>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Grid
                  className={classec.content}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                      <div className={classec.photo_main}>
                        <img
                          className={classec.img}
                          src={randomData[0]?.pathPicture[0]?.url ?? ""}
                          alt={randomData[0]?.productName}
                          loading="lazy"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={8}>
                      <div className={classec.detail_box}>
                        <div className={classec.detail_main}>
                          {randomData ? (
                            <div>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: "2vw",
                                }}
                              >
                                <div
                                  style={{
                                    width: "70%",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {randomData[0]?.productName}
                                </div>
                                <div
                                  style={{
                                    width: "30%",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    fontSize: "2vw",
                                  }}
                                >
                                  {randomData[0]?.productPrice} B.
                                </div>
                              </Typography>
                              <hr></hr>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: "1.2vw",
                                  width: "100%",
                                  height: "12.9vh",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {randomData[0]?.productDetail}
                              </Typography>
                            </div>
                          ) : (
                            <div>
                              <p className={classec.font_01}>Loading...</p>
                            </div>
                          )}
                        </div>
                        <Button
                          className={classec.btn_main}
                          variant="contained"
                          onClick={() => router.push("/login")}
                        >
                          เข้าสู่ระบบเพื่อสั่งชื้อ
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  className={classec.content}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  {randomData.slice(1, 5).map((data, index) => (
                    <div
                      className={classec.content_btn}
                      style={{
                        height: "30vh",
                        width: "23%",
                        marginLeft: "1vw",
                      }}
                      key={index}
                    >
                      <Card sx={{ height: "100%", width: "100%" }}>
                        <CardMedia
                          sx={{ height: "25vh" }}
                          image={data?.pathPicture[0]?.url}
                          title={data?.productName}
                        />
                        <CardContent sx={{ height: "10wh" }}>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "0.8vw",
                            }}
                          >
                            <div
                              style={{
                                maxWidth: "9vw",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {data?.productName}
                            </div>
                            <div>{data?.productPrice} B.</div>
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </>
  );
}

export default HomePage;
