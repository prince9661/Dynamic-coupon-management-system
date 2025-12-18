/**
 * ============================================
 * UNIT I - Node.js Core Modules: fs, path
 * ============================================
 * 
 * fs (File System) Module:
 * - Provides file I/O operations
 * - Used for reading/writing files, creating directories
 * - Both synchronous and asynchronous methods available
 * 
 * path Module:
 * - Utilities for working with file and directory paths
 * - Cross-platform path handling
 * - Path joining, resolving, parsing
 * 
 * In this system:
 * - Logs coupon operations to files
 * - Creates necessary directories
 * - Reads/writes JSON configuration files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup File System Utilities
 * Creates necessary directories and log files
 */
export const setupFileSystem = () => {
  try {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      console.log('✅ Created logs directory');
    }

    // Create data directory for JSON files
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('✅ Created data directory');
    }

    // Initialize coupon operations log file
    const logFile = path.join(logsDir, 'coupon-operations.log');
    if (!fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, `=== Coupon Operations Log ===\nStarted: ${new Date().toISOString()}\n\n`, 'utf8');
    }

    console.log('✅ File system utilities initialized');
  } catch (error) {
    console.error('❌ File system setup error:', error.message);
  }
};

/**
 * Write to Log File
 * Demonstrates: fs.writeFile (asynchronous file writing)
 * 
 * @param {string} message - Log message to write
 * @param {string} logType - Type of log (operations, errors, etc.)
 */
export const writeLog = (message, logType = 'operations') => {
  const logFile = path.join(__dirname, `../logs/coupon-${logType}.log`);
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  // Asynchronous write (non-blocking)
  fs.appendFile(logFile, logEntry, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

/**
 * Read Log File
 * Demonstrates: fs.readFile (asynchronous file reading)
 * 
 * @param {string} logType - Type of log to read
 * @returns {Promise<string>} Log file contents
 */
export const readLog = (logType = 'operations') => {
  return new Promise((resolve, reject) => {
    const logFile = path.join(__dirname, `../logs/coupon-${logType}.log`);
    
    fs.readFile(logFile, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Write JSON File
 * Demonstrates: JSON.stringify, fs.writeFileSync
 * 
 * @param {string} filename - Name of JSON file
 * @param {Object} data - Data to write
 */
export const writeJSON = (filename, data) => {
  try {
    const filePath = path.join(__dirname, `../data/${filename}`);
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing JSON file ${filename}:`, error);
    return false;
  }
};

/**
 * Read JSON File
 * Demonstrates: fs.readFileSync, JSON.parse
 * 
 * @param {string} filename - Name of JSON file
 * @returns {Object|null} Parsed JSON data or null
 */
export const readJSON = (filename) => {
  try {
    const filePath = path.join(__dirname, `../data/${filename}`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error(`Error reading JSON file ${filename}:`, error);
    return null;
  }
};

/**
 * Check if file exists
 * Demonstrates: fs.existsSync
 * 
 * @param {string} filepath - Path to check
 * @returns {boolean} True if file exists
 */
export const fileExists = (filepath) => {
  return fs.existsSync(filepath);
};

export default {
  setupFileSystem,
  writeLog,
  readLog,
  writeJSON,
  readJSON,
  fileExists
};


