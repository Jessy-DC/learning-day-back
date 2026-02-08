import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type NotionItemProps = {
  title: string;
  score?: number | null;
  isDeleting?: boolean;
  onDelete?: () => void;
};

export function NotionItem({
  title,
  score,
  isDeleting = false,
  onDelete,
}: NotionItemProps) {
  const badgeLabel = score === null || score === undefined ? "·" : `${score}%`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actionsContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
        {onDelete ? (
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed ? styles.deleteButtonPressed : null,
              isDeleting ? styles.deleteButtonDisabled : null,
            ]}
            disabled={isDeleting}
            onPress={onDelete}
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? "..." : "Supprimer"}
            </Text>
          </Pressable>
        ) : null}
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
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  deleteButton: {
    backgroundColor: "#dc2626",
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "600",
  },
});
