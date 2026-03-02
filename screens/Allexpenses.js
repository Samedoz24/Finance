import { View, StyleSheet, Dimensions, Text } from "react-native";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext } from "react";
import { ExpensesContext } from "../store/expenses-context";
import { PieChart } from "react-native-chart-kit";
import { ThemeContext } from "../store/theme-context";

const screenWidth = Dimensions.get("window").width;

function AllExpenses() {
  const expensesCtx = useContext(ExpensesContext);
  const themeCtx = useContext(ThemeContext);
  const colors = themeCtx.colors;

  let yemekToplam = 0;
  let ulasimToplam = 0;
  let marketToplam = 0;
  let digerToplam = 0;

  expensesCtx.expenses.forEach((expense) => {
    const cat = expense.category || "diger";
    if (cat === "yemek") yemekToplam += expense.amount;
    else if (cat === "ulasim") ulasimToplam += expense.amount;
    else if (cat === "market") marketToplam += expense.amount;
    else digerToplam += expense.amount;
  });

  const chartData = [
    {
      name: "Yemek",
      amount: yemekToplam,
      color: "#e74c3c",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
    {
      name: "Ulaşım",
      amount: ulasimToplam,
      color: "#3498db",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
    {
      name: "Market",
      amount: marketToplam,
      color: "#2ecc71",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
    {
      name: "Diğer",
      amount: digerToplam,
      color: "#f1c40f",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
  ].filter((item) => item.amount > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {chartData.length > 0 && (
        <View
          style={[
            styles.chartContainer,
            {
              backgroundColor: colors.card,
              borderBottomColor: colors.background,
            },
          ]}
        >
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Harcama Dağılımı
          </Text>
          <PieChart
            data={chartData}
            width={screenWidth - 48}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
          />
        </View>
      )}

      <View style={styles.listContainer}>
        <ExpensesOutput
          expenses={expensesCtx.expenses}
          expensesPeriod="Toplam"
        />
      </View>
    </View>
  );
}

export default AllExpenses;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartContainer: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
  },
});
