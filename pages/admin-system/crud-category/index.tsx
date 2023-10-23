import AuthService from "@/service/auth.sevice";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  Modal,
  Typography,
  Alert,
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
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import ButtonBack from "@/components/ui/button-back";
import { convertTimestampToFormattedDate } from "@/service/abstract.service";
import { CategoryService } from "@/service/category.service";
import { Category } from "@/service/models/category.interface";

import { generateRandomCode } from "@/common/class/random-code";
import { NextPage } from "next";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const Category: NextPage = () => {
  const callCategoryService = new CategoryService();
  const [categoryData, setCategoryData] = useState<Category[]>();
  const [page, setPage] = useState(1);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [idUser, setIdUser] = useState<string>("");
  const [isAddSuccess, setIsAddSuccess] = useState<boolean>(false);
  const [modalAddUser, setModalAddUser] = useState<boolean>(false);
  const [modalEditUser, setModalEditUser] = useState<boolean>(false);
  const [scroll, setScroll] = useState<DialogProps["scroll"]>("paper");
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [lastPage, setLastPage] = useState(0);
  const [errorNull, setErrorNull] = useState<boolean>(false);
  const descriptionElementRef = useRef<HTMLElement>(null);
  const [updatrFormData, setUpdateFormData] = useState<Category>({
    id: "",
    categoryName: "",
    categoryCode: "",
    categoryDetail: "",
    pathPicture: "",
    createAt: "",
    updateAt: "",
    createBy: "",
    updateBy: "",
    active: true,
  });

  const fetchData = async (page: number = 1) => {
    try {
      const data = await callCategoryService
        .getCategory(page)
        .then(async (res: any) => {
          let count: number = parseInt(res?.result.meta.page);
          setLastPage(res?.result.meta.last_page);
          if (res) {
            setCategoryData(res?.result.data);
          } else {
            setCategoryData([]);
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
      await callCategoryService.getCategoryById(id).then((res: any) => {

        if (res?.result) {
          setUpdateFormData(res?.result);
          setIdUser(id);
          setModalEditUser(true);
        } else {
          setIdUser("");
          setModalEditUser(false);
        }
      });
      fetchData();
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
    await callCategoryService.deleteCategory(idUser).then((res) => {
      setOpenModalDelete(false);
      fetchData();
    });
  };

  const submitUpdateData = () => {
    callCategoryService.updateCategory(updatrFormData).then((res) => {
      if (res?.status_code == "200") {
        setModalEditUser(false);
        setUpdateSuccess(true);
      } else {
        setModalEditUser(false);
        setUpdateSuccess(false);
      }
      fetchData();
    });
    setUpdateFormData({
      id: "",
      categoryName: "",
      categoryCode: "",
      categoryDetail: "",
      pathPicture: "",
      createAt: "",
      updateAt: "",
      createBy: "",
      updateBy: "",
      active: true,
    });
  };

  const submitAddCaategory = () => {
    setUpdateFormData({
      id: "",
      categoryName: "",
      categoryCode: "",
      categoryDetail: "",
      pathPicture: "",
      createAt: "",
      updateAt: "",
      createBy: "",
      updateBy: "",
      active: true,
    });
    if (
      updatrFormData?.categoryName === "" ||
      updatrFormData?.categoryDetail === ""
    ) {
      setErrorNull(true);
    } else {
      callCategoryService.createCategory(updatrFormData).then((res) => {
        setModalAddUser(false);
        setIsAddSuccess(true);
        setErrorNull(false);
        fetchData();
      });
    }
  };

  const openModalAdd = () => {
    setModalAddUser(true);
    setUpdateFormData({
      ...updatrFormData,
      categoryCode: generateRandomCode("CATEG"),
    });
  };

  return (
    <>
      <Grid container spacing={2} columns={16}>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="row"
          alignItems="center"
        >
          <ButtonBack />
        </Box>
      </Grid>

      <div style={{ padding: "10px" }}>
        <h2>ข้อมูลหมวดหมู่</h2>
      </div>

      <div style={{ padding: "10px" }}>
        <Button variant="contained" onClick={() => openModalAdd()}>
          เพิ่มหมวดหมู่
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <h3>Code</h3>
              </TableCell>
              <TableCell align="center">
                <h3>ชื่อหมวดหมู่</h3>
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
            {categoryData?.map((item, index) => (
              <TableRow
                key={(index + 1).toString()}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {item.categoryCode}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {item.categoryName}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {convertTimestampToFormattedDate(item.createAt) +
                    " โดย " +
                    item.createBy}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {item.active ? <CheckIcon /> : <ClearIcon />}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  <Button variant="text" onClick={() => handleEdit(item.id)}>
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    sx={{ color: item.active ? "gray" : "red" }}
                    onClick={() => handleDelete(item.active, item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
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

      <Modal
        open={openModalDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
            }}
          >
            <Button
              variant="outlined"
              sx={{ marginLeft: "30px" }}
              onClick={deleteUser}
            >
              ยืนยัน
            </Button>
            <Button
              variant="outlined"
              sx={{ marginLeft: "30px" }}
              onClick={handleCloseDelete}
            >
              ยกเลิก
            </Button>
          </div>
        </Box>
      </Modal>

      <Dialog
        open={modalEditUser}
        onClose={() => setModalEditUser(false)}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="xl"
      >
        <DialogTitle id="scroll-dialog-title">
          <h2>แก้ไขผู้ใช้งาน</h2>
          {/* <p className="optionsTitle">Product Options</p> */}
        </DialogTitle>

        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Grid container rowSpacing={1}>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Code"
                  variant="standard"
                  value={updatrFormData?.categoryCode}
                  disabled
                  sx={{ width: "400px" }}
                  required
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Name"
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      categoryName: e.target.value,
                    })
                  }
                  required
                  value={updatrFormData?.categoryName}
                  variant="standard"
                  sx={{ width: "400px" }}
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px", display: "flex" }}>
                <label htmlFor="">Detail &nbsp;</label>
                <textarea
                  name="Detail"
                  id="Detail"
                  style={{ display: "flex", width: "350px", height: "150px" }}
                  value={updatrFormData?.categoryDetail}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      categoryDetail: e.target.value,
                    })
                  }
                ></textarea>
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <span>Active </span>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-select-small"
                  value={updatrFormData?.active}
                  label="Active"
                  onChange={(e: any) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      active: e.target.value === "true" ? true : false,
                    })
                  }
                >
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
        open={modalAddUser}
        onClose={() => setModalAddUser(false)}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="xl"
      >
        <DialogTitle id="scroll-dialog-title">
          {" "}
          <h2>เพิ่มหมวดหมู่</h2>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Grid container rowSpacing={1}>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Code"
                  variant="standard"
                  value={updatrFormData?.categoryCode}
                  disabled
                  sx={{ width: "400px" }}
                  required
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Name"
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      categoryName: e.target.value,
                    })
                  }
                  required
                  variant="standard"
                  sx={{ width: "400px" }}
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px", display: "flex" }}>
                <label htmlFor="">Detail &nbsp;</label>
                <textarea
                  name="Detail"
                  id="Detail"
                  style={{ display: "flex", width: "350px", height: "150px" }}
                  onChange={(e) =>
                    setUpdateFormData({
                      ...updatrFormData,
                      categoryDetail: e.target.value,
                    })
                  }
                ></textarea>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginTop: "20px" }}>
          <Button onClick={() => submitAddCaategory()}>ยืนยัน</Button>
          <Button onClick={() => setModalAddUser(false)} autoFocus>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateSuccess}
        onClose={() => setUpdateSuccess(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
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

      <Dialog
        open={isAddSuccess}
        onClose={() => setIsAddSuccess(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"แจ้งเตือน"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <DialogContentText id="alert-dialog-description">
              {isAddSuccess ? (
                <>
                  <Alert severity="success">เพิ่มข้อมูลสำเร็จ!!</Alert>
                </>
              ) : (
                <>
                  <Alert severity="error">เพิ่มข้อมูลไม่สำเร็จ!!</Alert>
                </>
              )}
            </DialogContentText>{" "}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        open={errorNull}
        onClose={() => setErrorNull(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"แจ้งเตือน"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <DialogContentText id="alert-dialog-description">
              {errorNull ? (
                <>
                  <Alert severity="error">กรอกข้อมูลให้ครบ!!</Alert>
                </>
              ) : (
                <></>
              )}
            </DialogContentText>{" "}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Category;
