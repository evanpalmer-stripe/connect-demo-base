import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';

// Initial settings state
const initialSettings = {
  general: {
    publishableKey: '',
    secretKey: '',
    isVerified: false,
    connectedAccountCountry: 'AU',
  },
  onboarding: {
    accountType: 'Standard',
    onboardingFlow: 'Hosted',
  },
  payment: {
    // Add payment settings here when needed
  },
  logs: {
    // Add log settings here when needed
  },
  ui: {
    activeTab: 0, // Default to first tab (General)
  }
};

// Settings actions
const SETTINGS_ACTIONS = {
  UPDATE_GENERAL: 'UPDATE_GENERAL',
  UPDATE_ONBOARDING: 'UPDATE_ONBOARDING',
  UPDATE_PAYMENT: 'UPDATE_PAYMENT',
  UPDATE_LOGS: 'UPDATE_LOGS',
  UPDATE_UI: 'UPDATE_UI',
  RESET_SETTINGS: 'RESET_SETTINGS',
  LOAD_SETTINGS: 'LOAD_SETTINGS',
};

// Settings reducer
const settingsReducer = (state, action) => {
  switch (action.type) {
    case SETTINGS_ACTIONS.UPDATE_GENERAL:
      return {
        ...state,
        general: { ...state.general, ...action.payload }
      };
    case SETTINGS_ACTIONS.UPDATE_ONBOARDING:
      return {
        ...state,
        onboarding: { ...state.onboarding, ...action.payload }
      };
    case SETTINGS_ACTIONS.UPDATE_PAYMENT:
      return {
        ...state,
        payment: { ...state.payment, ...action.payload }
      };
    case SETTINGS_ACTIONS.UPDATE_LOGS:
      return {
        ...state,
        logs: { ...state.logs, ...action.payload }
      };
    case SETTINGS_ACTIONS.UPDATE_UI:
      return {
        ...state,
        ui: { ...state.ui, ...action.payload }
      };
    case SETTINGS_ACTIONS.RESET_SETTINGS:
      return initialSettings;
    case SETTINGS_ACTIONS.LOAD_SETTINGS:
      return {
        ...initialSettings,
        ...action.payload,
        // Ensure nested objects are properly merged
        general: { ...initialSettings.general, ...action.payload.general },
        onboarding: { ...initialSettings.onboarding, ...action.payload.onboarding },
        payment: { ...initialSettings.payment, ...action.payload.payment },
        logs: { ...initialSettings.logs, ...action.payload.logs },
        ui: { ...initialSettings.ui, ...action.payload.ui },
      };
    default:
      return state;
  }
};

// Create context
const SettingsContext = createContext();

// Settings Provider component
export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('stripe-connect-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: parsedSettings });
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save settings to localStorage (but not during initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('stripe-connect-settings', JSON.stringify(settings));
    }
  }, [settings, isInitialized]);

  // Auto-save to database with debounce to prevent excessive calls
  useEffect(() => {
    const saveToDatabase = async () => {
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            settings: settings,
            userId: 'default'
          }),
        });
      } catch (error) {
        console.error('Failed to save settings to database:', error);
      }
    };

    // Debounce database saves by 500ms to prevent excessive API calls
    const timeoutId = setTimeout(saveToDatabase, 500);
    
    return () => clearTimeout(timeoutId);
  }, [settings]);

  // Action creators
  const updateGeneral = useCallback((updates) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_GENERAL, payload: updates });
  }, []);

  const updateOnboarding = useCallback((updates) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_ONBOARDING, payload: updates });
  }, []);

  const updatePayment = useCallback((updates) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_PAYMENT, payload: updates });
  }, []);

  const updateLogs = useCallback((updates) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_LOGS, payload: updates });
  }, []);

  const updateUI = useCallback((updates) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_UI, payload: updates });
  }, []);

  const resetSettings = useCallback(() => {
    dispatch({ type: SETTINGS_ACTIONS.RESET_SETTINGS });
  }, []);

  const value = {
    settings,
    updateGeneral,
    updateOnboarding,
    updatePayment,
    updateLogs,
    updateUI,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Convenience hooks for specific setting categories
export const useGeneralSettings = () => {
  const { settings, updateGeneral } = useSettings();
  return {
    general: settings.general,
    updateGeneral,
  };
};

export const useOnboardingSettings = () => {
  const { settings, updateOnboarding } = useSettings();
  return {
    onboarding: settings.onboarding,
    updateOnboarding,
  };
};

export const usePaymentSettings = () => {
  const { settings, updatePayment } = useSettings();
  return {
    payment: settings.payment,
    updatePayment,
  };
};

export const useLogsSettings = () => {
  const { settings, updateLogs } = useSettings();
  return {
    logs: settings.logs,
    updateLogs,
  };
};

export const useUISettings = () => {
  const { settings, updateUI } = useSettings();
  return {
    ui: settings.ui,
    updateUI,
  };
};
