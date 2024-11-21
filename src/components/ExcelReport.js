import React, { useState } from "react";
import { useSelector } from "react-redux";
import ExcelJS from "exceljs";
import { Button, TextField, Box, Grid } from "@mui/material";

const ExcelExport = () => {
  const transactions = useSelector((state) => state.transactions.transactions);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleExport = (type) => {
    let filteredTransactions = transactions.filter((tx) => tx.type === type);

    if (startDate && endDate) {
      filteredTransactions = filteredTransactions.filter((tx) => {
        const date = new Date(tx.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = [
      { header: "ID", key: "id" },
      { header: "Type", key: "type" },
      { header: "Category", key: "category" },
      { header: "Description", key: "description" },
      { header: "Amount", key: "amount" },
      { header: "Date", key: "date" },
    ];

    filteredTransactions.forEach((tx) => worksheet.addRow(tx));

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_report.xlsx`;
      a.click();
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid
        container
        spacing={2}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Grid item xs={12} sm={6} md={4} sx={{ maxWidth: "250px" }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ maxWidth: "250px" }}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            fullWidth
          />
        </Grid>
      </Grid>

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        sx={{ mt: 2, gap: 2 }}
      >
        <Button
          onClick={() => handleExport("income")}
          variant="contained"
          color="primary"
          sx={{
            mb: { xs: 1, sm: 0 },

            maxWidth: "200px",
            width: "100%",
          }}
        >
          Export Incomes
        </Button>
        <Button
          onClick={() => handleExport("expense")}
          variant="contained"
          color="primary"
          sx={{
            maxWidth: "200px",
            width: "100%",
          }}
        >
          Export Expenses
        </Button>
      </Box>
    </Box>
  );
};

export default ExcelExport;
