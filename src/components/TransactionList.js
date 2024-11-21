import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { deleteTransaction } from "../redux/transactionsSlice";

const TransactionList = () => {
  const dispatch = useDispatch();
  const filteredTransactions = useSelector(
    (state) => state.transactions.filteredTransactions
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleOpenDialog = (transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDeleteTransaction = (transactionId) => {
    dispatch(deleteTransaction(transactionId));
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ overflow: "auto", maxWidth: { xs: 300, sm: "none" } }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(transaction)}>
                    Edit
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionList;
