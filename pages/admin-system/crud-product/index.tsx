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
import router from "next/router";
import { ProductService } from "@/service/product.service";
import { Product } from "@/service/models/product.interface";
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
  const Products: NextPage = () => {
  const callProducts = new ProductService();
  const callOrdersService = new OrdersService();
  const [dataTable, setDataTable] = useState<Product[]>([]);
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
  const [updatrFormData, setUpdateFormData] = useState<Product>();
  const fetchData = async (page: number = 1) => {
    try {
      const data = await callProducts.getallProduct(page).then(async (res: any) => {
        setLastPage(res?.result.meta?.last_page);
        if (res) {
          setDataTable(res?.result.data);
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
      await callProducts.getProductById(id).then((res: any) => {
        if (res?.result) {
          setUpdateFormData(res?.result);
          setOrderId(id);
          // setUserDataById(res?.result);
          // setModalEditUser(true);
          router.push(`/product/detailProduct-user?id=${id}`);
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
        <h2>สินค้าทั้งหมด</h2>
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
                <h3>สร้างเมื่อ</h3>
              </TableCell>
              <TableCell align="center">
                <h3>หมวดหมู่</h3>
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
                    {item.productCode}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.productName}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.productAmount}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item?.productPrice}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {convertTimestampToFormattedDate(item.createAt) + " โดย " + item.craeteBy}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.category.categoryName}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.active ? <CheckIcon /> : <ClearIcon />}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    <Button variant="text" onClick={() => handleEdit(item.id)}>
                      View
                    </Button>
                    <Button variant="text" sx={{ color: !item.active ? "red" : "gray" }} onClick={() => handleDelete(item.active, item.id)}>
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
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
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
            <h2>รายละเอียดสินค้า</h2>
          </DialogTitle>
          <DialogContent dividers={scroll === "paper"}>pss</DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
};

export default Products;
