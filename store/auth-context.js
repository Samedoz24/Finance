import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  uid: "",
  email: "",
  name: "",
  currency: "₺",
  avatar: "", // YENİ: Avatar linki için hafıza
  isAuthenticated: false,
  authenticate: (token, uid, email, name, avatar) => {}, // DEĞİŞTİ: avatar eklendi
  logout: () => {},
  changeCurrency: (newCurrency) => {},
  changeAvatar: (newAvatar) => {}, // YENİ: Avatar değiştirme komutu
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [authUid, setAuthUid] = useState();
  const [authEmail, setAuthEmail] = useState();
  const [authName, setAuthName] = useState();
  const [currency, setCurrency] = useState("₺");

  // YENİ: Avatar state'i
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      const storedCurrency = await AsyncStorage.getItem("currency");
      if (storedCurrency) {
        setCurrency(storedCurrency);
      }
    }
    fetchSettings();
  }, []);

  function authenticate(token, uid, email, name, profileAvatar) {
    setAuthToken(token);
    setAuthUid(uid);
    setAuthEmail(email);
    setAuthName(name);

    // YENİ: Eğer avatar varsa kasaya ve telefona kaydet
    if (profileAvatar) {
      setAvatar(profileAvatar);
      AsyncStorage.setItem("avatar", profileAvatar);
    }

    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("uid", uid);
    AsyncStorage.setItem("email", email);
    if (name) {
      AsyncStorage.setItem("name", name);
    }
  }

  function logout() {
    setAuthToken(null);
    setAuthUid(null);
    setAuthEmail(null);
    setAuthName(null);
    setAvatar(""); // YENİ
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("uid");
    AsyncStorage.removeItem("email");
    AsyncStorage.removeItem("name");
    AsyncStorage.removeItem("avatar"); // YENİ
  }

  function changeCurrency(newCurrency) {
    setCurrency(newCurrency);
    AsyncStorage.setItem("currency", newCurrency);
  }

  // YENİ: Avatarı değiştirip telefona kazıyan fonksiyon
  function changeAvatar(newAvatar) {
    setAvatar(newAvatar);
    AsyncStorage.setItem("avatar", newAvatar);
  }

  const value = {
    token: authToken,
    uid: authUid,
    email: authEmail,
    name: authName,
    currency: currency,
    avatar: avatar, // YENİ
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    changeCurrency: changeCurrency,
    changeAvatar: changeAvatar, // YENİ
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
