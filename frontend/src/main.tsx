import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import BgGradient from "./components/common/BgGradient.tsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

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
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BgGradient />
          <div className="relative z-10">
            <App />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </StrictMode>
);
