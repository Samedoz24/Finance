import { Pressable, View, StyleSheet, Text } from "react-native";
import { getFormatedDate } from "../../util/date";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { ThemeContext } from "../../store/theme-context";

const CATEGORY_ICONS = {
  yemek: "fast-food",
  ulasim: "bus",
  market: "cart",
  diger: "wallet",
};

function ExpenseItem({ description, amount, date, id, category }) {
  const navigation = useNavigation();

  const themeCtx = useContext(ThemeContext);
  const colors = themeCtx.colors;

  function expensePressHandler() {
    navigation.navigate("ManageExpense", {
      expenseId: id,
    });
  }

  const iconName = CATEGORY_ICONS[category] || CATEGORY_ICONS.diger;

  return (
    <Pressable
      onPress={expensePressHandler}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <View
        style={[
          styles.expenseItem,
          { backgroundColor: colors.card, shadowColor: colors.card },
        ]}
      >
        <View style={styles.infoContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={28} color={colors.textMuted} />
          </View>

          <View>
            <Text style={[styles.description, { color: colors.text }]}>
              {description}
            </Text>
            <Text style={{ color: colors.textMuted }}>
              {getFormatedDate(date)}
            </Text>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: colors.primary }]}>
            {amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default ExpenseItem;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  expenseItem: {
    padding: 12,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 6,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
  },
  amountContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    minWidth: 80,
  },
  amount: {
    fontWeight: "bold",
  },
});
