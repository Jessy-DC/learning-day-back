import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppButton } from "../components/AppButton";
import { Notion, createNotion } from "../services/api";

export function AddNotionScreen() {
  const [term, setTerm] = useState("");
  const [createdNotion, setCreatedNotion] = useState<Notion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    const sanitizedTerm = term.trim();

    if (!sanitizedTerm) {
      setErrorMessage("Merci de saisir une notion.");
      setCreatedNotion(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setCreatedNotion(null);

    try {
      const notion = await createNotion(sanitizedTerm);
      setCreatedNotion(notion);
      setTerm("");
    } catch {
      setErrorMessage("Impossible d'ajouter la notion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nouvelle notion</Text>

      <TextInput
        placeholder="Ex : Ancrage mémoriel"
        value={term}
        onChangeText={setTerm}
        style={styles.input}
        autoCapitalize="sentences"
      />

      <AppButton label="Valider" onPress={handleSubmit} />

      {isLoading ? <ActivityIndicator color="#2563eb" style={styles.loader} /> : null}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {createdNotion ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{createdNotion.title}</Text>
          <Text style={styles.resultExplanation}>{createdNotion.explanation}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  loader: {
    marginTop: 16,
  },
  error: {
    color: "#ef4444",
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 16,
  },
  resultTitle: {
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
    fontSize: 16,
  },
  resultExplanation: {
    color: "#475569",
    lineHeight: 20,
  },
});
