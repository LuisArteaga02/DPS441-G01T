import "./globals.css";

export const metadata = {
  title: "Preguntas frecuentes - Campus UBD",
  description: "Preguntas frecuentes sobre los servicios y políticas del campus universitario.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-display antialiased bg-indigo-200`}>
        {children}
      </body>
    </html>
  );
}
