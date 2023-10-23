import ManagTeamsModal from "@/components/ui/manag-teams-modal";
import { Box, Grid, IconButton } from "@mui/material";
import { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Stack, TableFooter } from "@mui/material";
import { MetaModel } from "@/common/models/base-result.imterface";
import { UsersInMarketModel } from "@/common/models/admin-market.interface";
import { MarketService } from "@/service/market.service";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmProcessModal from "@/components/ui/confirm-process-modal";

interface UsersIdListModel {
  userId: string[];
}

const ManageTeam: NextPage = () => {
  const marketService = new MarketService();
  const [meta, setMeta] = useState<MetaModel>();
  const [marketTeamData, setMarketTeamData] = useState<UsersInMarketModel>();
  const [userIdList, setUserIdList] = useState<UsersIdListModel>({
    userId: [],
  });

  const [rowsIndex, setRowsIndex] = useState({
    lastIndex: [0] as number[],
    currentIndex: 1,
  });

  const [openConfirmProcess, setOpenConfirmProcess] = useState(false);
  const [textConfirmProcessModal, setTextConfirmProcessModal] =
    useState<string>("");
  const [colorIconConfirmProcessModal, setColorConfirmProcessIconModal] =
    useState<string>("");

  const nextStepFunction = () => {
    setOpenConfirmProcess(false);
    reloadAdminMarket();
  };

  const handleProViousPage = () => {
    const page: number = parseInt(meta!.page.toString()) - 1;

    const newLastIndex = [...rowsIndex.lastIndex];
    const removedValue = newLastIndex.pop();

    if (page >= 1) {
      if (marketTeamData?.adminMarkets && removedValue !== undefined) {
        setRowsIndex({
          lastIndex: newLastIndex,
          currentIndex: removedValue,
        });
      }
      marketService.findUsersInMarket(page).then((req) => {
        if (req?.status_code === "200") {
          const data: UsersInMarketModel = req?.result[0].data[0];
          const meta: MetaModel = req?.result[0].meta;

          setMeta(meta);
          setMarketTeamData(data);
        }
      });
    }
  };

  const handleNextPage = () => {
    const page: number = parseInt(meta!.page.toString()) + 1;
    const last_page: number = meta!.last_page;

    if (page <= last_page) {
      if (marketTeamData?.adminMarkets) {
        setRowsIndex({
          lastIndex: [...rowsIndex.lastIndex, rowsIndex.currentIndex],
          currentIndex:
            rowsIndex.currentIndex + marketTeamData?.adminMarkets?.length,
        });
      }

      marketService.findUsersInMarket(page).then((req) => {
        if (req?.status_code === "200") {
          const data: UsersInMarketModel = req?.result[0].data[0];
          const meta: MetaModel = req?.result[0].meta;

          setMeta(meta);
          setMarketTeamData(data);
        }
      });
    }
  };

  const handleDeleteAdminMarget = (userId: string) => {
    if (marketTeamData?.adminMarkets) {
      if (marketTeamData?.adminMarkets?.length > 1) {
        marketService.deleteAdminMarket(userId).then((res) => {
          if (res?.status_code === "200") {
            setTextConfirmProcessModal("ลบผู้ดูแลร้านค้าสำเร็จ");
            setColorConfirmProcessIconModal("green");
            setOpenConfirmProcess(true);
          } else {
            setTextConfirmProcessModal("ลบผู้ดูแลร้านค้าล้มเหลว");
            setColorConfirmProcessIconModal("red");
            setOpenConfirmProcess(true);
          }
        });
      } else {
        setTextConfirmProcessModal("ไม่สามารถลบหากมีผู้ดูแลน้อยกว่า 1 คน");
        setColorConfirmProcessIconModal("#ffa726");
        setOpenConfirmProcess(true);
      }
    }
  };

  const reloadAdminMarket = () => {
    marketService.findUsersInMarket().then((req) => {
      if (req?.status_code === "200") {
        const data: UsersInMarketModel = req?.result[0].data[0];
        const meta: MetaModel = req?.result[0].meta;
        const userIdList1 = req?.result[1];

        setMeta(meta);
        setMarketTeamData(data);
        setUserIdList(userIdList1);
      }
    });
  };

  useEffect(() => {
    marketService.findUsersInMarket().then((req) => {
      if (req?.status_code === "200") {
        const data: UsersInMarketModel = req?.result[0].data[0];
        const meta: MetaModel = req?.result[0].meta;
        const userIdList1 = req?.result[1];

        setMeta(meta);
        setMarketTeamData(data);
        setUserIdList(userIdList1);
      }
    });
  }, []);

  return (
    <Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={16}>
          <Grid item xs={1}></Grid>
          <Grid item xs={14}>
            <Box
              flexGrow={0}
              display="flex"
              justifyContent="end"
              alignItems="center"
              marginY={3}
            >
              <ManagTeamsModal
                userList={userIdList}
                marketId={marketTeamData?.id}
                setOpenConfirmProcess={setOpenConfirmProcess}
                setTextModal={setTextConfirmProcessModal}
                setColorModal={setColorConfirmProcessIconModal}
              />
              <ConfirmProcessModal
                open={openConfirmProcess}
                text={textConfirmProcessModal}
                colorIcon={colorIconConfirmProcessModal}
                nextStepFunction={nextStepFunction}
              />
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              flexDirection="row"
              alignItems="center"
              alignContent="center"
              marginY={5}
            >
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      {/* <StyledTableCell
                        align="center"
                        className="orderHeaderTable"
                        sx={{
                          width: "8%",
                        }}
                      >
                        อันดับ
                      </StyledTableCell> */}
                      <StyledTableCell
                        align="left"
                        className="orderHeaderTable"
                      >
                        ชื่อร้านค้า
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        className="orderHeaderTable"
                      >
                        รหัสร้านค้า
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        className="orderHeaderTable"
                      >
                        ชื่อสมาชิก
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className="orderHeaderTable"
                      >
                        บทบาท
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        className="orderHeaderTable"
                      >
                        อีเมล
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className="orderHeaderTable"
                      >
                        เบอร์โทร
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
                    {marketTeamData?.adminMarkets?.map((row, index) => (
                      <StyledTableRow
                        key={(index + rowsIndex.currentIndex).toString()}
                      >
                        {/* <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {index + rowsIndex.currentIndex}
                        </StyledTableCell> */}

                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="left"
                        >
                          {marketTeamData.marketName}
                        </StyledTableCell>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="left"
                        >
                          {marketTeamData.marketCode}
                        </StyledTableCell>

                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="left"
                        >
                          {row.users.firstname + row.users.lastname}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.users.role.roleName
                            ? row.users.role.roleName
                            : "-"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.users.email ? row.users.email : "-"}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          {row.users.phoneNumber ? row.users.phoneNumber : "-"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteAdminMarget(row?.id)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
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
    </Fragment>
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

export default ManageTeam;
