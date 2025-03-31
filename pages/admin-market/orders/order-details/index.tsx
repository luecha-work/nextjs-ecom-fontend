import convertIsoToLocalDateTime from "@/common/class/convert-datetime-local";
import { OrderDetailModel } from "@/common/models/orders-result.interface";
import DetailsAtEnd from "@/components/order-detail/details-at-end";
import OrderProductProfile from "@/components/order-detail/order-product-profile";
import OrderTransfer from "@/components/order-detail/order-transfer";
import ButtonBack from "@/components/ui/button-back";
import { OrdersService } from "@/service/order.service";
import { Box, Grid } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrderDetails: NextPage = () => {
  const router = useRouter();
  const ordersService = new OrdersService();
  const [orderDetails, serOrderDetails] = useState<OrderDetailModel>();
  const [description, setDescripton] = useState<string>("");

  const { id } = router.query;

  const createDescription = () => {
    let detail;
    let orderCode = "-";
    let parcelNumber = "-";
    let transportCompany = "-";
    let orderDate = "-";
    let paymentDate = "-";
    let deliveryDate = "-";
    let parcelReceivedDate = "-";

    if (
      orderDetails?.transferDate !== null &&
      orderDetails?.transferDate !== undefined
    ) {
      const { formattedLocalDate, formattedLocalTime } =
        convertIsoToLocalDateTime(orderDetails?.transferDate.toString());

      paymentDate = formattedLocalDate;
    }

    if (
      orderDetails?.createAt !== null &&
      orderDetails?.createAt !== undefined
    ) {
      const { formattedLocalDate } = convertIsoToLocalDateTime(
        orderDetails?.createAt.toString()
      );

      orderDate = formattedLocalDate;
    }

    if (
      orderDetails?.parcelDelivery.deliveryDate !== null &&
      orderDetails?.parcelDelivery.deliveryDate !== undefined
    ) {
      const { formattedLocalDate, formattedLocalTime } =
        convertIsoToLocalDateTime(
          orderDetails?.parcelDelivery.deliveryDate.toString()
        );

      deliveryDate = formattedLocalDate;
    }

    if (
      orderDetails?.parcelDelivery.receivingParcelDate !== null &&
      orderDetails?.parcelDelivery.receivingParcelDate !== undefined
    ) {
      const { formattedLocalDate, formattedLocalTime } =
        convertIsoToLocalDateTime(
          orderDetails?.parcelDelivery.receivingParcelDate.toString()
        );

      parcelReceivedDate = formattedLocalDate;
    }

    if (
      orderDetails?.orderCode !== null &&
      orderDetails?.orderCode !== "" &&
      orderDetails?.orderCode !== undefined
    ) {
      orderCode = orderDetails?.orderCode;
    }

    if (
      orderDetails?.parcelDelivery.parcelNumber !== null &&
      orderDetails?.parcelDelivery.parcelNumber !== "" &&
      orderDetails?.parcelDelivery.parcelNumber !== undefined
    ) {
      parcelNumber = orderDetails?.parcelDelivery.parcelNumber;
    }

    if (
      orderDetails?.parcelDelivery.transportCompany !== null &&
      orderDetails?.parcelDelivery.transportCompany !== "" &&
      orderDetails?.parcelDelivery.transportCompany !== undefined
    ) {
      transportCompany = orderDetails?.parcelDelivery.transportCompany;
    }

    detail = `หมายเลขคำสั่งซื้อ : ${orderCode}\n`;
    detail += `เลขพัสดุ : ${parcelNumber}\n`;
    detail += `ขนส่ง : ${transportCompany}\n`;
    detail += `วันที่สั่งซื้อ : ${orderDate}\n`;
    detail += `วันที่ชำระเงิน : ${paymentDate}\n`;
    detail += `วันที่ที่จัดส่ง : ${deliveryDate}\n`;
    detail += `วันที่ที่ได้รับพัสดุ : ${parcelReceivedDate}`;

    setDescripton(detail);
  };

  useEffect(() => {
    if (typeof id === "string") {
      ordersService.getOrderById(id).then((req) => {
        serOrderDetails(req?.result);

        createDescription();
      });
    }
  }, [description, id]);
  return (
    <Box sx={{ flexGrow: 1 }}>
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
      <Grid container spacing={2} columns={16}>
        <Grid item xs={2}></Grid>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="row"
            alignItems="center"
          >
            <Box flexGrow={0}>
              <p className="titlePages">รายละเอียดคำสั่งซื้อ</p>
            </Box>
          </Box>

          <div>
            <OrderProductProfile
              pathPicture={orderDetails?.products?.pathPicture[0]?.url ?? ""}
              productName={orderDetails?.products.productName ?? ""}
              productDetail={orderDetails?.products.productDetail ?? ""}
              ordersAmount={orderDetails?.ordersAmount ?? 0}
              productPrice={orderDetails?.products.productPrice ?? 0}
            />
          </div>

          <div style={{ marginTop: "2rem" }}>
            <OrderTransfer
              totalAmount={orderDetails?.totalAmount ?? 0}
              paymentName={orderDetails?.paymentType.paymentName ?? "-"}
              transferDate={orderDetails?.transferDate ?? ""}
            />
          </div>
          <div style={{ marginTop: "2rem" }}>
            <DetailsAtEnd
              address={orderDetails?.address ?? ""}
              detail={description}
              slipPath={orderDetails?.slipPath ?? ""}
            />
          </div>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;
