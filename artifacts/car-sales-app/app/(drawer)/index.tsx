import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Car, useCars } from "@/context/CarContext";
import { useColors } from "@/hooks/useColors";

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: bg }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

function RecentCarRow({ car }: { car: Car }) {
  const colors = useColors();
  const isSold = car.status === "Sold";
  return (
    <View
      style={[
        styles.recentRow,
        { borderBottomColor: colors.border },
      ]}
    >
      <MaterialCommunityIcons
        name="car-side"
        size={18}
        color={colors.primary}
        style={{ marginRight: 10 }}
      />
      <View style={styles.recentInfo}>
        <Text style={[styles.recentName, { color: colors.foreground }]}>
          {car.company} {car.name}
        </Text>
        <Text style={[styles.recentYear, { color: colors.mutedForeground }]}>
          {car.modelYear} · ${car.price.toLocaleString()}
        </Text>
      </View>
      <View
        style={[
          styles.recentBadge,
          { backgroundColor: isSold ? colors.muted : "#dcfce7" },
        ]}
      >
        <Text
          style={[
            styles.recentBadgeText,
            { color: isSold ? colors.mutedForeground : colors.success },
          ]}
        >
          {car.status}
        </Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const colors = useColors();
  const { cars, availableCars, soldCars, isLoading } = useCars();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const totalValue = availableCars.reduce((sum, c) => sum + c.price, 0);
  const recentCars = cars.slice(0, 5);

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
      <View style={styles.statsGrid}>
        <StatCard
          icon="car-multiple"
          label="Total Inventory"
          value={cars.length}
          color={colors.primary}
          bg={colors.accent}
        />
        <StatCard
          icon="car-clock"
          label="Available"
          value={availableCars.length}
          color={colors.success}
          bg="#dcfce7"
        />
        <StatCard
          icon="handshake"
          label="Sold"
          value={soldCars.length}
          color={colors.mutedForeground}
          bg={colors.muted}
        />
        <StatCard
          icon="currency-usd"
          label="Stock Value"
          value={"$" + (totalValue / 1000).toFixed(0) + "k"}
          color={colors.warning}
          bg="#fef3c7"
        />
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
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Recent Inventory
          </Text>
          <TouchableOpacity onPress={() => router.push("/(drawer)/car-management")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
        {recentCars.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            No cars yet. Add your first car in Car Management.
          </Text>
        ) : (
          recentCars.map((car) => <RecentCarRow key={car.id} car={car} />)
        )}
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(drawer)/car-management")}
        style={[
          styles.ctaBtn,
          {
            backgroundColor: colors.primary,
            borderRadius: colors.radius,
          },
        ]}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        <Text style={styles.ctaBtnText}>Manage Inventory</Text>
      </TouchableOpacity>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "47%",
    padding: 16,
    borderWidth: 1,
    gap: 6,
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  section: {
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  recentInfo: {
    flex: 1,
    gap: 2,
  },
  recentName: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  recentYear: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  recentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  recentBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 16,
    paddingTop: 0,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  ctaBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
