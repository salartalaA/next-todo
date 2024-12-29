import "@/app/globals.css";
import { AuthProvider } from "./context/AuthContext";
import Toastify from "./components/Toastify";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Todo List</title>
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toastify />
        </AuthProvider>
      </body>
    </html>
  );
}
