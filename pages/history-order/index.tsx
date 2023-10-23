import ButtonBack from "@/components/ui/button-back";
import AuthService from "@/service/auth.sevice";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Pagination,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CrudUser from "@/service/user.sevice";
import ConfirmProcessModal from "@/components/ui/confirm-process-modal";
import CommentIcon from "@mui/icons-material/Comment";
import { OrdersService } from "@/service/order.service";
import { convertTimestampToFormattedDate } from "@/service/abstract.service";
import { green } from "@mui/material/colors";
import transferList from "@/common/class/transport-company";
import { useRouter } from "next/router";
import { Cart } from "@/service/models/cart.interface";
import { CartService } from "@/service/cart.service";
import { ProductService } from "@/service/product.service";
import { useDispatch } from "react-redux";
import { updateCartStatus } from "@/redux-store/actions/notifications";

const HistoryOrder: NextPage = () => {
  const router = useRouter();
  const authService = new AuthService();
  const userService = new CrudUser();
  const callOrderService = new OrdersService();
  const cartService = new CartService();
  const callProductsService = new ProductService();

  const [dataTable, setDataTable] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [textModal, setTextModal] = useState<string>("");
  const [colorIconModal, setColorIconModal] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const dispatch = useDispatch();

  const handleToggle = (value: number) => () => {};

  const fetchData = async (page: number = 1) => {
    await callOrderService.getOrderByCurrentUserId(page).then((res) => {
      if (res) {
        setDataTable(res?.data?.data);
        setLastPage(res?.data?.meta?.last_page);
      } else {
        setDataTable([]);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (event: any, newPage: any) => {
    setPage(newPage);
    fetchData(newPage);
  };

  const OrderAgain = async (item: any) => {
    await cartService.getCartByUserId(false).then((res) => {
      if (res !== undefined) {
        dispatch(updateCartStatus(res.result.length));
      } else {
        console.error("Fail APICart");
      }
    });
    const productsOption = await callProductsService.getProductById(item?.products?.id);
    const productsOptionId = productsOption?.result?.productsOption[0].id;
    const cartItem = {
      amount: item?.ordersAmount,
      product: item?.products?.id,
      productsOption: productsOptionId,
      cfProduct: true,
    };
    await callOrderService.cancelCreateOrder();
    const response = await cartService.createCart(cartItem).then((res) => {
      router.push("/cart-order");
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container mt={2} spacing={2} columns={16}>
        <Grid item xs={1}></Grid>
        <Grid item xs={14}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <h2>ประวัติการสั่งซื้อ</h2>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 800 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    <h3>เลข ออเดอร์</h3>
                  </TableCell>
                  <TableCell align="center">
                    <h3>ชื่อ</h3>
                  </TableCell>
                  <TableCell align="center">
                    <h3>จำนวน</h3>
                  </TableCell>
                  <TableCell align="center">
                    <h3>ราคา</h3>
                  </TableCell>
                  <TableCell align="center">
                    <h3>สถานะออเดอร์</h3>
                  </TableCell>
                  <TableCell align="center">
                    <h3>สถานะพัสดุ</h3>
                  </TableCell>
                  <TableCell align="center">
                    <h3>ประเภทการจ่ายเงิน</h3>
                  </TableCell>
                  <TableCell align="center">
                    <h3></h3>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataTable?.map((item) => {
                  let transportCompany = item?.parcelDelivery?.transportCompany; // ค่า code ที่คุณต้องการค้นหา
                  let transportCompanyLinkName = transferList.find((item: any) => item.name === transportCompany);
                  return (
                    <>
                      <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell component="th" scope="row" align="center" width="15%">
                          <div style={{ margin: "10px" }}>{`วันที่สั้งซื้อ : ` + " " + convertTimestampToFormattedDate(item.createAt)}</div>
                          <img
                            style={{
                              width: "100%",
                              maxHeight: "150px",
                              maxWidth: "150px",
                            }}
                            src={item?.products?.pathPicture[0].url}
                            alt=""
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {item?.parcelDelivery?.parcelNumber}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {item.orderName}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {item.ordersAmount}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center" sx={{ justifyContent: "center" }}>
                          <div>รวมค่าสินค้า : {item?.products?.productPrice * item?.ordersAmount}</div>
                          <div>ค่าจัดส่ง : {item?.products?.productWeight * 0.5 + 30}</div>
                          <div>รวมเป็น : {item?.products?.productPrice * item?.ordersAmount + (item?.products?.productWeight * 0.5 + 30)}</div>
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {item.orderStatus?.orderStatusName}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {item.parcelStatus?.parcelStatusName}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          {item.paymentType?.paymentName}
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                          <Link
                            target="_bank"
                            href={transportCompanyLinkName?.url!}
                            underline="hover"
                            sx={{ color: "rgba(2, 187, 2, 0.63)", cursor: "pointer" }}>
                            ติดตามพัสดุ
                          </Link>
                          <Button variant="outlined" color="error" sx={{ marginLeft: "10px" }} onClick={() => OrderAgain(item)}>
                            ซื้ออีกครั้ง
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell align="center" colSpan={10}>
                    <Pagination
                      sx={{ display: "flex", justifyContent: "center" }}
                      count={lastPage}
                      variant="outlined"
                      shape="rounded"
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Box>
  );
};

export default HistoryOrder;
