/**
 * ============================================
 * UNIT I - Node.js Core Modules: Stream, zlib
 * ============================================
 * 
 * Stream Module:
 * - Provides abstract interface for working with streaming data
 * - Four types: Readable, Writable, Duplex, Transform
 * - Efficient for handling large data without loading everything into memory
 * 
 * zlib Module:
 * - Provides compression and decompression using Gzip, Deflate, Brotli
 * - Useful for compressing log files, API responses
 * - Reduces storage and bandwidth usage
 * 
 * In this system:
 * - Stream coupon usage logs to files
 * - Compress old log files to save space
 */

import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { createGzip, createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Setup Streams for Coupon Usage Logging
 * Demonstrates: Stream module, Writable streams
 * 
 * @param {EventEmitter} eventEmitter - Event emitter for coupon events
 */
export const setupStreams = (eventEmitter) => {
  const logFilePath = path.join(__dirname, '../logs/coupon-usage-stream.log');
  
  // Create a writable stream for coupon usage logs
  const usageLogStream = createWriteStream(logFilePath, { flags: 'a' });

  // Listen to coupon usage events and write to stream
  eventEmitter.on('coupon:used', (usageData) => {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      couponCode: usageData.couponCode,
      userId: usageData.userId,
      orderId: usageData.orderId,
      discountAmount: usageData.discountAmount
    }) + '\n';

    // Write to stream (non-blocking)
    usageLogStream.write(logEntry, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to stream:', err);
      }
    });
  });

  console.log('✅ Stream utilities initialized');
};

/**
 * Compress Log File using Gzip
 * Demonstrates: zlib compression, Stream pipeline
 * 
 * @param {string} sourceFile - Path to file to compress
 * @param {string} destFile - Path for compressed file
 */
export const compressLogFile = async (sourceFile, destFile) => {
  try {
    const sourcePath = path.join(__dirname, '../logs', sourceFile);
    const destPath = path.join(__dirname, '../logs', destFile);

    // Create readable stream from source file
    const readStream = fs.createReadStream(sourcePath);
    
    // Create gzip compression stream
    const gzipStream = createGzip();
    
    // Create writable stream for compressed file
    const writeStream = fs.createWriteStream(destPath);

    // Pipe streams: read -> compress -> write
    await pipeline(readStream, gzipStream, writeStream);
    
    console.log(`✅ Compressed ${sourceFile} to ${destFile}`);
    return true;
  } catch (error) {
    console.error('❌ Compression error:', error);
    return false;
  }
};

/**
 * Decompress Log File
 * Demonstrates: zlib decompression, Stream pipeline
 * 
 * @param {string} sourceFile - Path to compressed file
 * @param {string} destFile - Path for decompressed file
 */
export const decompressLogFile = async (sourceFile, destFile) => {
  try {
    const sourcePath = path.join(__dirname, '../logs', sourceFile);
    const destPath = path.join(__dirname, '../logs', destFile);

    // Create readable stream from compressed file
    const readStream = fs.createReadStream(sourcePath);
    
    // Create gunzip decompression stream
    const gunzipStream = createGunzip();
    
    // Create writable stream for decompressed file
    const writeStream = fs.createWriteStream(destPath);

    // Pipe streams: read -> decompress -> write
    await pipeline(readStream, gunzipStream, writeStream);
    
    console.log(`✅ Decompressed ${sourceFile} to ${destFile}`);
    return true;
  } catch (error) {
    console.error('❌ Decompression error:', error);
    return false;
  }
};

export default {
  setupStreams,
  compressLogFile,
  decompressLogFile
};


