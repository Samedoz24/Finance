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
import { login } from "../util/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { AuthContext } from "../store/auth-context";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler() {
    setIsAuthenticating(true);
    try {
      // DEĞİŞTİ: Artık aşçı bize hem bileti (token) hem de kimliği (uid) getiriyor
      const authData = await login(email, password);

      // Her ikisini de kasaya yerleştiriyoruz
      authCtx.authenticate(authData.token, authData.uid, authData.email);
    } catch (error) {
      Alert.alert("Giriş Başarısız", "E-posta veya şifreniz hatalı olabilir.");
      setIsAuthenticating(false);
    }
  }

  function switchAuthModeHandler() {
    navigation.navigate("Signup");
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
          <Text style={styles.title}>Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>

          <View style={styles.formContainer}>
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
              placeholder="Şifrenizi girin"
              placeholderTextColor={GlobalStyles.colors.gray500}
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.buttonContainer}>
              <Button onPress={loginHandler}>Giriş Yap</Button>
            </View>
          </View>

          <TouchableOpacity
            onPress={switchAuthModeHandler}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              Hesabınız yok mu?{" "}
              <Text style={styles.switchTextBold}>Kayıt Olun</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;

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
