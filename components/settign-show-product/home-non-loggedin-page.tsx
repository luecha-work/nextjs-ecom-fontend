import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";

import classec from "./setting-home-page.module.css";
import { ProductService } from "@/service/product.service";
import { AllProductModel } from "@/common/models/product-result.interface";
import { useRouter } from "next/router";
import { PreferencesShowProductsService } from "@/service/preferences-show-products.service";
import ConfirmProcessModal from "../ui/confirm-process-modal";

interface HomeNonLoggedinPageForm {
  id: string;
  isLoggedIn: boolean;
  formatSettingsShow: number;
  isMostSales: boolean;
  isLowestSales: boolean;
  productList: ProductList[] | null;
}

interface ProductList {
  productId: string;
}

interface FormErrors {
  productId?: string;
}

const initialProductList = [
  { productId: "" },
  { productId: "" },
  { productId: "" },
  { productId: "" },
  { productId: "" },
];

const HomeNonLoggedinPage: NextPage = () => {
  const router = useRouter();
  const productService = new ProductService();
  const preferencesShowProductsService = new PreferencesShowProductsService();
  const [preferencesShowProductsForm, setPreferencesShowProductsForm] =
    useState<HomeNonLoggedinPageForm>({
      id: "",
      isLoggedIn: false,
      formatSettingsShow: 2,
      isMostSales: true,
      isLowestSales: false,
      productList: null,
    });

  const [productData, setProductData] = useState<AllProductModel[]>();
  const [settingsShowByOrder, setSettingsShowByOrder] = useState<number>(0);
  const [productListCustomShow, setProductListCustomShow] =
    useState<ProductList[]>(initialProductList);
  const [textModal, setTextModal] = useState<string>("");
  const [colorIconModal, setColorIconModal] = useState<string>("");
  const [titleSelect, setTitleSelect] = useState<string>("สินค้าที่จะแสดงที่ ");

  const [formErrors, setFormErrors] = useState<FormErrors[]>([
    {
      productId: "",
    },
    {
      productId: "",
    },
    {
      productId: "",
    },
    {
      productId: "",
    },
    {
      productId: "",
    },
  ]);
  const [open, setOpen] = useState(false);

  const handleFormatSettingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newFormat: number = Number((event.target as HTMLInputElement).value);

    setPreferencesShowProductsForm({
      ...preferencesShowProductsForm,
      formatSettingsShow: newFormat,
    });
  };

  const validateForm = () => {
    let errors: FormErrors[] = [
      {
        productId: "",
      },
      {
        productId: "",
      },
      {
        productId: "",
      },
      {
        productId: "",
      },
      {
        productId: "",
      },
    ];
    let isValid = true;

    if (
      !productListCustomShow[0]?.productId &&
      preferencesShowProductsForm.formatSettingsShow === 1
    ) {
      errors[0].productId = "กรุณากรอกสินค้าที่จะแสดงที่1";

      isValid = false;
    }

    if (
      !productListCustomShow[1]?.productId &&
      preferencesShowProductsForm.formatSettingsShow === 1
    ) {
      errors[1].productId = "กรุณากรอกสินค้าที่จะแสดงที่2";

      isValid = false;
    }

    if (
      !productListCustomShow[2]?.productId &&
      preferencesShowProductsForm.formatSettingsShow === 1
    ) {
      errors[2].productId = "กรุณากรอกสินค้าที่จะแสดงที่3";

      isValid = false;
    }

    if (
      !productListCustomShow[3]?.productId &&
      preferencesShowProductsForm.formatSettingsShow === 1
    ) {
      errors[3].productId = "กรุณากรอกสินค้าที่จะแสดงที่4";

      isValid = false;
    }

    if (
      !productListCustomShow[4]?.productId &&
      preferencesShowProductsForm.formatSettingsShow === 1
    ) {
      errors[4].productId = "กรุณากรอกสินค้าที่จะแสดงที่5";

      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleShowByOrderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value: number = Number((event.target as HTMLInputElement).value);

    let isMostSales = value === 11;
    let isLowestSales = value === 22;

    setSettingsShowByOrder(value);

    setPreferencesShowProductsForm({
      ...preferencesShowProductsForm,
      isMostSales: isMostSales,
      isLowestSales: isLowestSales,
    });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const data = {
        formatSettingsShow: preferencesShowProductsForm.formatSettingsShow,
        isMostSales: preferencesShowProductsForm.isMostSales,
        isLowestSales: preferencesShowProductsForm.isLowestSales,
        productList:
          preferencesShowProductsForm.formatSettingsShow === 1
            ? productListCustomShow
            : null,
      };
      preferencesShowProductsService
        .update(preferencesShowProductsForm.id, data)
        .then((res) => {
          if (res?.status_code === "200") {
            setTextModal("ตั้งค่าหน้าแรกเว็บไซต์สำเร็จ");
            setColorIconModal("green");

            setOpen(true);
          } else {
            setColorIconModal("red");
            setTextModal("ตั้งค่าหน้าแรกเว็บไซต์ล้มเหลว");

            setOpen(true);
          }
        });
    }
  };

  const nextStepFunction = () => {
    setOpen(false);

    if (preferencesShowProductsForm.formatSettingsShow !== 1) {
      setProductListCustomShow(initialProductList);
    }

    router.push("/admin-market/warehouse/settign-show-product");
  };

  useEffect(() => {
    productService.findAllProducts().then((res) => {
      setProductData(res?.result);
    });

    preferencesShowProductsService.getFirstPageSetting().then((res) => {
      if (res?.result.isMostSales === true) {
        setSettingsShowByOrder(11);
      } else if (res?.result.isLowestSales === true) {
        setSettingsShowByOrder(22);
      }

      if (res?.result.formatSettingsShow === 1) {
        productService
          .findProductInListSettings({ productList: res?.result.productList })
          .then((res1) => {
            if (res1?.status_code === "200") {
              const updatedProductList = res1?.result.map((item: any) => ({
                productId: item.id,
              }));
              setProductListCustomShow(updatedProductList);
            }
          });
      }

      setPreferencesShowProductsForm({
        id: res?.result.id,
        isLoggedIn: res?.result.isLoggedIn,
        formatSettingsShow: res?.result.formatSettingsShow,
        isMostSales: res?.result.isMostSales,
        isLowestSales: res?.result.isLowestSales,
        productList: res?.result.productList,
      });
    });
  }, []);

  return (
    <Box className={classec.homeNonLoggedinPageBody}>
      <ConfirmProcessModal
        open={open}
        text={textModal}
        colorIcon={colorIconModal}
        nextStepFunction={nextStepFunction}
      />
      <FormControl>
        <RadioGroup
          aria-labelledby="home-non-loggedinpage-radio-buttons-group"
          name="home-non-loggedinpage-radio-buttons-group"
          value={preferencesShowProductsForm.formatSettingsShow}
          onChange={handleFormatSettingChange}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            display="flex"
            justifyContent="center"
            justifyItems="center"
          >
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyItems: "start",
                justifyContent: "start",
                paddingX: "5rem",
              }}
              item
              xs={6}
            >
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="กำหนดการแสดงสินค้าเอง"
              />
              <Box
                sx={{
                  paddingLeft: "2rem",
                }}
              >
                <p className={classec.textComment}>
                  *เลือกสินค่าที่ต้องการแสดง
                </p>

                {productListCustomShow.map((item, index) => (
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{ marginTop: "2rem" }}
                    key={(index + 1).toString()}
                    error={!!formErrors[index].productId}
                  >
                    <InputLabel id={`select-address-label-${index}`}>
                      {titleSelect + (index + 1).toString()}
                    </InputLabel>
                    <Select
                      labelId={`select-address-label-${index}`}
                      id={`select-address-${index}`}
                      label={`${titleSelect}${index + 1}`}
                      value={productListCustomShow[index].productId}
                      disabled={
                        preferencesShowProductsForm.formatSettingsShow !== 1
                      }
                      onChange={(e) => {
                        const newValue = e.target.value;

                        const newProductList = [...productListCustomShow];
                        newProductList[index] = { productId: newValue };

                        setProductListCustomShow(newProductList);
                      }}
                      error={!!formErrors[index].productId}
                    >
                      <MenuItem value="">
                        <em>ไม่มี</em>
                      </MenuItem>
                      {productData?.map((product, productIndex) => (
                        <MenuItem
                          key={(productIndex + 1).toString()}
                          value={product.id}
                        >
                          {product.productName}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors[index].productId && (
                      <FormHelperText>
                        {formErrors[index].productId}
                      </FormHelperText>
                    )}
                  </FormControl>
                ))}
              </Box>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyItems: "start",
                justifyContent: "start",
                paddingX: "5rem",
              }}
              item
              xs={6}
            >
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="กำหนดการแสดงสินค้าตามยอดขาย"
              />
              <Box
                sx={{
                  paddingLeft: "2rem",
                }}
              >
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={settingsShowByOrder}
                    onChange={handleShowByOrderChange}
                  >
                    <FormControlLabel
                      value={11}
                      control={<Radio />}
                      label="ยอดขายดีสุด(1-5)"
                      disabled={
                        preferencesShowProductsForm.formatSettingsShow !== 2
                      }
                    />
                    <FormControlLabel
                      value={22}
                      control={<Radio />}
                      label="ยอดขายต่ำสุด(1-5)"
                      disabled={
                        preferencesShowProductsForm.formatSettingsShow !== 2
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box sx={{ height: "5rem" }}></Box>
              <FormControlLabel
                value={3}
                control={<Radio />}
                label="กำหนดการแสดงสินค้าตามผู้ใช้"
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "start",
                  justifyItems: "start",
                  paddingLeft: "2rem",
                }}
              >
                <p className={classec.textComment}>
                  (การแสดงสินค้าจะขึ้นตามการเข้าชมและการค้นหา)
                </p>
              </Box>
            </Grid>
            <Box
              display="flex"
              justifyContent="center"
              justifyItems="center"
              flexDirection="row"
              width="50%"
              px={2}
              mt={10}
            >
              <Button
                className={classec.btnStyle}
                variant="contained"
                color="error"
                onClick={() =>
                  router.push("/admin-market/warehouse/managmant-product")
                }
              >
                ยกเลิก
              </Button>
              <Button
                className={classec.btnStyle}
                variant="contained"
                onClick={handleSubmit}
              >
                ตกลง
              </Button>
            </Box>
          </Grid>
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default HomeNonLoggedinPage;
