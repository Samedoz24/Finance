import { View, Text, StyleSheet } from "react-native";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext } from "react";

import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDay } from "../util/date";

function RecentExpenses() {
  const expensesCtx = useContext(ExpensesContext);

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDay(today, 7);

    return expense.date > date7DaysAgo;
  });

  return (
    <ExpensesOutput expenses={recentExpenses} expensesPeriod="Son 7 Gün" />
  );
}

export default RecentExpenses;
