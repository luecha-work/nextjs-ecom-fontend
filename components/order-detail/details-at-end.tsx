import { Box, Grid } from "@mui/material";
import { NextPage } from "next";
import { TextareaAutosize } from "@mui/base";
import { styled } from "@mui/system";

interface DetailsAtEndProps {
  address: string;
  detail: string;
  slipPath: string;
}

const DetailsAtEnd: NextPage<DetailsAtEndProps> = ({
  address,
  detail,
  slipPath,
}) => {
  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
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

  const StyledTextarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 320px;
    min-height: 120px;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[500] : blue[200]
      };
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  return (
    <Grid container spacing={1} columns={16}>
      <Grid item xs={3}></Grid>
      <Grid item xs={5}>
        <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="start"
        >
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="start"
            flexDirection="row"
            alignItems="center"
          >
            <p>ที่อยู่จัดส่ง</p>
          </Box>
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="center"
            flexDirection="row"
            alignItems="center"
          >
            <StyledTextarea
              maxRows={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue={address}
            />
          </Box>
        </Box>
        <Box
          flexGrow={1}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="start"
        >
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="center"
            flexDirection="row"
            alignItems="center"
            mt={3}
          >
            <StyledTextarea
              maxRows={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue={detail}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={5}>
        <Box
          flexGrow={1}
          mt={0}
          display="flex"
          justifyContent="end"
          flexDirection="column"
          alignItems="end"
        >
          <div>
            <p style={{ textAlign: "center" }}>รูปภาพหลักฐานการโอน</p>
            {slipPath !== "" ? (
              <img
                style={{
                  width: "15rem",
                  border: "1px solid",
                  borderRadius: "0.4rem",
                }}
                src={slipPath}
                alt="slip-payment"
              />
            ) : (
              <>
                <p style={{ color: "red" }}>***ไม่มีหลักฐานการโอนเงิน</p>
              </>
            )}
          </div>
        </Box>
      </Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  );
};

export default DetailsAtEnd;
