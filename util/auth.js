import axios from "axios";

// ⚠️ KENDİ FIREBASE API ANAHTARINI BURAYA YAPIŞTIR
const API_KEY = "AIzaSyCAquVhN4eEuNYBYv4h00n8AmUaeBQ7vvg";

async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  return {
    token: response.data.idToken,
    uid: response.data.localId,
    email: response.data.email,
  };
}

export function createUser(email, password) {
  return authenticate("signUp", email, password);
}

export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}

// =======================================================
// PROFİL VE GÜVENLİK İŞLEMLERİ (SONRADAN EKLENENLER)
// =======================================================

// 1. Şifre Sıfırlama Bağlantısı Gönderme
export async function resetPassword(email) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;
  await axios.post(url, {
    requestType: "PASSWORD_RESET",
    email: email,
  });
}

// 2. Kullanıcı Hesabını Tamamen Silme
export async function deleteUserAccount(token) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}`;
  await axios.post(url, {
    idToken: token,
  });
}

// 3. Kullanıcının İsim (Vitrin Adı) Bilgisini Firebase'e Kaydetme
export async function updateProfileName(token, name) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;
  await axios.post(url, {
    idToken: token,
    displayName: name,
    returnSecureToken: true,
  });
}

// 4. Kasaya Koymak İçin Firebase'den E-posta ve İsmi Geri Çekme
export async function getUserDetails(token) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`;

  const response = await axios.post(url, {
    idToken: token,
  });

  // Sadece e-postayı değil, ismi de paket yapıp gönderiyoruz
  return {
    email: response.data.users[0].email,
    name: response.data.users[0].displayName || "Kullanıcı", // Eğer isim yoksa "Kullanıcı" yazsın
  };
}
