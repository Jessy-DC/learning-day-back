export const BASE_URL =
  "https://learning-day-api-b2c4g2a8gscuagb7.westeurope-01.azurewebsites.net";

export type Notion = {
  id: string;
  title: string;
  explanation: string;
  score?: number | null;
};

export type QuizPrompt = {
  id: string;
  title: string;
};

export type QuizAnswerResult = {
  score: number;
  feedback: string;
  idealAnswer: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      ...options,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || "La requête a échoué.");
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Erreur réseau.");
    }

    throw new Error("Erreur réseau.");
  }
}

export async function createNotion(term: string): Promise<Notion> {
  return request<Notion>("/notions", {
    method: "POST",
    body: JSON.stringify({ title: term }),
  });
}

export async function listNotions() {
  return request<Notion[]>("/notions");
}

export async function fetchQuiz() {
  return request<QuizPrompt>("/quiz");
}

export async function submitQuizAnswer(notionId: string, answer: string) {
  return request<QuizAnswerResult>("/quiz/answer", {
    method: "POST",
    body: JSON.stringify({ notionId, answer }),
  });
}
