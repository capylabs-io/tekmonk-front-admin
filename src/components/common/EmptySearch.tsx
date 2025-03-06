import Image from "next/image";
import { useRouter } from "next/navigation"; // Optional: If you want to provide a navigation action

type Props = {
  customClassName?: string;
  message?: string; // Optional: Allow dynamic messages
  buttonText?: string; // Optional: Allow customizable button text
  onAction?: () => void; // Optional: Provide an event handler for actions
};

export const EmptySearch = ({
  customClassName = "",
  message = "No results found. Try adjusting your search!",
  buttonText,
  onAction,
}: Props) => {
  const router = useRouter();

  // Default action: Navigate to home if no custom onAction is provided
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      router.push("/"); // Redirect to the homepage
    }
  };

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full gap-4 p-6 ${customClassName}`}
    >
      <Image
        src="/image/contest/empty-box.png"
        alt="Empty search result"
        width={150}
        height={150}
        className="animate-bounce" // Add some subtle animation
      />
      <p className="text-lg font-medium text-gray-600 text-center">{message}</p>
      {buttonText && (
        <button
          onClick={handleAction}
          className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all duration-200"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};
