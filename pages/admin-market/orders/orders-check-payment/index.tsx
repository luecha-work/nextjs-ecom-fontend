import craeteTransferDatetime from "@/common/class/craete-transfer-datetimd";
import { useStore } from "@/common/class/stateManagement";
import { MetaModel } from "@/common/models/base-result.imterface";
import { OrdersModel } from "@/common/models/orders-result.interface";
import EditOrderStatusModal from "@/components/ui/change-order-status-modal";
import DeleteOrderModal from "@/components/ui/delete-order-modal";
import SearchInput from "@/components/ui/search-input";
import { OrdersService } from "@/service/order.service";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import { Button, Stack, TableFooter } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { NextPage } from "next";
import router from "next/router";
import { ChangeEvent, useEffect, useState } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const OrdersCheckPayment: NextPage = () => {
  const ordersService = new OrdersService();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoading_status = useStore((state) => state.spin_status);

  const [searchValue, setSearchValue] = useState("");
  const [orderData, setOrderData] = useState<OrdersModel[] | undefined>();
  const [meta, setMeta] = useState<MetaModel>();
  const [rowsIndex, setRowsIndex] = useState({
    lastIndex: [0] as number[],
    currentIndex: 1,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const page: number = 1;
    setSearchValue(event.target.value);

    if (
      typeof event.target.value !== "undefined" ||
      event.target.value !== ""
    ) {
      ordersService
        .getOrdersCheckPayment(page, event.target.value)
        .then((req) => {
          const data: OrdersModel[] = req?.result.data;
          const meta: MetaModel = req?.result.meta;
          setMeta(meta);
          setOrderData(data);
        });
    } else {
      ordersService.getOrdersCheckPayment().then((req) => {
        const data: OrdersModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;
        setMeta(meta);
        setOrderData(data);
      });
    }
  };

  const handleNextPage = () => {
    const page: number = parseInt(meta!.page.toString()) + 1;
    const last_page: number = meta!.last_page;

    if (page <= last_page) {
      if (orderData) {
        setRowsIndex({
          lastIndex: [...rowsIndex.lastIndex, rowsIndex.currentIndex],
          currentIndex: rowsIndex.currentIndex + orderData.length,
        });
      }

      ordersService.getOrdersCheckPayment(page, searchValue).then((req) => {
        const data: OrdersModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;
        setMeta(meta);
        setOrderData(data);
      });
    }
  };

  const handleProViousPage = () => {
    const page: number = parseInt(meta!.page.toString()) - 1;

    const newLastIndex = [...rowsIndex.lastIndex];
    const removedValue = newLastIndex.pop();

    if (page >= 1) {
      if (orderData && removedValue !== undefined) {
        setRowsIndex({
          lastIndex: newLastIndex,
          currentIndex: removedValue,
        });
      }

      ordersService.getOrdersCheckPayment(page, searchValue).then((req) => {
        const data: OrdersModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;
        setMeta(meta);
        setOrderData(data);
      });
    }
  };

  const handleClickOrderDetail = (orderId: string) => {
    if (orderId !== undefined && orderId !== "") {
      router.push(`/admin-market/orders/order-details?id=${orderId}`);
    }
  };

  const reloadOrders = () => {
    ordersService.getOrdersCheckPayment().then((req) => {
      const data: OrdersModel[] = req?.result.data;
      const meta: MetaModel = req?.result.meta;

      setMeta(meta);
      setOrderData(data);
    });
  };

  useEffect(() => {
    ordersService.getOrdersCheckPayment().then((req) => {
      const data: OrdersModel[] = req?.result.data;
      const meta: MetaModel = req?.result.meta;

      setMeta(meta);
      setOrderData(data);
    });
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={1}></Grid>
        <Grid item xs={14}>
          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection="row"
            alignItems="center"
          >
            <Box flexGrow={0}>
              <p className="titlePages">สินค้ารอการอนุมัติ</p>
            </Box>
            <Box flexGrow={0} width={"30%"}>
              <SearchInput
                handleInputChange={handleInputChange}
                title={`ค้นหารายชื่อผู้รับ/เบอร์โทร`}
                searchValue={searchValue}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <Grid container spacing={2} columns={16} mt={1}>
        <Grid item xs={1}></Grid>
        <Grid item xs={14}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      className="orderHeaderTable"
                    >
                      คำสั่งซื้อ
                    </StyledTableCell>
                    <StyledTableCell align="left" className="orderHeaderTable">
                      หมายเลขคำสั่งซื้อ
                    </StyledTableCell>
                    <StyledTableCell align="left" className="orderHeaderTable">
                      ผู้รับ
                    </StyledTableCell>
                    <StyledTableCell align="left" className="orderHeaderTable">
                      เบอร์โทร
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      className="orderHeaderTable"
                    >
                      วัน-เวลาที่สั่งซื้อ
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      className="orderHeaderTable"
                    >
                      สถานะ
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      className="orderHeaderTable"
                    >
                      action
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderData?.map((row, index) => (
                    <StyledTableRow
                      key={(index + rowsIndex.currentIndex).toString()}
                    >
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {index + rowsIndex.currentIndex}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="left">
                        {row.orderCode ? row.orderCode : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.recipient ? row.recipient : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.phoneNumber ? row.phoneNumber : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {orderData?.[0].createAt
                          ? craeteTransferDatetime(row.createAt.toString())
                          : "-"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color:
                            row.orderStatus.orderStatusName !==
                            "รอยืนยันคำสั่งซื้อ"
                              ? row.orderStatus.orderStatusName ===
                                  "เก็บเงินปลายทาง" ||
                                row.orderStatus.orderStatusName === "ชำระสำเร็จ"
                                ? "green"
                                : "red"
                              : "red",
                        }}
                      >
                        {row.orderStatus.orderStatusName
                          ? row.orderStatus.orderStatusName
                          : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center" style={{ width: "35%" }}>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ContentPasteSearchOutlinedIcon />}
                            onClick={() => {
                              handleClickOrderDetail(row?.id);
                            }}
                          >
                            รายละเอียด
                          </Button>
                          <EditOrderStatusModal
                            orderId={row.id}
                            orderStatusProps={row.orderStatus}
                            reloadOrders={reloadOrders}
                          />

                          <DeleteOrderModal
                            orderId={row.id}
                            orderStatusProps={row.orderStatus}
                            reloadOrders={reloadOrders}
                          />
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow style={{ justifyContent: "space-between" }}>
                    <TableCell colSpan={2} style={{ paddingRight: 0 }}>
                      <p style={{ fontSize: 14 }}>
                        number of rows: {meta?.total}
                      </p>
                    </TableCell>
                    <TableCell
                      colSpan={6}
                      align="right"
                      style={{ paddingLeft: 0 }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        marginY={1}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <Button
                          size="medium"
                          style={{ margin: "0px" }}
                          onClick={handleProViousPage}
                        >
                          Previous
                        </Button>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0rem 0.8rem",
                          }}
                        >
                          <p
                            style={{
                              fontSize: 14,
                            }}
                          >
                            {meta?.page}
                          </p>
                        </span>
                        <Button
                          size="medium"
                          style={{ margin: "0px" }}
                          onClick={handleNextPage}
                        >
                          Next
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Box>
  );
};

export default OrdersCheckPayment;
