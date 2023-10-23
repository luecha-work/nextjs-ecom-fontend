import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { NextPage } from "next";

import classec from "./adding-product.module.css";
import { useEffect, useState } from "react";
import { categoryResult } from "@/common/models/category-result.interface";
import { Textarea } from "@mui/joy";
import { CategoryService } from "@/service/category.service";
import {
  AddingProductModel,
  FormErrors,
} from "@/common/models/product-result.interface";

interface AddingProductDetailProps {
  addingProductForm: AddingProductModel;
  setAddingProductForm: React.Dispatch<
    React.SetStateAction<AddingProductModel>
  >;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
  formErrors: FormErrors;
  defultCategory: string;
}

const AddingProductDetail: NextPage<AddingProductDetailProps> = ({
  addingProductForm,
  setAddingProductForm,
  setCategoryId,
  formErrors,
  defultCategory,
}) => {
  const categoryService = new CategoryService();

  const [categoryData, setCategoryData] = useState<
    categoryResult[] | undefined
  >();
  const [categorySelected, setCategorySelected] = useState("");

  useEffect(() => {
    setCategorySelected(defultCategory);
    categoryService.getAllCategory().then((res) => {
      setCategoryData(res?.result);
    });
  }, [defultCategory]);

  return (
    <div
      style={{
        display: "block",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box>
        <InputLabel className={classec.labelTitleContent}>
          ชื่อสินค้า
        </InputLabel>
        <FormControl
          fullWidth
          className={classec.selectAddressContent}
          size="small"
          required
          error={!!formErrors.productName}
        >
          <TextField
            fullWidth
            label=""
            value={addingProductForm.productName}
            size="small"
            className={classec.textFieldContent}
            onChange={(e) =>
              setAddingProductForm({
                ...addingProductForm,
                productName: e.target.value,
              })
            }
            error={!!formErrors.productName}
          />
          {formErrors.productName && (
            <FormHelperText>{formErrors.productName}</FormHelperText>
          )}
        </FormControl>
      </Box>
      <Box>
        <InputLabel className={classec.labelTitleContent}>
          รหัสสินค้า
        </InputLabel>
        <FormControl
          fullWidth
          className={classec.selectAddressContent}
          size="small"
        >
          <TextField
            fullWidth
            label=""
            value={addingProductForm.productCode}
            size="small"
            disabled
            className={classec.textFieldContent}
            onChange={(e) =>
              setAddingProductForm({
                ...addingProductForm,
                productName: e.target.value,
              })
            }
          />
        </FormControl>
      </Box>
      <Box>
        <InputLabel className={classec.labelTitleContent}>หมวดหมู่</InputLabel>
        <FormControl
          fullWidth
          className={classec.selectAddressContent}
          size="small"
          required
          error={!!formErrors.productCategory}
        >
          <Select
            value={categorySelected}
            className={classec.textFieldContent}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            onChange={(event) => {
              const selectedValue = event.target.value;
              const selectedItem = categoryData?.find(
                (item) => item.categoryCode === selectedValue
              );

              setCategorySelected(event.target.value);
              setCategoryId(selectedItem?.id ?? "");
            }}
          >
            <MenuItem disabled value="">
              <em>เลือกหมวดหมู่สินค้า</em>
            </MenuItem>
            {categoryData?.map((item) => (
              <MenuItem key={item?.categoryCode} value={item?.categoryCode}>
                {item?.categoryName}
              </MenuItem>
            ))}
          </Select>
          {formErrors.productCategory && (
            <FormHelperText>{formErrors.productCategory}</FormHelperText>
          )}
        </FormControl>
      </Box>

      <Box>
        <InputLabel className={classec.labelTitleContent}>
          คีย์เวิร์ด
        </InputLabel>
        <FormControl
          fullWidth
          className={classec.selectAddressContent}
          size="small"
          required
          error={!!formErrors.keyword}
        >
          <TextField
            label=""
            value={addingProductForm.keyword}
            size="small"
            className={classec.textFieldContent}
            required
            onChange={(e) =>
              setAddingProductForm({
                ...addingProductForm,
                keyword: e.target.value,
              })
            }
            error={!!formErrors.keyword}
          />
          {formErrors.keyword && (
            <FormHelperText>{formErrors.keyword}</FormHelperText>
          )}
        </FormControl>
      </Box>

      <Box>
        <InputLabel className={classec.labelTitleContent}>
          รายละเอียด
        </InputLabel>
        <FormControl
          fullWidth
          className={classec.selectAddressContent}
          size="small"
          required
          error={!!formErrors.productDetail}
        >
          <Textarea
            defaultValue={addingProductForm.productDetail}
            minRows={2}
            maxRows={4}
            className={classec.textarea}
            required
            onChange={(e) =>
              setAddingProductForm({
                ...addingProductForm,
                productDetail: e.target.value,
              })
            }
            error={!!formErrors.productDetail}
          />
          {formErrors.productDetail && (
            <FormHelperText>{formErrors.productDetail}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </div>
  );
};

export default AddingProductDetail;
