import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NotionItem } from "../components/NotionItem";
import { listNotions, Notion } from "../services/api";

export function NotionsListScreen() {
  const [notions, setNotions] = useState<Notion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
              <NotionItem title={item.title} score={item.score ?? null} />
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
