import axios from "axios";

// 1. MERKEZ URL (Kendi Firebase linkini buraya yapıştır, sonunda '/' olmasın)
const BACKEND_URL = "https://finance-000-default-rtdb.firebaseio.com/";

// --- AŞÇININ GÖREVLERİ (FONKSİYONLAR) ---

// 1. Yeni Gider Ekleme (POST İsteği)
export async function storeExpense(expenseData) {
  const response = await axios.post(
    BACKEND_URL + "/expenses.json",
    expenseData
  );

  // Firebase'in oluşturduğu o benzersiz ID'yi (name) geri döndürüyoruz ki UI (Arayüz) bunu kullanabilsin
  const id = response.data.name;
  return id;
}

// 2. Giderleri Sunucudan Çekme (GET İsteği)
export async function fetchExpenses() {
  const response = await axios.get(BACKEND_URL + "/expenses.json");

  const expenses = [];

  // Veri varsa, o karmaşık yapıyı bizim anladığımız Diziye (Array) çeviriyoruz
  if (response.data) {
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
  }

  // Çevirdiğimiz bu tertemiz diziyi ekranlara (isteyene) gönderiyoruz
  return expenses;
}

// 3. Var Olan Gideri Güncelleme (PUT İsteği)
export function updateExpense(id, expenseData) {
  // Sadece URL'in sonuna güncellenecek elemanın id'sini ekliyoruz
  return axios.put(BACKEND_URL + `/expenses/${id}.json`, expenseData);
}

// 4. Gider Silme (DELETE İsteği)
export function deleteExpense(id) {
  // Sadece URL'in sonuna silinecek elemanın id'sini ekliyoruz
  return axios.delete(BACKEND_URL + `/expenses/${id}.json`);
}
