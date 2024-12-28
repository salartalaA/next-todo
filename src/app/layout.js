import "@/app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Todo List</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
