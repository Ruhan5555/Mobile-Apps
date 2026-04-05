import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AddCarForm } from "@/components/AddCarForm";
import { CarList } from "@/components/CarList";
import { Car, useCars } from "@/context/CarContext";
import { useColors } from "@/hooks/useColors";

export default function AllCarsScreen() {
  const colors = useColors();
  const { cars, isLoading } = useCars();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar] = useState<Car | null>(null);

  const filtered = cars.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      String(c.modelYear).includes(search)
  );

  const handleEdit = (car: Car) => {
    Haptics.selectionAsync();
    setEditCar(car);
    setShowForm(true);
  };

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
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          All Cars
        </Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            setEditCar(null);
            setShowForm(true);
          }}
          style={[
            styles.addBtn,
            { backgroundColor: colors.primary, borderRadius: colors.radius - 2 },
          ]}
        >
          <Feather name="plus" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.muted, borderRadius: colors.radius },
        ]}
      >
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, company, year..."
          placeholderTextColor={colors.mutedForeground}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      <CarList
        cars={filtered}
        isLoading={isLoading}
        onEdit={handleEdit}
        emptyTitle={
          search.length > 0 ? "No results found" : "No cars in inventory"
        }
        emptySubtitle={
          search.length > 0
            ? "Try a different search term"
            : "Tap the + Add button to add your first car"
        }
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
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
