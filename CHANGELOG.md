# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-27

### Added
- Initial release of `useDeviceDetector` hook
- Multi-layered mobile device detection using:
  - User agent string analysis
  - Touch capability detection
  - Viewport width checking (480px breakpoint)
  - Chrome DevTools mobile emulation support
- Debug mode support via localStorage and URL parameters
- Window resize event handling for responsive detection
- Full TypeScript support with type definitions
- Comprehensive documentation and examples

### Features
- Zero dependencies (except React peer dependency)
- Lightweight and performant
- SSR-safe implementation
- Browser compatibility across modern browsers