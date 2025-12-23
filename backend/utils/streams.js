import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { createGzip, createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupStreams = (eventEmitter) => {
  const logFilePath = path.join(__dirname, '../logs/coupon-usage-stream.log');

  const usageLogStream = createWriteStream(logFilePath, { flags: 'a' });

  eventEmitter.on('coupon:used', (usageData) => {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      couponCode: usageData.couponCode,
      userId: usageData.userId,
      orderId: usageData.orderId,
      discountAmount: usageData.discountAmount
    }) + '\n';

    usageLogStream.write(logEntry, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to stream:', err);
      }
    });
  });

  console.log('✅ Stream utilities initialized');
};

export const compressLogFile = async (sourceFile, destFile) => {
  try {
    const sourcePath = path.join(__dirname, '../logs', sourceFile);
    const destPath = path.join(__dirname, '../logs', destFile);

    const readStream = fs.createReadStream(sourcePath);

    const gzipStream = createGzip();

    const writeStream = fs.createWriteStream(destPath);

    await pipeline(readStream, gzipStream, writeStream);

    console.log(`✅ Compressed ${sourceFile} to ${destFile}`);
    return true;
  } catch (error) {
    console.error('❌ Compression error:', error);
    return false;
  }
};

export const decompressLogFile = async (sourceFile, destFile) => {
  try {
    const sourcePath = path.join(__dirname, '../logs', sourceFile);
    const destPath = path.join(__dirname, '../logs', destFile);

    const readStream = fs.createReadStream(sourcePath);

    const gunzipStream = createGunzip();

    const writeStream = fs.createWriteStream(destPath);

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
