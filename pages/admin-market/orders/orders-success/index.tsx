import { NextPage } from "next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { ChangeEvent, useEffect, useState } from "react";
import SearchInput from "@/components/ui/search-input";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { OrdersService } from "@/service/order.service";
import { OrdersModel } from "@/common/models/orders-result.interface";
import { Button, MenuItem, Select, Stack, TableFooter } from "@mui/material";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import router from "next/router";
import craeteTransferDatetime from "@/common/class/craete-transfer-datetimd";
import transferList from "@/common/class/transport-company";
import EditOrderSuccessStatusModal from "@/components/ui/change-order-success-modal";
import { MetaModel } from "@/common/models/base-result.imterface";

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

const OrdersSuccess: NextPage = () => {
  const ordersService = new OrdersService();

  const [searchValue, setSearchValue] = useState("");
  const [orderSuccessData, setOrderSuccessData] = useState<
    OrdersModel[] | undefined
  >();
  const [meta, setMeta] = useState<MetaModel>();
  const [rowsIndex, setRowsIndex] = useState({
    lastIndex: [0] as number[],
    currentIndex: 1,
  });
  const [transportCompany, setTransportCompany] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const page: number = 1;
    setSearchValue(event.target.value);

    if (
      typeof event.target.value !== "undefined" ||
      event.target.value !== ""
    ) {
      ordersService.getOrdersSuccess(page, event.target.value).then((req) => {
        const data: OrdersModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;
        setMeta(meta);
        setOrderSuccessData(data);
      });
    } else {
      ordersService.getOrdersSuccess().then((req) => {
        const data: OrdersModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;
        setMeta(meta);
        setOrderSuccessData(data);
      });
    }
  };

  const handleClickOrderDetail = (orderId: string) => {
    if (orderId !== undefined && orderId !== "") {
      router.push(`/admin-market/orders/order-details?id=${orderId}`);
    }
  };

  const reloadOrders = () => {
    ordersService.getOrdersSuccess().then((req) => {
      const data: OrdersModel[] = req?.result.data;
      const meta: MetaModel = req?.result.meta;

      setMeta(meta);
      setOrderSuccessData(data);
    });
  };

  const handleProViousPage = () => {
    const page: number = parseInt(meta!.page.toString()) - 1;

    const newLastIndex = [...rowsIndex.lastIndex];
    const removedValue = newLastIndex.pop();

    if (page >= 1) {
      if (orderSuccessData && removedValue !== undefined) {
        setRowsIndex({
          lastIndex: newLastIndex,
          currentIndex: removedValue,
        });
      }

      ordersService.getOrdersSuccess(page, searchValue).then((req) => {
        const data: OrdersModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;
        setMeta(meta);
        setOrderSuccessData(data);
      });
    }
  };

  const handleNextPage = () => {
    const page: number = parseInt(meta!.page.toString()) + 1;
    const last_page: number = meta!.last_page;

    if (page <= last_page) {
      if (orderSuccessData) {
        setRowsIndex({
          lastIndex: [...rowsIndex.lastIndex, rowsIndex.currentIndex],
          currentIndex: rowsIndex.currentIndex + orderSuccessData.length,
        });
      }

      ordersService.getOrdersSuccess(page, searchValue).then((req) => {
        const data: OrdersModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;
        setMeta(meta);
        setOrderSuccessData(data);
      });
    }
  };

  const handleSearchCompany = (searchCompany: string) => {
    const page: number = 1;

    ordersService
      .getOrdersSuccess(page, searchValue, searchCompany)
      .then((req) => {
        const data: OrdersModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;
        setMeta(meta);
        setOrderSuccessData(data);
      });
  };

  useEffect(() => {
    ordersService.getOrdersSuccess().then((req) => {
      const data: OrdersModel[] = req?.result.data;
      const meta: MetaModel = req?.result.meta;
      setMeta(meta);
      setOrderSuccessData(data);
    });

    setTransportCompany("");
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
              <p className="titlePages">คำสั่งซื้อสำเร็จ</p>
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
                      style={{ width: "15%" }}
                    >
                      <Select
                        labelId="select-label-transport"
                        id="select-transport"
                        displayEmpty
                        value={transportCompany}
                        label={``}
                        style={{ color: "white" }}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          const selectedItem = transferList.find(
                            (item) => item.code === selectedValue
                          );
                          const selectedName = selectedItem
                            ? selectedItem.name
                            : "";
                          setTransportCompany(selectedValue);
                          handleSearchCompany(selectedName);
                        }}
                      >
                        <MenuItem value="">
                          <em>เลือกบริษัทขนส่งทั้งหมด</em>
                        </MenuItem>
                        {transferList.map((item) => (
                          <MenuItem key={item.code} value={item.code}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
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
                  {orderSuccessData?.map((row, index) => (
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
                        {orderSuccessData?.[0].createAt
                          ? craeteTransferDatetime(row.createAt.toString())
                          : "-"}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "green",
                        }}
                      >
                        {row.parcelStatus.parcelStatusName
                          ? row.parcelStatus.parcelStatusName
                          : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.parcelDelivery.transportCompany
                          ? row.parcelDelivery.transportCompany
                          : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center" style={{ width: "auto" }}>
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
                          {/* <EditOrderSuccessStatusModal
                            orderId={row.id}
                            orderSuccessProps={row.parcelStatus}
                            reloadOrders={reloadOrders}
                            parcelDeliveryProps={row.parcelDelivery}
                          /> */}
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

export default OrdersSuccess;
