const DeleteIcon: React.FC = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      <span className="sr-only">Delete</span>
    </>
  );
};

type Props = {
  onClick: () => void;
};

export const DeleteButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg p-4 hover:bg-gray-700"
    >
      <DeleteIcon />
    </button>
  );
};
