# @clarion-app/frontend

## Description
Clarion App Frontend is a modular React application built with TypeScript and Vite. It serves as the unified entry point for all Clarion micro-frontends and provides shared UI components, routing, state management, and real-time event handling.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites
- Node.js v18 or higher
- npm v8 or higher

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Change into the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
This project uses custom fields in `package.json` for runtime configuration:

- `customFields.backendUrl`: Base URL for the backend API.
- `customFields.reverb`: Real-time event settings:
  - `host`: Reverb server host
  - `port`: Reverb server port
  - `protocol`: Communication protocol (http/https)
  - `appKey`: Application key for Reverb

### Updating Configuration
- Set backend URL:
  ```bash
  npm run set-backend-url http://your.api.server:8000
  ```
- Set dev server port:
  ```bash
  npm run set-port 9000
  ```
- Set Reverb config:
  ```bash
  npm run set-reverb-config <host> <port> <protocol> <appKey>
  ```

## Available Scripts
| Command                    | Description                                  |
| -------------------------- | -------------------------------------------- |
| `npm run dev`              | Start Vite dev server (default port 9000)    |
| `npm run build`            | Compile TypeScript & bundle for production   |
| `npm run preview`          | Preview production build                    |
| `npm run lint`             | Run ESLint                                 |
| `npm run set-backend-url`  | Update API backend URL in package.json       |
| `npm run set-port`         | Update dev server port in package.json       |
| `npm run set-reverb-config`| Update Reverb real-time event settings       |

## Project Structure
```
frontend/
├── public/                    # Static assets (e.g., CSS, images)
├── src/                       # Application source code
│   ├── components/            # Shared UI components
│   ├── hooks.ts               # Custom React hooks
│   ├── App.tsx                # Root component
│   ├── main.tsx               # App entrypoint
│   └── ...
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.cjs        # Tailwind CSS config
├── setBackendUrl.js           # Script to update backendUrl
├── setPort.js                 # Script to update dev port
├── setReverbConfig.js         # Script to update reverb settings
└── README.md                  # This file
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with improvements.

## License
MIT License.
