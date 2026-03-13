import axios from "axios";

// KENDİ FİREBASE LİNKİNİ BURAYA YAPIŞTIR (Sonda / olmasın)
const BACKEND_URL = "https://finance-000-default-rtdb.firebaseio.com";

// DEĞİŞTİ: Artık fonksiyonlara 'uid' de geliyor ve adres /users/${uid}/expenses şeklinde değişti!

export async function storeExpense(expenseData, token, uid) {
  const response = await axios.post(
    BACKEND_URL + `/users/${uid}/expenses.json?auth=${token}`,
    expenseData
  );
  const id = response.data.name;
  return id;
}

export async function fetchExpenses(token, uid) {
  const response = await axios.get(
    BACKEND_URL + `/users/${uid}/expenses.json?auth=${token}`
  );
  const expenses = [];

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
      category: response.data[key].category,
    };
    expenses.push(expenseObj);
  }
  return expenses;
}

export function updateExpense(id, expenseData, token, uid) {
  return axios.put(
    BACKEND_URL + `/users/${uid}/expenses/${id}.json?auth=${token}`,
    expenseData
  );
}

export function deleteExpense(id, token, uid) {
  return axios.delete(
    BACKEND_URL + `/users/${uid}/expenses/${id}.json?auth=${token}`
  );
}

// YENİ EKLENDİ: Kullanıcının tüm harcamalarını tek seferde silme
export function deleteAllExpenses(token, uid) {
  // Sona belirli bir ID yazmadığımız için tüm expenses klasörünü uçurur
  return axios.delete(
    BACKEND_URL + `/users/${uid}/expenses.json?auth=${token}`
  );
}
