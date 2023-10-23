import { Box } from "@mui/joy";
import { NextPage } from "next";
import classec from "./order-product-profile.module.css";
import { useEffect } from "react";

interface OrderProfileProps {
  pathPicture: string;
  productName: string;
  productDetail: string;
  ordersAmount: number;
  productPrice: number;
}

const OrderProductProfile: NextPage<OrderProfileProps> = ({
  pathPicture,
  productName,
  productDetail,
  ordersAmount,
  productPrice,
}) => {
  // useEffect(() => {}, [
  //   pathPicture,
  //   productName,
  //   productDetail,
  //   ordersAmount,
  //   productPrice,
  // ]);
  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="row"
      alignItems="center"
    >
      <Box
        flexGrow={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
      >
        <img
          className={classec.imageProductOrderDetail}
          src={pathPicture}
          alt="รูปสินค้า"
          loading="lazy"
        />
        <div className={classec.contentText}>
          <h3>{productName}</h3>
          <p>{productDetail}</p>
        </div>
        <div className={classec.contentText}>
          <p
            style={{
              minWidth: "5rem",
            }}
          >
            x {ordersAmount}
          </p>
        </div>
        <div
          style={{ display: "flex", alignItems: "center" }}
          className={classec.contentText}
        >
          <p>{productPrice}</p>
          <span>&nbsp;</span>
          <p> บาท</p>
        </div>
      </Box>
    </Box>
  );
};

export default OrderProductProfile;
