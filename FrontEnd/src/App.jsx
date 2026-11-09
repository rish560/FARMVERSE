import { AppRoutes } from './routes/AppRoutes';
import { AIChatProvider } from './context/AIChatContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { OfflineProvider } from './context/OfflineContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <OfflineProvider>
            <ToastProvider>
              <AIChatProvider>
                <AppRoutes />
              </AIChatProvider>
            </ToastProvider>
          </OfflineProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
