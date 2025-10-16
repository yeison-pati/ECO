
import React, { useEffect } from "react";
import { Slot, useSegments } from "expo-router";
import { StatusBar, ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider, useUser } from "../Context/UserContext";
import useAppNavigation from "./hooks/useAppNavigation";

function AuthProvider({ children }) {
  const { user, token, loading, usuario } = useUser();
  const navigate = useAppNavigation();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const handleNavigation = async () => {

      if (
        user?.rol === "COMERCIANTE" &&
        (!user?.nit || user.nit.trim() === "")
      ) {
        navigate.toRegisterComerce();
        return;
      }


      if (
        user &&
        (segments.length === 0 ||
          segments[0] === "" ||
          segments[0] === "sesion")
      ) {
        if (user.rol === "COMERCIANTE") {
          navigate.toComerceHome();
        } else if (user.rol === "CONSUMIDOR") {
          navigate.toConsumerHome();
        }
      }


      else if (
        !user &&
        (segments[0] === "/consumer" || segments[0] === "/comerce")
      ) {
        navigate.toIndex();
      }
    };

    handleNavigation();
  }, [user, loading, segments]);

  return children;
}

function GlobalLoader() {
  const { loading } = useUser();
  return loading ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FEF3EF",
      }}
    >
      <ActivityIndicator size="large" color="#E54C4D" />
    </View>
  ) : (
    <Slot />
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <UserProvider>
        <AuthProvider>
          <GlobalLoader />
        </AuthProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
