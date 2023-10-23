import { Box, styled, Theme } from "@mui/system";
import Fade from "@mui/material/Fade";
import {
  Button,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { forwardRef, useEffect, useState } from "react";
import { NextPage } from "next";
import { OrdersStatusService } from "@/service/order-status.service";
import { OrdersService } from "@/service/order.service";
import { OrdersStatusModel } from "@/common/models/orders-result.interface";
import { NotificationsService } from "@/service/notifications.service";
import { useDispatch, useSelector } from "react-redux";
import { updateNotifStatus } from "@/redux-store/actions/notifications";

interface EditOrderStatusProps {
  orderId: string;
  reloadOrders: () => void;
  orderStatusProps: {
    id: string;
    createAt: Date;
    updateAt: Date;
    description: string;
    orderStatusCode: string;
    orderStatusName: string;
    active: boolean;
    updateBy: string;
    createBy: string;
  };
}

const EditOrderStatusModal: NextPage<EditOrderStatusProps> = ({
  orderId,
  orderStatusProps,
  reloadOrders,
}) => {
  const ordersStatusService = new OrdersStatusService();
  const ordersService = new OrdersService();
  const notificationsService = new NotificationsService();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isStatusChange, setIsStatusChange] = useState(true);
  const [ordersStatus, setOrdersStatus] = useState<OrdersStatusModel[]>();

  const [ordersStatusSelected, setOrdersStatusSelected] =
    useState<OrdersStatusModel>(orderStatusProps);

  const handleOpen = () => {
    getOrdersStatus();
    setOpen(true);
  };
  const handleClose = () => {
    setIsStatusChange(true);
    setOpen(false);
  };

  const handleRadioChange = (selectedRow: OrdersStatusModel) => {
    setOrdersStatusSelected(selectedRow);
  };

  const handleOrderStatusChange = () => {
    if (
      ordersStatusSelected?.id !== orderStatusProps.id &&
      ordersStatusSelected?.id !== undefined
    ) {
      ordersService
        .update({ orderStatus: ordersStatusSelected }, orderId)
        .then((res) => {
          const message = `ชื่อออเดอร์(${res?.result?.orderName}) รหัสออเดอร์(${res?.result?.orderCode}) สถานะเป็น: ${ordersStatusSelected.orderStatusName}`;

          updateNotification(message, orderId);
        });
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

  const getOrdersStatus = async () => {
    ordersStatusService.getOrdersStatus("edit").then((req) => {
      setOrdersStatus(req?.result);
    });
  };

  useEffect(() => {}, [isStatusChange]);

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
            <h2>แก้ไขสถานะออเดอร์</h2>
            <FormControl>
              <RadioGroup
                aria-labelledby="orders-status-buttons-group-label"
                value={ordersStatusSelected.orderStatusCode}
                name="orders-status-radio-group"
              >
                {ordersStatus?.map((row) => (
                  <FormControlLabel
                    key={row.id}
                    value={row.orderStatusCode}
                    control={<Radio />}
                    label={row.orderStatusName}
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

export default EditOrderStatusModal;
