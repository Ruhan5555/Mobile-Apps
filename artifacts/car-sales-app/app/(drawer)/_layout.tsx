import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCars } from "@/context/CarContext";
import { useColors } from "@/hooks/useColors";

function CustomDrawerContent(props: any) {
  const colors = useColors();
  const { availableCars, soldCars, cars } = useCars();
  const insets = useSafeAreaInsets();

  const navItems = [
    {
      name: "index",
      label: "Dashboard",
      icon: "view-dashboard",
    },
    {
      name: "car-management",
      label: "Car Management",
      icon: "car-multiple",
    },
    {
      name: "settings",
      label: "Settings",
      icon: "cog",
    },
  ] as const;

  return (
    <View
      style={[
        styles.drawerContainer,
        {
          backgroundColor: colors.card,
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16),
        },
      ]}
    >
      <View style={styles.drawerHeader}>
        <View
          style={[
            styles.logoCircle,
            { backgroundColor: colors.primary },
          ]}
        >
          <MaterialCommunityIcons name="car" size={28} color="#fff" />
        </View>
        <Text style={[styles.appName, { color: colors.foreground }]}>
          CarSales
        </Text>
        <Text style={[styles.appTagline, { color: colors.mutedForeground }]}>
          Inventory Manager
        </Text>
      </View>

      <View
        style={[styles.statsRow, { borderColor: colors.border }]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {cars.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Total
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {availableCars.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Available
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.mutedForeground }]}>
            {soldCars.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Sold
          </Text>
        </View>
      </View>

      <View style={styles.nav}>
        {navItems.map((item) => {
          const isActive =
            props.state.routeNames[props.state.index] === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => props.navigation.navigate(item.name)}
              style={[
                styles.navItem,
                {
                  backgroundColor: isActive ? colors.accent : "transparent",
                  borderRadius: colors.radius - 2,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={22}
                color={isActive ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.navLabel,
                  {
                    color: isActive ? colors.primary : colors.foreground,
                    fontFamily: isActive
                      ? "Inter_600SemiBold"
                      : "Inter_400Regular",
                  },
                ]}
              >
                {item.label}
              </Text>
              {isActive && (
                <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const colors = useColors();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.foreground,
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 17,
        },
        drawerStyle: {
          width: 280,
        },
        headerShadowVisible: false,
        headerLeft: ({ onPress }) => (
          <TouchableOpacity onPress={onPress} style={{ marginLeft: 16 }}>
            <Feather name="menu" size={22} color={colors.foreground} />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="index"
        options={{ title: "Dashboard" }}
      />
      <Drawer.Screen
        name="car-management"
        options={{ title: "Car Management" }}
      />
      <Drawer.Screen
        name="settings"
        options={{ title: "Settings" }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  drawerHeader: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  appName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  appTagline: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
    paddingVertical: 14,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  statDivider: {
    width: 1,
    marginVertical: 4,
  },
  nav: {
    gap: 4,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  navLabel: {
    fontSize: 15,
    flex: 1,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
