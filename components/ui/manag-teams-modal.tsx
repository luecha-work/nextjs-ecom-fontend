import { Box, styled, Theme } from "@mui/system";
import Modal from "@mui/base/Modal";
import Fade from "@mui/material/Fade";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { ChangeEvent, forwardRef, useEffect, useState } from "react";
import { NextPage } from "next";
import CrudUser from "@/service/user.sevice";
import { MarketService } from "@/service/market.service";

interface usersIdListProps {
  userList: Users;
  marketId: string | undefined;
  setOpenConfirmProcess: React.Dispatch<React.SetStateAction<boolean>>;
  setTextModal: React.Dispatch<React.SetStateAction<string>>;
  setColorModal: React.Dispatch<React.SetStateAction<string>>;
}

interface Users {
  userId: string[];
}

interface UsersModel {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
  active: boolean;
  createBy: string;
  updateBy: string | null;
  createAt: Date;
  updateAt: Date;
  dateOfBirth: Date;
  gender: string;
}
interface FormErrors {
  addingUserSelected?: string;
}

const ManagTeamsModal: NextPage<usersIdListProps> = ({
  userList,
  marketId,
  setOpenConfirmProcess,
  setTextModal,
  setColorModal,
}) => {
  const usersService = new CrudUser();
  const marketService = new MarketService();
  const [open, setOpen] = useState(false);
  const [addingUserSelected, setaddingUserSelected] = useState("");
  const [usersToAddingList, setUsersToAdding] = useState<UsersModel[]>();

  const [formErrors, setFormErrors] = useState<FormErrors>({
    addingUserSelected: "",
  });

  const handleButtonClick = () => {
    handleOpen();

    usersService.findUsersToAdminMarket(userList).then((req) => {
      if (req?.status_code === "200") {
        setUsersToAdding(req?.result);
      }
    });
  };

  const handleAddingAdminMarket = () => {
    if (validateForm()) {
      const data = {
        marketId: marketId,
        userId: addingUserSelected,
      };

      marketService.createAdminMarket(data).then((req) => {
        if (req?.status_code === "201") {
          setTextModal("เพิ่มผู้ดูแลร้านค้าสำเร็จ");
          setColorModal("green");
          setOpenConfirmProcess(true);
        } else {
          setTextModal("เพิ่มผู้ดูแลร้านค้าล้มเหลว");
          setColorModal("red");
          setOpenConfirmProcess(true);
        }
      });

      handleClose();
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setaddingUserSelected("");
  };

  const validateForm = () => {
    let errors: FormErrors = {};
    let isValid = true;

    if (!addingUserSelected) {
      errors.addingUserSelected = "กรุณากเลือกผู้ใช้งาน";

      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  useEffect(() => {}, []);

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<AddOutlinedIcon />}
        style={{ margin: "auto" }}
        onClick={handleButtonClick}
      >
        เพิ่มผู้ดูแลร้านค้า
      </Button>

      <StyledModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <h2>เลือกผู้ดูแลระบบ</h2>
            <InputLabel>ผู้ใช้งาน</InputLabel>
            <FormControl
              fullWidth
              size="small"
              required
              error={!!formErrors.addingUserSelected}
            >
              <Select
                value={addingUserSelected}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  setaddingUserSelected(selectedValue);
                }}
              >
                <MenuItem disabled value="">
                  <em>เลือกผู้ใช้งาน</em>
                </MenuItem>
                {usersToAddingList?.map((item) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item?.email}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.addingUserSelected && (
                <FormHelperText>{formErrors.addingUserSelected}</FormHelperText>
              )}
            </FormControl>
            <Stack
              direction="row"
              spacing={2}
              mt={5}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button variant="outlined" color="error" onClick={handleClose}>
                ยกเลิก
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddingAdminMarket}
              >
                เพิ่มผู้ดูแลร้านค้า
              </Button>
            </Stack>
          </Box>
        </Fade>
      </StyledModal>
    </div>
  );
};

// eslint-disable-next-line react/display-name
const Backdrop = forwardRef<HTMLDivElement, { open?: boolean }>(
  (props, ref) => {
    const { open, ...other } = props;
    return (
      <Fade in={open}>
        <div ref={ref} {...other} />
      </Fade>
    );
  }
);

const blue = {
  200: "#99CCF3",
  400: "#3399FF",
  500: "#007FFF",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const StyledModal = styled(Modal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = (theme: Theme) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: "10px",
  padding: "16px 32px 24px 32px",
  backgroundColor: theme.palette.mode === "dark" ? "#0A1929" : "white",
  boxShadow: `0px 2px 24px ${
    theme.palette.mode === "dark" ? "#000" : "#383838"
  }`,
});

export default ManagTeamsModal;
