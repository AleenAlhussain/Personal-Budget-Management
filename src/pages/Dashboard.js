import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

function Dashboard() {
  const {
    totalIncome,
    totalExpenses,
    currentBalance,
    transactions,
    incomeCategories,
    expenseCategories,
  } = useSelector((state) => state.transactions);

  const allCategories = [
    ...incomeCategories.map((cat) => ({ ...cat, type: "income" })),
    ...expenseCategories.map((cat) => ({ ...cat, type: "expense" })),
  ];

  const expenseCategoryTotals = expenseCategories.map((cat) => ({
    name: cat.name,
    totalAmount: transactions
      .filter(
        (transaction) =>
          transaction.category === cat.name && transaction.type === "expense"
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0),
  }));

  const topExpenseCategories = expenseCategoryTotals
    .filter((cat) => cat.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 3);

  const expenseData = topExpenseCategories.map((cat) => ({
    name: cat.name,
    value: cat.totalAmount,
  }));

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"];

  const revenueExpenseData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];

  const getCategoryName = (transactionCategory) => {
    const category = allCategories.find(
      (cat) => cat.name === transactionCategory
    );
    return category ? category.name : "Unknown";
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Grid container spacing={isMobile ? 2 : 3}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant={isMobile ? "subtitle1" : "h6"}>
              Total Income
            </Typography>
            <Typography variant={isMobile ? "h6" : "h5"}>
              ${totalIncome}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant={isMobile ? "subtitle1" : "h6"}>
              Total Expenses
            </Typography>
            <Typography variant={isMobile ? "h6" : "h5"}>
              ${totalExpenses}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant={isMobile ? "subtitle1" : "h6"}>
              Current Balance
            </Typography>
            <Typography variant={isMobile ? "h6" : "h5"}>
              ${currentBalance}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant={isMobile ? "subtitle1" : "h6"}>
              Recent Transactions
            </Typography>
            <List>
              {transactions.slice(0, 5).map((transaction) => (
                <ListItem key={transaction.id}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Typography variant={isMobile ? "body2" : "subtitle1"}>
                        {transaction.date}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {getCategoryName(transaction.category)}
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography variant={isMobile ? "body2" : "body1"}>
                        {transaction.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        variant={isMobile ? "body2" : "body1"}
                        color={
                          transaction.type === "expense" ? "error" : "primary"
                        }
                      >
                        ${transaction.amount}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant={isMobile ? "subtitle1" : "h6"}>
              Revenue vs Expenses
            </Typography>
            <PieChart
              width={isMobile ? 250 : isTablet ? 350 : 400}
              height={isMobile ? 200 : 300}
            >
              <Pie
                data={revenueExpenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : 80}
                fill="#8884d8"
                label
              >
                {revenueExpenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant={isMobile ? "subtitle1" : "h6"}>
              Top 3 Categories of Expenses
            </Typography>
            <PieChart
              width={isMobile ? 250 : isTablet ? 350 : 400}
              height={isMobile ? 200 : 300}
            >
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 60 : 80}
                fill="#82ca9d"
                label
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

            <List>
              {topExpenseCategories.map((cat, index) => (
                <ListItem key={cat.name}>
                  {index + 1}. {cat.name}: ${cat.totalAmount}{" "}
                  {totalExpenses > 0 && (
                    <span>
                      ({((cat.totalAmount / totalExpenses) * 100).toFixed(2)}%)
                    </span>
                  )}
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
