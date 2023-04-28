import { DeleteButton } from "./DeleteButton";
import { Chat } from "./_types/Chat";

type Props = {
  chats: readonly Chat[];
  onNewChatButtonClick: () => void;
  onChatSelect: (chatId: string) => void;
  onChatDelete: (chatId: string) => void;
  settingButton: React.ReactNode;
};

export const SideMenu: React.FC<Props> = ({
  chats,
  onNewChatButtonClick,
  onChatSelect,
  onChatDelete,
  settingButton,
}) => {
  return (
    <div className="h-full w-[256px] space-y-2 bg-gray-900 p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-grow">
          <button
            type="button"
            className="w-full rounded-lg border border-white px-4 py-3 hover:bg-gray-700"
            onClick={onNewChatButtonClick}
          >
            New chat
          </button>
        </div>
        <div>{settingButton}</div>
      </div>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="flex items-center space-x-2">
            <button
              type="button"
              className="w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-lg px-4 py-3 text-left hover:bg-gray-700"
              onClick={() => {
                onChatSelect(chat.id);
              }}
            >
              {chat.messages[0]?.content}
            </button>
            <DeleteButton
              onClick={() => {
                onChatDelete(chat.id);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
