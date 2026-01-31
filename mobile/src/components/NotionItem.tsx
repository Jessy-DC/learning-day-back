import React from "react";
import { StyleSheet, Text, View } from "react-native";

type NotionItemProps = {
  title: string;
  score?: number | null;
};

export function NotionItem({ title, score }: NotionItemProps) {
  const badgeLabel = score === null || score === undefined ? "·" : `${score}%`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    flex: 1,
    marginRight: 12,
  },
  badge: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    minWidth: 40,
    alignItems: "center",
  },
  badgeText: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "600",
  },
});
