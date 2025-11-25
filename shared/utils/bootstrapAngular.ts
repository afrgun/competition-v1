/**
 * Bootstrap Angular Component Utility
 * Helps mount Angular components inside React application
 */

interface BootstrapAngularOptions {
  moduleName: string;
  selector: string;
  containerId: string;
  props?: Record<string, any>;
}

export async function bootstrapAngularComponent(
  options: BootstrapAngularOptions
): Promise<HTMLElement | null> {
  const { moduleName, selector, containerId, props = {} } = options;

  try {
    console.log('[Angular Bootstrap] Starting...', {
      moduleName,
      selector,
      containerId,
    });

    // Check if container exists
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    // Create Angular element
    const element = document.createElement(selector);

    // Pass props as attributes if needed
    Object.entries(props).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        element.setAttribute(key, String(value));
      } else {
        // For complex objects, use property binding
        (element as any)[key] = value;
      }
    });

    // Append to container
    container.appendChild(element);

    console.log('[Angular Bootstrap] ✅ Component mounted successfully', {
      element,
      selector,
    });

    return element;
  } catch (error) {
    console.error('[Angular Bootstrap] ❌ Failed to bootstrap:', error);
    throw error;
  }
}

export function cleanupAngularComponent(containerId: string): void {
  try {
    const container = document.getElementById(containerId);
    if (container) {
      // Clear all children
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      console.log('[Angular Bootstrap] 🧹 Cleanup completed');
    }
  } catch (error) {
    console.error('[Angular Bootstrap] ❌ Cleanup failed:', error);
  }
}
