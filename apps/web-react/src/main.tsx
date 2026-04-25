import { CONTRACT_KEYS } from "@packages/api-contract";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App.tsx";
import BgGradient from "./components/common/BgGradient.tsx";
import LanguageProvider from "./contexts/LanguageProvider.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

console.log(CONTRACT_KEYS);

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
  </StrictMode>,
);
