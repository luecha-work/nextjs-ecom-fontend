import { NextPage } from "next";

import { Button } from "@mui/material";
import { MouseEventHandler, ReactNode } from "react";

import classec from "./button-login.module.css";

interface ButtonLoginProps {
  background: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

const ButtonLogin: NextPage<ButtonLoginProps> = ({
  onClick,
  children,
  background,
}) => {
  let backgroundColor: string = "white";
  let textColor: string = "#2b2b2b";
  let border = "1px solid";

  if (background !== "") {
    backgroundColor = "#240B0B";
    textColor = "white";

    return (
      <div>
        <Button
          style={{
            backgroundColor: backgroundColor,
            color: textColor,
            margin: "0.2rem",
            fontSize: "18px",
          }}
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
          onClick={onClick}
          type="submit"
        >
          {children}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          marginRight: "1rem",
        }}
        fullWidth
        variant="outlined"
        sx={{ mt: 3, mb: 1, borderColor: "grey.500" }}
        onClick={onClick}
        type="submit"
      >
        {children}
      </Button>
    </div>
  );
};

export default ButtonLogin;
