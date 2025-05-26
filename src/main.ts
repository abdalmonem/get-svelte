import { mount } from 'svelte';
import App from "./App.svelte";

/**
 * Entry point for the application.
 * Mounts the main Svelte App component to the DOM element with id 'app'.
 */
const appElement = document.getElementById('app');
if (appElement) {
  mount(App, {
    target: appElement
  });
} else {
  console.error('Could not find element with id "app"');
}
