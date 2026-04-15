import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import BgGradient from "./components/common/BgGradient.tsx";
import LanguageProvider from "./contexts/LanguageProvider.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BgGradient />
        <LanguageProvider>
          <div className="relative z-10">
            <App />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
