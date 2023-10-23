import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { NextPage } from "next";
import { ChangeEvent, useState } from "react";

import classec from "./textfield-password.module.css";

interface TextFieldPasswordProps {
  validateError?: string;
  isValidPasswordPattern?: boolean;
  label: string;
  password: string;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextFieldPassword: NextPage<TextFieldPasswordProps> = ({
  label,
  password,
  handlePasswordChange,
  validateError,
  isValidPasswordPattern,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <FormControl
      fullWidth
      className={classec.inputPasswordContent}
      size="small"
      required
      error={!!validateError || !isValidPasswordPattern}
    >
      <TextField
        label={label}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        size="small"
        value={password}
        onChange={handlePasswordChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePassword}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        required
        error={!!validateError || !isValidPasswordPattern}
      />

      {!isValidPasswordPattern ? (
        <FormHelperText sx={{ marginBottom: "1rem" }}>
          Password must have at least 8 characters, one lowercase letter, one
          uppercase letter, one number, and one special character.
        </FormHelperText>
      ) : (
        validateError && <FormHelperText>{validateError}</FormHelperText>
      )}
    </FormControl>
  );
};

export default TextFieldPassword;
