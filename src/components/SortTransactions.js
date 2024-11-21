import { useState } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { sortTransactions } from "../redux/transactionsSlice";

const SortTransactions = () => {
  const [sortBy, setSortBy] = useState("");
  const dispatch = useDispatch();
  const isSorting = useSelector((state) => state.transactions.isSorting);

  const handleSort = () => {
    dispatch(sortTransactions(sortBy));
  };

  return (
    <div>
      <h3>Sort Transactions</h3>
      <Select
        labelId="sort-by-label"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        displayEmpty
        sx={{ mb: 2 }}
      >
        <MenuItem value="">None</MenuItem>
        <MenuItem value="date">Date</MenuItem>
        <MenuItem value="amount">Amount</MenuItem>
        <MenuItem value="category">Category</MenuItem>
      </Select>

      <Button
        onClick={handleSort}
        variant="contained"
        color="primary"
        disabled={!sortBy || isSorting}
      >
        {isSorting ? "Sorting..." : "Sort"}
      </Button>
    </div>
  );
};

export default SortTransactions;
