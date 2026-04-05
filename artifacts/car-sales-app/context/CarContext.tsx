import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface Car {
  id: string;
  name: string;
  company: string;
  price: number;
  modelYear: number;
  status: "Available" | "Sold";
  createdAt: string;
}

interface CarContextValue {
  cars: Car[];
  addCar: (car: Omit<Car, "id" | "createdAt">) => void;
  updateCar: (id: string, updates: Partial<Omit<Car, "id" | "createdAt">>) => void;
  deleteCar: (id: string) => void;
  markAsSold: (id: string) => void;
  availableCars: Car[];
  soldCars: Car[];
  isLoading: boolean;
}

const CarContext = createContext<CarContextValue | null>(null);

const STORAGE_KEY = "@car_sales_cars";

const INITIAL_CARS: Car[] = [
  {
    id: "1",
    name: "Civic",
    company: "Honda",
    price: 24000,
    modelYear: 2023,
    status: "Available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Corolla",
    company: "Toyota",
    price: 22000,
    modelYear: 2022,
    status: "Sold",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Model 3",
    company: "Tesla",
    price: 42000,
    modelYear: 2024,
    status: "Available",
    createdAt: new Date().toISOString(),
  },
];

export function CarProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCars(JSON.parse(stored));
        } else {
          setCars(INITIAL_CARS);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CARS));
        }
      } catch {
        setCars(INITIAL_CARS);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const persist = useCallback(async (updated: Car[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, []);

  const addCar = useCallback(
    (car: Omit<Car, "id" | "createdAt">) => {
      const newCar: Car = {
        ...car,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      setCars((prev) => {
        const updated = [newCar, ...prev];
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const updateCar = useCallback(
    (id: string, updates: Partial<Omit<Car, "id" | "createdAt">>) => {
      setCars((prev) => {
        const updated = prev.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        );
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const deleteCar = useCallback(
    (id: string) => {
      setCars((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const markAsSold = useCallback(
    (id: string) => {
      setCars((prev) => {
        const updated = prev.map((c) =>
          c.id === id ? { ...c, status: "Sold" as const } : c
        );
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const availableCars = useMemo(
    () => cars.filter((c) => c.status === "Available"),
    [cars]
  );
  const soldCars = useMemo(
    () => cars.filter((c) => c.status === "Sold"),
    [cars]
  );

  const value = useMemo(
    () => ({
      cars,
      addCar,
      updateCar,
      deleteCar,
      markAsSold,
      availableCars,
      soldCars,
      isLoading,
    }),
    [cars, addCar, updateCar, deleteCar, markAsSold, availableCars, soldCars, isLoading]
  );

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
}

export function useCars() {
  const ctx = useContext(CarContext);
  if (!ctx) throw new Error("useCars must be used within CarProvider");
  return ctx;
}
