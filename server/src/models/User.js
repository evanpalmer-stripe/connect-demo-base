const db = require('../config/database');

class User {
  // Create a new user
  static createUser(email, accountId) {
    try {
      const stmt = db.prepare('INSERT INTO users (email, account_id) VALUES (?, ?)');
      const result = stmt.run(email, accountId);
      
      return {
        id: result.lastInsertRowid,
        email,
        accountId,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Create or update user (upsert)
  static createOrUpdateUser(email, accountId) {
    try {
      // First try to get existing user
      const existingUser = this.getUserByEmail(email);
      if (existingUser) {
        // Update the account ID if it's different
        if (existingUser.accountId !== accountId) {
          const updatedUser = this.updateUser(existingUser.id, { account_id: accountId });
          return updatedUser || existingUser;
        }
        return existingUser;
      }

      // If user doesn't exist, create new one
      return this.createUser(email, accountId);
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error);
      throw error;
    }
  }

  // Get user by ID
  static getUserById(id) {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
      const result = stmt.get(id);
      
      if (!result) {
        return null;
      }

      return {
        id: result.id,
        email: result.email,
        accountId: result.account_id,
        createdAt: result.created_at
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Get user by email
  static getUserByEmail(email) {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
      const result = stmt.get(email);
      
      if (!result) {
        return null;
      }

      return {
        id: result.id,
        email: result.email,
        accountId: result.account_id,
        createdAt: result.created_at
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Get user by account ID
  static getUserByAccountId(accountId) {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE account_id = ?');
      const result = stmt.get(accountId);
      
      if (!result) {
        return null;
      }

      return {
        id: result.id,
        email: result.email,
        accountId: result.account_id,
        createdAt: result.created_at
      };
    } catch (error) {
      console.error('Error getting user by account ID:', error);
      throw error;
    }
  }

  // Get all users
  static getAllUsers() {
    try {
      const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
      const results = stmt.all();
      
      return results.map(result => ({
        id: result.id,
        email: result.email,
        accountId: result.account_id,
        createdAt: result.created_at
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  // Update user
  static updateUser(id, updates) {
    try {
      const allowedFields = ['email', 'account_id'];
      const updateFields = [];
      const values = [];

      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
          updateFields.push(`${key} = ?`);
          values.push(updates[key]);
        }
      });

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      values.push(id);
      const stmt = db.prepare(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`);
      const result = stmt.run(...values);

      if (result.changes === 0) {
        return null;
      }

      return this.getUserById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  static deleteUser(id) {
    try {
      const stmt = db.prepare('DELETE FROM users WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Check if email exists
  static emailExists(email) {
    try {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
      const result = stmt.get(email);
      return result.count > 0;
    } catch (error) {
      console.error('Error checking if email exists:', error);
      throw error;
    }
  }

  // Check if account ID exists
  static accountIdExists(accountId) {
    try {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE account_id = ?');
      const result = stmt.get(accountId);
      return result.count > 0;
    } catch (error) {
      console.error('Error checking if account ID exists:', error);
      throw error;
    }
  }
}

module.exports = User;
