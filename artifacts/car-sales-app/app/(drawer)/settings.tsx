import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCars } from "@/context/CarContext";
import { useColors } from "@/hooks/useColors";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cars, soldCars, availableCars } = useCars();
  const [notifications, setNotifications] = useState(true);

  const handleClearSold = () => {
    Alert.alert(
      "Clear Sold Cars",
      "This would remove all sold cars from your inventory. (Demo — no action taken)",
      [{ text: "Cancel", style: "cancel" }, { text: "Clear", style: "destructive" }]
    );
  };

  const settingRow = (
    icon: string,
    label: string,
    value?: string,
    onPress?: () => void,
    right?: React.ReactNode
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.settingRow,
        { borderBottomColor: colors.border },
      ]}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.accent }]}>
        <MaterialCommunityIcons name={icon as any} size={18} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { color: colors.foreground }]}>
          {label}
        </Text>
        {value && (
          <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>
            {value}
          </Text>
        )}
      </View>
      {right ?? (
        onPress && <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20),
          paddingTop: Platform.OS === "web" ? 8 : 16,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          INVENTORY SUMMARY
        </Text>
        {settingRow("car-multiple", "Total Cars", `${cars.length} cars`)}
        {settingRow("car-clock", "Available", `${availableCars.length} available`)}
        {settingRow("handshake", "Sold", `${soldCars.length} sold`)}
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          PREFERENCES
        </Text>
        {settingRow(
          "bell-outline",
          "Notifications",
          undefined,
          undefined,
          <Switch
            value={notifications}
            onValueChange={(v) => {
              Haptics.selectionAsync();
              setNotifications(v);
            }}
            trackColor={{ true: colors.primary }}
          />
        )}
        {settingRow("currency-usd", "Currency", "USD ($)")}
        {settingRow("theme-light-dark", "Theme", "System Default")}
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          DATA
        </Text>
        {settingRow("delete-sweep-outline", "Clear Sold Cars", undefined, handleClearSold)}
        {settingRow("export", "Export Inventory", undefined, () =>
          Alert.alert("Export", "Export functionality coming soon!")
        )}
      </View>

      <View
        style={[
          styles.section,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          ABOUT
        </Text>
        {settingRow("information-outline", "Version", "1.0.0")}
        {settingRow("car", "CarSales Manager", "React Native App")}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  section: {
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  settingValue: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
