import React, { useEffect, useState } from "react";
import {
  TextField,
  InputLabel,
  Grid,
  Container,
  FormControl,
  Box,
} from "@mui/material";
import classec from "./adding-product.module.css";
import { NextPage } from "next";
import { OptionsModel } from "@/common/models/options-interface";

interface AddingProductOptionProps {
  options: OptionsModel[];
  setOptions: React.Dispatch<React.SetStateAction<OptionsModel[]>>;
  handleSetProductAmount: () => void;
}

const AddingProductOption: NextPage<AddingProductOptionProps> = ({
  options,
  setOptions,
  handleSetProductAmount,
}) => {
  useEffect(() => {}, [options]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {options.map((option, index) => (
        <Box
          sx={{ display: "flex", flexDirection: "row", width: "100%" }}
          key={(index + 1).toString()}
        >
          <Box sx={{ width: "100%", marginX: "0.5rem" }}>
            <InputLabel className={classec.labelTitleContent}>
              option code
            </InputLabel>
            <FormControl
              fullWidth
              className={classec.selectAddressContent}
              size="small"
              required
            >
              <TextField
                label=""
                size="small"
                value={option.optionCode}
                className={classec.textFieldContent}
                disabled={true}
                inputProps={{ min: 0 }}
                onInput={(e) => {
                  const newValue = (e.target as HTMLInputElement).value;
                  const updatedOptions = [...options];
                  updatedOptions[index].optionCode = newValue;
                  setOptions(updatedOptions);
                }}
              />
            </FormControl>
          </Box>
          <Box sx={{ width: "100%", marginX: "0.5rem" }}>
            <InputLabel className={classec.labelTitleContent}>
              option name
            </InputLabel>
            <FormControl
              fullWidth
              className={classec.selectAddressContent}
              size="small"
              required
            >
              <TextField
                label=""
                size="small"
                // defaultValue={option.optionName}
                value={option.optionName}
                className={classec.textFieldContent}
                required
                inputProps={{ min: 0 }}
                onInput={(e) => {
                  const newValue = (e.target as HTMLInputElement).value;
                  const updatedOptions = [...options];
                  updatedOptions[index].optionName = newValue;
                  setOptions(updatedOptions);
                }}
              />
            </FormControl>
          </Box>
          <Box sx={{ width: "100%", marginX: "0.5rem" }}>
            <InputLabel className={classec.labelTitleContent}>
              amount
            </InputLabel>
            <FormControl
              fullWidth
              className={classec.selectAddressContent}
              size="small"
              required
            >
              <TextField
                label=""
                size="small"
                value={option.optionsAmount}
                className={classec.textFieldContent}
                inputProps={{ min: 0 }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/\D+/g, "");

                  const updatedOptions = [...options];
                  updatedOptions[index].optionsAmount =
                    target.value === "" ? 0 : parseInt(target.value);
                  setOptions(updatedOptions);

                  handleSetProductAmount();
                }}
              />
            </FormControl>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AddingProductOption;
