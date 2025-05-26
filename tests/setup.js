// This file is used to set up the test environment for Svelte components
// It's referenced in the vite.config.ts file

// Set up the global environment for Svelte components
import { vi } from 'vitest';

// Mock any browser APIs that might be used by Svelte components
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Add any other setup code here
