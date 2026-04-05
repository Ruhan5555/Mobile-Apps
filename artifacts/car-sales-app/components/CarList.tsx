import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Car } from "@/context/CarContext";
import { useColors } from "@/hooks/useColors";
import { CarItem } from "./CarItem";

interface CarListProps {
  cars: Car[];
  isLoading?: boolean;
  onEdit: (car: Car) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export function CarList({
  cars,
  isLoading,
  onEdit,
  emptyTitle = "No cars found",
  emptySubtitle = "Add your first car to get started",
}: CarListProps) {
  const colors = useColors();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderEmpty = () => (
    <View style={styles.empty}>
      <MaterialCommunityIcons
        name="car-off"
        size={56}
        color={colors.mutedForeground}
      />
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
        {emptyTitle}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
        {emptySubtitle}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={cars}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CarItem car={item} onEdit={onEdit} />}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={cars.length === 0 ? styles.emptyContainer : styles.listContent}
      showsVerticalScrollIndicator={false}
      scrollEnabled={cars.length > 0}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
});
