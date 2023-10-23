import AuthService from "@/service/auth.sevice";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  Button,
  Box,
  Modal,
  Typography,
  Alert,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogProps,
  TextField,
  Grid,
  MenuItem,
  Select,
  IconButton,
  TableFooter,
  Stack,
  Pagination,
} from "@mui/material";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import style from "styled-jsx/style";
import CrudUser from "@/service/user.sevice";
import ResiterForm from "@/components/register-form/resiter-form";
import { RolesService } from "@/service/roles.service";
import { OrdersService } from "@/service/order.service";
import { convertTimestampToFormattedDate } from "@/service/abstract.service";
import { OrderParcelStatusService } from "@/service/order-parcel.service";
import { ParcelDeliveryService } from "@/service/parcel-delivery.service";
import { OrdersModel } from "@/common/models/orders-result.interface";
import router from "next/router";
import { Product } from "@/service/models/product.interface";
import { OrderType } from "@/service/models/order.interface";
import { NextPage } from "next";

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];
  const ProductOrder: NextPage = () => {
  const ordersService = new OrdersService();
  const callOrdersService = new OrdersService();
  const [dataTable, setDataTable] = useState<OrderType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [modalAddUser, setModalAddUser] = useState<boolean>(false);
  const [modalEditUser, setModalEditUser] = useState<boolean>(false);
  const [scroll, setScroll] = useState<DialogProps["scroll"]>("paper");
  const [lastPage, setLastPage] = useState(0);
  const [updatrFormData, setUpdateFormData] = useState({
    active: true,
    address: "",
    cashOnDalivery: true,
    createAt: "",
    createBy: "",
    id: "",
    totalAmount: 0,
    orderCode: "",
    orderName: "",
    ordersAmount: 0,
    orderStatusId: "",
    orderStatus: { id: "", orderStatusCode: "", orderStatusName: "" },
    parcelStatusId: "",
    parcelStatus: { id: "", parcelStatusCode: "", parcelStatusName: "" },
    paymentTypeId: "",
    paymentType: { id: "", paymentCode: "", paymentName: "" },
    productsId: "",
    products: {
      active: true,
      craeteBy: "",
      createAt: "",
      id: "",
      pathPicture: "",
      productAmount: 0,
      productCode: "",
      productDetail: "",
      productName: "",
      productPrice: 0,
      updateAt: "",
      updateBy: "",
    },
    phoneNumber: "",
    recipient: "",
    slipPath: "",
    transferDate: "",
    updateAt: "",
    updateBy: "",
  });
  const fetchData = async (page: number = 1) => {
    try {
      const data = await callOrdersService.getAllOrder(page, "").then(async (res: any) => {
        setLastPage(res?.meta?.last_page);
        if (res) {
          setDataTable(res?.data);
        } else {
          setDataTable([]);
        }
      });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (isVale: boolean, id: string) => {
    setOrderId(id);
    isVale ? setOpenModalDelete(false) : setOpenModalDelete(true);
  };
  const handleEdit = async (id: string) => {
    try {
      await callOrdersService.getOrderById(id).then((res: any) => {
        if (res?.result) {
          setUpdateFormData({
            active: res?.result.active,
            address: res?.result.address,
            cashOnDalivery: res?.result.cashOnDalivery,
            createAt: res?.result.createAt,
            createBy: res?.result.createBy,
            id: res?.result.id,
            totalAmount: parseInt(res?.result.totalAmount),
            orderCode: res?.result.orderCode,
            orderName: res?.result.orderName,
            orderStatusId: res?.result.orderStatus?.id,
            orderStatus: {
              id: res?.result.orderStatus?.id,
              orderStatusCode: res?.result.orderStatus?.orderStatusCode,
              orderStatusName: res?.result.orderStatus?.orderStatusName,
            },
            ordersAmount: parseInt(res?.result.ordersAmount),
            parcelStatusId: res?.result.parcelStatus?.id,
            parcelStatus: {
              id: res?.result.parcelStatus?.id,
              parcelStatusCode: res?.result.parcelStatus?.parcelStatusCode,
              parcelStatusName: res?.result.parcelStatus?.parcelStatusName,
            },
            paymentTypeId: res?.result.paymentType?.Id,
            paymentType: {
              id: res?.result.paymentType?.id,
              paymentCode: res?.result.paymentType?.paymentCode,
              paymentName: res?.result.paymentType?.paymentName,
            },
            phoneNumber: res?.result.phoneNumber,
            productsId: res?.result?.products?.id,
            products: {
              active: res?.result?.products?.active,
              craeteBy: res?.result?.products?.craeteBy,
              createAt: res?.result?.products?.createAt,
              id: res?.result?.products?.id,
              pathPicture: res?.result?.products?.pathPicture,
              productAmount: parseInt(res?.result?.products?.productAmount),
              productCode: res?.result?.products?.productCode,
              productDetail: res?.result?.products?.productDetail,
              productName: res?.result?.products?.productName,
              productPrice: parseInt(res?.result?.products?.productPrice),
              updateAt: res?.result?.products?.updateAt,
              updateBy: res?.result?.products?.updateBy,
            },
            recipient: res?.result.recipient,
            slipPath: res?.result.slipPath,
            transferDate: res?.result.transferDate,
            updateAt: res?.result.updateAt,
            updateBy: res?.result.updateBy,
          });
          setOrderId(id);
          // setUserDataById(res?.result);
          setModalEditUser(true);
        } else {
          setOrderId("");
          setModalEditUser(false);
          // setUserDataById(res?.result);
        }
      });
    } catch (error) {}
  };
  const handleCloseDelete = () => {
    setOpenModalDelete(false);
  };

  const handlePageChange = (event: any, newPage: any) => {
    setPage(newPage);
    fetchData(newPage);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  const deleteOrder = async () => {
    await callOrdersService.delete(orderId).then(async (res) => {
      setTimeout(() => {
        if (res?.messes == "Success") {
          setIsSuccess(false);
        } else {
          setIsSuccess(true);
        }
        setOpenModalDelete(false);
      }, 1000);
      setTimeout(() => {
        if (res?.messes == "Success") {
          setShowPopUp(true);
        } else {
          setShowPopUp(false);
        }
      }, 1000);
    });
    setShowPopUp(false);
  };

  const descriptionElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (modalAddUser) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const handleClickOrderDetail = (orderId: string) => {
    if (orderId !== undefined && orderId !== "") {
      router.push(`/admin-market/orders/order-details?id=${orderId}`);
    }
  };

  return (
    <>
      <div style={{ padding: "10px" }}>
        <h2>ประวัติการสั่งซื้อ</h2>
      </div>

      <div style={{ padding: "10px" }}>
        {/* <Button variant="contained" onClick={() => setModalAddUser(true)}>
          เพิ่มผู้ใช้งาน
        </Button> */}
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <h3>Code</h3>
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
                <h3>วันที่สั้ง</h3>
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
                <h3>Active</h3>
              </TableCell>
              <TableCell align="center">
                <h3>Action</h3>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataTable?.map((item) => (
              <>
                <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row" align="center">
                    {item.orderCode}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.orderName}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.ordersAmount}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item?.totalAmount}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {convertTimestampToFormattedDate(item.createAt) + " โดย " + item.recipient}
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
                    {item.active ? <CheckIcon /> : <ClearIcon />}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    <Button variant="text" onClick={() => handleEdit(item.id!)}>
                      View
                    </Button>
                    <Button variant="text" sx={{ color: !item.active ? "red" : "gray" }} onClick={() => handleDelete(item.active!, item.id!)}>
                      Delete
                    </Button>
                  </TableCell>
                  <Modal
                    open={openModalDelete}
                    onClose={handleCloseDelete}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description">
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        <h4 style={{ color: "red" }}>ลบข้อมูล</h4>
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        คุณต้องการลบข้อมูลนี้ใช่หรือไม่?
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                        }}>
                        <Button variant="outlined" sx={{ marginLeft: "30px" }} onClick={deleteOrder}>
                          ยืนยัน
                        </Button>
                        <Button variant="outlined" sx={{ marginLeft: "30px" }} onClick={handleCloseDelete}>
                          ยกเลิก
                        </Button>
                      </div>
                    </Box>
                  </Modal>
                </TableRow>
                <Dialog
                  open={showPopUp}
                  onClose={() => setShowPopUp(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description">
                  <DialogTitle id="alert-dialog-title">{"แจ้งเตือน"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      {!isSuccess ? (
                        <>
                          <Alert severity="success">ลบข้อมูลสำเร็จ!!</Alert>
                        </>
                      ) : (
                        <>
                          <Alert severity="error">ลบข้อมูลสำเร็จ!!</Alert>
                        </>
                      )}
                    </DialogContentText>
                  </DialogContent>
                </Dialog>
              </>
            ))}
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
        <Dialog
          open={modalEditUser}
          onClose={() => setModalEditUser(false)}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          maxWidth="xl">
          <DialogTitle id="scroll-dialog-title">
            {" "}
            <h2>รายละเอียดออเดอร์</h2>
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="standard-basic"
                    label="Code"
                    variant="standard"
                    name="Code"
                    disabled={true}
                    sx={{ width: "400px" }}
                    value={updatrFormData?.orderCode}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="standard-basic"
                    label="ชื่อ"
                    variant="standard"
                    name="name"
                    disabled={true}
                    sx={{ width: "400px" }}
                    value={updatrFormData?.orderName}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updatrFormData,
                        orderName: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="standard-basic"
                    label="สร้างเมื่อ"
                    variant="standard"
                    name="createAt"
                    disabled={true}
                    sx={{ width: "400px" }}
                    value={convertTimestampToFormattedDate(updatrFormData?.createAt) + " โดย " + updatrFormData?.createBy}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="standard-basic"
                    label="เบอร์โทร"
                    variant="standard"
                    disabled={true}
                    name="phoneNumber"
                    sx={{ width: "400px" }}
                    value={updatrFormData?.phoneNumber}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updatrFormData,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    id="standard-basic"
                    label="จำนวน"
                    variant="standard"
                    name="ordersAmount"
                    sx={{ width: "400px" }}
                    disabled={true}
                    value={updatrFormData?.ordersAmount}
                    onChange={(e: any) =>
                      setUpdateFormData({
                        ...updatrFormData,
                        ordersAmount: parseInt(e.target.value, 10),
                        totalAmount: parseInt(e.target.value, 10) * updatrFormData?.products?.productPrice,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    id="standard-basic"
                    label="ราคาทั้งหมด"
                    variant="standard"
                    name="totalAmount"
                    disabled={true}
                    sx={{ width: "400px" }}
                    value={updatrFormData?.totalAmount}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="standard-basic"
                    label="ประเภทการจ่ายเงิน"
                    variant="standard"
                    name="paymentType"
                    sx={{ width: "400px" }}
                    disabled={true}
                    value={updatrFormData?.paymentType?.paymentName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="standard-basic"
                    label="สถานะพัสดุ"
                    variant="standard"
                    name="paymentType"
                    sx={{ width: "400px" }}
                    disabled={true}
                    value={updatrFormData?.parcelStatus?.parcelStatusName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="text"
                    id="standard-basic"
                    label="สถานะออเดอร์"
                    variant="standard"
                    name="paymentType"
                    sx={{ width: "400px" }}
                    disabled={true}
                    value={updatrFormData?.orderStatus?.orderStatusName}
                  />
                </Grid>
              </Grid>
              <DialogActions sx={{ marginTop: "20px" }}>
                <Button onClick={() => handleClickOrderDetail(updatrFormData?.id)}>ดูเพิ่มเติม</Button>
                <Button onClick={() => setModalEditUser(false)} autoFocus>
                  ยกเลิก
                </Button>
              </DialogActions>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
};

export default ProductOrder;
