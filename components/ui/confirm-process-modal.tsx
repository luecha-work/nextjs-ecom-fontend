import { Box, styled, Theme } from "@mui/system";
import Fade from "@mui/material/Fade";
import { Modal, Button } from "@mui/material";
import { NextPage } from "next";
import { forwardRef } from "react";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ConfirmProcessModalProp {
  open: boolean;
  text: string;
  colorIcon: string;
  nextStepFunction?: () => void;
}

const ConfirmProcessModal: NextPage<ConfirmProcessModalProp> = ({
  open,
  text,
  colorIcon,
  nextStepFunction,
}) => {
  return (
    <StyledModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      slots={{ backdrop: StyledBackdrop }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              paddingTop: "1.0rem",
              paddingBottom: "2rem",
            }}
          >
            {/* <IconButton edge="end" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton> */}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              justifyItems: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {colorIcon === "green" ? (
              <CheckCircleOutlineIcon
                sx={{ fontSize: "5rem", display: "block", color: colorIcon }}
              />
            ) : (
              <ErrorOutlineIcon
                sx={{ fontSize: "5rem", display: "block", color: colorIcon }}
              />
            )}

            <p>{text}</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              justifyItems: "center",
              alignItems: "center",
              marginTop: "2rem",
            }}
          >
            <Button
              variant="outlined"
              size="medium"
              onClick={nextStepFunction}
              sx={{
                color: "#8d6e63",
                borderColor: "#8d6e63",
                "&:hover": {
                  backgroundColor: "#efebe9",
                  color: "#8d6e63",
                  borderColor: "#8d6e63",
                },
              }}
            >
              ตกลง
            </Button>
          </div>
        </Box>
      </Fade>
    </StyledModal>
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
  paddingTop: "2rem",
  paddingBottom: "2rem",
});

export default ConfirmProcessModal;
