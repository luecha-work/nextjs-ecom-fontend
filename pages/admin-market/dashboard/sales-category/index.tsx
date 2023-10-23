import { MetaModel } from "@/common/models/base-result.imterface";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  tableCellClasses,
} from "@mui/material";
import { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { OrdersService } from "@/service/order.service";

const menuTitle = [
  { title: "วันนี้", value: "day", isInput: false },
  { title: "สัปดาห์", value: "week", isInput: false },
  { title: "เดือน", value: "month", isInput: false },
  { title: "ปี", value: "year", isInput: false },
  { title: "ระยะเวลา", value: "period", isInput: true },
];

interface RowDataDisplayModel {
  categoryid: string;
  categoryname: string;
  totalamount: string;
  ordersamount: string;
  averageSales: string;
}

const SalesCategory: NextPage = () => {
  const ordersService = new OrdersService();

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [isShowInput, setIsShowInput] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rowDataDisplay, setRowDataDisplay] = useState<RowDataDisplayModel[]>();
  const [filter, setFilter] = useState<string>("day");
  const [valueDateTime, setValueDateTime] = useState({
    startDate: "",
    endDate: "",
  });

  const handleButtonClick = (index: any, value: string) => {
    setFilter(value);
    setActiveIndex(index);

    setSelectedStartDate(null);
    setSelectedEndDate(null);

    if (index + 1 === 5) {
      setIsShowInput(true);
    } else {
      setIsShowInput(false);
    }
  };

  const handleStartDateChange = (date: any) => {
    setValueDateTime({ ...valueDateTime, startDate: date.toISOString() });

    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date: any) => {
    setValueDateTime({ ...valueDateTime, endDate: date.toISOString() });

    setSelectedEndDate(date);
  };

  useEffect(() => {
    if (
      filter === "period" &&
      valueDateTime.startDate !== "" &&
      valueDateTime.endDate !== ""
    ) {
      ordersService
        .getDashbordSalesByCategory(
          filter,
          valueDateTime.startDate,
          valueDateTime.endDate
        )
        .then((res) => {
          if (res?.status_code == 200) {
            setRowDataDisplay(res?.result);
          }
        });
    } else if (filter !== "period") {
      ordersService.getDashbordSalesByCategory(filter).then((res) => {
        if (res?.status_code == 200) {
          setRowDataDisplay(res?.result);
        }
      });
    }
  }, [filter, selectedEndDate]);

  return (
    <Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={16}>
          <Grid item xs={1}></Grid>
          <Grid item xs={14}>
            <Box
              display="flex"
              justifyContent="start"
              flexDirection="row"
              alignItems="center"
              alignContent="center"
            >
              <p className="titlePages">ยอดขายแบ่งตามหมวดหมู่</p>
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
              alignContent="center"
              marginY={2}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                {menuTitle.map((anchor, index) => (
                  <Fragment key={anchor.title}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <Button
                        sx={{
                          fontSize: "1.2rem",
                          marginX: "0.6rem",
                          paddingX: "1rem",
                          backgroundColor:
                            activeIndex === index ? "#b1a5a5" : "initial",
                          color: "black",
                        }}
                        onClick={() => handleButtonClick(index, anchor.value)}
                      >
                        {anchor.title}
                      </Button>

                      {anchor.isInput && (
                        <div
                          style={{
                            display: "inline-flex",
                            width: "auto",
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="start date"
                              sx={{ width: "12rem", marginRight: "1rem" }}
                              // defaultValue={selectedStartDate}
                              defaultValue={selectedEndDate}
                              slotProps={{ textField: { size: "small" } }}
                              disabled={!isShowInput}
                              onChange={handleStartDateChange}
                            />
                            <DatePicker
                              label="end date"
                              sx={{ width: "12rem", margin: "0rem" }}
                              defaultValue={selectedEndDate}
                              // value={selectedEndDate}
                              slotProps={{ textField: { size: "small" } }}
                              disabled={!isShowInput}
                              onChange={handleEndDateChange}
                            />
                          </LocalizationProvider>
                        </div>
                      )}
                    </div>
                  </Fragment>
                ))}
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
              alignContent="center"
              marginY={2}
            >
              <Paper sx={{ width: "80%" }}>
                <TableContainer
                  component={Paper}
                  sx={{ maxHeight: "35rem", height: "auto", overflowY: "auto" }}
                >
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {/* <StyledTableCell
                          align="center"
                          sx={{ width: "15%" }}
                          className="orderHeaderTable"
                        >
                          ลำดับ
                        </StyledTableCell> */}
                        <StyledTableCell
                          align="center"
                          className="orderHeaderTable"
                        >
                          หมวดหมู่
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          className="orderHeaderTable"
                        >
                          ยอดขาย
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          className="orderHeaderTable"
                        >
                          ออเดอร์
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          className="orderHeaderTable"
                        >
                          ยอดขายเฉลี่ย/ออเดอร์
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rowDataDisplay?.map((row, index) => (
                        <StyledTableRow key={(index + 1).toString()}>
                          {/* <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {(index + 1).toString()}
                          </StyledTableCell> */}
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {row.categoryname ? row.categoryname : "-"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.totalamount ? row.totalamount : "-"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.ordersamount ? row.ordersamount : "-"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.averageSales ? row.averageSales : "-"}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
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

export default SalesCategory;
