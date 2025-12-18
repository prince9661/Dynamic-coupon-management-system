/**
 * EventEmitter Instance Singleton
 * Exports a single instance that can be imported anywhere
 */

import { setupEventEmitter } from './eventEmitter.js';

// Create and export the instance
export const couponEventEmitter = setupEventEmitter();


