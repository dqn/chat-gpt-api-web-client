"use client";

import { FormEventHandler, useEffect, useRef, useState } from "react";
import { ulid } from "ulidx";
import useLocalStorageState from "use-local-storage-state";
import * as DOMPurify from "dompurify";
import { SettingButton } from "./SettingButton";
import { Chat } from "./_types/Chat";
import { Message } from "./_types/Message";
import { fetchChatMessage } from "./fetchChatMessage";
import { SideMenu } from "./SideMenu";
import { MessageInput } from "./MessageInput";
import { marked } from "marked";
import hljs from "highlight.js";

const localStoragePrefix = "chat-gpt-api-web-client";

function parseAndSanitize(text: string): string {
  marked.setOptions({
    highlight(code, lang) {
      return hljs.highlightAuto(code, [lang]).value;
    },
  });

  return DOMPurify.sanitize(marked.parse(text));
}

const Home: React.FC = () => {
  const [chats, setChats] = useLocalStorageState<Chat[]>(
    `${localStoragePrefix}-chats`,
    { defaultValue: [] }
  );
  const [token, setToken] = useLocalStorageState(
    `${localStoragePrefix}-token`,
    { defaultValue: "" }
  );
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentChunks, setContentChunks] = useState<string>("");

  const handleInputChange: FormEventHandler<HTMLTextAreaElement> = (e) => {
    setInput(e.currentTarget.value);
  };

  const handleNewChatButtonClick = () => {
    setChatId("");
  };

  const handleChatSelect = (chatId: string) => {
    setChatId(chatId);
  };

  const handleChatDelete = (chatId: string) => {
    const newChats = chats.filter((chat) => chat.id !== chatId);
    setChats(newChats);
  };

  const handleSubmit = () => {
    setInput("");
    setIsLoading(true);

    const handleResponse = async (res: Response): Promise<string> => {
      if (res.body === null) {
        throw new Error("Response body is null");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunksText = decoder.decode(value);

        chunksText
          .trim()
          .split(/\n+/)
          .forEach((chunk) => {
            const data = chunk.slice(6);

            if (data === "[DONE]") {
              return;
            }

            const c = JSON.parse(data).choices[0]?.delta?.content;
            content += c ?? "";
            setContentChunks(content);
          });
      }

      reader.releaseLock();

      return content;
    };

    if (chatId === "") {
      const chatId = ulid();
      setChatId(chatId);

      const messages: Message[] = [
        {
          role: "user",
          content: input,
        },
      ];

      const newChats: Chat[] = [
        {
          id: chatId,
          messages,
        },
        ...chats,
      ];
      setChats(newChats);

      fetchChatMessage(token, messages).then(async (res) => {
        const content = await handleResponse(res);
        messages.push({
          role: "assistant",
          content,
        });
        setContentChunks("");
        setChats(newChats);
        setIsLoading(false);
      });
    } else {
      const newChats = structuredClone(chats);
      const targetChat = newChats.find((chat) => chat.id === chatId);

      if (targetChat === undefined) {
        return;
      }

      const messages = targetChat.messages;

      messages.push({
        role: "user",
        content: input,
      });
      setChats(newChats);

      fetchChatMessage(token, messages).then(async (res) => {
        const content = await handleResponse(res);
        messages.push({
          role: "assistant",
          content,
        });
        setContentChunks("");
        setChats(newChats);
        setIsLoading(false);
      });
    }
  };

  const chatListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = chatListRef?.current;

    if (el === null) {
      return;
    }

    el.scrollTop = el.scrollHeight;
  }, [contentChunks]);

  const chat = chats.find((chat) => chat.id === chatId);

  return (
    <div className="flex h-[100svh]">
      <div className="flex-none">
        <SideMenu
          chats={chats}
          onNewChatButtonClick={handleNewChatButtonClick}
          onChatSelect={handleChatSelect}
          onChatDelete={handleChatDelete}
          settingButton={
            <SettingButton token={token} onTokenChange={setToken} />
          }
        />
      </div>
      <div className="flex-grow">
        <main className="mx-auto mb-32 flex h-full max-w-screen-sm flex-col space-y-8 p-5">
          <ul className="flex-grow space-y-8 overflow-y-auto" ref={chatListRef}>
            {chat?.messages.map((message, i) => (
              <li
                key={i}
                className={message.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } prose inline-block rounded-lg px-4 py-3`}
                  dangerouslySetInnerHTML={{
                    __html: parseAndSanitize(message.content),
                  }}
                />
              </li>
            ))}
            {isLoading && (
              <li>
                <div
                  className="prose inline-block rounded-lg bg-gray-200 px-4 py-3 text-black"
                  dangerouslySetInnerHTML={{
                    __html: parseAndSanitize(contentChunks),
                  }}
                />
              </li>
            )}
          </ul>
          <div className="">
            <MessageInput
              value={input}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
