const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get all table names
router.get('/tables', (req, res) => {
  try {
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all();
    
    res.json({ tables: tables.map(t => t.name) });
  } catch (error) {
    console.error('Error getting tables:', error);
    res.status(500).json({ error: 'Failed to get tables' });
  }
});

// Get table schema
router.get('/tables/:tableName/schema', (req, res) => {
  try {
    const { tableName } = req.params;
    const schema = db.prepare(`PRAGMA table_info(${tableName})`).all();
    res.json({ schema });
  } catch (error) {
    console.error('Error getting table schema:', error);
    res.status(500).json({ error: 'Failed to get table schema' });
  }
});

// Get paginated table data
router.get('/tables/:tableName/data', (req, res) => {
  try {
    const { tableName } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM ${tableName}`).get();
    const total = countResult.total;
    
    // Get paginated data
    const data = db.prepare(`
      SELECT * FROM ${tableName} 
      ORDER BY rowid 
      LIMIT ? OFFSET ?
    `).all(parseInt(limit), parseInt(offset));
    
    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting table data:', error);
    res.status(500).json({ error: 'Failed to get table data' });
  }
});

// Update a record
router.put('/tables/:tableName/records/:id', (req, res) => {
  try {
    const { tableName, id } = req.params;
    const updates = req.body;
    
    // Get table schema to validate fields
    const schema = db.prepare(`PRAGMA table_info(${tableName})`).all();
    const allowedFields = schema.map(col => col.name);
    
    // Build update query
    const updateFields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && key !== 'id') {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    values.push(id);
    const query = `UPDATE ${tableName} SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = db.prepare(query).run(...values);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    // Get updated record
    const updatedRecord = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);
    res.json({ record: updatedRecord });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// Delete a record
router.delete('/tables/:tableName/records/:id', (req, res) => {
  try {
    const { tableName, id } = req.params;
    
    const result = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

module.exports = router;
