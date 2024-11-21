import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
  filteredTransactions: [],
  totalIncome: 10000,
  totalExpenses: 0,
  currentBalance: 10000,
  incomeCategories: [{ name: "Salary" }, { name: "Investments" }],
  expenseCategories: [{ name: "Rent" }, { name: "Groceries" }],
  allCategories: [],
  filters: {
    category: "",
    type: "",
    date: "",
  },
  sortBy: "date",
};

const calculateTotals = (transactions) => {
  let totalIncome = 10000;
  let totalExpenses = 0;
  let categoriesMap = new Map();

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else if (transaction.type === "expense") {
      totalExpenses += transaction.amount;
      if (transaction.category) {
        if (!categoriesMap.has(transaction.category)) {
          categoriesMap.set(transaction.category, 0);
        }
        categoriesMap.set(
          transaction.category,
          categoriesMap.get(transaction.category) + transaction.amount
        );
      }
    }
  });

  const categoriesArray = Array.from(categoriesMap.entries()).map(
    ([name, totalAmount]) => ({
      name,
      totalAmount,
    })
  );

  return {
    totalIncome,
    totalExpenses,
    currentBalance: totalIncome - totalExpenses,
    categories: categoriesArray,
  };
};

const applyFilters = (transactions, filters) => {
  return transactions.filter((transaction) => {
    const matchesCategory =
      !filters.category || transaction.category === filters.category;
    const matchesType = !filters.type || transaction.type === filters.type;
    const matchesDate = !filters.date || transaction.date === filters.date;

    return matchesCategory && matchesType && matchesDate;
  });
};
const applySorting = (transactions, sortBy) => {
  return [...transactions].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === "amount") {
      return a.amount - b.amount;
    }
    if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const { categoryName, type } = action.payload;
      if (type === "income") {
        const incomeCategoryExists = state.incomeCategories.some(
          (cat) => cat.name === categoryName
        );
        if (!incomeCategoryExists) {
          state.incomeCategories.push({ name: categoryName });
        }
      } else if (type === "expense") {
        const expenseCategoryExists = state.expenseCategories.some(
          (cat) => cat.name === categoryName
        );
        if (!expenseCategoryExists) {
          state.expenseCategories.push({ name: categoryName });
        }
      }

      if (!state.allCategories.some((cat) => cat.name === categoryName)) {
        state.allCategories.push({ name: categoryName });
      }
    },
    addTransaction: (state, action) => {
      const newTransaction = action.payload;
      if (
        newTransaction.type === "expense" &&
        state.totalIncome - state.totalExpenses < newTransaction.amount
      ) {
        alert("You cannot spend more than your total income!");
        return;
      }
      if (newTransaction.category) {
        const categoryExists =
          newTransaction.type === "income"
            ? state.incomeCategories.some(
                (cat) => cat.name === newTransaction.category
              )
            : state.expenseCategories.some(
                (cat) => cat.name === newTransaction.category
              );

        if (!categoryExists) {
          if (newTransaction.type === "income") {
            state.incomeCategories.push({ name: newTransaction.category });
          } else if (newTransaction.type === "expense") {
            state.expenseCategories.push({ name: newTransaction.category });
          }
        }
      }

      state.transactions.push(newTransaction);
      state.filteredTransactions = applyFilters(
        state.transactions,
        state.filters
      );
      const totals = calculateTotals(state.transactions);
      state.totalIncome = Math.max(totals.totalIncome, 0);
      state.totalExpenses = Math.max(totals.totalExpenses, 0);
      state.currentBalance = Math.max(totals.currentBalance, 0);
    },

    editTransaction: (state, action) => {
      const { id, updatedTransaction } = action.payload;
      const index = state.transactions.findIndex((tx) => tx.id === id);

      if (index !== -1) {
        const oldTransaction = state.transactions[index];
        const oldCategory = oldTransaction.category;
        const oldType = oldTransaction.type;

        state.transactions[index] = updatedTransaction;
        if (
          oldType !== updatedTransaction.type ||
          oldCategory !== updatedTransaction.category
        ) {
          if (updatedTransaction.type === "income") {
            if (!state.incomeCategories.includes(updatedTransaction.category)) {
              state.incomeCategories.push(updatedTransaction.category);
            }
          } else if (updatedTransaction.type === "expense") {
            if (
              !state.expenseCategories.includes(updatedTransaction.category)
            ) {
              state.expenseCategories.push(updatedTransaction.category);
            }
          }
          const remainingCategories = state.transactions
            .filter((tx) => tx.type === oldType)
            .map((tx) => tx.category)
            .filter((cat, idx, arr) => arr.indexOf(cat) === idx);

          if (oldType === "income") {
            state.incomeCategories = state.incomeCategories.filter((cat) =>
              remainingCategories.includes(cat)
            );
          } else if (oldType === "expense") {
            state.expenseCategories = state.expenseCategories.filter((cat) =>
              remainingCategories.includes(cat)
            );
          }
        }

        state.filteredTransactions = applyFilters(
          state.transactions,
          state.filters
        );

        const totals = calculateTotals(state.transactions);
        state.totalIncome = Math.max(totals.totalIncome, 0);
        state.totalExpenses = Math.max(totals.totalExpenses, 0);
        state.currentBalance = Math.max(totals.currentBalance, 0);

        state.filteredTransactions = applySorting(
          state.filteredTransactions,
          state.sortBy
        );
      }
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.filteredTransactions = applyFilters(
        state.transactions,
        state.filters
      );
      state.filteredTransactions = applySorting(
        state.filteredTransactions,
        state.sortBy
      );
    },
    sortTransactions: (state, action) => {
      state.sortBy = action.payload;
      state.filteredTransactions = applySorting(
        state.filteredTransactions,
        state.sortBy
      );
    },
  },
});

export const {
  addCategory,
  addTransaction,
  deleteTransaction,
  editTransaction,
  setFilters,
  sortTransactions,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
