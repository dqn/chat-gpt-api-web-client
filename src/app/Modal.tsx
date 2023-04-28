import { useModal } from "hook-modal";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => {
  const modal = useModal({ isOpen, onClose });

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 p-5">
      <div
        {...modal}
        className="bg-background max-h-full min-w-[600px] max-w-xl overflow-auto rounded-xl p-5"
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
