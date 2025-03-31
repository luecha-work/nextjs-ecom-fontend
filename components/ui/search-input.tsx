import SearchIcon from "@mui/icons-material/Search";
import { InputBase, Paper } from "@mui/material";
import { NextPage } from "next";
import { ChangeEventHandler } from "react";

interface SearchInputProps {
  handleInputChange?: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  title: string;
  searchValue: string;
}

const SearchInput: NextPage<SearchInputProps> = ({
  handleInputChange,
  title,
  searchValue,
}) => {
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        borderRadius: "5px",
        height: "3rem",
      }}
    >
      <SearchIcon color="action" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={title}
        inputProps={{ "aria-label": `${title}` }}
        value={searchValue}
        onChange={handleInputChange}
      />
    </Paper>
  );
};

export default SearchInput;
