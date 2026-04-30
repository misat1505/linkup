import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./app.tsx";
import BgGradient from "./components/common/bg-gradient.tsx";
import { SetUiPackageConfig } from "./components/common/set-ui-package-config.tsx";
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
            <SetUiPackageConfig />
            <App />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
