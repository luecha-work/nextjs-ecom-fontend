import { Box, Button, Grid, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CardDashbordContent from "@/components/dashbord/card-dashbord-content";
import dynamic from "next/dynamic";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import { OrdersService } from "@/service/order.service";
import CardLineChart from "@/components/dashbord/line-chart";
import { AnyARecord } from "dns";

// const MuiLineChart = dynamic(() => import("@/components/dashbord/line-chart"), {
//   ssr: false,
// });

const menuTitle = [
  { title: "วันนี้", value: "day", isInput: false },
  { title: "สัปดาห์", value: "week", isInput: false },
  { title: "เดือน", value: "month", isInput: false },
  { title: "ปี", value: "year", isInput: false },
  { title: "ระยะเวลา", value: "period", isInput: true },
];

interface LineChartModel {
  dataX: string[];
  dataY: number[];
}

interface DashbordContenModel {
  sumTotalAmount: number;
  sumOrderAmount: number;
  averageSales: string;
  averageData: {
    averageTotalAmount: number;
    averageOrderAmount: number;
    averageSales: number;
  };
}

const OverallSales: NextPage = () => {
  const ordersService = new OrdersService();

  let tradingResults = {
    rateDecrease: "ลดลง",
    increaseRate: "เพิ่มขึ้น",
  };

  const [dataLineChart, setDataLineChart] = useState<LineChartModel>({
    dataX: [],
    dataY: [],
  });
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const [valueDateTime, setValueDateTime] = useState({
    startDate: "",
    endDate: "",
  });

  const [isShowInput, setIsShowInput] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dataDisplayPeriod, setDataDisplayPeriod] = useState("วันนี้");
  const [filter, setFilter] = useState<string>("day");
  const [dashbordContentData, setDashbordContentData] =
    useState<DashbordContenModel>({
      sumTotalAmount: 0,
      sumOrderAmount: 0,
      averageSales: "",
      averageData: {
        averageTotalAmount: 0,
        averageOrderAmount: 0,
        averageSales: 0,
      },
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

    switch (index) {
      case 0: {
        setDataDisplayPeriod("จากหนึ่งวันนี้ก่อน");
        setValueDateTime({ startDate: "", endDate: "" });
        break;
      }
      case 1: {
        setDataDisplayPeriod("จากหนึ่งอาทิตย์ก่อน");
        setValueDateTime({ startDate: "", endDate: "" });
        break;
      }
      case 2: {
        setDataDisplayPeriod("จากหนึ่งเดือนนี้ก่อน");
        setValueDateTime({ startDate: "", endDate: "" });
        break;
      }
      case 3: {
        setDataDisplayPeriod("จากหนึ่งปีก่อน");
        setValueDateTime({ startDate: "", endDate: "" });
        break;
      }
      case 4: {
        setDataDisplayPeriod("จากระยะเวลาที่เลือก");
        break;
      }
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
        .getToDashbordSalesOverall(
          filter,
          valueDateTime.startDate,
          valueDateTime.endDate
        )
        .then((res) => {
          if (res?.status_code == 200) {
            setDataLineChart({
              dataX: res?.result[0]?.dataX,
              dataY: res?.result[0]?.dataY,
            });

            setDashbordContentData({
              sumTotalAmount: res?.result[0]?.sumTotalAmount,
              sumOrderAmount: res?.result[0]?.sumOrderAmount,
              averageSales: res?.result[0]?.averageSales,
              averageData: res?.result[1],
            });
          }
        });
    } else if (filter !== "period") {
      ordersService.getToDashbordSalesOverall(filter).then((res) => {
        if (res?.status_code == 200) {
          setDataLineChart({
            dataX: res?.result[0]?.dataX,
            dataY: res?.result[0]?.dataY,
          });

          setDashbordContentData({
            sumTotalAmount: res?.result[0]?.sumTotalAmount,
            sumOrderAmount: res?.result[0]?.sumOrderAmount,
            averageSales: res?.result[0]?.averageSales,
            averageData: res?.result[1],
          });
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
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
              alignContent="center"
            >
              <p className="titlePages">ภาพรวมยอดขาย</p>
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
              marginTop={5}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "90%",
                  height: "30rem",
                  padding: "2rem",
                  border: "2px solid #616161",
                  borderRadius: "0.5rem",
                }}
              >
                {/* <MuiLineChart /> */}
                <CardLineChart
                  filter={filter}
                  dataX={dataLineChart.dataX}
                  dataY={dataLineChart.dataY}
                />
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
              marginTop={5}
              marginBottom={5}
            >
              <Box display="flex" marginX="2rem">
                <CardDashbordContent
                  title="ยอดขาย"
                  grossSales={dashbordContentData.sumTotalAmount.toString()}
                  averageData={
                    dashbordContentData.averageData.averageTotalAmount >= 0
                      ? tradingResults.increaseRate
                      : tradingResults.rateDecrease
                  }
                  averageSales={
                    dashbordContentData.averageData.averageTotalAmount
                  }
                  dataDisplayPeriod={dataDisplayPeriod}
                  color={
                    dashbordContentData.averageData.averageTotalAmount >= 0
                      ? "green"
                      : "red"
                  }
                  icon1={
                    <AccountBalanceWalletOutlinedIcon
                      sx={{ color: "#448aff" }}
                    />
                  }
                  icon2={
                    dashbordContentData.averageData.averageTotalAmount >= 0 ? (
                      <ArrowUpwardOutlinedIcon
                        fontSize="small"
                        sx={{ color: "green" }}
                      />
                    ) : (
                      <ArrowDownwardOutlinedIcon
                        fontSize="small"
                        sx={{ color: "red" }}
                      />
                    )
                  }
                />
              </Box>
              <Box display="flex" marginX="2rem">
                <CardDashbordContent
                  title="ออเดอร์"
                  grossSales={dashbordContentData.sumOrderAmount.toString()}
                  averageData={
                    dashbordContentData.averageData.averageOrderAmount >= 0
                      ? tradingResults.increaseRate
                      : tradingResults.rateDecrease
                  }
                  averageSales={
                    dashbordContentData.averageData.averageOrderAmount
                  }
                  dataDisplayPeriod={dataDisplayPeriod}
                  color={
                    dashbordContentData.averageData.averageOrderAmount >= 0
                      ? "green"
                      : "red"
                  }
                  icon1={
                    <LocalGroceryStoreOutlinedIcon sx={{ color: "#448aff" }} />
                  }
                  icon2={
                    dashbordContentData.averageData.averageOrderAmount >= 0 ? (
                      <ArrowUpwardOutlinedIcon
                        fontSize="small"
                        sx={{ color: "green" }}
                      />
                    ) : (
                      <ArrowDownwardOutlinedIcon
                        fontSize="small"
                        sx={{ color: "red" }}
                      />
                    )
                  }
                />
              </Box>
              <Box display="flex" marginX="2rem">
                <CardDashbordContent
                  title="ยอดอขายเฉลี่ย/ออเดอร์"
                  grossSales={dashbordContentData.averageSales}
                  averageData={
                    dashbordContentData.averageData.averageSales >= 0
                      ? tradingResults.increaseRate
                      : tradingResults.rateDecrease
                  }
                  averageSales={dashbordContentData.averageData.averageSales}
                  dataDisplayPeriod={dataDisplayPeriod}
                  color={
                    dashbordContentData.averageData.averageSales >= 0
                      ? "green"
                      : "red"
                  }
                  icon1={<BarChartOutlinedIcon sx={{ color: "#448aff" }} />}
                  icon2={
                    dashbordContentData.averageData.averageSales >= 0 ? (
                      <ArrowUpwardOutlinedIcon
                        fontSize="small"
                        sx={{ color: "green" }}
                      />
                    ) : (
                      <ArrowDownwardOutlinedIcon
                        fontSize="small"
                        sx={{ color: "red" }}
                      />
                    )
                  }
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default OverallSales;
