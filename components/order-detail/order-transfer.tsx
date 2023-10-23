import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";

import classec from "./order-transfer.module.css";
import { NextPage } from "next";
import convertIsoToLocalDateTime from "@/common/class/convert-datetime-local";
import { useEffect } from "react";

interface OrderTransferProps {
  totalAmount: number;
  paymentName: string;
  transferDate: Date | string;
}

const OrderTransfer: NextPage<OrderTransferProps> = ({
  totalAmount,
  paymentName,
  transferDate,
}) => {
  const { formattedLocalDate, formattedLocalTime } = convertIsoToLocalDateTime(
    transferDate.toString()
  );

  // useEffect(() => {}, [totalAmount, paymentName, transferDate]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="row"
      alignItems="center"
    >
      <Card sx={{ minWidth: 275, width: "60%" }}>
        <CardHeader
          title="การโอนเงิน"
          style={{
            textAlign: "center",
          }}
        ></CardHeader>
        <CardContent
          style={{
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <Box>
            <Grid container spacing={1} columns={16}>
              <Grid item xs={2}></Grid>
              <Grid item xs={7}>
                <Box
                  flexGrow={0}
                  display="flex"
                  justifyContent="start"
                  flexDirection="row"
                  alignItems="center"
                >
                  <p className={classec.textContent}>
                    จำนวนเงินที่โอนเข้าบัญชี
                  </p>
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Box flexGrow={0}>
                  <p className={classec.textContentValue}>{totalAmount}</p>
                </Box>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>

            <Grid container spacing={1} columns={16}>
              <Grid item xs={2}></Grid>
              <Grid item xs={7}>
                <Box
                  flexGrow={0}
                  display="flex"
                  justifyContent="start"
                  flexDirection="row"
                  alignItems="center"
                >
                  <p className={classec.textContent}>วันที่โอนเงิน</p>
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Box flexGrow={0}>
                  <p className={classec.textContentValue}>
                    {formattedLocalDate !== "NaN/NaN/NaN"
                      ? formattedLocalDate
                      : "-"}
                  </p>
                </Box>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>

            <Grid container spacing={1} columns={16}>
              <Grid item xs={2}></Grid>
              <Grid item xs={7}>
                <Box
                  flexGrow={0}
                  display="flex"
                  justifyContent="start"
                  flexDirection="row"
                  alignItems="center"
                >
                  <p className={classec.textContent}>เวลา</p>
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Box flexGrow={0}>
                  <p className={classec.textContentValue}>
                    {formattedLocalTime !== "NaN:NaN:NaN"
                      ? formattedLocalTime
                      : "-"}
                  </p>
                </Box>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>
            <Grid container spacing={1} columns={16}>
              <Grid item xs={2}></Grid>
              <Grid item xs={7}>
                <Box
                  flexGrow={0}
                  display="flex"
                  justifyContent="start"
                  flexDirection="row"
                  alignItems="center"
                >
                  <p className={classec.textContent}>ช่องทางการโอน</p>
                </Box>
              </Grid>
              <Grid item xs={5}>
                <Box flexGrow={0}>
                  <p className={classec.textContentValue}>
                    {paymentName || "-"}
                  </p>
                </Box>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderTransfer;
