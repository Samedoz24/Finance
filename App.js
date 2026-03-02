import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";

import ManageExpense from "./screens/ManageExpense";
import AllExpenses from "./screens/Allexpenses";
import RecentExpenses from "./screens/RecentExpenses";
import IconButton from "./components/UI/IconButton";

import ExpensesContextProvider from "./store/expenses-context";
import { ThemeContextProvider, ThemeContext } from "./store/theme-context";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

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
        name="TümMasraflar"
        component={AllExpenses}
        options={{
          title: "Tüm Masraflar",
          tabBarLabel: "Tüm Masraflar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

function Navigation() {
  const themeCtx = useContext(ThemeContext);
  const colors = themeCtx.colors;

  return (
    <NavigationContainer>
      <StatusBar style={themeCtx.isDark ? "light" : "dark"} />

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
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeContextProvider>
      <ExpensesContextProvider>
        <Navigation />
      </ExpensesContextProvider>
    </ThemeContextProvider>
  );
}

const styles = StyleSheet.create({});
