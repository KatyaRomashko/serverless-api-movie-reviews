
import { ChangeEvent } from "react";
import { Pagination, Paper } from "@mui/material";

interface PageNavigationProps {
  totalItems: number;
  perPage: number;
  currentPage: number;
  pageChangeHandler: (event: ChangeEvent<unknown>, newPage: number) => void;
}

const CustomPagination = ({
  totalItems,
  perPage,
  currentPage,
  pageChangeHandler
}: PageNavigationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  return (
    <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={pageChangeHandler}
        showFirstButton
        showLastButton
        sx={{ justifyContent: "center", display: "flex" }}
      />
    </Paper>
  );
};

export default CustomPagination; 