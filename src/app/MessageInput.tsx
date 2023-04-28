import {
  ChangeEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
} from "react";

type Props = {
  value: string;
  onChange: FormEventHandler<HTMLTextAreaElement>;
  onSubmit: () => void;
};

export const MessageInput: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
}) => {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const el = e.target;
    el.rows = el.value.split("\n").length;
    onChange(e);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="w-full rounded-lg border border-white bg-gray-800 p-3"
      rows={1}
    />
  );
};
