import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import Button from "./Button";

function ErrorOverlay({ message, onConfirm }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>Eyvah, Bir Hata Oluştu!</Text>
      <Text style={styles.text}>{message}</Text>

      {/* Kullanıcının hatayı okuyup kapatabilmesi için senin yazdığın Button bileşeni */}
      <Button onPress={onConfirm}>Tamam</Button>
    </View>
  );
}

export default ErrorOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  text: {
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
