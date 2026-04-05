import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Car, useCars } from "@/context/CarContext";
import { useColors } from "@/hooks/useColors";

interface CarItemProps {
  car: Car;
  onEdit: (car: Car) => void;
}

export function CarItem({ car, onEdit }: CarItemProps) {
  const colors = useColors();
  const { deleteCar, markAsSold } = useCars();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Car",
      `Remove ${car.name} from inventory?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            deleteCar(car.id);
          },
        },
      ]
    );
  };

  const handleMarkSold = () => {
    Alert.alert(
      "Mark as Sold",
      `Mark ${car.name} as sold?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            markAsSold(car.id);
          },
        },
      ]
    );
  };

  const isSold = car.status === "Sold";
  const statusColor = isSold ? colors.mutedForeground : colors.success;
  const statusBg = isSold ? colors.muted : "#dcfce7";

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          Haptics.selectionAsync();
          setExpanded((v) => !v);
        }}
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons
              name="car-side"
              size={20}
              color={colors.primary}
              style={styles.carIcon}
            />
            <View style={styles.titleContainer}>
              <Text style={[styles.carName, { color: colors.foreground }]}>
                {car.name}
              </Text>
              <Text style={[styles.company, { color: colors.mutedForeground }]}>
                {car.company} · {car.modelYear}
              </Text>
            </View>
          </View>
          <View style={styles.rightCol}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusBg, borderRadius: 20 },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColor }]}>
                {car.status}
              </Text>
            </View>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${car.price.toLocaleString()}
            </Text>
          </View>
        </View>

        {expanded && (
          <View
            style={[
              styles.actions,
              { borderTopColor: colors.border, borderTopWidth: 1 },
            ]}
          >
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: colors.border }]}
              onPress={() => {
                Haptics.selectionAsync();
                onEdit(car);
              }}
            >
              <Feather name="edit-2" size={16} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>

            {!isSold && (
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: colors.border }]}
                onPress={handleMarkSold}
              >
                <Feather name="check-circle" size={16} color={colors.success} />
                <Text style={[styles.actionText, { color: colors.success }]}>
                  Sold
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: colors.border }]}
              onPress={handleDelete}
            >
              <Feather name="trash-2" size={16} color={colors.destructive} />
              <Text style={[styles.actionText, { color: colors.destructive }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  carIcon: {
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  carName: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  company: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  price: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  actions: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
