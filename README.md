# GetX for Svelte

![GetX for Svelte](https://via.placeholder.com/150x150.png?text=GetX)

A simple, powerful state management library for Svelte applications, inspired by [GetX for Flutter](https://pub.dev/packages/get).

[![npm version](https://badge.fury.io/js/get-svelte.svg)](https://badge.fury.io/js/get-svelte)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Features

- 🚀 Simple and intuitive API
- 🎯 Dependency injection for controllers
- 🔄 Reactive state management
- 🧩 Automatic component updates
- ♻️ Optional automatic controller disposal
- 🏷️ Tag-based controller identification

## Installation

```bash
# npm
npm install get-svelte

# pnpm
pnpm add get-svelte

# yarn
yarn add get-svelte
```

## Basic Usage

### 1. Create a Controller

First, create a controller that extends `GetxController`:

```typescript
import { GetxController } from 'get-svelte';

class CounterController extends GetxController {
  count = 0;
  
  increment() {
    this.count++;
    this.notifyListener(); // Notify listeners about state change
  }
  
  decrement() {
    this.count--;
    this.notifyListener(); // Notify listeners about state change
  }
  
  // Optional: Override onInit for initialization logic
  protected onInit(): void {
    console.log('CounterController initialized');
  }
}
```

### 2. Register Controller

Register your controller with the `Get` service:

```typescript
import { Get } from 'get-svelte';
import { CounterController } from './CounterController';

// Register controller without tag
const counterController = Get.put(new CounterController());

// Or register with a tag for specific identification
const taggedController = Get.put(new CounterController(), { tag: 'main-counter' });
```

### 3. Use Controller in Components

Use the `GetListener` component to automatically react to controller state changes:

```svelte
<script>
  import { Get, GetListener } from 'get-svelte';
  import { CounterController } from './CounterController';
  
  // Find existing controller or throw error if not found
  const counterController = Get.find(CounterController);
  
  // Or find controller by tag
  const taggedController = Get.find(CounterController, { tag: 'main-counter' });
</script>

<GetListener controller={counterController}>
  {#snippet builder(controller)}
    <div>
      <h1>Counter: {controller.count}</h1>
      <button on:click={() => controller.increment()}>Increment</button>
      <button on:click={() => controller.decrement()}>Decrement</button>
    </div>
  {/snippet}
</GetListener>
```

## API Reference

### `Get` Class

The main service class for controller management:

#### `Get.put<T extends GetxController>(controller: T, params?: { tag?: string }): T`

Registers a controller with the Get system. If a controller of the same type and tag exists, returns the existing instance.

```typescript
const controller = Get.put(new MyController());
const taggedController = Get.put(new MyController(), { tag: 'unique-tag' });
```

#### `Get.find<T extends GetxController>(ControllerClass: new (...args: any[]) => T, params?: { tag?: string }): T`

Finds and returns a registered controller. Throws an error if not found.

```typescript
const controller = Get.find(MyController);
const taggedController = Get.find(MyController, { tag: 'unique-tag' });
```

#### `Get.isRegistered<T extends GetxController>(ControllerClass: new (...args: any[]) => T, params?: { tag?: string }): boolean`

Checks if a controller is registered with the Get system.

```typescript
const exists = Get.isRegistered(MyController, { tag: 'unique-tag' });
```

### `GetxController` Class

Base class for all controllers:

#### `notifyListener(): void`

Notifies all registered listeners about state changes. Call this method whenever your controller's state changes.

#### `onInit(): void`

Lifecycle hook called when the controller is initialized. Override this method to perform initialization tasks.

#### `dispose(): void`

Removes the controller from the Get system.

### `GetListener` Component

A Svelte component that listens to controller state changes and rebuilds its UI:

```svelte
<GetListener
  controller={myController}
  autoDestroy={true}>
  {#snippet builder(controller)}
    <!-- Your UI that uses controller state -->
    <div>Count: {controller.count}</div>
  {/snippet}
</GetListener>
```

#### Props:

- `controller`: The controller instance to listen to
- `autoDestroy` (optional, default: `true`): Whether to automatically dispose the controller when the component is destroyed

## Examples

### Counter Example

```typescript
// CounterController.ts
import { GetxController } from 'get-svelte';

export class CounterController extends GetxController {
  count = 0;
  
  increment() {
    this.count++;
    this.notifyListener();
  }
  
  decrement() {
    this.count--;
    this.notifyListener();
  }
}
```

```svelte
<!-- Counter.svelte -->
<script>
  import { Get, GetListener } from 'get-svelte';
  import { CounterController } from './CounterController';
  
  // Create and register controller if not already registered
  const controller = Get.isRegistered(CounterController)
    ? Get.find(CounterController)
    : Get.put(new CounterController());
</script>

<GetListener controller={controller}>
  {#snippet builder(ctrl)}
    <div>
      <h2>Count: {ctrl.count}</h2>
      <button on:click={() => ctrl.increment()}>+</button>
      <button on:click={() => ctrl.decrement()}>-</button>
    </div>
  {/snippet}
</GetListener>
```

## Advanced Usage

### Using Tags for Multiple Instances

```typescript
// Create multiple counter instances
const counter1 = Get.put(new CounterController(), { tag: 'counter1' });
const counter2 = Get.put(new CounterController(), { tag: 'counter2' });

// Later, retrieve specific counters
const counter1Instance = Get.find(CounterController, { tag: 'counter1' });
const counter2Instance = Get.find(CounterController, { tag: 'counter2' });
```

### Manual Controller Lifecycle Management

```svelte
<script>
  import { Get, GetListener } from 'get-svelte';
  import { MyController } from './MyController';
  
  const controller = Get.put(new MyController());
  
  function cleanupController() {
    controller.dispose();
  }
</script>

<GetListener 
  controller={controller} 
  autoDestroy={false}>
  {#snippet builder(ctrl)}
    <!-- Your UI components here -->
    <div>Data: {ctrl.data}</div>
  {/snippet}
</GetListener>

<button on:click={cleanupController}>Dispose Controller</button>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License

## Author

Created by [Abdalmonem](https://inkedoo.com)

