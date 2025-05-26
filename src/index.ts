// Main entry point for the GetX Svelte library
import Get from './Get.js';
import GetxController from './GetxController.js';
import GetxControllerID from './GetxControllerID.js';
import { InnerCaller } from './InnerCaller.js';

// Export the Svelte components
import GetListener from './svelteComponents/GetListener.svelte';

// Export all library elements
export {
  // Core classes
  Get,
  GetxController,
  GetxControllerID,
  InnerCaller,

  // Svelte components
  GetListener
};

// Default export for convenience
export default {
  Get,
  GetxController,
  GetListener
};
