import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppButton } from "../components/AppButton";
import { fetchQuiz, submitQuizAnswer } from "../services/api";

type QuizResult = {
  score: number;
  feedback: string;
  idealAnswer: string;
};

export function QuizScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [prompt, setPrompt] = useState<string>("");
  const [promptId, setPromptId] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<QuizResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadQuiz = async () => {
      try {
        const quiz = await fetchQuiz();
        if (isMounted) {
          setPrompt(quiz.title);
          setPromptId(quiz.id);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage("Aucune révision disponible.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleValidate = async () => {
    if (!answer.trim()) {
      setErrorMessage("Merci de saisir votre réponse.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await submitQuizAnswer(promptId, answer.trim());
      setResult(response);
    } catch (error) {
      setErrorMessage("Impossible d'envoyer votre réponse.");
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator color="#2563eb" />
      ) : (
        <>
          <Text style={styles.title}>Expliquez :</Text>
          <Text style={styles.prompt}>{prompt || "---"}</Text>

          <TextInput
            placeholder="Votre réponse"
            multiline
            value={answer}
            onChangeText={setAnswer}
            style={styles.textarea}
          />

          <AppButton label="Valider" onPress={handleValidate} />

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          {result ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Résultat</Text>
              <Text style={styles.resultScore}>Score : {result.score}%</Text>
              <Text style={styles.resultLabel}>Feedback</Text>
              <Text style={styles.resultText}>{result.feedback}</Text>
              <Text style={styles.resultLabel}>Réponse idéale</Text>
              <Text style={styles.resultText}>{result.idealAnswer}</Text>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  prompt: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginVertical: 12,
  },
  textarea: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 16,
    fontSize: 16,
  },
  error: {
    color: "#ef4444",
    marginTop: 8,
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  resultScore: {
    fontWeight: "600",
    color: "#2563eb",
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 8,
  },
  resultText: {
    color: "#475569",
    marginTop: 4,
    lineHeight: 20,
  },
});
