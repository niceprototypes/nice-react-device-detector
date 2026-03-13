# nice-react-device-detector

[![npm version](https://badge.fury.io/js/nice-react-device-detector.svg)](https://badge.fury.io/js/nice-react-device-detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React hook for detecting mobile devices with enhanced debugging capabilities and Chrome DevTools support.

## Features

✨ **Smart Detection**: Multi-layered approach combining user agent, touch capability, and viewport width
🔧 **DevTools Support**: Enhanced detection for Chrome DevTools mobile emulation
🐛 **Debug Mode**: Easy testing with localStorage or URL parameter flags
📱 **Responsive**: Automatically updates on window resize events
⚡ **Lightweight**: Zero dependencies (except React peer dependency)
🎯 **TypeScript**: Full TypeScript support with type definitions

## Installation

```bash
npm install nice-react-device-detector
```

## Quick Start

### Using the Hook Directly

```tsx
import { useDeviceDetector } from 'nice-react-device-detector';

function MyComponent() {
  const isMobile = useDeviceDetector();

  return (
    <div>
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  );
}
```

### Using Context Provider (Optional)

For applications that need to share device detection state across multiple components, you can use the Context Provider pattern:

```tsx
import { DeviceProvider, useDevice } from 'nice-react-device-detector';

// Wrap your app with the provider
function App() {
  return (
    <DeviceProvider>
      <YourAppComponents />
    </DeviceProvider>
  );
}

// Use the hook in any child component
function ChildComponent() {
  const { isMobile } = useDevice();

  return (
    <div>
      {isMobile ? 'Mobile View' : 'Desktop View'}
    </div>
  );
}
```

## API Reference

### `useDeviceDetector()`

A React hook that returns a boolean indicating whether the current device is detected as mobile.

**Returns:**
- `boolean` - `true` if mobile device is detected, `false` otherwise

**Example:**
```tsx
const isMobile = useDeviceDetector();
```

### `DeviceProvider`

A React Context Provider that shares device detection state across components.

**Props:**
- `children: React.ReactNode` - Child components that will have access to the device context

**Example:**
```tsx
<DeviceProvider>
  <App />
</DeviceProvider>
```

### `useDevice()`

A React hook that accesses the device context. Must be used within a `DeviceProvider`.

**Returns:**
- `{ isMobile: boolean }` - Object containing the mobile detection state

**Throws:**
- Error if used outside of `DeviceProvider`

**Example:**
```tsx
const { isMobile } = useDevice();
```

## Detection Logic

The hook uses a comprehensive approach to detect mobile devices:

1. **User Agent Detection**: Checks for mobile device indicators in the user agent string
2. **Touch Capability**: Detects if the device supports touch events (`ontouchstart` or `maxTouchPoints`)
3. **Viewport Width**: Considers devices with width ≤ 480px as mobile
4. **DevTools Emulation**: Special handling for Chrome DevTools mobile emulation (combines touch + small screen)

## Debug Mode

For testing and development, you can force mobile detection:

### Method 1: localStorage
```javascript
localStorage.setItem('debug-mobile', 'true');
// Refresh the page or re-render the component
```

### Method 2: URL Parameter
```
https://yoursite.com?mobile=true
```

### Disable Debug Mode
```javascript
localStorage.removeItem('debug-mobile');
// Or visit URL without the mobile parameter
```

## Use Cases

- **Responsive Components**: Show different UI components based on device type
- **Touch Interactions**: Enable/disable touch-specific features
- **Performance Optimization**: Load different assets for mobile vs desktop
- **User Experience**: Adapt navigation, modals, and interactions for mobile users

## Examples

### Conditional Rendering
```tsx
import { useDeviceDetector } from 'nice-react-device-detector';

function Navigation() {
  const isMobile = useDeviceDetector();

  return (
    <nav>
      {isMobile ? (
        <MobileMenu />
      ) : (
        <DesktopMenu />
      )}
    </nav>
  );
}
```

### Conditional Styling
```tsx
import { useDeviceDetector } from 'nice-react-device-detector';
import styled from 'styled-components';

const Container = styled.div<{ isMobile: boolean }>`
  padding: ${props => props.isMobile ? '10px' : '20px'};
  font-size: ${props => props.isMobile ? '14px' : '16px'};
`;

function MyComponent() {
  const isMobile = useDeviceDetector();

  return (
    <Container isMobile={isMobile}>
      Content adapts to device type
    </Container>
  );
}
```

### Feature Toggling
```tsx
import { useDeviceDetector } from 'nice-react-device-detector';

function App() {
  const isMobile = useDeviceDetector();

  return (
    <div>
      {isMobile && <TouchGestures />}
      {!isMobile && <MouseInteractions />}
      <MainContent />
    </div>
  );
}
```

## Storybook Documentation

This hook is fully documented in our interactive Storybook with live examples and use cases.

**View the documentation:** [Nice Prototypes Storybook - useDeviceDetector](http://localhost:6006/?path=/docs/hooks-usedevicedetector--docs)

The Storybook includes:
- 📚 **Interactive Examples**: Test the hook with live device detection
- 🎮 **Debug Mode Demo**: Learn how to use localStorage and URL parameters for testing
- 🔄 **Context vs Hook Comparison**: Understand when to use each approach
- 📱 **Responsive Testing**: See detection in action with different viewport sizes
- 💡 **Real-World Patterns**: Common use cases and implementation examples
- 🎯 **Best Practices**: Performance tips and architectural guidance

### Running the Storybook Locally

```bash
# Clone the storybook repository
git clone https://github.com/niceprototypes/nice-storybook.git
cd nice-storybook

# Install dependencies
npm install

# Start Storybook
npm run storybook
```

Visit `http://localhost:6006` and navigate to **Hooks → useDeviceDetector** in the sidebar.

## Browser Support

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Requirements

- React 16.8.0 or higher (hooks support)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Nice Prototypes](https://github.com/niceprototypes)