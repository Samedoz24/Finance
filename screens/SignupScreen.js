import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Button from "../components/UI/Button";
import { GlobalStyles } from "../constants/styles";

// DEĞİŞTİ: updateProfileName fonksiyonunu da içeri aldık
import { createUser, updateProfileName } from "../util/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";

import { AuthContext } from "../store/auth-context";

function SignupScreen({ navigation }) {
  // YENİ EKLENDİ: İsim için hafıza
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler() {
    // İsim kutusu boş mu kontrolü
    if (name.trim().length === 0) {
      Alert.alert("Eksik Bilgi", "Lütfen adınızı ve soyadınızı girin.");
      return;
    }

    setIsAuthenticating(true);
    try {
      // 1. Firebase'de e-posta ve şifre ile hesabı oluştur
      const authData = await createUser(email, password);

      // 2. YENİ EKLENDİ: Oluşan bu hesaba kullanıcının ismini (Vitrin Adı) kaydet
      await updateProfileName(authData.token, name);

      // 3. DEĞİŞTİ: Artık kasaya ismi (name) de gönderiyoruz
      authCtx.authenticate(authData.token, authData.uid, authData.email, name);
    } catch (error) {
      Alert.alert(
        "Kayıt Başarısız",
        "Lütfen bilgilerinizi kontrol edin (Şifre en az 6 haneli olmalı veya bu e-posta zaten kullanımda olabilir)."
      );
      setIsAuthenticating(false);
    }
  }

  function switchAuthModeHandler() {
    navigation.goBack();
  }

  if (isAuthenticating) {
    return <LoadingOverlay />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Aramıza Katılın</Text>
          <Text style={styles.subtitle}>Yeni bir hesap oluşturun</Text>

          <View style={styles.formContainer}>
            {/* YENİ EKLENDİ: İsim Kutucuğu */}
            <Text style={styles.label}>Adınız Soyadınız</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Samet Öz"
              placeholderTextColor={GlobalStyles.colors.gray500}
              autoCapitalize="words" // Her kelimenin baş harfini büyük yapar
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>E-posta</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: mail@adresiniz.com"
              placeholderTextColor={GlobalStyles.colors.gray500}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="En az 6 karakter"
              placeholderTextColor={GlobalStyles.colors.gray500}
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.buttonContainer}>
              <Button onPress={signupHandler}>Kayıt Ol</Button>
            </View>
          </View>

          <TouchableOpacity
            onPress={switchAuthModeHandler}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              Zaten hesabınız var mı?{" "}
              <Text style={styles.switchTextBold}>Giriş Yapın</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.gray700,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: GlobalStyles.colors.primary100,
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: GlobalStyles.colors.gray500,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  label: { color: "white", marginBottom: 8, fontWeight: "bold" },
  input: {
    backgroundColor: GlobalStyles.colors.primary50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    color: GlobalStyles.colors.primary700,
  },
  buttonContainer: { marginTop: 12 },
  switchButton: { marginTop: 24, alignItems: "center" },
  switchText: { color: GlobalStyles.colors.primary100, fontSize: 16 },
  switchTextBold: { fontWeight: "bold", color: "white" },
});
