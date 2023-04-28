import "./globals.css";

export const metadata = {
  title: "Chat GPT API Web Client",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body className="font-mono">{children}</body>
    </html>
  );
};

export default RootLayout;
