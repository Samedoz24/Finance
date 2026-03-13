import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";

// Kalıcı hafıza ve Yükleme Ekranı
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "./components/UI/LoadingOverlay";

// Ekranlar
import ManageExpense from "./screens/ManageExpense";
import AllExpenses from "./screens/Allexpenses";
import RecentExpenses from "./screens/RecentExpenses";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileScreen from "./screens/ProfileScreen";

// Bileşenler ve Sabitler
import IconButton from "./components/UI/IconButton";
import { GlobalStyles } from "./constants/styles";

// Kasalar (Context)
import ExpensesContextProvider from "./store/expenses-context";
import { ThemeContextProvider, ThemeContext } from "./store/theme-context";
import AuthContextProvider, { AuthContext } from "./store/auth-context";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

// 1. ANA UYGULAMA İÇERİĞİ
function ExpensesOverview({ navigation }) {
  const themeCtx = useContext(ThemeContext);
  const colors = themeCtx.colors;

  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.accent,
        tabBarStyle: { backgroundColor: colors.header, borderTopWidth: 0 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,

        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            size={26}
            color={tintColor}
            onPress={() => {
              navigation.navigate("ManageExpense");
            }}
          />
        ),

        headerLeft: () => (
          <IconButton
            icon={themeCtx.isDark ? "sunny" : "moon"}
            size={24}
            color={themeCtx.isDark ? "#f1c40f" : colors.primary}
            onPress={themeCtx.toggleTheme}
          />
        ),
      }}
    >
      <BottomTabs.Screen
        name="SonHarcamalar"
        component={RecentExpenses}
        options={{
          title: "Son Harcamalar",
          tabBarLabel: "Son Harcamalar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Tüm Masraflar"
        component={AllExpenses}
        options={{
          title: "Tüm Masraflar",
          tabBarLabel: "Tüm Masraflar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

// 2. GİRİŞ YAPMAMIŞ KULLANICI YIĞINI
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.gray500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.gray700 },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Giriş Yap" }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ title: "Kayıt Ol" }}
      />
    </Stack.Navigator>
  );
}

// 3. GİRİŞ YAPMIŞ KULLANICI YIĞINI
function AuthenticatedStack() {
  const themeCtx = useContext(ThemeContext);
  const colors = themeCtx.colors;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.accent,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="ExpensesOverview"
        component={ExpensesOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageExpense"
        component={ManageExpense}
        options={{ presentation: "modal", title: "Masraf Yönetimi" }}
      />
    </Stack.Navigator>
  );
}

// 4. KAPI GÖREVLİSİ (Yönlendirici)
function Navigation() {
  const authCtx = useContext(AuthContext);
  const themeCtx = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <StatusBar style={themeCtx.isDark ? "light" : "dark"} />
      {authCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
// 5. UYGULAMA UYANIRKEN BİLGİLERİ HATIRLAMA
function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUid = await AsyncStorage.getItem("uid");
      const storedEmail = await AsyncStorage.getItem("email");
      const storedName = await AsyncStorage.getItem("name");

      // YENİ EKLENDİ: Avatarı telefon hafızasından çekiyoruz
      const storedAvatar = await AsyncStorage.getItem("avatar");

      if (storedToken && storedUid && storedEmail) {
        // DEĞİŞTİ: Artık avatarı da (storedAvatar) en sona ekleyerek kasaya yolluyoruz
        authCtx.authenticate(
          storedToken,
          storedUid,
          storedEmail,
          storedName,
          storedAvatar
        );
      }
      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <LoadingOverlay />;
  }

  return <Navigation />;
}
// 6. ANA KAPSAYICI
export default function App() {
  return (
    <ThemeContextProvider>
      <AuthContextProvider>
        <ExpensesContextProvider>
          <Root />
        </ExpensesContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  );
}

const styles = StyleSheet.create({});
