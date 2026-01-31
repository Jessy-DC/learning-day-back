const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Une erreur est survenue");
  }

  return response.json() as Promise<T>;
}

export async function createNotion(title: string) {
  return request<Notion>("/notions", {
    method: "POST",
    body: JSON.stringify({ title }),
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
