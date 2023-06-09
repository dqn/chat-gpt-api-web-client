import { Message } from "./_types/Message";

export async function fetchChatMessage(
  token: string,
  messages: readonly Message[]
): Promise<Response> {
  const body = JSON.stringify({
    // model: "gpt-3.5-turbo",
    model: "gpt-4",
    messages,
    stream: true,
  });

  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });
}
