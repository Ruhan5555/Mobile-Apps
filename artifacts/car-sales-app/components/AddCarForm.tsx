import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Car, useCars } from "@/context/CarContext";
import { useColors } from "@/hooks/useColors";

interface AddCarFormProps {
  visible: boolean;
  onClose: () => void;
  editCar?: Car | null;
}

interface FormState {
  name: string;
  company: string;
  price: string;
  modelYear: string;
  status: "Available" | "Sold";
}

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  price: "",
  modelYear: "",
  status: "Available",
};

export function AddCarForm({ visible, onClose, editCar }: AddCarFormProps) {
  const colors = useColors();
  const { addCar, updateCar } = useCars();
  const insets = useSafeAreaInsets();
  const isEdit = !!editCar;

  const [form, setForm] = useState<FormState>(() =>
    editCar
      ? {
          name: editCar.name,
          company: editCar.company,
          price: String(editCar.price),
          modelYear: String(editCar.modelYear),
          status: editCar.status,
        }
      : EMPTY_FORM
  );

  React.useEffect(() => {
    if (editCar) {
      setForm({
        name: editCar.name,
        company: editCar.company,
        price: String(editCar.price),
        modelYear: String(editCar.modelYear),
        status: editCar.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editCar, visible]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.company.trim()) {
      Alert.alert("Validation", "Car name and company are required.");
      return;
    }
    const price = parseFloat(form.price);
    const year = parseInt(form.modelYear, 10);
    if (isNaN(price) || price <= 0) {
      Alert.alert("Validation", "Enter a valid price.");
      return;
    }
    if (isNaN(year) || year < 1900 || year > 2030) {
      Alert.alert("Validation", "Enter a valid model year (1900-2030).");
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (isEdit && editCar) {
      updateCar(editCar.id, {
        name: form.name.trim(),
        company: form.company.trim(),
        price,
        modelYear: year,
        status: form.status,
      });
    } else {
      addCar({
        name: form.name.trim(),
        company: form.company.trim(),
        price,
        modelYear: year,
        status: form.status,
      });
    }
    onClose();
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.muted,
      borderColor: colors.border,
      color: colors.foreground,
      borderRadius: colors.radius - 2,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.modalHeader,
            {
              borderBottomColor: colors.border,
              paddingTop: insets.top + (Platform.OS === "web" ? 16 : 8),
            },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>
            {isEdit ? "Edit Car" : "Add New Car"}
          </Text>
          <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}>
            <Text style={[styles.saveBtnText, { color: colors.primary }]}>
              {isEdit ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.formContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              CAR NAME
            </Text>
            <TextInput
              style={inputStyle}
              value={form.name}
              onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="e.g. Civic, Camry"
              placeholderTextColor={colors.mutedForeground}
              returnKeyType="next"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              COMPANY / MAKE
            </Text>
            <TextInput
              style={inputStyle}
              value={form.company}
              onChangeText={(v) => setForm((f) => ({ ...f, company: v }))}
              placeholder="e.g. Honda, Toyota"
              placeholderTextColor={colors.mutedForeground}
              returnKeyType="next"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.fieldGroup, styles.flex1]}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                PRICE ($)
              </Text>
              <TextInput
                style={inputStyle}
                value={form.price}
                onChangeText={(v) => setForm((f) => ({ ...f, price: v }))}
                placeholder="25000"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                returnKeyType="next"
              />
            </View>
            <View style={[styles.fieldGroup, styles.flex1]}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                MODEL YEAR
              </Text>
              <TextInput
                style={inputStyle}
                value={form.modelYear}
                onChangeText={(v) => setForm((f) => ({ ...f, modelYear: v }))}
                placeholder="2024"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              STATUS
            </Text>
            <View style={styles.statusRow}>
              {(["Available", "Sold"] as const).map((s) => {
                const isActive = form.status === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setForm((f) => ({ ...f, status: s }));
                    }}
                    style={[
                      styles.statusOption,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : colors.muted,
                        borderColor: isActive ? colors.primary : colors.border,
                        borderRadius: colors.radius - 2,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        {
                          color: isActive
                            ? colors.primaryForeground
                            : colors.foreground,
                        },
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.submitBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text
              style={[
                styles.submitBtnText,
                { color: colors.primaryForeground },
              ]}
            >
              {isEdit ? "Update Car" : "Add Car"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
    width: 48,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    flex: 1,
  },
  saveBtn: {
    padding: 4,
    width: 48,
    alignItems: "flex-end",
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  scrollView: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  statusOptionText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  submitBtn: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
});
