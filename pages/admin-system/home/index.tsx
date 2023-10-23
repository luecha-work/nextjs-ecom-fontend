import * as React from "react";
import { Box, CircularProgress, Container, Grid, styled } from "@mui/material";
import { useEffect, useState } from "react";
import User from "../crud-user";
import Product from "../crud-product";
import ProductOrder from "../crud-product-order";
import Market from "../crud-category";
import PaymentType from "../crud-payment-type";
import { useStore } from "@/common/class/stateManagement";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function HomePage() {
  const [paged, setPaged] = useState<string>("");
  const isLoading_status = useStore((state) => state.spin_status);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPaged;
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const page = [
    {
      label: "ข้อมูลส่วนบุคคล",
      click: "User",
    },
    {
      label: "ร้านค้า",
      click: "Market",
    },
    {
      label: "สินค้าทั้งหมด",
      click: "Product",
    },
    {
      label: "ประวัติการสั่งซื้อ",
      click: "ProductOrder",
    },
    {
      label: "ประเภทการจ่ายเงิน",
      click: "PaymentType",
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid xs={2}>
        <MenuList>
          {page.map((item, index) => (
            <>
              <MenuItem
                onClick={() => {
                  setPaged(item.click);
                }}
              >
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
              <Divider />
            </>
          ))}
        </MenuList>
      </Grid>
      <Grid xs={1}></Grid>

      <Grid xs={9}>
        {isLoading ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "50vh",
                fontSize: "1rem",
                color: "#9b9090",
              }}
            >
              <CircularProgress size={60} disableShrink={isLoading_status} />
            </Box>
          </>
        ) : (
          <>
            <Container maxWidth="xl" sx={{ marginTop: "20px" }}>
              <Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }}>
                {paged === "User" && <User />}
                {paged === "Product" && <Product />}
                {paged === "Market" && <Market />}
                {paged === "ProductOrder" && <ProductOrder />}
                {paged === "PaymentType" && <PaymentType />}
              </Box>
            </Container>
          </>
        )}
      </Grid>
    </Grid>
  );
}
