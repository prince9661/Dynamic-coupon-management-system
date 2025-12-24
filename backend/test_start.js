
console.log('Attempting to import server.js...');
try {
    await import('./server.js');
    console.log('Server imported successfully.');
} catch (error) {
    console.error('CRASH DETECTED during import:');
    console.error(error);
}
