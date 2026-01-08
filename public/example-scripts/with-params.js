// This script demonstrates reading query parameters
const scriptTag = document.currentScript;
const url = new URL(scriptTag.src);
const params = Object.fromEntries(url.searchParams);

console.log('Script loaded with query parameters:', params);
window.paramsReceived = params;
window.paramsScriptLoadTime = new Date().toISOString();
