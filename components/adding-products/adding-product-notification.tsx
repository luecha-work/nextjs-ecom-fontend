import React, { useEffect, useState } from "react";
import {
  TextField,
  InputLabel,
  Grid,
  Container,
  FormControl,
  FormHelperText,
} from "@mui/material";
import classec from "./adding-product.module.css";
import { NextPage } from "next";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  AddingProductModel,
  FormErrors,
} from "@/common/models/product-result.interface";

interface AddingProductNotificationProps {
  addingProductForm: AddingProductModel;
  setAddingProductForm: React.Dispatch<
    React.SetStateAction<AddingProductModel>
  >;
  formErrors: FormErrors;
}

const AddingProductNotification: NextPage<AddingProductNotificationProps> = ({
  addingProductForm,
  setAddingProductForm,
  formErrors,
}) => {
  const handleDateOfBirthChange = (date: any) => {
    setAddingProductForm({
      ...addingProductForm,
      notifyExpirationDate: date.toISOString(),
    });
  };

  useEffect(() => {
    // console.log(`AddingProductNotification: ${addingProductForm.productPrice}`);
    // console.log(
    //   `AddingProductNotification: ${typeof addingProductForm.productPrice}`
    // );
    // console.log(
    //   `AddingProductNotification: ${
    //     addingProductForm.productPrice === 0 ||
    //     addingProductForm.productPrice === null
    //   }`
    // );
  }, [addingProductForm]);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <InputLabel
            className={classec.labelTitleContent}
            htmlFor="input-price"
          >
            ราคาสินค้า
          </InputLabel>
          <FormControl
            fullWidth
            className={classec.selectAddressContent}
            size="small"
            required
            error={!!formErrors.productPrice}
          >
            <TextField
              label=""
              id="input-price"
              size="small"
              value={addingProductForm.productPrice}
              className={classec.textFieldContent}
              required
              inputProps={{ min: 0 }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;

                target.value = target.value.replace(/\D+/g, "");

                setAddingProductForm({
                  ...addingProductForm,
                  productPrice:
                    target.value === "" ? 0 : parseInt(target.value),
                });
              }}
              error={!!formErrors.productPrice}
            />
            {formErrors.productPrice && (
              <FormHelperText>{formErrors.productPrice}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <InputLabel className={classec.labelTitleContent}>ต้นทุน</InputLabel>
          <FormControl
            fullWidth
            className={classec.selectAddressContent}
            size="small"
            required
            error={!!formErrors.productCost}
          >
            <TextField
              label=""
              size="small"
              value={addingProductForm.productCost}
              className={classec.textFieldContent}
              required
              inputProps={{ min: 0 }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/\D+/g, "");

                setAddingProductForm({
                  ...addingProductForm,
                  productCost: target.value === "" ? 0 : parseInt(target.value),
                });
              }}
              error={!!formErrors.productCost}
            />
            {formErrors.productCost && (
              <FormHelperText>{formErrors.productCost}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <InputLabel className={classec.labelTitleContent}>คลัง</InputLabel>
          <FormControl
            fullWidth
            className={classec.selectAddressContent}
            size="small"
            error={!!formErrors.productAmount}
          >
            <TextField
              label=""
              size="small"
              value={addingProductForm.productAmount}
              className={classec.textFieldContent}
              disabled={true}
              inputProps={{ min: 0 }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/\D+/g, "");

                setAddingProductForm({
                  ...addingProductForm,
                  productAmount:
                    target.value === "" ? 0 : parseInt(target.value),
                });
              }}
              error={!!formErrors.productAmount}
            />
            {formErrors.productAmount && (
              <FormHelperText>{formErrors.productAmount}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <InputLabel className={classec.labelTitleContent}>
            น้ำหนัก(กรัม)
          </InputLabel>

          <TextField
            label=""
            value={addingProductForm.productWeight}
            size="small"
            className={classec.textFieldContent}
            onChange={(e) => {
              // const target = e.target as HTMLInputElement;
              // target.value = target.value.replace(/\D+/g, "");
              const input = e.target.value;

              const validInput = input.replace(/[^0-9.]/g, "");

              setAddingProductForm({
                ...addingProductForm,
                productWeight: parseFloat(validInput) || 0,
              });
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <InputLabel className={classec.labelTitleContent}>
            วันผลิต(ถ้ามี)
          </InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className={classec.datePicker}
              value={
                addingProductForm.productionDate === undefined ||
                addingProductForm.productionDate === null
                  ? null
                  : dayjs(addingProductForm.productionDate?.toString())
              }
              slotProps={{ textField: { size: "small" } }}
              onChange={(date: any) => {
                setAddingProductForm({
                  ...addingProductForm,
                  productionDate: date.toISOString(),
                });
              }}
            />
          </LocalizationProvider>
          {/* <TextField
            label=""
            value={addingProductForm.productionDate}
            size="small"
            className={classec.textFieldContent}
            required
            onChange={(e) =>
              setAddingProductForm({
                ...addingProductForm,
                productionDate: e.target.value,
              })
            }
          /> */}
        </Grid>
        <Grid item xs={4}>
          <InputLabel className={classec.labelTitleContent}>
            วันหมดอายุ(ถ้ามี)
          </InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className={classec.datePicker}
              value={
                addingProductForm.expirationDate === undefined ||
                addingProductForm.expirationDate === null
                  ? null
                  : dayjs(addingProductForm.expirationDate?.toString())
              }
              slotProps={{ textField: { size: "small" } }}
              onChange={(date: any) => {
                setAddingProductForm({
                  ...addingProductForm,
                  expirationDate: date.toISOString(),
                });
              }}
            />
          </LocalizationProvider>
          {/* <TextField
            label=""
            value={addingProductForm.expirationDate}
            size="small"
            className={classec.textFieldContent}
            required
            onChange={(e) =>
              setAddingProductForm({
                ...addingProductForm,
                expirationDate: e.target.value,
              })
            }
          /> */}
        </Grid>
        <Grid item xs={6}>
          <InputLabel className={classec.labelTitleContent}>
            แจ้งเตือนสินค้าไกล้หมด(ชิ้น)
          </InputLabel>
          <TextField
            label=""
            value={addingProductForm.outStockNotification}
            size="small"
            className={classec.textFieldContent}
            required
            inputProps={{ min: 0 }}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              let newValue;
              target.value = target.value.replace(/\D+/g, "");

              newValue = parseInt(target.value);

              setAddingProductForm({
                ...addingProductForm,
                outStockNotification: newValue || 0,
              });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel className={classec.labelTitleContent}>
            แจ้งเตือนวันที่ไกล้หมดอายุของสินค้า
          </InputLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className={classec.datePicker}
              value={
                addingProductForm.notifyExpirationDate === undefined ||
                addingProductForm.notifyExpirationDate === null
                  ? null
                  : dayjs(addingProductForm.notifyExpirationDate?.toString())
              }
              slotProps={{ textField: { size: "small" } }}
              onChange={(date: any) => {
                setAddingProductForm({
                  ...addingProductForm,
                  notifyExpirationDate: date.toISOString(),
                });
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddingProductNotification;
