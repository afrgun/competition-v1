/**
 * Load Remote Module Utility
 * Handles dynamic loading of Module Federation remotes with retry logic
 */

interface LoadRemoteModuleOptions {
  url: string;
  scope: string;
  module: string;
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Load a script with timeout
 */
function loadScript(src: string, timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      console.log('[LoadRemote] Script already loaded:', src);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;

    const timeoutId = setTimeout(() => {
      script.remove();
      reject(new Error(`Timeout loading ${src} after ${timeout}ms`));
    }, timeout);

    script.onload = () => {
      clearTimeout(timeoutId);
      console.log('[LoadRemote] ✅ Script loaded:', src);
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      script.remove();
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.head.appendChild(script);
  });
}

/**
 * Retry a function with delay
 */
async function retry<T>(
  fn: () => Promise<T>,
  retriesLeft: number,
  delay: number
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retriesLeft === 0) {
      throw error;
    }

    console.warn(
      `[LoadRemote] Retry attempt (${retriesLeft} left)`,
      error
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retriesLeft - 1, delay);
  }
}

/**
 * Load remote module with Module Federation
 */
export async function loadRemoteModule({
  url,
  scope,
  module,
  maxRetries = 3,
  retryDelay = 1000,
  timeout = 5000,
}: LoadRemoteModuleOptions): Promise<any> {
  console.log('[LoadRemote] Loading remote module...', {
    url,
    scope,
    module,
  });

  return retry(
    async () => {
      // Step 1: Load the remote script
      await loadScript(url, timeout);

      // Step 2: Initialize webpack sharing
      // @ts-ignore - Webpack runtime globals
      if (!__webpack_init_sharing__) {
        throw new Error('Webpack sharing not available');
      }

      // @ts-ignore
      await __webpack_init_sharing__('default');
      console.log('[LoadRemote] ✅ Webpack sharing initialized');

      // Step 3: Get the container
      // @ts-ignore
      const container = window[scope];

      if (!container) {
        throw new Error(`Remote container "${scope}" not found on window`);
      }

      console.log('[LoadRemote] ✅ Container found:', scope);

      // Step 4: Initialize the container
      // @ts-ignore
      if (!__webpack_share_scopes__) {
        throw new Error('Webpack share scopes not available');
      }

      // @ts-ignore
      await container.init(__webpack_share_scopes__.default);
      console.log('[LoadRemote] ✅ Container initialized');

      // Step 5: Get the module
      const factory = await container.get(module);
      if (!factory) {
        throw new Error(`Module "${module}" not found in container "${scope}"`);
      }

      console.log('[LoadRemote] ✅ Module factory retrieved');

      // Step 6: Execute the factory to get the module
      const Module = factory();
      console.log('[LoadRemote] ✅ Module loaded successfully', Module);

      return Module;
    },
    maxRetries,
    retryDelay
  );
}

/**
 * Check if remote is available
 */
export async function checkRemoteHealth(
  url: string,
  timeout: number = 3000
): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const healthy = response.ok;
    console.log('[LoadRemote] Health check:', {
      url,
      status: response.status,
      healthy,
    });

    return healthy;
  } catch (error) {
    console.warn('[LoadRemote] Health check failed:', url, error);
    return false;
  }
}
