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
    accountType: 'standard',
    onboardingFlow: 'hosted',
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
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
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
      return { ...initialSettings, isLoading: false, error: null };
    case SETTINGS_ACTIONS.LOAD_SETTINGS:
      return {
        ...initialSettings,
        // Deep merge with proper fallbacks - only merge if payload has data
        general: { ...initialSettings.general, ...(action.payload.general || {}) },
        onboarding: { ...initialSettings.onboarding, ...(action.payload.onboarding || {}) },
        payment: { ...initialSettings.payment, ...(action.payload.payment || {}) },
        logs: { ...initialSettings.logs, ...(action.payload.logs || {}) },
        ui: { ...initialSettings.ui, ...(action.payload.ui || {}) },
        isLoading: false,
        error: null,
      };
    case SETTINGS_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case SETTINGS_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

// Create context
const SettingsContext = createContext();

// Settings Provider component
export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, { ...initialSettings, isLoading: true, error: null });
  const [isInitialized, setIsInitialized] = useState(false);
  const [saveTimeoutId, setSaveTimeoutId] = useState(null);

  // Load settings from server database and localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        dispatch({ type: SETTINGS_ACTIONS.SET_LOADING, payload: true });
        
        // First, try to load from server database
        const response = await fetch('/api/settings');
        if (response.ok) {
          const serverSettings = await response.json();
          
          // Check if server settings contain meaningful data (not just empty objects)
          const hasData = serverSettings && (
            (serverSettings.general && Object.keys(serverSettings.general).length > 0) ||
            (serverSettings.onboarding && Object.keys(serverSettings.onboarding).length > 0) ||
            (serverSettings.payment && Object.keys(serverSettings.payment).length > 0) ||
            (serverSettings.logs && Object.keys(serverSettings.logs).length > 0) ||
            (serverSettings.ui && Object.keys(serverSettings.ui).length > 0)
          );
          
          if (hasData) {
            dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: serverSettings });
            setIsInitialized(true);
            return;
          }
        }
        
        // Fallback to localStorage if server settings are empty
        const savedSettings = localStorage.getItem('stripe-connect-settings');
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings);
            dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: parsedSettings });
          } catch (error) {
            console.error('Failed to load settings from localStorage:', error);
            dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: 'Failed to load settings from localStorage' });
          }
        } else {
          // Use defaults if no saved settings exist
          dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: {} });
        }
      } catch (error) {
        console.error('Failed to load settings from server:', error);
        
        // Fallback to localStorage on server error
        const savedSettings = localStorage.getItem('stripe-connect-settings');
        if (savedSettings) {
          try {
            const parsedSettings = JSON.parse(savedSettings);
            dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: parsedSettings });
          } catch (error) {
            console.error('Failed to load settings from localStorage:', error);
            dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: 'Failed to load settings from localStorage' });
          }
        } else {
          // Use defaults if no saved settings exist
          dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: {} });
        }
      }
      setIsInitialized(true);
    };

    loadSettings();
  }, []);

  // Save settings to localStorage (but not during initial load)
  useEffect(() => {
    if (isInitialized && !settings.isLoading) {
      localStorage.setItem('stripe-connect-settings', JSON.stringify({
        general: settings.general,
        onboarding: settings.onboarding,
        payment: settings.payment,
        logs: settings.logs,
        ui: settings.ui,
      }));
    }
  }, [settings, isInitialized]);

  // Auto-save to database with proper debounce
  useEffect(() => {
    if (!isInitialized || settings.isLoading) {
      return; // Don't save during initialization
    }

    const saveToDatabase = async () => {
      try {
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            settings: {
              general: settings.general,
              onboarding: settings.onboarding,
              payment: settings.payment,
              logs: settings.logs,
              ui: settings.ui,
            },
            userId: 'default'
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to save settings to database:', error);
        // Could dispatch an error action here to show user notification
      }
    };

    // Clear existing timeout
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(saveToDatabase, 1000); // Increased to 1 second
    setSaveTimeoutId(newTimeoutId);
    
    return () => {
      if (newTimeoutId) {
        clearTimeout(newTimeoutId);
      }
    };
  }, [settings.general, settings.onboarding, settings.payment, settings.logs, settings.ui, isInitialized, settings.isLoading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
      }
    };
  }, [saveTimeoutId]);

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
