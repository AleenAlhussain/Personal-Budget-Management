import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  addTransaction,
  editTransaction,
  addCategory,
} from "../redux/transactionsSlice";

const TransactionDialog = ({ open, handleClose, existingTransaction }) => {
  const [type, setType] = useState(existingTransaction?.type || "expense");
  const [amount, setAmount] = useState(existingTransaction?.amount || "");
  const [category, setCategory] = useState(existingTransaction?.category || "");
  const [description, setDescription] = useState(
    existingTransaction?.description || ""
  );
  const [date, setDate] = useState(existingTransaction?.date || "");
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const incomeCategories = useSelector(
    (state) => state.transactions.incomeCategories
  );
  const expenseCategories = useSelector(
    (state) => state.transactions.expenseCategories
  );

  useEffect(() => {
    if (existingTransaction) {
      setType(existingTransaction.type);
      setAmount(existingTransaction.amount);
      setCategory(existingTransaction.category);
      setDescription(existingTransaction.description);
      setDate(existingTransaction.date);
    }
  }, [existingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || (!category && !newCategory) || !date) {
      setError("All fields are required.");
      return;
    }

    if (
      newCategory &&
      !expenseCategories.includes(newCategory) &&
      !incomeCategories.includes(newCategory)
    ) {
      dispatch(addCategory({ name: newCategory, type }));
      setCategory(newCategory);
    }

    const transaction = {
      id: existingTransaction ? existingTransaction.id : Date.now(),
      type,
      amount: parseFloat(amount),
      category: newCategory || category,
      description,
      date,
    };

    if (existingTransaction) {
      dispatch(
        editTransaction({
          id: existingTransaction.id,
          updatedTransaction: transaction,
        })
      );
    } else {
      dispatch(addTransaction(transaction));
    }

    handleClose();
    setError("");
    setType("expense");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate("");
    setNewCategory("");
  };

  const categoriesToDisplay =
    type === "income" ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {existingTransaction ? "Edit Transaction" : "Add Transaction"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Select
            fullWidth
            value={type}
            onChange={(e) => setType(e.target.value)}
            margin="normal"
            required
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>

          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            required
          />

          <Select
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
            required={!newCategory}
          >
            {categoriesToDisplay.length > 0 ? (
              categoriesToDisplay.map((cat, index) => (
                <MenuItem key={index} value={cat.name}>
                  {" "}
                  {cat.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No categories available</MenuItem>
            )}
          </Select>
          <TextField
            fullWidth
            label="Add New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            margin="normal"
            placeholder="Type new category here"
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            required
          />
        </form>
      </DialogContent>

      {error && <p style={{ color: "red", marginLeft: "15px" }}>{error}</p>}

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          {existingTransaction ? "Update Transaction" : "Add Transaction"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDialog;
