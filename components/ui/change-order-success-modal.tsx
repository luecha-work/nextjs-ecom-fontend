import { Box, styled, Theme } from "@mui/system";
import Modal from "@mui/base/Modal";
import Fade from "@mui/material/Fade";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { ChangeEvent, forwardRef, useEffect, useState } from "react";
import { NextPage } from "next";
import { OrdersService } from "@/service/order.service";
import { ParcelStatusModel } from "@/common/models/orders-result.interface";
import { OrderParcelStatusService } from "@/service/order-parcel.service";
import { ParcelDeliveryService } from "@/service/parcel-delivery.service";
import { NotificationsService } from "@/service/notifications.service";
import { useDispatch } from "react-redux";
import { updateNotifStatus } from "@/redux-store/actions/notifications";

interface EditOrderSuccessStatusProps {
  orderId: string;
  reloadOrders: () => void;
  orderSuccessProps: {
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

const EditOrderSuccessStatusModal: NextPage<EditOrderSuccessStatusProps> = ({
  orderId,
  reloadOrders,
  orderSuccessProps,
  parcelDeliveryProps,
}) => {
  const parcelStatusService = new OrderParcelStatusService();
  const parcelDeliveryService = new ParcelDeliveryService();
  const notificationsService = new NotificationsService();
  const dispatch = useDispatch();

  const ordersService = new OrdersService();
  const [open, setOpen] = useState(false);
  const [isStatusChange, setIsStatusChange] = useState(true);
  const [parcelStatus, setParcelStatus] = useState<ParcelStatusModel[]>();

  const [parcelStatusSelected, setParcelStatusSelected] =
    useState<ParcelStatusModel>(orderSuccessProps);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setIsStatusChange(true);
    setOpen(false);
  };

  const handleRadioChange = (selectedRow: ParcelStatusModel) => {
    setParcelStatusSelected(selectedRow);
  };

  const handleOrderStatusChange = () => {
    if (
      parcelStatusSelected?.id !== orderSuccessProps.id &&
      parcelStatusSelected?.id !== undefined
    ) {
      ordersService
        .update({ parcelStatus: parcelStatusSelected }, orderId)
        .then((res) => {
          const message = `ชื่อออเดอร์(${res?.result?.orderName}) รหัสออเดอร์(${res?.result?.orderCode}) สถานะเป็น: ${parcelStatusSelected.parcelStatusName}`;

          updateNotification(message, orderId);
        });

      if (parcelStatusSelected.parcelStatusName === "จัดส่งสำเร็จ") {
        parcelDeliveryService.update(
          { receivingParcelDate: new Date() },
          parcelDeliveryProps.id
        );
      }

      setIsStatusChange(true);
      handleClose();
    } else {
      setIsStatusChange(false);
    }

    reloadOrders();
  };

  const updateNotification = (message: string, orderId: string) => {
    const title: string = "แก้ไขสถานะออเดอร์";

    notificationsService
      .createNotification({ title, message, orderId })
      .then((res) => {
        notificationsService.countNotifications().then((count) => {
          if (res !== undefined) {
            notificationsService.countNotifications().then((count) => {
              dispatch(updateNotifStatus(count?.result.number));
            });
          }
        });
      });
  };

  useEffect(() => {
    parcelStatusService.getParcelStatusOnOrderSuccess().then((req) => {
      setParcelStatus(req?.result);
    });
  }, []);

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
            <h2>แก้ไขสถานะพัสดุ</h2>
            <FormControl>
              <RadioGroup
                aria-labelledby="orders-status-buttons-group-label"
                value={parcelStatusSelected.parcelStatusCode}
                name="orders-status-radio-group"
              >
                {parcelStatus?.map((row) => (
                  <FormControlLabel
                    key={row.id}
                    value={row.parcelStatusCode}
                    control={<Radio />}
                    label={row.parcelStatusName}
                    onClick={() => handleRadioChange(row)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <span>
              {!isStatusChange && (
                <p style={{ color: "red" }}>
                  ***กรุณาเลือกสถานะออเดอร์ใหม่ก่อน
                </p>
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
                onClick={handleOrderStatusChange}
              >
                ตกลง
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

export default EditOrderSuccessStatusModal;
