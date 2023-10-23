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
  Pagination,
  TableFooter,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import style from "styled-jsx/style";
import CrudUser from "@/service/user.sevice";
import ResiterForm from "@/components/register-form/resiter-form";
import { convertTimestampToFormattedDate } from "@/service/abstract.service";
import Dropdown from "@/components/ui/dropdown";
import { RolesService } from "@/service/roles.service";
import { FastForward } from "@mui/icons-material";
import { stringify } from "querystring";
import { UserType } from "@/service/models/auth.interface";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
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

const User: NextPage = () => {
  const callService = new AuthService();
  const callUserServier = new CrudUser();
  const callRoleService = new RolesService();
  const [userData, setUserData] = useState<UserType[]>([]);
  const [userDataById, setUserDataById] = useState<UserType>();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [idUser, setIdUser] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [modalAddUser, setModalAddUser] = useState<boolean>(false);
  const [modalEditUser, setModalEditUser] = useState<boolean>(false);
  const [scroll, setScroll] = useState<DialogProps["scroll"]>("paper");
  const [roleData, setRoleData] = useState<string[]>();
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [lastPage, setLastPage] = useState(0);
  const router = useRouter();
  const [updatrFormData, setUpdateFormData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    phoneNumber: "",
    email: "",
    role: "",
    active: true,
    // roleId: "",
    // gender:""
  });

  const fetchData = async (page: number = 1) => {
    try {
      await callService.getUserList(page, "").then(async (res: any) => {
        setLastPage(res?.data?.result?.meta.last_page);
        if (res?.data) {
          setUserData(res?.data?.result?.data);
        } else {
          setUserData([]);
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
    setIdUser(id);
    isVale ? setOpenModalDelete(false) : setOpenModalDelete(true);
  };
  const handleEdit = async (id: string) => {
    try {
      await callUserServier.getUserById(id).then((res: any) => {
        if (res?.result) {
          setUpdateFormData({
            id: res?.result?.id,
            firstname: res?.result.firstname,
            lastname: res?.result.lastname,
            phoneNumber: res?.result.phoneNumber,
            email: res?.result.email,
            role: res?.result?.role?.roleName,
            active: res?.result.active,
            // roleId: res?.result.role.id,
            // gender: ""
          });
          setIdUser(id);
          // setUserDataById(res?.result);
          if (res?.result.role.roleName === "admin_manager") {
            setModalEditUser(false);
          } else setModalEditUser(true);
        } else {
          setIdUser("");
          setModalEditUser(false);
          // setUserDataById(res?.result);
        }
      });
      await callRoleService.getRolesToRegister().then((res: any) => {
        if (res?.result) {
          setRoleData(res?.result);
        } else {
          setRoleData([]);
        }
      });
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:116 ~ handleEdit ~ error:", error);
    }
  };
  const handleCloseDelete = () => {
    setOpenModalDelete(false);
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

  const handlePageChange = (event: any, newPage: any) => {
    setPage(newPage);
    fetchData(newPage);
  };

  const deleteUser = async () => {
    await callUserServier.delete(idUser).then(async (res) => {
      setTimeout(() => {
        if (res?.messes == "Success") {
          setIsSuccess(false);
        } else {
          setIsSuccess(true);
        }
        setOpenModalDelete(false);
      }, 500);
      setTimeout(() => {
        if (res?.messes == "Success") {
          setShowPopUp(true);
        } else {
          setShowPopUp(false);
        }
      }, 500);
    });
    fetchData();
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

  const submitUpdateData = () => {
    callUserServier.updateById(updatrFormData?.id, updatrFormData).then((res) => {
      if (res?.status_code == "200") {
        setModalEditUser(false);
        setUpdateSuccess(true);
      } else {
        setModalEditUser(false);
        setUpdateSuccess(false);
      }
      fetchData();
    });
  };

  return (
    <>
      <div style={{ padding: "10px" }}>
        <h2>ข้อมูลส่วนบุคคล</h2>
      </div>

      <div style={{ padding: "10px" }}>
        <Button variant="contained" onClick={() => setModalAddUser(true)}>
          เพิ่มผู้ใช้งาน
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <h3>Email</h3>
              </TableCell>
              <TableCell align="center">
                <h3>ชื่อ นามสกุล</h3>
              </TableCell>
              <TableCell align="center">
                <h3>บทบาท</h3>
              </TableCell>
              <TableCell align="center">
                <h3>เบอร์โทร</h3>
              </TableCell>
              <TableCell align="center">
                <h3>ปีเกิด</h3>
              </TableCell>
              <TableCell align="center">
                <h3>เพศ</h3>
              </TableCell>
              <TableCell align="center">
                <h3>สร้างเมื่อ</h3>
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
            {userData?.map((item) => (
              <>
                <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row" align="center">
                    {item.email}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.firstname + "   " + item.lastname}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.role.roleName}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.phoneNumber}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {convertTimestampToFormattedDate(item.dateOfBirth)}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.gender}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {convertTimestampToFormattedDate(item.createAt) + " โดย " + item.createBy}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {item.active ? <CheckIcon /> : <ClearIcon />}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    <Button variant="text" onClick={() => handleEdit(item.id)} sx={{ color: item.role?.roleName === "admin_manager" ? "gray" : "" }}>
                      Edit
                    </Button>
                    <Button variant="text" sx={{ color: item.active ? "gray" : "red" }} onClick={() => handleDelete(item.active, item.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
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
      </TableContainer>

      <Modal open={openModalDelete} onClose={handleCloseDelete} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h4 style={{ color: "red" }}>ลบข้อมูล</h4>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            คุณต้องการลบข้อมูลนี้ใช่หรือไม่?
          </Typography>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
            <Button variant="outlined" sx={{ marginLeft: "30px" }} onClick={deleteUser}>
              ยืนยัน
            </Button>
            <Button variant="outlined" sx={{ marginLeft: "30px" }} onClick={handleCloseDelete}>
              ยกเลิก
            </Button>
          </div>
        </Box>
      </Modal>

      <Dialog open={showPopUp} onClose={() => setShowPopUp(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"แจ้งเตือน"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {!isSuccess ? (
              <>
                <Alert severity="success">ลบข้อมูลสำเร็จ!!</Alert>
              </>
            ) : (
              <>
                <Alert severity="error">ลบข้อมูลไม่สำเร็จ!!</Alert>
              </>
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Modal
        open={modalAddUser}
        onClose={() => setModalAddUser(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description">
        <Box sx={{ ...style, width: "80%", overflowX: "auto", height: "80%" }}>
          <Button onClick={() => setModalAddUser(false)} sx={{ float: "right" }}>
            <CloseIcon sx={{ color: "red" }} />
          </Button>
          <ResiterForm AddUser={true} />
        </Box>
      </Modal>

      <Dialog
        open={modalEditUser}
        onClose={() => setModalEditUser(false)}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="xl">
        <DialogTitle id="scroll-dialog-title">
          {" "}
          <h2>แก้ไขผู้ใช้งาน</h2>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
              <Grid item xs={6} sx={{ padding: "30px" }}>
                <TextField
                  id="standard-basic"
                  label="ชื่อ"
                  variant="standard"
                  sx={{ width: "400px" }}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      firstname: e.target.value,
                    })
                  }
                  value={updatrFormData?.firstname}
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "30px" }}>
                <TextField
                  id="standard-basic"
                  label="นามสกุล"
                  variant="standard"
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      lastname: e.target.value,
                    })
                  }
                  sx={{ width: "400px" }}
                  value={updatrFormData?.lastname}
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "30px" }}>
                <TextField
                  type="email"
                  id="standard-basic"
                  label="Email"
                  variant="standard"
                  name="email"
                  sx={{ width: "400px" }}
                  value={updatrFormData?.email}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      email: e.target.value,
                    })
                  }
                />

                {/* <pre>{JSON.stringify(updatrFormData, null, 2)}</pre> */}
              </Grid>
              <Grid item xs={6} sx={{ padding: "30px" }}>
                <span>บทบาท </span>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-select-small"
                  label="บทบาท"
                  value={updatrFormData?.role}
                  sx={{ width: "200px" }}
                  onChange={async (e: any) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      role: e.target.value,
                    })
                  }>
                  {roleData?.map((e: any) => (
                    <MenuItem key={e.id} value={e.label}>
                      {e.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6} sx={{ padding: "30px" }}>
                <TextField
                  id="standard-basic"
                  label="เบอร์โทร"
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      phoneNumber: e.target.value,
                    })
                  }
                  variant="standard"
                  sx={{ width: "400px" }}
                  value={updatrFormData?.phoneNumber}
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "30px" }}>
                <span>Active </span>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-select-small"
                  value={updatrFormData?.active}
                  label="Active"
                  sx={{ width: "200px" }}
                  onChange={(e: any) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      active: e.target.value === "true" ? true : false,
                    })
                  }>
                  <MenuItem value={"true"}>true</MenuItem>
                  <MenuItem value={"false"}>false</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <DialogActions sx={{ marginTop: "20px" }}>
              <Button onClick={() => submitUpdateData()}>ยืนยัน</Button>
              <Button onClick={() => setModalEditUser(false)} autoFocus>
                ยกเลิก
              </Button>
            </DialogActions>
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      <Dialog
        open={updateSuccess}
        onClose={() => setUpdateSuccess(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"แจ้งเตือน"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <DialogContentText id="alert-dialog-description">
              {updateSuccess ? (
                <>
                  <Alert severity="success">แก้ไขข้อมูลสำเร็จ!!</Alert>
                </>
              ) : (
                <>
                  <Alert severity="error">แก้ไขข้อมูลไม่สำเร็จ!!</Alert>
                </>
              )}
            </DialogContentText>{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateSuccess(false)}>CLOES</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default User;
