import HomeLoggedinPage from "@/components/settign-show-product/home-loggedin-page";
import HomeNonLoggedinPage from "@/components/settign-show-product/home-non-loggedin-page";
import { Box, Button, Grid } from "@mui/material";
import { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";

const menuTitleSettingHomePages = [
  { title: "หน้าแรกเว็บไซต์", component: <HomeNonLoggedinPage /> },
  { title: "หน้าสินค้าแนะนำ", component: <HomeLoggedinPage /> },
];

const SettignShowProduct: NextPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const [menuNavItem, setMenuNavItem] = useState(menuTitleSettingHomePages);

  useEffect(() => {}, [menuNavItem]);

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
              <p className="titlePages">ตั้งค่าแสดงสินค้า</p>
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
                {menuNavItem.map((anchor, index) => (
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
                        onClick={() => {
                          setActiveIndex(index);
                        }}
                      >
                        {anchor.title}
                      </Button>
                    </div>
                  </Fragment>
                ))}
              </Box>
            </Box>
            <Box
              display="block"
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
              marginTop={2}
              padding={0}
            >
              {menuTitleSettingHomePages[activeIndex].component}
            </Box>
            {/* <Grid item xs={1}></Grid> */}
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default SettignShowProduct;
