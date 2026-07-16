// @ts-check
/**
 * Helper to check if Jekyll server is running before E2E tests
 * Since we removed auto-start from playwright.config.js, 
 * the server must be started manually with `make serve`
 */

import http from 'http';

/**
 * Check if server is responding at the given URL
 * @param {string} url - Full URL to check (e.g., 'http://localhost:4000')
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>}
 */
export async function isServerRunning(url, timeout = 3000) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: '/',
      method: 'HEAD',
      timeout: timeout
    };

    const req = http.request(options, (res) => {
      const code = res.statusCode;
      resolve(typeof code === 'number' && code >= 200 && code < 500);
      //resolve(res.statusCode >= 200 && res.statusCode < 500);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

/**
 * Validate server is running, throw error with helpful message if not
 * @param {string} baseURL - Base URL to check
 */
export async function validateServerRunning(baseURL) {
  const serverRunning = await isServerRunning(baseURL);
  
  if (!serverRunning) {
    throw new Error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ ERRO: Servidor Jekyll não está rodando em ${baseURL}

Para executar os testes E2E, você precisa:

1. Em um terminal separado, execute:
   $ make serve

2. Aguarde a mensagem "Server running..."

3. Em outro terminal, execute os testes:
   $ make test-e2e

Ou use o atalho que verifica automaticamente:
   $ make test-with-server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }
}
