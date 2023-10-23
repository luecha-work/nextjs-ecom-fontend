import { NextPage } from "next";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStore } from "@/common/class/stateManagement";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  Grid,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ProductService } from "@/service/product.service";
import { CategoryService } from "@/service/category.service";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import SearchIcon from "@mui/icons-material/Search";
import ProductModal from "@/components/ui/modal-detail";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ProductInfo {
  productPrice: number;
  productName: string;
  productAmount: number;
  pathPicture: {
    url: string;
  }[];
  productDetail: string;
  id: string;
  views: number;
}
interface CategoryInfo {
  categoryName: string;
  id: string;
}

const AllProduct: NextPage<any> = () => {
  const router = useRouter();
  const productService = new ProductService();
  const categoryService = new CategoryService();
  const isLoading_status = useStore((state) => state.spin_status);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductInfo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [category, setCategory] = useState<CategoryInfo[]>([]);
  const [mod, setMod] = useState<string>("Product");
  const [idCategory, setIdCategory] = useState<string>();
  const [selectedMenu, setSelecttedMenu] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const access_token = Cookies.get("jwt_token");
    if (!(access_token && access_token !== undefined && access_token !== "")) {
      router.push("/login");
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    loadProduct("", 1, "");
    fectchApiCategory();
  }, []);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    loadPage(page);
  };

  const fectchApiCategory = async () => {
    category.length === 0
      ? await categoryService
          .getAllCategory()
          .then((res) => setCategory(res?.result))
      : undefined;
  };

  const reProduct = () => {
    if (currentPage === 1 && mod == "Product") {
      undefined;
    } else {
      setCurrentPage(1);
      mod == "Product" ? undefined : setMod("Product");
      loadProduct("", 1, searchValue);
    }
  };

  const reCategory = (id: string) => {
    if (currentPage === 1 && mod == "Category" && id === idCategory) {
      undefined;
    } else {
      setSelecttedMenu(id);
      setIdCategory(id);
      setCurrentPage(1);
      mod == "Category" ? undefined : setMod("Category");
      loadProduct(id, 1, searchValue);
    }
  };
  const loadProduct = async (id: string, page: number, fiter: string) => {
    const res = await productService
      .getProductbyCategory(id, page, fiter)
      .then((res) => {
        setProduct(res?.result.data);
        setTotalPages(res?.result.meta.last_page);
      });
  };

  const loadPage = async (page: number) => {
    if (mod === "Product") {
      loadProduct("", page, searchValue);
    } else if (mod === "Category") {
      if (idCategory) {
        loadProduct(idCategory, page, searchValue);
      } else {
        console.error("idCategory is undefined");
      }
    }
  };
  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await setSearchValue(event.target.value);
    fiterSearch(event.target.value);
  };

  const fiterSearch = (fiter: string) => {
    idCategory
      ? mod === "Product"
        ? loadProduct("", 1, fiter)
        : loadProduct(idCategory, 1, fiter)
      : mod === "Product"
      ? loadProduct("", 1, fiter)
      : console.error("IdCategory is null");
  };
  const onClickButton = async (id: string) => {
    setIsModalOpen(true);
    setSelectedProductId(id);
    let viewsOld;
    const res = await productService.getProductById(id).then((res) => {
      viewsOld = res.result.views + 1;
      console.log(product);
    });
    await productService.update(id, { views: viewsOld });
  };

  return (
    <div style={{ backgroundColor: "#F9F5F6" }}>
      {isLoading ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              fontSize: "1rem",
              color: "f0f0f0",
            }}
          >
            <CircularProgress size={60} disableShrink={isLoading_status} />
          </Box>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                borderRadius: "10rem",
                height: "3rem",
                width: "30%",
                paddingX: "1.5rem",
              }}
            >
              <SearchIcon color="action" />
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={"Search..."}
                inputProps={{ "aria-label": "Search" }}
                value={searchValue}
                onChange={handleInputChange}
              />
            </Paper>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Drawer
                variant="permanent"
                sx={{
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: {
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "13rem",
                    marginLeft: "0rem",
                    width: "15%",
                    height: "61%",
                    boxSizing: "border-box",
                    backgroundColor: "#e2e2e2",
                    borderRadius: "0.8rem",
                  },
                }}
              >
                <Toolbar>
                  <h1>Category</h1>
                </Toolbar>
                <List>
                  <ListItem disablePadding>
                    <ListItemButton
                      sx={{
                        backgroundColor:
                          mod === "Product" ? "#cac3c3" : "transparent",
                        marginY: "0.2rem",
                        borderRadius: "0.3rem",
                      }}
                      onClick={reProduct}
                    >
                      <ListItemText primary="All Product" />
                    </ListItemButton>
                  </ListItem>
                </List>
                <Divider />
                <Box sx={{ overflow: "auto" }}>
                  <List>
                    {category?.map((data, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemButton
                          key={index}
                          sx={{
                            backgroundColor:
                              mod === "Category" && selectedMenu === data.id
                                ? "#cac3c3"
                                : "transparent",
                            marginY: "0.2rem",
                            borderRadius: "0.3rem",
                          }}
                          onClick={() => reCategory(data.id)}
                        >
                          <ListItemText primary={data.categoryName} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </Grid>
            <Grid item xs={10}>
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
                    <CircularProgress
                      size={60}
                      disableShrink={isLoading_status}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Container maxWidth="xl" sx={{ marginTop: "3%" }}>
                    <Box
                      sx={{
                        height: "auto",
                        width: "auto",
                      }}
                    >
                      <div>
                        {product?.length === 0 || product === undefined ? (
                          <div
                            style={{
                              width: "98%",
                              height: "70vh",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              backgroundColor: "white",
                              borderRadius: "1rem",
                            }}
                          >
                            <ProductionQuantityLimitsIcon
                              sx={{ width: "40%", height: "40%" }}
                            />
                            <h1 style={{ letterSpacing: "0.1vw" }}>
                              ไม่มีสินค้าที่ท่านค้นหา
                            </h1>
                          </div>
                        ) : (
                          <Grid
                            container
                            spacing={{ xs: 2, md: 3 }}
                            columns={{ xs: 4, sm: 8, md: 12 }}
                            sx={{
                              height: "auto",
                              width: "auto",
                            }}
                          >
                            {product?.map((data, index) => (
                              <Grid item xs={2} sm={2} md={3} key={index}>
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "#fff3",
                                  }}
                                >
                                  <Card sx={{ width: "100%", height: "100%" }}>
                                    {data?.productAmount == 0 ? (
                                      <CardMedia
                                        sx={{ height: 160 }}
                                        image={data?.pathPicture[0]?.url}
                                        title={data?.productName}
                                        style={{ opacity: 0.5 }}
                                      />
                                    ) : (
                                      <CardMedia
                                        sx={{ height: 160 }}
                                        image={data?.pathPicture[0]?.url}
                                        title={data?.productName}
                                      />
                                    )}

                                    <CardContent>
                                      <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          height: "1vw",
                                          fontSize: "1vw",
                                        }}
                                      >
                                        <div
                                          style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "13vw",
                                          }}
                                        >
                                          {data.productName}
                                        </div>
                                        <div>{data?.productPrice} B.</div>
                                      </Typography>
                                      <hr></hr>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                          height: "5vw",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          maxHeight: "4.5vw",
                                          maxWidth: "20vw",
                                        }}
                                      >
                                        {data?.productDetail}
                                      </Typography>
                                    </CardContent>
                                    <CardActions
                                      sx={{ justifyContent: "center" }}
                                    >
                                      {data?.productAmount === 0 ? (
                                        <Button
                                          disabled
                                          onClick={() =>
                                            onClickButton(data?.id)
                                          }
                                          style={{
                                            backgroundColor: "whitesmoke",
                                            color: "gray",
                                            border: "0.1px solid gray",
                                          }}
                                          sx={{
                                            padding: "0.5vw",
                                            marginBottom: "0.7vw",
                                            ":hover": {
                                              backgroundColor:
                                                "rgb(138, 116, 81)",
                                            },
                                          }}
                                        >
                                          <div>ขออภัยสินค้าหมด</div>
                                        </Button>
                                      ) : (
                                        <Button
                                          onClick={() =>
                                            onClickButton(data?.id)
                                          }
                                          sx={{
                                            backgroundColor: "rgb(46, 39, 28)",
                                            padding: "0.5vw",
                                            color: "white",
                                            marginBottom: "0.7vw",
                                            ":hover": {
                                              backgroundColor:
                                                "rgb(138, 116, 81)",
                                            },
                                          }}
                                        >
                                          <div>ดูรายละเอียดสินค้า</div>
                                          <VisibilityIcon
                                            sx={{ marginX: "5px" }}
                                          ></VisibilityIcon>
                                        </Button>
                                      )}
                                    </CardActions>
                                  </Card>
                                </div>
                              </Grid>
                            ))}
                            <div
                              style={{
                                width: "100%",
                                height: "4vw",
                                marginTop: "1vw",
                                marginLeft: "3vw",
                                marginRight: "1vw",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Pagination
                                page={currentPage}
                                count={totalPages}
                                onChange={handlePageChange}
                                color="primary"
                              />
                            </div>
                          </Grid>
                        )}
                      </div>
                    </Box>
                  </Container>
                </>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};
export default AllProduct;
