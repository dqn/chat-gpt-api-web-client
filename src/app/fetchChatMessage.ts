import { Message } from "./_types/Message";

export async function fetchChatMessage(
  token: string,
  messages: readonly Message[]
): Promise<Message> {
  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    // model: "gpt-4",
    messages,
  });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  const data = await res.json();

  if (data.error !== undefined) {
    throw new Error(data.error.message);
  }

  return data.choices?.[0]?.message;
}
