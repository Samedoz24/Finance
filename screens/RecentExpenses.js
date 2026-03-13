import { View, Text, StyleSheet } from "react-native";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext, useEffect, useState } from "react";

import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDay } from "../util/date";
import { fetchExpenses } from "../util/http";

import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

// YENİ EKLENDİ: Kimlik kasamızı içeri alıyoruz
import { AuthContext } from "../store/auth-context";

function RecentExpenses() {
  const expensesCtx = useContext(ExpensesContext);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState();

  // YENİ EKLENDİ: Kasayı kullanıma açıyoruz
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        // DEĞİŞTİ: Artık token'ın yanına authCtx.uid de ekledik!
        const expenses = await fetchExpenses(authCtx.token, authCtx.uid);
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError(
          "Giderler yüklenemedi. Lütfen internet bağlantınızı kontrol edin."
        );
      }
      setIsFetching(false);
    }

    getExpenses();
  }, [authCtx.token, authCtx.uid]); // uid'yi de takibe aldık

  function errorHandler() {
    setError(null);
  }

  if (error && !isFetching) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

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
