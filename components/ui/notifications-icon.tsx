import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Popover from "@mui/material/Popover";
import { Box, Button, Typography } from "@mui/material";
import classec from "./notifications-icon.module.css";
import { NextPage } from "next";
import { RootState } from "../../redux-store/store";
import { NotificationsService } from "@/service/notifications.service";
import { useDispatch, useSelector } from "react-redux";
import { updateNotifStatus } from "@/redux-store/actions/notifications";

interface MassageModel {
  id: string;
  title: string;
  message: string;
  roleCode: number;
  isviewed: boolean;
  createBy: string;
  updateBy: string;
  createAt: Date;
  updateAt: Date;
}

const NotificationsIconUI: NextPage = () => {
  const notificationsService = new NotificationsService();
  const dispatch = useDispatch();

  const [message, setMessage] = useState<MassageModel[]>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const numberNotification = useSelector(
    (state: RootState) => state.notifications.notif
  );

  const open = Boolean(anchorEl);
  const id = open ? "popover-notifications" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickMessage = (id: string) => {
    const data = {
      isviewed: true,
    };
    notificationsService.updateNotification(id, data).then((res) => {
      if (res !== undefined) {
        setMessage(res?.result);
        notificationsService.getAllNotification().then((res) => {
          if (res !== undefined) {
            setMessage(res?.result);
            notificationsService.countNotifications().then((count) => {
              dispatch(updateNotifStatus(count?.result.number));
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    notificationsService.getAllNotification().then((res) => {
      if (res !== undefined) {
        setMessage(res?.result);
        notificationsService.countNotifications().then((count) => {
          dispatch(updateNotifStatus(count?.result.number));
        });
      }
    });
  }, [numberNotification]);

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <IconButton
          size="large"
          aria-label="show new notifications"
          className={classec.notificationsIcon}
          onClick={handleClick}
        >
          <Badge badgeContent={numberNotification} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: { width: "35%" },
        }}
      >
        <Box className={classec.notificationContent}>
          <Typography className={classec.titleMessage}>
            ข้อความแจ้งเตือน
          </Typography>
          {message && message?.length > 0 ? (
            message?.map((item, index) => (
              <Button
                key={(index + 1).toString()}
                className={classec.btnContent}
                size="medium"
                onClick={() => onClickMessage(item.id)}
              >
                <b style={{ marginRight: "2ch", width: "17rem" }}>
                  {item.title}
                </b>
                {item.message}
              </Button>
            ))
          ) : (
            <p>*ไม่มีข้อความแจ้งเตือนแจ้งเตือน</p>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationsIconUI;
