import { Box, Button } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";

const ButtonBack: NextPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Box flexGrow={0}>
      <Button
        variant="contained"
        style={{ backgroundColor: "#8d6e63", marginTop: "20px" }}
        startIcon={<ArrowBackIosOutlinedIcon />}
        onClick={() => {
          handleGoBack();
        }}
        sx={{
          marginLeft: "4rem",
        }}>
        ย้อนกลับ
      </Button>
    </Box>
  );
};

export default ButtonBack;
