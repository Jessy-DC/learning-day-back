import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NotionItem } from "../components/NotionItem";
import { deleteNotion, listNotions, Notion } from "../services/api";

export function NotionsListScreen() {
  const [notions, setNotions] = useState<Notion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingNotionId, setDeletingNotionId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadNotions = async () => {
      try {
        const data = await listNotions();
        if (isMounted) {
          setNotions(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage("Impossible de charger les notions.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNotions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (notionId: string) => {
    setDeletingNotionId(notionId);
    setErrorMessage("");

    try {
      await deleteNotion(notionId);
      setNotions((currentNotions) =>
        currentNotions.filter((notion) => notion.id !== notionId)
      );
    } catch (error) {
      setErrorMessage("Impossible de supprimer cette notion.");
    } finally {
      setDeletingNotionId(null);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color="#2563eb" />
      ) : (
        <>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <FlatList
            data={notions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => (
              <NotionItem
                title={item.title}
                score={item.score ?? null}
                isDeleting={deletingNotionId === item.id}
                onDelete={() => handleDelete(item.id)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Vous n'avez pas encore de notions sauvegardées.
              </Text>
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 24,
  },
  list: {
    paddingTop: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 32,
  },
  error: {
    color: "#ef4444",
    marginBottom: 12,
  },
});
