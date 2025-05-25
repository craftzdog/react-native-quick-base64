# react-native-quick-base64

A blazing fast, native Base64 implementation for React Native using C++ and JSI.

This library is ~16x faster than [base64-js](https://github.com/beatgammit/base64-js) on an iPhone 15 Pro Max simulator.
Try the benchmarks in the [example](./example) app.

| iPhone                                            | Android                                             |
| ------------------------------------------------- | --------------------------------------------------- |
| ![iPhone](./docs/iphone-15-pro-max-simulator.png) | ![Android](./docs/android-pixel-6-pro-emulator.png) |

---

## Features

- ⚡ Native C++/JSI implementation for maximum performance
- 🧠 Automatically installs its JSI bindings at runtime
- 🧩 Drop-in replacement for `base64-js` with matching API
- 🔒 No additional native setup or linking required

> ℹ️ **Heads-up**:
> Starting with recent versions of **Hermes**, `btoa` and `atob` are **natively available in the JS runtime**.
> You likely don't need to use the versions provided by this library anymore unless you're running on an older engine or want consistent behavior across platforms.
> These methods will remain in the package for compatibility but are considered **deprecated**.

---

## Installation

```bash
npm install react-native-quick-base64
```

---

This module installs its native bindings automatically.
Simply importing the library is enough to activate the native backend.
Add it to your root entry point file or your first \_layout.tsx.

```js
import 'react-native-quick-base64' // triggers native JSI install to global namespace
```

You can also import individual helpers:

```tsx
import { fromByteArray, toByteArray } from 'react-native-quick-base64'
```

### Usage

```tsx
import { btoa, atob } from 'react-native-quick-base64'

const base64 = btoa('foo')
const decoded = atob(base64)
```

---

## API

Compatible with [base64-js](https://github.com/beatgammit/base64-js).

### `byteLength(b64: string): number`

Returns the length of the byte array that corresponds to the base64 string.

### `toByteArray(b64: string, removeLinebreaks: boolean = false): Uint8Array`

Converts a base64 string into a Uint8Array.
If `removeLinebreaks` is `true`, all `\n` characters are removed first.

### `fromByteArray(uint8: Uint8Array, urlSafe: boolean = false): string`

Converts a byte array into a base64 string.
If `urlSafe` is `true`, the output uses a URL-safe base64 charset.

### `btoa(data: string): string` ⚠️ Deprecated

Encodes a string into base64 format.

> **Avoid using this unless you're on an older JS engine.**
> Use `fromByteArray(new TextEncoder().encode(...))` instead for better encoding control.

### `atob(b64: string): string` ⚠️ Deprecated

Decodes a base64 string into a UTF-8 string.

> **Avoid using this unless you're on an older JS engine.**
> Use `TextDecoder + toByteArray()` for more robust decoding.

### `shim()`

Adds global `btoa` and `atob` functions

```ts
import { shim } from 'react-native-quick-base64'

shim()

btoa('foo') // available globally
```

### `trimBase64Padding(str: string): string`

Removes trailing `=` or `.` padding from base64 or base64url-encoded strings.

---

## Contributing

See the [contributing guide](https://github.com/craftzdog/react-native-quick-base64/blob/main/CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

---

## License

MIT © [Takuya Matsuyama](https://github.com/craftzdog)
