import "./globals.css";
import "highlight.js/styles/vs2015.css";

export const metadata = {
  title: "Chat GPT API Web Client",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
