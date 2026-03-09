import { createContext, useReducer } from "react";

const DUMMY_EXPENSES = [];

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date, category }) => {},
  // YENİ EKLENDİ: Firebase'den gelen verileri tek seferde Context'e basmak için
  setExpenses: (expenses) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, amount, date, category }) => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      // DEĞİŞTİRİLDİ: Eğer payload'ın içinde id varsa onu kullan (Firebase id'si), yoksa rastgele üret
      const id =
        action.payload.id || new Date().toString() + Math.random().toString();
      return [{ ...action.payload, id: id }, ...state];

    // YENİ EKLENDİ: Verileri ters çevirip state'e yazıyoruz (En yeni harcama en üstte görünsün diye)
    case "SET":
      const inverted = action.payload.reverse();
      return inverted;

    case "UPDATE":
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;

    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);

    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, DUMMY_EXPENSES);

  function addExpense(expenseData) {
    dispatch({ type: "ADD", payload: expenseData });
  }

  // YENİ EKLENDİ: setExpenses Fonksiyonu
  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expenseData } });
  }

  const value = {
    expenses: expensesState,
    addExpense: addExpense,
    setExpenses: setExpenses, // YENİ EKLENDİ: Provider'a dahil ettik
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
