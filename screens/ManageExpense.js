import { useContext, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";
import { ExpensesContext } from "../store/expenses-context";
import { storeExpense, updateExpense, deleteExpense } from "../util/http";

import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

// KASAMIZI İÇERİ ALIYORUZ
import { AuthContext } from "../store/auth-context";

const CATEGORIES = [
  { id: "yemek", label: "Yemek", icon: "fast-food" },
  { id: "ulasim", label: "Ulaşım", icon: "bus" },
  { id: "market", label: "Market", icon: "cart" },
  { id: "diger", label: "Diğer", icon: "wallet" },
];

function ManageExpense({ route, navigation }) {
  const expensesCtx = useContext(ExpensesContext);

  // KASAYI KULLANIMA AÇIYORUZ
  const authCtx = useContext(AuthContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;
  const selectedExpense = expensesCtx.expenses.find(
    (e) => e.id === editedExpenseId
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Gider Düzenle" : "Gider Ekle",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      // SİLME İŞLEMİNE BİLET VE KİMLİK (UID) EKLENDİ
      await deleteExpense(editedExpenseId, authCtx.token, authCtx.uid);
      expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setError("Gider silinemedi. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
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

  async function confirmHandler() {
    const expenseAmount = +amountValue;
    const expenseDescription = descriptionValue.trim();

    if (
      isNaN(expenseAmount) ||
      expenseAmount <= 0 ||
      expenseDescription.length === 0
    ) {
      return;
    }

    const expenseData = {
      amount: expenseAmount,
      date: dateValue,
      description: expenseDescription,
      category: categoryValue,
    };

    setIsSubmitting(true);
    try {
      if (isEditing) {
        // GÜNCELLEME İŞLEMİNE BİLET VE KİMLİK (UID) EKLENDİ
        await updateExpense(
          editedExpenseId,
          expenseData,
          authCtx.token,
          authCtx.uid
        );
        expensesCtx.updateExpense(editedExpenseId, expenseData);
      } else {
        // EKLEME İŞLEMİNE BİLET VE KİMLİK (UID) EKLENDİ
        const id = await storeExpense(expenseData, authCtx.token, authCtx.uid);
        expensesCtx.addExpense({ ...expenseData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError("Veriler kaydedilemedi. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  }

  function errorHandler() {
    setError(null);
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
                    color={
                      isSelected ? "white" : GlobalStyles.colors.primary500
                    }
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
    </TouchableWithoutFeedback>
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
