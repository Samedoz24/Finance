import { useContext, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";
import { ExpensesContext } from "../store/expenses-context";

const CATEGORIES = [
  { id: "yemek", label: "Yemek", icon: "fast-food" },
  { id: "ulasim", label: "Ulaşım", icon: "bus" },
  { id: "market", label: "Market", icon: "cart" },
  { id: "diger", label: "Diğer", icon: "wallet" },
];

function ManageExpense({ route, navigation }) {
  const expensesCtx = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  const [amountValue, setAmountValue] = useState(
    selectedExpense ? selectedExpense.amount.toString() : ""
  );
  const [dateValue, setDateValue] = useState(
    selectedExpense ? selectedExpense.date : new Date()
  );
  const [descriptionValue, setDescriptionValue] = useState(
    selectedExpense ? selectedExpense.description : ""
  );

  const [categoryValue, setCategoryValue] = useState(
    selectedExpense && selectedExpense.category
      ? selectedExpense.category
      : "diger"
  );

  const [isDatePickerShow, setIsDatePickerShow] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Gider Düzenle" : "Gider Ekle",
    });
  }, [navigation, isEditing]);

  function deleteExpenseHandler() {
    expensesCtx.deleteExpense(editedExpenseId);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  function dateChangeHandler(event, selectedDate) {
    setIsDatePickerShow(false);
    if (selectedDate) {
      setDateValue(selectedDate);
    }
  }

  function confirmHandler() {
    const expenseAmount = +amountValue;
    const expenseDescription = descriptionValue.trim();

    const amountIsValid = !isNaN(expenseAmount) && expenseAmount > 0;
    const descriptionIsValid = expenseDescription.length > 0;

    if (!amountIsValid || !descriptionIsValid) {
      Alert.alert(
        "Geçersiz Giriş!",
        "Lütfen tutarın 0'dan büyük olduğundan ve açıklamayı boş bırakmadığınızdan emin olun."
      );
      return;
    }

    const expenseData = {
      amount: expenseAmount,
      date: dateValue,
      description: expenseDescription,
      category: categoryValue,
    };

    if (isEditing) {
      expensesCtx.updateExpense(editedExpenseId, expenseData);
    } else {
      expensesCtx.addExpense(expenseData);
    }
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Tutar</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          onChangeText={setAmountValue}
          value={amountValue}
          placeholder="Örn: 19.99"
        />

        <Text style={styles.label}>Tarih</Text>
        <Pressable onPress={() => setIsDatePickerShow(true)}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              value={dateValue.toISOString().slice(0, 10)}
              editable={false}
            />
          </View>
        </Pressable>

        {isDatePickerShow && (
          <DateTimePicker
            value={dateValue}
            mode="date"
            display="default"
            onChange={dateChangeHandler}
          />
        )}

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.categoriesContainer}>
          {CATEGORIES.map((cat) => {
            const isSelected = categoryValue === cat.id;
            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.categoryButton,
                  isSelected && styles.categoryButtonSelected,
                ]}
                onPress={() => setCategoryValue(cat.id)}
              >
                <Ionicons
                  name={cat.icon}
                  size={24}
                  color={isSelected ? "white" : GlobalStyles.colors.primary500}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          multiline={true}
          onChangeText={setDescriptionValue}
          value={descriptionValue}
          placeholder="Harcama detayını yazın..."
        />
      </View>

      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={cancelHandler}>
          İptal
        </Button>
        <Button style={styles.button} onPress={confirmHandler}>
          {isEditing ? "Güncelle" : "Ekle"}
        </Button>
      </View>

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={32}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.gray500,
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "white",
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    fontSize: 18,
    color: "black",
    marginBottom: 16,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    width: "22%",
  },
  categoryButtonSelected: {
    backgroundColor: GlobalStyles.colors.primary500,
  },
  categoryText: {
    fontSize: 12,
    marginTop: 4,
    color: GlobalStyles.colors.primary500,
  },
  categoryTextSelected: {
    color: "white",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 80,
    marginHorizontal: 8,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "white",
    alignItems: "center",
  },
});
