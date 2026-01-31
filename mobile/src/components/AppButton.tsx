import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

export function AppButton({ label, onPress, variant = "primary" }: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "secondary" && styles.textDark,
          variant === "ghost" && styles.textGhost,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#2563eb",
  },
  secondary: {
    backgroundColor: "#e2e8f0",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: "#f8fafc",
    fontWeight: "600",
    fontSize: 16,
  },
  textDark: {
    color: "#0f172a",
  },
  textGhost: {
    color: "#2563eb",
  },
});
