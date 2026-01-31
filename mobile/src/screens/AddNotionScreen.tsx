import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppButton } from "../components/AppButton";
import { createNotion } from "../services/api";

export function AddNotionScreen() {
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerate = async () => {
    if (!title.trim()) {
      setErrorMessage("Merci de saisir une notion.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSavedMessage("");

    try {
      const notion = await createNotion(title.trim());
      setExplanation(notion.explanation);
    } catch (error) {
      setErrorMessage("Impossible de générer l'explication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!explanation) {
      setErrorMessage("Validez la notion avant de sauvegarder.");
      return;
    }

    setSavedMessage("Notion sauvegardée.");
    setTitle("");
    setExplanation("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Notion ou mot</Text>
      <TextInput
        placeholder="Ex : Ancrage mémoriel"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        autoCapitalize="sentences"
      />

      <AppButton label="Valider" onPress={handleGenerate} />

      {isLoading && <ActivityIndicator color="#2563eb" />}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {explanation ? (
        <View style={styles.definitionCard}>
          <Text style={styles.definitionTitle}>Explication IA</Text>
          <Text style={styles.definitionText}>{explanation}</Text>
        </View>
      ) : null}

      {explanation ? (
        <AppButton label="Sauvegarder" onPress={handleSave} />
      ) : null}

      {savedMessage ? <Text style={styles.success}>{savedMessage}</Text> : null}
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
  definitionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginVertical: 16,
  },
  definitionTitle: {
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  definitionText: {
    color: "#475569",
    lineHeight: 20,
  },
  error: {
    color: "#ef4444",
    marginTop: 8,
  },
  success: {
    color: "#16a34a",
    marginTop: 12,
    fontWeight: "600",
  },
});
