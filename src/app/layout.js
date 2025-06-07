
import { SavedItemsProvider } from "@/context/SavedItems";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Nav } from "@/components/Nav";


export const metadata = {
  title: "London Blog App",
  description: "London Places to Visit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <SavedItemsProvider>

            <Nav />
           {children}
          </SavedItemsProvider>
        </ThemeProvider>
      
      </body>
    </html>
  );
}
