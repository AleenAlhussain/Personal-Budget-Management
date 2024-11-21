import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../redux/transactionsSlice";
import {
  Grid,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

const Filters = () => {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const dispatch = useDispatch();
  const incomeCategories = useSelector(
    (state) => state.transactions.incomeCategories || []
  );
  const expenseCategories = useSelector(
    (state) => state.transactions.expenseCategories || []
  );

  const categoriesToDisplay =
    filterType === "income" ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (
      filterCategory &&
      !categoriesToDisplay.some((cat) => cat.name === filterCategory)
    ) {
      setFilterCategory("");
    }
  }, [categoriesToDisplay, filterCategory]);

  const handleFilter = () => {
    dispatch(
      setFilters({
        category: filterCategory,
        type: filterType,
        date: filterDate,
      })
    );
  };

  const handleReset = () => {
    setFilterCategory("");
    setFilterType("");
    setFilterDate("");
    dispatch(setFilters({ category: "", type: "", date: "" }));
  };

  return (
    <Box sx={{ borderRadius: 1, backgroundColor: "#f9f9f9" }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Filter Transactions
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3}>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            displayEmpty
            fullWidth
            inputProps={{ "aria-label": "Filter by type" }}
            sx={{
              maxWidth: { xs: "200px", sm: "auto" },
              width: "100%",
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Filter by category" }}
            disabled={!filterType}
            sx={{
              maxWidth: { xs: "200px", sm: "auto" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categoriesToDisplay.map((category) => (
              <MenuItem key={category.name} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <TextField
            label="Date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              maxWidth: { xs: "200px", sm: "auto" },
              width: { xs: "100%", sm: "auto" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            onClick={handleFilter}
            variant="contained"
            color="primary"
            sx={{
              py: 1.5,
              maxWidth: { xs: "200px", sm: "auto" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Apply Filters
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            onClick={handleReset}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{
              py: 1.5,
              maxWidth: { xs: "200px", sm: "auto" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Filters;
