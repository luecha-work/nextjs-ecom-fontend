import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogActions,
  TableFooter,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import styles from "../../../styles/paymentType.module.css";
import PaymentService from "@/service/paymentType.service";
import { PaymentType } from "@/service/models/paymentType.interface";
import { convertTimestampToFormattedDate } from "@/service/abstract.service";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { generateRandomCode } from "@/common/class/random-code";
import { NextPage } from "next";

const PaymentType: NextPage = () => {
  const callPaymentService = new PaymentService();
  const [page, setPage] = useState(1);
  const [dataList, setDataList] = useState<PaymentType[]>();
  const [lastPage, setLastPage] = useState(0);
  const [scroll, setScroll] = useState<DialogProps["scroll"]>("paper");
  const descriptionElementRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedData, setSelectedData] = useState({
    id: "",
    bankAccount: "",
    paymentName: "",
    paymentCode: "",
    createDate: "",
    createBy: "",
    updateDate: "",
    updateBy: "",
    active: true,
  });

  const fetchData = async (page: number = 1) => {
    try {
      await callPaymentService.getAllPayment(page).then((res) => {
        if (res?.result.data) {
          setDataList(res?.result.data);
          setLastPage(res?.result.meta.last_page);
        } else {
          setDataList([]);
        }
      });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEdit = () => {
    if (selectedData.id) {
      // แก้ไขข้อมูล
      callPaymentService.updatePaymentType(selectedData).then((res) => {
        fetchData();
        closeModal();
      });
    } else {
      closeModal();
    }
  };

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setIsModalOpenUpdate(true);
  };

  const handleAdd = () => {
    callPaymentService.createPaymentType(selectedData).then((res) => {
      fetchData();
    });
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await callPaymentService.delete(id).then((res) => {
      setOpenModalDelete(false);
      fetchData();
    });
  };

  const openModal = () => {
    setSelectedData({
      id: "",
      bankAccount: "",
      paymentName: "",
      paymentCode: generateRandomCode("PAYMENT"),
      createDate: "",
      createBy: "",
      updateDate: "",
      updateBy: "",
      active: true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalOpenUpdate(false);
  };

  const handlePageChange = (event: any, newPage: any) => {
    setPage(newPage);
    fetchData(newPage);
  };

  const openModalCheckDelete = (id: string, isVale: boolean) => {
    setSelectedData({
      ...selectedData,
      id: id,
    });
    isVale ? setOpenModalDelete(false) : setOpenModalDelete(true);
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

  return (
    <Container maxWidth="xl">
      <h1>ประเภทการจ่ายเงิน</h1>
      <div>
        <Button variant="contained" color="primary" onClick={openModal}>
          เพิ่มประเภทการจ่ายเงิน
        </Button>
      </div>
      <div>
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <h3>Code</h3>{" "}
                </TableCell>
                <TableCell align="center">
                  <h3>Name</h3>
                </TableCell>
                <TableCell align="center">
                  <h3>Account</h3>
                </TableCell>
                <TableCell align="center">
                  <h3>Crate At</h3>
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
              {dataList?.map((data) => (
                <>
                  <TableRow key={data.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row" align="center">
                      {data.paymentCode}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {data.paymentName}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {data.bankAccount}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {convertTimestampToFormattedDate(data.createDate) + " โดย " + data.createBy}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {data.active ? <CheckIcon /> : <ClearIcon />}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <Button onClick={() => handleEdit(data)}>Edit</Button>
                      <Button onClick={() => openModalCheckDelete(data.id, data.active)} variant="text" sx={{ color: data.active ? "gray" : "red" }}>
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
      </div>

      <Dialog
        open={isModalOpen}
        onClose={closeModal}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="xl">
        <DialogTitle id="scroll-dialog-title">
          {" "}
          <h2>เพิ่มหมวดหมู่</h2>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <Grid container rowSpacing={1}>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Code"
                  variant="standard"
                  value={selectedData?.paymentCode}
                  disabled
                  sx={{ width: "400px" }}
                  required
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Name"
                  required
                  variant="standard"
                  sx={{ width: "400px" }}
                  onChange={(e: any) =>
                    setSelectedData({
                      ...selectedData,
                      paymentName: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Account"
                  required
                  variant="standard"
                  sx={{ width: "400px" }}
                  onChange={(e: any) =>
                    setSelectedData({
                      ...selectedData,
                      bankAccount: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginTop: "20px" }}>
          <Button onClick={() => handleAdd()}>ยืนยัน</Button>
          <Button onClick={closeModal} autoFocus>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isModalOpenUpdate}
        onClose={closeModal}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="xl">
        <DialogTitle id="scroll-dialog-title">
          {" "}
          <h2>แก้ไข</h2>
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <Grid container rowSpacing={1}>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Code"
                  variant="standard"
                  value={selectedData?.paymentCode}
                  disabled
                  sx={{ width: "400px" }}
                  required
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Name"
                  required
                  variant="standard"
                  value={selectedData?.paymentName}
                  sx={{ width: "400px" }}
                  onChange={(e: any) =>
                    setSelectedData({
                      ...selectedData,
                      paymentName: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <TextField
                  id="standard-basic"
                  label="Account"
                  required
                  variant="standard"
                  value={selectedData?.bankAccount}
                  sx={{ width: "400px" }}
                  onChange={(e: any) =>
                    setSelectedData({
                      ...selectedData,
                      bankAccount: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "10px" }}>
                <span>Active </span>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-select-small"
                  value={selectedData?.active}
                  label="Active"
                  onChange={(e: any) =>
                    setSelectedData({
                      ...selectedData,
                      active: e.target.value === "true" ? true : false,
                    })
                  }>
                  <MenuItem value={"true"}>true</MenuItem>
                  <MenuItem value={"false"}>false</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ marginTop: "20px" }}>
          <Button onClick={() => handleAddEdit()}>ยืนยัน</Button>
          <Button onClick={closeModal} autoFocus>
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
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
            <Button variant="outlined" sx={{ marginLeft: "30px" }} onClick={() => handleDelete(selectedData?.id)}>
              ยืนยัน
            </Button>
            <Button variant="outlined" sx={{ marginLeft: "30px" }} onClick={() => setOpenModalDelete(false)}>
              ยกเลิก
            </Button>
          </div>
        </Box>
      </Modal>
    </Container>
  );
}
export default PaymentType