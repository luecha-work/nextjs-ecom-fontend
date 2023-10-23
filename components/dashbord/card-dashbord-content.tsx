import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, CardHeader } from "@mui/material";
import { NextPage } from "next";

interface CardDashbordContentProp {
  title: string;
  grossSales: string;
  averageData: string;
  averageSales: number;
  dataDisplayPeriod: string;
  color: string;
  icon1: React.ReactElement;
  icon2: React.ReactElement;
}

const CardDashbordContent: NextPage<CardDashbordContentProp> = ({
  title,
  grossSales,
  averageData,
  averageSales,
  dataDisplayPeriod,
  color,
  icon1,
  icon2,
}) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader title={title} sx={{ paddingBottom: "0rem" }} />
      <CardContent>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          {icon1}
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.5rem",
              marginLeft: "0.7rem",
              color: "#448aff",
            }}
          >
            {grossSales}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          {icon2}
          <Typography
            variant="body2"
            sx={{
              color: color,
              marginLeft: "0.5rem",
            }}
          >
            {averageData}
            <br />
            {/* {averageSales + "%"} */}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              marginLeft: "1.5rem",
            }}
          >
            {dataDisplayPeriod}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardDashbordContent;
