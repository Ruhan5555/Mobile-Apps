import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AddCarForm } from "@/components/AddCarForm";
import { CarList } from "@/components/CarList";
import { Car, useCars } from "@/context/CarContext";
import { useColors } from "@/hooks/useColors";

export default function SoldCarsScreen() {
  const colors = useColors();
  const { soldCars, isLoading } = useCars();
  const insets = useSafeAreaInsets();

  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);

  const handleEdit = (car: Car) => {
    setEditCar(car);
    setShowForm(true);
  };

  const totalRevenue = soldCars.reduce((sum, c) => sum + c.price, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Platform.OS === "web" ? 67 : insets.top + 8,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.screenTitle, { color: colors.foreground }]}>
            Sold Cars
          </Text>
          {soldCars.length > 0 && (
            <Text style={[styles.revenueText, { color: colors.mutedForeground }]}>
              Total Revenue: ${totalRevenue.toLocaleString()}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.countBadge,
            { backgroundColor: colors.muted, borderRadius: 20 },
          ]}
        >
          <Text style={[styles.countText, { color: colors.mutedForeground }]}>
            {soldCars.length} sold
          </Text>
        </View>
      </View>

      <CarList
        cars={soldCars}
        isLoading={isLoading}
        onEdit={handleEdit}
        emptyTitle="No sold cars yet"
        emptySubtitle="Cars marked as sold will appear here"
      />

      <AddCarForm
        visible={showForm}
        onClose={() => {
          setShowForm(false);
          setEditCar(null);
        }}
        editCar={editCar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  revenueText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
