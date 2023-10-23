import { Box, styled, Theme } from "@mui/system";
import Modal from "@mui/base/Modal";
import Fade from "@mui/material/Fade";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { forwardRef, useEffect, useState } from "react";
import { NextPage } from "next";
import { OrdersService } from "@/service/order.service";
import { ParcelStatusModel } from "@/common/models/orders-result.interface";
import { OrderParcelStatusService } from "@/service/order-parcel.service";
import transferList from "@/common/class/transport-company";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ParcelDeliveryService } from "@/service/parcel-delivery.service";
import { NotificationsService } from "@/service/notifications.service";
import { useDispatch } from "react-redux";
import { updateNotifStatus } from "@/redux-store/actions/notifications";

interface EditOrdersPendingProps {
  orderId: string;
  reloadOrders: () => void;
  ordersPendingProps: {
    id: string;
    parcelStatusName: string;
    parcelStatusCode: string;
    description: string;
    active: boolean;
    createAt: Date;
    updateAt: Date;
    createBy: string;
    updateBy: string;
  };
  parcelDeliveryProps: {
    id: string;
    parcelNumber: string | null;
    deliveryDate: Date | null;
    receivingParcelDate: Date | null;
    transportCompany: string | null;
    description: string | null;
    createBy: string;
    updateBy: string;
    createAt: Date;
    updateAt: Date;
  };
}

const EditOrdersParcelStatusModal: NextPage<EditOrdersPendingProps> = ({
  orderId,
  ordersPendingProps,
  parcelDeliveryProps,
  reloadOrders,
}) => {
  const parcelStatusService = new OrderParcelStatusService();
  const parcelDeliveryService = new ParcelDeliveryService();
  const ordersService = new OrdersService();
  const notificationsService = new NotificationsService();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isStatusChange, setIsStatusChange] = useState(true);
  const [ordersPending, setOrdersPending] = useState<ParcelStatusModel[]>();
  const [parcelStatus, setParcelStatus] = useState<ParcelStatusModel>();
  const [transportCompany, setTransportCompany] = useState("");
  const [changeOrdersParcelForm, setChangeOrdersParcelerForm] = useState({
    parcelNumber: "",
    transportCompany: "",
    deliveryDate: Date(),
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setIsStatusChange(true);
    setOpen(false);
  };

  const handleOrdersPendingChange = () => {
    if (
      parcelStatus?.id !== "" &&
      changeOrdersParcelForm.transportCompany !== "" &&
      changeOrdersParcelForm.parcelNumber !== ""
    ) {
      ordersService
        .update({ parcelStatus: parcelStatus }, orderId)
        .then((res) => {
          const message = `ชื่อออเดอร์(${res?.result?.orderName}) รหัสออเดอร์(${res?.result?.orderCode}) สถานะเป็น: ${parcelStatus?.parcelStatusName}`;

          updateNotification(message, orderId);
        });

      parcelDeliveryService.update(
        changeOrdersParcelForm,
        parcelDeliveryProps.id
      );

      setIsStatusChange(true);
      handleClose();
    } else {
      setIsStatusChange(false);
    }

    reloadOrders();
  };

  const updateNotification = (message: string, orderId: string) => {
    const title: string = "แก้ไขสถานะพัสดุ";

    notificationsService
      .createNotification({ title, message, orderId })
      .then((res) => {
        if (res !== undefined) {
          notificationsService.countNotifications().then((count) => {
            dispatch(updateNotifStatus(count?.result.number));
          });
        }
      });
  };

  useEffect(() => {
    setParcelStatus(ordersPendingProps);
    parcelStatusService.getPendingStatus().then((req) => {
      setOrdersPending(req?.result);
    });

    const selectedValue = parcelDeliveryProps.transportCompany;
    const selectedItem = transferList.find(
      (item) => item.name === selectedValue
    );
    const selectedCode = selectedItem ? selectedItem.code : "";

    setTransportCompany(selectedCode);

    setChangeOrdersParcelerForm({
      deliveryDate:
        parcelDeliveryProps.deliveryDate instanceof Date
          ? parcelDeliveryProps.deliveryDate.toString()
          : new Date().toString(),
      transportCompany: parcelDeliveryProps.transportCompany ?? "",
      parcelNumber: parcelDeliveryProps.parcelNumber ?? "",
    });
  }, [isStatusChange]);

  return (
    <div>
      <Button
        variant="contained"
        color="warning"
        startIcon={<DriveFileRenameOutlineOutlinedIcon />}
        style={{ margin: "auto" }}
        onClick={handleOpen}
      >
        แก้ไขสถานะ
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
            <form action="">
              <h2>แก้ไขสถานะพัสดุ</h2>
              <InputLabel id="select-label-parcel-status">
                แก้ไขสถานะ
              </InputLabel>
              <FormControl fullWidth size="small" required>
                <Select
                  labelId="select-label-parcel-status"
                  id="parcel-status"
                  value={parcelStatus?.parcelStatusCode}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selectedItem = ordersPending?.find(
                      (item) => item.parcelStatusCode === selectedValue
                    );
                    setParcelStatus(selectedItem);
                  }}
                >
                  {ordersPending?.map((item) => (
                    <MenuItem
                      key={item.parcelStatusCode}
                      value={item.parcelStatusCode}
                    >
                      {item.parcelStatusName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <InputLabel
                sx={{
                  marginTop: "1rem",
                }}
                id="select-label-parcel-status"
              >
                รหัสพัสดุ
              </InputLabel>
              <TextField
                fullWidth
                label=""
                defaultValue={changeOrdersParcelForm.parcelNumber}
                variant="outlined"
                size="small"
                onChange={(e) =>
                  setChangeOrdersParcelerForm({
                    ...changeOrdersParcelForm,
                    parcelNumber: e.target.value,
                  })
                }
                required
              />
              <InputLabel
                sx={{
                  marginTop: "1rem",
                }}
                id="select-label-transport"
              >
                บริษัทขนส่ง
              </InputLabel>
              <FormControl fullWidth size="small">
                <Select
                  labelId="select-label-transport"
                  id="select-transport"
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  value={transportCompany}
                  label={``}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selectedItem = transferList.find(
                      (item) => item.code === selectedValue
                    );
                    const selectedName = selectedItem ? selectedItem.name : "";

                    setTransportCompany(selectedValue);

                    setChangeOrdersParcelerForm({
                      ...changeOrdersParcelForm,
                      transportCompany: selectedName,
                    });
                  }}
                >
                  <MenuItem disabled value="">
                    <em>เลือกบริษัทขนส่ง</em>
                  </MenuItem>
                  {transferList.map((item) => (
                    <MenuItem key={item.code} value={item.code}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <span>
                <InputLabel
                  sx={{
                    marginTop: "1rem",
                  }}
                  htmlFor="date-picker"
                >
                  เวลาที่จัดส่ง
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{
                      width: "100%",
                    }}
                    // defaultValue={dayjs()}
                    defaultValue={dayjs(
                      parcelDeliveryProps.deliveryDate !== null
                        ? new Date(parcelDeliveryProps.deliveryDate)
                        : new Date()
                    )}
                    slotProps={{ textField: { size: "small" } }}
                    onChange={(date: any) => {
                      setChangeOrdersParcelerForm({
                        ...changeOrdersParcelForm,
                        deliveryDate: date.toISOString(),
                      });
                    }}
                  />
                </LocalizationProvider>
              </span>
              <span>
                {!isStatusChange && (
                  <p style={{ color: "red" }}>***รายการข้อมูลห้ามว่าง</p>
                )}
              </span>
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
                  onClick={handleOrdersPendingChange}
                >
                  ตกลง
                </Button>
              </Stack>
            </form>
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

export default EditOrdersParcelStatusModal;
