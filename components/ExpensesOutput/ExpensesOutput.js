import { View, StyleSheet } from "react-native";
import ExpensesSummary from "./ExpensesSummary";
import ExpensesList from "./ExpensesList";
import { useContext } from "react";

import { ThemeContext } from "../../store/theme-context";

function ExpensesOutput({ expenses, expensesPeriod }) {
  const themeCtx = useContext(ThemeContext);
  const colors = themeCtx.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ExpensesSummary expenses={expenses} periodName={expensesPeriod} />
      <ExpensesList expenses={expenses} />
    </View>
  );
}

export default ExpensesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
