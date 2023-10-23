import { generateRandomCode } from "@/common/class/random-code";
import {
  AddingProductModel,
  FormErrors,
} from "@/common/models/product-result.interface";
import AddingProductDetail from "@/components/adding-products/adding-product-detail";
import AddingProductImage from "@/components/adding-products/adding-product-image";
import AddingProductNotification from "@/components/adding-products/adding-product-notification";
import AddingProductOption from "@/components/adding-products/adding-product-option";
import ButtonBack from "@/components/ui/button-back";
import { ProductService } from "@/service/product.service";
import { Box, Button, Grid, IconButton, Stack } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { OptionsModel } from "@/common/models/options-interface";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { OptionService } from "@/service/option.service";
import ConfirmProcessModal from "@/components/ui/confirm-process-modal";

const AddingProducts: NextPage = () => {
  const router = useRouter();
  const productService = new ProductService();
  const optionService = new OptionService();

  const { id } = router.query;

  const [categoryId, setCategoryId] = useState<string>("");
  const [defultCategory, setDefultCategory] = useState<string>("");
  const [imageList, setImageList] = useState<FormData[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [addingProductForm, setAddingProductForm] =
    useState<AddingProductModel>({
      productName: "",
      productCode: "",
      productDetail: "",
      keyword: "",
      productPrice: 0,
      productAmount: 0,
      pathPicture: [],
      active: true,
      productWeight: 0,
      productCost: 0,
      productionDate: null,
      expirationDate: null,
      outStockNotification: 0,
      notifyExpirationDate: null,
    });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    productName: "",
    productDetail: "",
    keyword: "",
    productPrice: "",
    productAmount: "",
    productCost: "",
    productCategory: "",
  });

  const [options, setOptions] = useState<OptionsModel[]>([]);
  const [open, setOpen] = useState(false);
  const [textModal, setTextModal] = useState<string>("");
  const [colorIconModal, setColorIconModal] = useState<string>("");
  const [indexImageChange, setIndexImageChange] = useState<number[]>();

  const handleSetProductAmount = () => {
    let newProductAmount: number = 0;
    options.forEach((option) => {
      newProductAmount += option.optionsAmount;
    });

    setAddingProductForm({
      ...addingProductForm,
      productAmount: newProductAmount,
    });
  };

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        id: "",
        optionName: "",
        optionCode: generateRandomCode("POT"),
        optionsAmount: 0,
      },
    ]);
  };

  const handlePopOption = () => {
    if (options.length > 1) {
      const updatedOptions = options.slice(0, options.length - 1);
      setOptions(updatedOptions);
    }
  };

  useEffect(() => {
    if (id !== undefined && id !== "") {
      productService.getProductById(id.toString()).then((res) => {
        setCategoryId(res?.result.category.id);
        setDefultCategory(res?.result.category.categoryCode);

        setAddingProductForm({
          productName: res?.result.productName,
          productCode: res?.result.productCode,
          productDetail: res?.result.productDetail,
          keyword: res?.result.keyword,
          productPrice: res?.result.productPrice,
          productAmount: res?.result.productAmount,
          pathPicture: res?.result.pathPicture,
          active: res?.result.active,
          productWeight: res?.result.productWeight,
          productCost: res?.result.productCost,
          productionDate: res?.result.productionDate,
          expirationDate: res?.result.expirationDate,
          outStockNotification: res?.result.outStockNotification,
          notifyExpirationDate: res?.result.notifyExpirationDate,
        });

        const optionsResult: OptionsModel[] = res?.result.productsOption;

        const selectedOptions = optionsResult.map((option) => ({
          id: option.id,
          optionCode: option.optionCode,
          optionName: option.optionName,
          optionsAmount: option.optionsAmount,
        }));

        setOptions(selectedOptions);
      });
    } else {
      setAddingProductForm({
        ...addingProductForm,
        productCode: generateRandomCode("PD"),
      });

      setOptions([
        {
          id: "",
          optionName: "",
          optionCode: generateRandomCode("POT"),
          optionsAmount: 0,
        },
      ]);
    }
  }, [id]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    let uploadedImageUrls: any[] = [];

    try {
      if (validateForm()) {
        if (id !== undefined && id !== "") {
          const optionsPromises = options.map(async (option) => {
            const updateOption = await optionService.update(
              option.id.toString(),
              {
                optionName: option.optionName,
                optionCode: option.optionCode,
                optionsAmount: option.optionsAmount,
              }
            );
            return updateOption;
          });

          await Promise.all(optionsPromises);

          const updateImageUrls = await productImageChange();

          const dataToCreateProduct = {
            ...addingProductForm,
            pathPicture: updateImageUrls,
          };

          await productService
            .update(id.toString(), dataToCreateProduct)
            .then((res) => {
              if (res?.status_code === "200") {
                setTextModal("แก้ไขข้อมูลสินค้าสำเร็จ");
                setColorIconModal("green");
                setOpen(true);
              } else {
                setTextModal("แก้ไขข้อมูลสินค้าล้มเหลว");
                setColorIconModal("red");
                setOpen(true);
              }
            });
        } else {
          const uploadPromises = imageList.map(uploadingImage);
          const responses = await Promise.all(uploadPromises);

          for (const response of responses) {
            uploadedImageUrls.push({ url: response.url });
          }

          const dataToCreateProduct = {
            ...addingProductForm,
            pathPicture: uploadedImageUrls,
            options: options,
          };

          await productService
            .create(dataToCreateProduct, categoryId)
            .then((res) => {
              if (res?.status_code === "201") {
                setTextModal("เพิ่มสินค้าสำเร็จ");
                setColorIconModal("green");

                setOpen(true);
              } else {
                setTextModal("เพิ่มสินค้าล้มเหลว");
                setColorIconModal("red");

                setOpen(true);
              }
            });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const productImageChange = async () => {
    const uploadedImageUrls: any[] = addingProductForm.pathPicture;

    if (selectedImages.length > 0) {
      const uploadPromises = imageList.map(uploadingImage);
      const responses = await Promise.all(uploadPromises);

      if (indexImageChange && indexImageChange.length > 0) {
        for (const index of indexImageChange) {
          if (index >= 0 && index < uploadedImageUrls.length) {
            // Remove data at the specified index using splice
            uploadedImageUrls.splice(index, 1);
          }
        }
      }

      for (const response of responses) {
        uploadedImageUrls.push({ url: response.url });
      }
    }

    return uploadedImageUrls;
  };

  const uploadingImage = async (data: any) => {
    try {
      const response = await productService.uploadingImage(data);
      return response;
    } catch (error) {
      console.error("Upload error:", error);
      return {};
    }
  };

  const validateForm = () => {
    let errors: FormErrors = {};
    let isValid = true;

    if (!addingProductForm.productName) {
      errors.productName = "กรุณากรอกชื่อสินค้า";

      isValid = false;
    }

    if (!addingProductForm.productCost) {
      errors.productCost = "กรุณากรอกต้นทุน";

      isValid = false;
    }

    if (!addingProductForm.productAmount) {
      errors.productAmount = "กรุณากรอกคลัง";

      isValid = false;
    }

    if (!addingProductForm.productPrice) {
      errors.productPrice = "กรุณากรอกราคาสินค้า";

      isValid = false;
    }

    if (!addingProductForm.productDetail) {
      errors.productDetail = "กรุณากรอกรายละเอียด";

      isValid = false;
    }

    if (!addingProductForm.keyword) {
      errors.keyword = "กรุณากรอกคีย์เวิร์ด";

      isValid = false;
    }

    if (!categoryId && categoryId === "") {
      errors.productCategory = "กรุณากรอกหมวดหมู่สินค้า";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const nextStepFunction = () => {
    setOpen(false);

    router.push("/admin-market/warehouse/managmant-product");
  };

  return (
    <Box
      // component="form"
      sx={{ flexGrow: 1 }}
      marginBottom={5}
    >
      <ConfirmProcessModal
        open={open}
        text={textModal}
        colorIcon={colorIconModal}
        nextStepFunction={nextStepFunction}
      />
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
        <Grid item xs={1}></Grid>
        <Grid item xs={14}>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="row"
            alignItems="center"
          >
            <Box flexGrow={0}>
              <p className="titlePages">
                {id !== undefined && id !== "" ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
              </p>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <Grid container spacing={2} columns={16} marginTop={2}>
        <Grid item xs={2}></Grid>
        <Grid
          item
          xs={6}
          sx={{
            borderRight: "2px #bdbdbd solid",
          }}
          paddingY={4}
        >
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="row"
            alignItems="center"
            px={5}
          >
            <AddingProductDetail
              addingProductForm={addingProductForm}
              setAddingProductForm={setAddingProductForm}
              setCategoryId={setCategoryId}
              formErrors={formErrors}
              defultCategory={defultCategory}
            />
          </Box>
        </Grid>
        <Grid item xs={6} marginTop={3}>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="row"
            alignItems="center"
            px={5}
          >
            <AddingProductImage
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              imageList={imageList}
              setImageList={setImageList}
              addingProductForm={addingProductForm}
              setIndexImageChange={setIndexImageChange}
              setAddingProductForm={setAddingProductForm}
            />
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={2}></Grid>
        <Grid
          item
          xs={12}
          mt={5}
          sx={{
            borderTop: "2px #bdbdbd solid",
            display: "flex",
          }}
        >
          <Grid item xs={10}>
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
              px={2}
            >
              <AddingProductNotification
                addingProductForm={addingProductForm}
                setAddingProductForm={setAddingProductForm}
                formErrors={formErrors}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={2}></Grid>
        <Grid
          item
          xs={12}
          mt={5}
          sx={{
            borderTop: "2px #bdbdbd solid",
            display: "flex",
          }}
        >
          <Grid item xs={11}>
            <Box
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
              px={2}
            >
              <p className="optionsTitle">Product Options</p>

              <Grid container spacing={1}>
                <Grid
                  item
                  xs={1}
                  sx={{
                    display: "flex",
                    alignContent: "center",
                    alignItems: "end",
                  }}
                >
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      aria-label="add to product options"
                      onClick={handleAddOption}
                      disabled={id !== undefined}
                    >
                      <AddCircleOutlineIcon color="primary" />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid item xs={10}>
                  <AddingProductOption
                    options={options}
                    setOptions={setOptions}
                    handleSetProductAmount={handleSetProductAmount}
                  />
                </Grid>
                <Grid
                  item
                  xs={1}
                  sx={{
                    display: "flex",
                    alignContent: "center",
                    alignItems: "end",
                  }}
                >
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      aria-label="remove to product options"
                      onClick={handlePopOption}
                      disabled={id !== undefined}
                    >
                      <RemoveCircleOutlineIcon color="error" />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex" }}>
            <Box
              display="flex"
              justifyContent="end"
              flexDirection="column"
              width="100%"
              px={2}
            >
              <Button
                className="addingProductBtn"
                variant="outlined"
                color="error"
                onClick={() =>
                  router.push("/admin-market/warehouse/managmant-product")
                }
              >
                ยกเลิก
              </Button>
              <Button
                className="addingProductBtn"
                sx={{ marginTop: "1rem" }}
                variant="contained"
                onClick={handleSubmit}
              >
                ตกลง
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddingProducts;
