import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "../navigation/types";
import { fetchQuiz } from "../services/api";
import { AppButton } from "../components/AppButton";

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasQuiz, setHasQuiz] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadQuizStatus = async () => {
      try {
        const quiz = await fetchQuiz();
        if (isMounted) {
          setHasQuiz(Boolean(quiz?.id));
        }
      } catch (error) {
        if (isMounted) {
          setHasQuiz(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuizStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Votre rituel du jour</Text>
        {isLoading ? (
          <ActivityIndicator color="#2563eb" />
        ) : (
          <Text style={styles.subtitle}>
            {hasQuiz
              ? "Une notion vous attend pour aujourd'hui."
              : "Aucune notion à réviser pour le moment."}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <AppButton
          label="Commencer la révision"
          onPress={() => navigation.navigate("Quiz")}
        />
        <AppButton
          label="Ajouter une notion"
          variant="secondary"
          onPress={() => navigation.navigate("AddNotion")}
        />
        <AppButton
          label="Voir mes notions"
          variant="ghost"
          onPress={() => navigation.navigate("NotionsList")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
  },
  actions: {
    gap: 12,
  },
});
