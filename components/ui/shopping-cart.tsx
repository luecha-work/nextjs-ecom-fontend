import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { NextPage } from "next";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Badge,
  ButtonGroup,
  Divider,
  Grid,
  IconButton,
  Toolbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux-store/store";
import { updateCartStatus } from "../../redux-store/actions/notifications";
import classec from "./shopping-cart.module.css";
import { CartService } from "@/service/cart.service";
import { ShoppingCartResult } from "@/common/models/shopping-cart.interface";
import { shadows } from "@mui/system";
import { useRouter } from "next/router";
import { OrdersService } from "@/service/order.service";

const ShoppingCartUI: NextPage = () => {
  const callOrderService = new OrdersService();
  const cartService = new CartService();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checkedAllItem, setCheckedAllItem] = useState(false);
  const [cartListData, setCartListData] = useState<ShoppingCartResult[]>([]);
  const [totalAmountShow, setTotalAmountShow] = useState<number>(0);

  const cartLength = useSelector(
    (state: RootState) => state.notifications.cart
  );

  const toggleDrawer = (open: boolean) => async () => {
    await callOrderService.cancelCreateOrder();
    getCartList();
    setIsDrawerOpen(open);
    setCheckedAllItem(false);
    setTotalAmountShow(0);
  };

  const getCartList = async (check: boolean = false) => {
    await cartService.getCartByUserId(false).then((res) => {
      if (res !== undefined) {
        setCartListData(res?.result);
        if (check) {
          dispatch(updateCartStatus(res?.result.length));
        }
      } else {
        setCartListData([]);
      }
    });
  };

  const handleDeleteCart = async (id: string) => {
    await cartService.deleteCart(id).then(async (res) => {
      if (res !== undefined) {
        await getCartList(true);
        await setTotalAmountShow(0);
        await setCheckedAllItem(false);
      }
    });
  };

  const handleSubmit = async () => {
    const cartPromises = cartListData.map(async (cart) => {
      const updateCart = await cartService.updateCart(cart.id.toString(), {
        amount: cart.amount,
        cfProduct: cart.cfProduct,
      });
      return updateCart;
    });

    await Promise.all(cartPromises);
    await getCartList(true);
    await setIsDrawerOpen(false);
    await setTotalAmountShow(0);

    router.push("/cart-order");
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedAllItem(checkedAllItem ? !checkedAllItem : checkedAllItem);

    let updateTotalAmountShow = 0;

    const updatedCartListData = [...cartListData];
    updatedCartListData[index].cfProduct =
      !updatedCartListData[index].cfProduct;

    setCartListData(updatedCartListData);

    for (let item of updatedCartListData) {
      if (item.cfProduct) {
        updateTotalAmountShow += item.amount * item.product.productPrice;
      }
    }

    setTotalAmountShow(updateTotalAmountShow);
  };

  const handleChangeAllItem = () => {
    const updatedCartListData = cartListData.map((item) => {
      return {
        ...item,
        cfProduct: !checkedAllItem,
      };
    });

    setCartListData(updatedCartListData);
    setCheckedAllItem(!checkedAllItem);

    if (!checkedAllItem) {
      let updateTotalAmount: number = 0;

      for (const item of cartListData) {
        updateTotalAmount += item.amount * item.product.productPrice;
      }
      setTotalAmountShow(updateTotalAmount);
    } else {
      setTotalAmountShow(0);
    }
  };

  const handleAddOne = (itemData: ShoppingCartResult, index: number) => {
    let updateTotalAmountShow = 0;
    const updatedCartListData = [...cartListData];
    if (itemData?.amount >= itemData.productsOption.optionsAmount) {
      console.error("ไม่สามารถเลือกได้เกินจำนวนทั้งหมด");
    } else {
      if (itemData.cfProduct) {
        updatedCartListData[index].amount += 1;
        setCartListData(updatedCartListData);
      }

      for (let item of cartListData) {
        if (item.cfProduct) {
          updateTotalAmountShow += item.amount * item.product.productPrice;
        }
      }

      setTotalAmountShow(updateTotalAmountShow);
    }
  };

  const handleRemoveOne = (itemData: ShoppingCartResult, index: number) => {
    let updateTotalAmountShow = 0;
    const updatedCartListData = [...cartListData];
    if (itemData.cfProduct) {
      if (itemData.amount > 1) {
        updatedCartListData[index].amount -= 1;
        setCartListData(updatedCartListData);
      }
    }

    for (let item of cartListData) {
      if (item.cfProduct) {
        updateTotalAmountShow += item.amount * item.product.productPrice;
      }
    }

    setTotalAmountShow(updateTotalAmountShow);
  };

  useEffect(() => {
    cartService.getCartByUserId(false).then((res) => {
      if (res !== undefined) {
        dispatch(updateCartStatus(res?.result?.length));
      } else {
        setCartListData([]);
      }
    });
  }, []);

  const list = () => (
    <>
      <Box
        sx={{
          width: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          overflow: "auto",
        }}
        role="presentation"
      >
        <Toolbar sx={{ marginY: "0.5rem" }}>
          <h1>PE-Shop Cart</h1>
        </Toolbar>
        <Divider sx={{ width: "100%" }} />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // borderTop: "1px solid #616161",
          }}
        >
          {cartListData !== undefined && cartListData.length > 0 ? (
            <div style={{ width: "100%" }}>
              {cartListData?.map((item, index) => (
                <FormControl
                  className={classec.formControlStyle}
                  key={(index + 1).toString()}
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.cfProduct}
                          onChange={() => handleCheckboxChange(index)}
                          name={`product_${index}`}
                        />
                      }
                      label={null}
                    />
                  </FormGroup>
                  <img
                    src={item.product.pathPicture[0].url}
                    alt={item.product.productName}
                    className={classec.imgStyle}
                  />
                  <Box
                    sx={{
                      width: "100%",
                      height: "110px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      justifyContent: "space-between",
                      marginLeft: "2rem",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      <Typography variant="subtitle1" mb={1}>
                        {item.product.productName}
                      </Typography>
                      <Typography variant="subtitle2" mb={1}>
                        {item.productsOption.optionName}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        width: "90%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2">
                        ชิ้นละ: {item.product.productPrice} บาท
                      </Typography>
                      <ButtonGroup
                        variant="contained"
                        aria-label="outlined primary button group"
                      >
                        <Button
                          key={`btn_remove_${index}`}
                          sx={{
                            width: "1.5rem",
                            height: "1.5rem",
                          }}
                          onClick={() => {
                            handleRemoveOne(item, index);
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: "1rem" }} />
                        </Button>
                        <div className={classec.amountOrderContent}>
                          {item.amount}
                        </div>
                        <Button
                          key={`btn_add_${index}`}
                          variant="contained"
                          sx={{
                            width: "1.5rem",
                            height: "1.5rem",
                          }}
                          onClick={() => {
                            handleAddOne(item, index);
                          }}
                        >
                          <AddIcon sx={{ fontSize: "1rem" }} />
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "1rem",
                    }}
                  >
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        handleDeleteCart(item.id);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </FormControl>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "70vh",
                color: "lightgray",
              }}
            >
              ไม่มีรายการสินค้าในตะกร้าในขณะนี้
            </div>
          )}
        </Box>
      </Box>
    </>
  );

  return (
    <div>
      <IconButton
        onClick={toggleDrawer(true)}
        size="large"
        aria-label="show 4 new mails"
        className={classec.shoppingIcon}
      >
        <Badge badgeContent={cartLength} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <SwipeableDrawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {list()}
        </div>
        <Divider sx={{ width: "100%" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          mt={4}
          mb={2}
        >
          <Grid container spacing={2} columns={16}>
            <Grid item xs={3}></Grid>
            <Grid
              item
              xs={5}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={
                      cartListData !== undefined && cartListData.length > 0
                        ? false
                        : true
                    }
                    checked={checkedAllItem}
                    onChange={handleChangeAllItem}
                    inputProps={{
                      "aria-label": "controlled",
                      color: "rgba(128, 128, 128, 0.5)",
                    }}
                  />
                }
                label="เลือกทั้งหมด"
              />
            </Grid>
            {cartListData !== undefined && cartListData.length > 0 ? (
              <Grid
                item
                xs={5}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                รวมทั้งหมด: {totalAmountShow} บาท
              </Grid>
            ) : (
              <Grid
                item
                xs={5}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(128, 128, 128, 0.5);",
                }}
              >
                รวมทั้งหมด: {totalAmountShow} บาท
              </Grid>
            )}
            <Grid item xs={3}></Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          mb={4}
        >
          <Grid container spacing={2} columns={16}>
            <Grid item xs={4}></Grid>
            <Grid
              item
              xs={8}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cartListData !== undefined && cartListData.length > 0 ? (
                <Button
                  style={{ width: "100%" }}
                  variant="contained"
                  disableElevation
                  onClick={handleSubmit}
                >
                  ยืนยันการสั่งชื้อ
                </Button>
              ) : (
                <Button
                  disabled
                  style={{ width: "100%" }}
                  variant="contained"
                  disableElevation
                  onClick={handleSubmit}
                >
                  ยืนยันการสั่งชื้อ
                </Button>
              )}
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Box>
      </SwipeableDrawer>
    </div>
  );
};

export default ShoppingCartUI;
