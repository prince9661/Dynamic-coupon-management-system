import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupFileSystem = () => {
  try {
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      console.log('Created logs directory');
    }

    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('Created data directory');
    }

    const logFile = path.join(logsDir, 'coupon-operations.log');
    if (!fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, `=== Coupon Operations Log ===\nStarted: ${new Date().toISOString()}\n\n`, 'utf8');
    }

    console.log('File system utilities initialized');
  } catch (error) {
    console.error('File system setup error:', error.message);
  }
};

export const writeLog = (message, logType = 'operations') => {
  const logFile = path.join(__dirname, `../logs/coupon-${logType}.log`);
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFile(logFile, logEntry, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

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
