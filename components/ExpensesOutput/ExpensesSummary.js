import { View, Text, StyleSheet } from "react-native"; // FlatList ve Platform kullanılmadığı için temizledik
import { useContext } from "react"; // YENİ EKLENDİ
import { GlobalStyles } from "../../constants/styles";
import { AuthContext } from "../../store/auth-context"; // YENİ EKLENDİ

function ExpensesSummary({ periodName, expenses }) {
  // YENİ EKLENDİ: Kasadan para birimini çekiyoruz
  const authCtx = useContext(AuthContext);
  const userCurrency = authCtx.currency;

  const expensesSum = expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.period}>{periodName}</Text>
      {/* DEĞİŞTİ: Sabit ₺ yerine dinamik userCurrency kullanıyoruz */}
      <Text style={styles.sum}>
        {expensesSum.toFixed(2)} {userCurrency}
      </Text>
    </View>
  );
}

export default ExpensesSummary;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  period: {
    fontSize: 15,
    color: GlobalStyles.colors.primary400,
  },
  sum: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary800,
  },
});
