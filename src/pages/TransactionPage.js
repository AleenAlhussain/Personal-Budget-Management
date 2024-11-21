import React, { useState } from "react";
import { useSelector } from "react-redux";
import TransactionDialog from "../components/TransactionDialog";
import Filters from "../components/Filters";
import SortTransactions from "../components/SortTransactions";
import TransactionList from "../components/TransactionList";
import { Card, CardContent, Typography, Box } from "@mui/material";

const TransactionPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const currentBalance = useSelector(
    (state) => state.transactions.currentBalance
  );

  const handleOpenDialog = (transaction = null) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div>
      <h2>Total Budget: ${currentBalance}</h2>

      <Card
        variant="outlined"
        sx={{
          width: { xs: 250, sm: 300 },
          marginBottom: "20px",
          cursor: "pointer",
          textAlign: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <CardContent onClick={() => handleOpenDialog()}>
          <Typography variant="h6" component="div">
            + Add Transaction
          </Typography>
        </CardContent>
      </Card>

      <div style={{ marginBottom: "20px" }}>
        <Filters />
        <SortTransactions />
      </div>

      <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
        <TransactionList handleOpenDialog={handleOpenDialog} />
      </Box>

      <TransactionDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        existingTransaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionPage;
