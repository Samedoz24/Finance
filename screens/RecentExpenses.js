import { View, Text, StyleSheet } from "react-native";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext, useEffect, useState } from "react";

import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDay } from "../util/date";
import { fetchExpenses } from "../util/http";

// YENİ EKLENDİ: Kendi yaptığımız şık bileşenleri çağırıyoruz
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenses() {
  const expensesCtx = useContext(ExpensesContext);
  const [isFetching, setIsFetching] = useState(true);

  // YENİ EKLENDİ: Hata durumunu tutacağımız state
  const [error, setError] = useState();

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses();
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        // HATA YAKALANDI: State'e hata mesajımızı yazıyoruz
        setError(
          "Giderler yüklenemedi. Lütfen internet bağlantınızı kontrol edin."
        );
      }
      setIsFetching(false);
    }

    getExpenses();
  }, []);

  // YENİ EKLENDİ: Kullanıcı hatayı okuyup "Tamam"a basınca hatayı ekrandan silen fonksiyon
  function errorHandler() {
    setError(null);
  }

  // KOŞUL 1: Eğer bir hata varsa, sadece Hata Ekranını göster ve dur!
  if (error && !isFetching) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }

  // KOŞUL 2: Eğer veriler hala yükleniyorsa, sadece Yükleme Ekranını göster ve dur!
  if (isFetching) {
    return <LoadingOverlay />;
  }

  // KOŞUL 3: Her şey yolundaysa normal listeyi göster
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
