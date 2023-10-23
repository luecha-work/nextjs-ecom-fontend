import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { NextPage } from "next";

import classec from "./dropdown.module.css";

interface DropdownProps {
  label: string;
  items: { value: string; label: string }[];
  value: string;
  handleChange: (event: SelectChangeEvent) => void;
  validateError?: string;
}

const Dropdown: NextPage<DropdownProps> = ({
  label,
  items,
  value,
  handleChange,
  validateError,
}) => {
  return (
    <FormControl fullWidth size="small" required error={!!validateError}>
      <InputLabel id="select-address-label">{label}</InputLabel>
      <Select
        labelId="select-address-label"
        className={classec.selectAddressContent}
        id="elect-address"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {validateError && <FormHelperText>{validateError}</FormHelperText>}
    </FormControl>
  );
};

export default Dropdown;
