import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./app.tsx";
import BgGradient from "./components/common/bg-gradient.tsx";
import AppProvider from "./contexts/app-provider.tsx";
import LanguageProvider from "./contexts/language-provider.tsx";
import { ThemeProvider } from "./contexts/theme-provider.tsx";
import "./index.css";

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
            <Router>
              <AppProvider>
                <App />
              </AppProvider>
            </Router>
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
