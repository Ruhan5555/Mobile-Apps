import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { AddCarForm } from "@/components/AddCarForm";
import { Car } from "@/context/CarContext";
import { useColors } from "@/hooks/useColors";

export default function CarManagementTabLayout() {
  const colors = useColors();
  const isDark = false;
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);

  const openAdd = () => {
    setEditCar(null);
    setShowForm(true);
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedForeground,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: isIOS ? "transparent" : colors.background,
            borderTopWidth: isWeb ? 1 : 0,
            borderTopColor: colors.border,
            elevation: 0,
            ...(isWeb ? { height: 84 } : {}),
          },
          tabBarBackground: () =>
            isIOS ? (
              <BlurView
                intensity={100}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            ) : isWeb ? (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: colors.background },
                ]}
              />
            ) : null,
          tabBarLabelStyle: {
            fontFamily: "Inter_500Medium",
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "All Cars",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="car-multiple"
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Add Car",
            tabBarIcon: ({ color }) => (
              <Feather name="plus-circle" size={22} color={color} />
            ),
            tabBarButton: (props) => {
              const { style, ...rest } = props as any;
              return (
                <View
                  {...rest}
                  style={[style, { flex: 1 }]}
                  onTouchEnd={openAdd}
                  accessibilityRole="button"
                />
              );
            },
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              openAdd();
            },
          }}
        />
        <Tabs.Screen
          name="sold"
          options={{
            title: "Sold Cars",
            tabBarIcon: ({ color }) => (
              <Feather name="check-circle" size={22} color={color} />
            ),
          }}
        />
      </Tabs>

      <AddCarForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        editCar={editCar}
      />
    </>
  );
}
