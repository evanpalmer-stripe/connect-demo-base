const db = require('../config/database');

class Settings {
  // Get settings for a user (default user for now)
  static getSettings(userId = 'default') {
    try {
      const stmt = db.prepare('SELECT * FROM settings WHERE user_id = ?');
      const result = stmt.get(userId);
      
      if (!result) {
        return null;
      }

      // Parse JSON strings back to objects
      return {
        id: result.id,
        userId: result.user_id,
        general: result.general ? JSON.parse(result.general) : {},
        onboarding: result.onboarding ? JSON.parse(result.onboarding) : {},
        dashboard: result.dashboard ? JSON.parse(result.dashboard) : {},
        payment: result.payment ? JSON.parse(result.payment) : {},
        logs: result.logs ? JSON.parse(result.logs) : {},
        database: result.database ? JSON.parse(result.database) : {},
        ui: result.ui ? JSON.parse(result.ui) : {},
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  }

  // Save or update settings for a user
  static saveSettings(settingsData, userId = 'default') {
    try {
      const existingSettings = this.getSettings(userId);
      
      if (existingSettings) {
        // Update existing settings
        const stmt = db.prepare(`
          UPDATE settings 
          SET general = ?, onboarding = ?, dashboard = ?, payment = ?, logs = ?, database = ?, ui = ?
          WHERE user_id = ?
        `);
        
        stmt.run(
          JSON.stringify(settingsData.general || {}),
          JSON.stringify(settingsData.onboarding || {}),
          JSON.stringify(settingsData.dashboard || {}),
          JSON.stringify(settingsData.payment || {}),
          JSON.stringify(settingsData.logs || {}),
          JSON.stringify(settingsData.database || {}),
          JSON.stringify(settingsData.ui || {}),
          userId
        );
      } else {
        // Insert new settings
        const stmt = db.prepare(`
          INSERT INTO settings (user_id, general, onboarding, dashboard, payment, logs, database, ui)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run(
          userId,
          JSON.stringify(settingsData.general || {}),
          JSON.stringify(settingsData.onboarding || {}),
          JSON.stringify(settingsData.dashboard || {}),
          JSON.stringify(settingsData.payment || {}),
          JSON.stringify(settingsData.logs || {}),
          JSON.stringify(settingsData.database || {}),
          JSON.stringify(settingsData.ui || {})
        );
      }
      
      return this.getSettings(userId);
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  // Update specific setting category
  static updateSettings(category, updates, userId = 'default') {
    try {
      const existingSettings = this.getSettings(userId) || {
        general: {},
        onboarding: {},
        dashboard: {},
        payment: {},
        logs: {},
        database: {},
        ui: {}
      };

      // Update the specific category
      existingSettings[category] = { ...existingSettings[category], ...updates };

      return this.saveSettings(existingSettings, userId);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Delete settings for a user
  static deleteSettings(userId = 'default') {
    try {
      const stmt = db.prepare('DELETE FROM settings WHERE user_id = ?');
      const result = stmt.run(userId);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting settings:', error);
      throw error;
    }
  }
}

module.exports = Settings;
