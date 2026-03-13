import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../store/auth-context";
import { ThemeContext } from "../store/theme-context";
import { ExpensesContext } from "../store/expenses-context";

import { resetPassword, deleteUserAccount } from "../util/auth";
import { deleteAllExpenses } from "../util/http";

const AVATARS = [
  "https://api.dicebear.com/9.x/avataaars/png?seed=Felix&backgroundColor=b6e3f4&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Aneka&backgroundColor=ffdfbf&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Mimi&backgroundColor=c0aede&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Jack&backgroundColor=d1d4f9&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Luna&backgroundColor=ffd5dc&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Leo&backgroundColor=b6e3f4&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Nala&backgroundColor=ffdfbf&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Simba&backgroundColor=c0aede&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Cleo&backgroundColor=d1d4f9&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Oscar&backgroundColor=ffd5dc&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Jasper&backgroundColor=b6e3f4&size=256",
  "https://api.dicebear.com/9.x/avataaars/png?seed=Bella&backgroundColor=ffdfbf&size=256",
];

function ProfileScreen() {
  const authCtx = useContext(AuthContext);
  const themeCtx = useContext(ThemeContext);
  const expensesCtx = useContext(ExpensesContext);

  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  // 🆕 Para birimi seçimi için yeni bir modal state'i ekledik
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);

  const userEmail = authCtx.email;
  const userName = authCtx.name || "Kullanıcı";
  const userCurrency = authCtx.currency;
  const userAvatar = authCtx.avatar;

  const totalExpensesCount = expensesCtx.expenses.length;
  const totalExpensesAmount = expensesCtx.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const colors = themeCtx.colors;
  const dynamicPrimaryColor = themeCtx.isDark ? "white" : colors.primary;

  function selectAvatarHandler(avatarUrl) {
    authCtx.changeAvatar(avatarUrl);
    setIsAvatarModalVisible(false);
  }

  // 💰 Para Birimi Seçme Mantığı
  function selectCurrencyHandler(symbol) {
    authCtx.changeCurrency(symbol);
    setIsCurrencyModalVisible(false);
  }

  async function changePasswordHandler() {
    Alert.alert(
      "Şifre Değiştirme",
      `${userEmail} adresine bir şifre sıfırlama bağlantısı gönderilecek. Onaylıyor musunuz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet, Gönder",
          onPress: async () => {
            try {
              await resetPassword(userEmail);
              Alert.alert("Başarılı!", "Bağlantı gönderildi.");
            } catch (error) {
              Alert.alert("Hata", "Şu an işlem yapılamıyor.");
            }
          },
        },
      ]
    );
  }

  function clearAllDataHandler() {
    if (totalExpensesCount === 0) {
      Alert.alert("Zaten Boş", "Silinecek veri yok.");
      return;
    }
    Alert.alert(
      "DİKKAT!",
      "Tüm harcamalarınız KALICI olarak silinecektir. Onaylıyor musunuz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Hepsini Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAllExpenses(authCtx.token, authCtx.uid);
              expensesCtx.clearAllExpenses();
            } catch (error) {
              Alert.alert("Hata", "Silme işlemi başarısız.");
            }
          },
        },
      ]
    );
  }

  function deleteAccountHandler() {
    Alert.alert(
      "HESABI SİL",
      "Hesabınız ve tüm verileriniz kalıcı olarak silinecektir. Bu işlemin geri dönüşü yoktur!",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Hesabımı Sil",
          style: "destructive",
          onPress: async () => {
            try {
              if (totalExpensesCount > 0) {
                await deleteAllExpenses(authCtx.token, authCtx.uid);
              }
              await deleteUserAccount(authCtx.token);
              expensesCtx.clearAllExpenses();
              authCtx.logout();
            } catch (error) {
              Alert.alert("Hata", "Lütfen çıkış yapıp tekrar girerek deneyin.");
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 🎭 Avatar Seçme Modalı (Senin Mevcut Yapın) */}
      <Modal
        visible={isAvatarModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Bir Karakter Seçin
            </Text>

            <View style={styles.avatarGrid}>
              {AVATARS.map((imgUrl, index) => (
                <Pressable
                  key={index}
                  onPress={() => selectAvatarHandler(imgUrl)}
                >
                  <Image
                    source={{ uri: imgUrl }}
                    style={[
                      styles.gridAvatar,
                      userAvatar === imgUrl && {
                        borderColor: dynamicPrimaryColor,
                        borderWidth: 3,
                      },
                    ]}
                  />
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[
                styles.closeModalBtn,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => setIsAvatarModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Vazgeç</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 🇪🇺 YENİ: Para Birimi Seçme Modalı (Android Sorununu Çözen Yapı) */}
      <Modal
        visible={isCurrencyModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.currencyModalContent,
              { backgroundColor: colors.card },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: colors.text, marginBottom: 20 },
              ]}
            >
              Para Birimi Seçin
            </Text>

            {[
              { label: "₺ - Türk Lirası", value: "₺" },
              { label: "$ - Amerikan Doları", value: "$" },
              { label: "€ - Euro", value: "€" },
            ].map((item) => (
              <Pressable
                key={item.value}
                style={({ pressed }) => [
                  styles.currencyOption,
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => selectCurrencyHandler(item.value)}
              >
                <Text
                  style={[styles.currencyOptionText, { color: colors.text }]}
                >
                  {item.label}
                </Text>
                {userCurrency === item.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={dynamicPrimaryColor}
                  />
                )}
              </Pressable>
            ))}

            <Pressable
              style={[
                styles.closeModalBtn,
                { backgroundColor: "#ef4444", marginTop: 15 },
              ]}
              onPress={() => setIsCurrencyModalVisible(false)}
            >
              <Text style={styles.closeModalText}>Vazgeç</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 👤 Profil Üst Kısmı */}
      <View style={styles.profileHeader}>
        <Pressable
          onPress={() => setIsAvatarModalVisible(true)}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeCtx.isDark ? "#2c2c3e" : "#e0e0e0" },
            ]}
          >
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person" size={50} color={dynamicPrimaryColor} />
            )}

            <View
              style={[
                styles.editBadge,
                { backgroundColor: dynamicPrimaryColor },
              ]}
            >
              <Ionicons
                name="camera"
                size={14}
                color={themeCtx.isDark ? "black" : "white"}
              />
            </View>
          </View>
        </Pressable>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: colors.text,
            marginBottom: 8,
          }}
        >
          Merhaba, {userName}
        </Text>
        <View style={[styles.emailContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.emailText, { color: colors.text }]}>
            {userEmail}
          </Text>
        </View>
      </View>

      {/* 📊 Özet Kartı */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Ionicons
            name="pie-chart"
            size={24}
            color={dynamicPrimaryColor}
            style={styles.cardIcon}
          />
          <Text style={[styles.cardTitle, { color: dynamicPrimaryColor }]}>
            Harcama Özeti
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Toplam Kayıt
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {totalExpensesCount} adet
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.text }]}>
            Toplam Gider
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: colors.text, fontWeight: "bold" },
            ]}
          >
            {totalExpensesAmount.toFixed(2)} {userCurrency}
          </Text>
        </View>
      </View>

      {/* 🌓 Tema Değiştirme */}
      <View
        style={[
          styles.card,
          styles.switchCard,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.cardHeader}>
          <Ionicons
            name={themeCtx.isDark ? "moon" : "sunny"}
            size={24}
            color={dynamicPrimaryColor}
            style={styles.cardIcon}
          />
          <Text style={[styles.cardTitle, { color: dynamicPrimaryColor }]}>
            {themeCtx.isDark ? "Karanlık Tema" : "Aydınlık Tema"}
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#ccc", true: colors.primary }}
          thumbColor={themeCtx.isDark ? "#f1c40f" : "#f4f3f4"}
          onValueChange={themeCtx.toggleTheme}
          value={themeCtx.isDark}
        />
      </View>

      {/* ⚙️ İşlemler Listesi */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, paddingVertical: 12 },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.actionRow,
            pressed && styles.actionRowPressed,
          ]}
          onPress={() => setIsCurrencyModalVisible(true)} // Artık Modalı açıyor
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="cash-outline"
              size={22}
              color={dynamicPrimaryColor}
              style={styles.cardIcon}
            />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Para Birimi
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: colors.text,
                opacity: 0.5,
                marginRight: 8,
                fontSize: 16,
              }}
            >
              {userCurrency}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
              opacity={0.5}
            />
          </View>
        </Pressable>

        <View style={[styles.divider, { marginVertical: 8 }]} />

        <Pressable
          style={({ pressed }) => [
            styles.actionRow,
            pressed && styles.actionRowPressed,
          ]}
          onPress={changePasswordHandler}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="lock-closed"
              size={22}
              color={dynamicPrimaryColor}
              style={styles.cardIcon}
            />
            <Text style={[styles.actionText, { color: colors.text }]}>
              Şifremi Değiştir
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text}
            opacity={0.5}
          />
        </Pressable>

        <View style={[styles.divider, { marginVertical: 8 }]} />

        <Pressable
          style={({ pressed }) => [
            styles.actionRow,
            pressed && styles.actionRowPressed,
          ]}
          onPress={clearAllDataHandler}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="trash-bin"
              size={22}
              color="#ef4444"
              style={styles.cardIcon}
            />
            <Text style={[styles.actionText, { color: "#ef4444" }]}>
              Tüm Harcamalarımı Sıfırla
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#ef4444"
            opacity={0.5}
          />
        </Pressable>

        <View style={[styles.divider, { marginVertical: 8 }]} />

        <Pressable
          style={({ pressed }) => [
            styles.actionRow,
            pressed && styles.actionRowPressed,
          ]}
          onPress={deleteAccountHandler}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="warning"
              size={22}
              color="#991b1b"
              style={styles.cardIcon}
            />
            <Text
              style={[
                styles.actionText,
                { color: "#991b1b", fontWeight: "bold" },
              ]}
            >
              Hesabımı Tamamen Sil
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#991b1b"
            opacity={0.5}
          />
        </Pressable>
      </View>

      <View style={styles.logoutContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && styles.logoutBtnPressed,
          ]}
          onPress={authCtx.logout}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutBtnText}>Hesaptan Çıkış Yap</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  scrollContainer: { padding: 24, paddingBottom: 40 },
  profileHeader: { alignItems: "center", marginBottom: 24, marginTop: 16 },

  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 6,
    borderRadius: 15,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", // Android'de daha iyi durması için merkeze aldım
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    borderRadius: 24,
    padding: 24,
    minHeight: 400,
    alignItems: "center",
  },
  // 🆕 Para birimi modalı özel tasarımı
  currencyModalContent: {
    width: "85%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginBottom: 24,
  },
  gridAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#e0e0e0",
  },

  closeModalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  closeModalText: { color: "white", fontSize: 16, fontWeight: "bold" },

  // 🆕 Para birimi satırları tasarımı
  currencyOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150, 150, 150, 0.1)",
  },
  currencyOptionText: {
    fontSize: 18,
    fontWeight: "500",
  },

  emailContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emailText: { fontSize: 16, fontWeight: "bold", letterSpacing: 0.5 },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  switchCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  cardIcon: { marginRight: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  statLabel: { fontSize: 16, opacity: 0.8 },
  statValue: { fontSize: 16 },
  divider: {
    height: 1,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  actionRowPressed: { opacity: 0.6 },
  actionText: { fontSize: 16, fontWeight: "500" },
  logoutContainer: { marginTop: 8, alignItems: "center", marginBottom: 32 },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    elevation: 3,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoutBtnPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  logoutBtnText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
