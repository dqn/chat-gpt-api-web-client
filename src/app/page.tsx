"use client";

import { FormEventHandler, useState } from "react";
import { ulid } from "ulidx";
import useLocalStorageState from "use-local-storage-state";
import { SettingButton } from "./SettingButton";
import { Chat } from "./_types/Chat";
import { Message } from "./_types/Message";
import { fetchChatMessage } from "./fetchChatMessage";
import { SideMenu } from "./SideMenu";
import { MessageInput } from "./MessageInput";

const localStoragePrefix = "chat-gpt-api-web-client";

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

      fetchChatMessage(token, messages).then((message) => {
        messages.push(message);
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

      fetchChatMessage(token, messages).then((message) => {
        messages.push(message);
        setChats(newChats);
        setIsLoading(false);
      });
    }
  };

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
        <main className="relative mx-auto h-full max-w-screen-sm p-5">
          <ul className="space-y-4">
            {chat?.messages.map((message, i) => (
              <li key={i} className="text-left">
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  } inline-block rounded-lg px-4 py-3`}
                >
                  {message.content}
                </div>
              </li>
            ))}
            {isLoading && (
              <li className="animate-pulse">
                <div className="inline-block rounded-lg bg-gray-200 px-4 py-3 text-black">
                  Loading...
                </div>
              </li>
            )}
          </ul>
          <div className="absolute inset-x-0 bottom-0 p-5">
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
