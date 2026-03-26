import "./globals.css";
import { ToastContainer } from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.css";
import Providers from "@/store/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
