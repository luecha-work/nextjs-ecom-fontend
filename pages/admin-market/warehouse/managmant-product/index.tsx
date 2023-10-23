import { NextPage } from "next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { ChangeEvent, useEffect, useState } from "react";
import SearchInput from "@/components/ui/search-input";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack, TableFooter } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { ProductResultModel } from "@/common/models/product-result.interface";
import { MetaModel } from "@/common/models/base-result.imterface";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { ProductService } from "@/service/product.service";
import { useRouter } from "next/router";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

const ManagmantProduct: NextPage = () => {
  const router = useRouter();
  const productService = new ProductService();

  const [searchValue, setSearchValue] = useState("");
  const [meta, setMeta] = useState<MetaModel>();
  const [productData, setProductData] = useState<
    ProductResultModel[] | undefined
  >();

  useEffect(() => {
    productService.findProductInCurrenUser().then((req) => {
      if (req?.status_code === "200") {
        const data: ProductResultModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;

        setMeta(meta);
        setProductData(data);
      }
    });
  }, []);

  const reloadProduct = () => {
    productService.findProductInCurrenUser().then((req) => {
      if (req?.status_code === "200") {
        const data: ProductResultModel[] = req?.result.data;
        const meta: MetaModel = req?.result.meta;

        setMeta(meta);
        setProductData(data);
      }
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const page: number = 1;
    setSearchValue(event.target.value);


    if (
      typeof event.target.value !== "undefined" ||
      event.target.value !== ""
    ) {
      productService
        .findProductInCurrenUser(page, event.target.value)
        .then((req) => {
          if (req?.status_code === "200") {
            const data: ProductResultModel[] = req?.result.data;
            const meta: MetaModel = req?.result.meta;

            setMeta(meta);
            setProductData(data);
          }
        });
    } else {
      productService.findProductInCurrenUser().then((req) => {
        if (req?.status_code === "200") {
          const data: ProductResultModel[] = req?.result.data;
          const meta: MetaModel = req?.result.meta;

          setMeta(meta);
          setProductData(data);
        }
      });
    }
  };

  const handleProViousPage = () => {
    const page: number = parseInt(meta!.page.toString()) - 1;

    if (page >= 1) {
      productService.findProductInCurrenUser(page, searchValue).then((req) => {
        if (req?.status_code === "200") {
          const data: ProductResultModel[] = req?.result.data;
          const meta: MetaModel = req?.result.meta;

          setMeta(meta);
          setProductData(data);
        }
      });
    }
  };

  const handleNextPage = () => {
    const page: number = parseInt(meta!.page.toString()) + 1;
    const last_page: number = meta!.last_page;

    if (page <= last_page) {
      productService.findProductInCurrenUser(page, searchValue).then((req) => {
        if (req?.status_code === "200") {
          const data: ProductResultModel[] = req?.result.data;
          const meta: MetaModel = req?.result.meta;

          setMeta(meta);
          setProductData(data);
        }
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    productService.delete(productId).then(() => {
      reloadProduct();
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={1}></Grid>
        <Grid item xs={14}>
          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection="row"
            alignItems="center"
            marginY={3}
          >
            <Box flexGrow={0} width={"30%"}>
              <SearchInput
                handleInputChange={handleInputChange}
                title={`ค้นหารายชื่อสินค้า/คีย์เวิร์ด`}
                searchValue={searchValue}
              />
            </Box>
            <Box flexGrow={0}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="medium"
                  color="warning"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => router.push("/admin-system/crud-category")}
                >
                  เพิ่มหมวดหมู่สินค้า
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  color="info"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() =>
                    router.push("/admin-market/warehouse/create-products")
                  }
                >
                  เพิ่มสินค้า
                </Button>
              </Stack>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <Grid container spacing={2} columns={16} mt={1}>
        <Grid item xs={1}></Grid>
        <Grid item xs={14}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      className="orderHeaderTable"
                      sx={{
                        width: "10%",
                      }}
                    >
                      รูปสินค้า
                    </StyledTableCell>
                    <StyledTableCell align="left" className="orderHeaderTable">
                      ชื่อสินค้า
                    </StyledTableCell>
                    <StyledTableCell align="left" className="orderHeaderTable">
                      รหัสสินค้า
                    </StyledTableCell>
                    <StyledTableCell align="left" className="orderHeaderTable">
                      คีย์เวิร์ด
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      className="orderHeaderTable"
                    >
                      คลัง(จำนวนชิ้น)
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      className="orderHeaderTable"
                    >
                      action
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productData?.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                        sx={{
                          width: "12%",
                          paddingX: "2rem",
                        }}
                      >
                        <img
                          style={{
                            width: "100%",
                          }}
                          src={
                            row?.pathPicture[0] !== undefined ||
                            row?.pathPicture.length > 0
                              ? row.pathPicture[0].url
                              : ""
                          }
                          alt=""
                        />
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="left">
                        {row.productName ?? "-"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.productCode ?? "-"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.keyword ?? "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.productAmount ?? "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center" style={{ width: "20%" }}>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignContent={"center"}
                          justifyContent={"center"}
                        >
                          <Button
                            variant="contained"
                            color="warning"
                            startIcon={<DriveFileRenameOutlineOutlinedIcon />}
                            // style={{ margin: "auto" }}
                            onClick={() =>
                              router.push(
                                `/admin-market/warehouse/create-products?id=${row.id}`
                              )
                            }
                          >
                            แก้ไข
                          </Button>
                          <Button
                            variant="contained"
                            size="medium"
                            color="error"
                            startIcon={<DeleteForeverOutlinedIcon />}
                            onClick={() => {
                              handleDeleteProduct(row.id);
                            }}
                          >
                            ลบ
                          </Button>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow style={{ justifyContent: "space-between" }}>
                    <TableCell colSpan={2} style={{ paddingRight: 0 }}>
                      <p style={{ fontSize: 14 }}>
                        number of rows: {meta?.total}
                      </p>
                    </TableCell>
                    <TableCell
                      colSpan={6}
                      align="right"
                      style={{ paddingLeft: 0 }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        marginY={1}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <Button
                          size="medium"
                          style={{ margin: "0px" }}
                          onClick={handleProViousPage}
                        >
                          Previous
                        </Button>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0rem 0.8rem",
                          }}
                        >
                          <p
                            style={{
                              fontSize: 14,
                            }}
                          >
                            {meta?.page}
                          </p>
                        </span>
                        <Button
                          size="medium"
                          style={{ margin: "0px" }}
                          onClick={handleNextPage}
                        >
                          Next
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Box>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default ManagmantProduct;
