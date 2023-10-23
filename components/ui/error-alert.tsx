import { NextPage } from "next";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const ErrorAlert: NextPage<any> = (props) => {
  return (
    <div>
      <Alert severity="error">{props.message}</Alert>
    </div>
  );
};

export default ErrorAlert;
