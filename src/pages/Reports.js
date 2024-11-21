import React from "react";
import { useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Box, Grid } from "@mui/material";
import ExcelExport from "../components/ExcelReport";

const Reports = () => {
  const transactions = useSelector((state) => state.transactions.transactions);
  const calculateTotals = (transactions) => {
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoriesMap = new Map();

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "expense") {
        totalExpenses += transaction.amount;
        if (transaction.category) {
          categoriesMap.set(
            transaction.category,
            (categoriesMap.get(transaction.category) || 0) + transaction.amount
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

  const getExpenseDistribution = () => {
    const totals = calculateTotals(transactions);
    return totals.categories.map((cat) => ({
      name: cat.name,
      value: cat.totalAmount,
    }));
  };

  const getIncomeExpenseComparison = () => {
    const totals = calculateTotals(transactions);
    return [
      { name: "Income", value: totals.totalIncome },
      { name: "Expenses", value: totals.totalExpenses },
    ];
  };

  const getSpendingTrends = () => {
    const monthlySpending = {};

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    sortedTransactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        const month = new Date(transaction.date).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        monthlySpending[month] =
          (monthlySpending[month] || 0) + transaction.amount;
      }
    });

    return Object.entries(monthlySpending).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  const getIncomeOverTime = () => {
    const monthlyIncome = {};
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    sortedTransactions.forEach((transaction) => {
      if (transaction.type === "income") {
        const month = new Date(transaction.date).toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        monthlyIncome[month] = (monthlyIncome[month] || 0) + transaction.amount;
      }
    });
    return Object.entries(monthlyIncome).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  const COLORS = ["#36A2EB", "#FF6384"];

  return (
    <div>
      <h2>Income vs Expenses</h2>
      <PieChart width={300} height={300}>
        <Pie
          data={getIncomeExpenseComparison()}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {getIncomeExpenseComparison().map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h2>Expense Distribution</h2>
      <PieChart width={300} height={300}>
        <Pie
          data={getExpenseDistribution()}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#82ca9d"
        />
        <Tooltip />
      </PieChart>

      <h2>Spending Trends</h2>
      <LineChart width={300} height={300} data={getSpendingTrends()}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
      </LineChart>

      <h2>Income Over Time</h2>
      <LineChart width={300} height={300} data={getIncomeOverTime()}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
      </LineChart>

      <Grid item xs={12}>
        <Box sx={{ marginBottom: 2 }}>
          <h2>Export Transactions</h2>
          <ExcelExport />
        </Box>
      </Grid>
    </div>
  );
};

export default Reports;
