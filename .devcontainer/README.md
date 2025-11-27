# Dev Container Setup

This directory contains the configuration for developing tikkun.io in a containerized environment using VS Code Dev Containers.

## What's Included

- **Node.js 22** - Matches CI environment for consistent testing
- **Git** - Version control
- **GitHub CLI** - For GitHub integration
- **VS Code Extensions** - Pre-configured with ESLint, Prettier, and TypeScript support

## Getting Started

1. **Prerequisites**:

   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop) or Docker Engine
   - Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for VS Code

2. **Open in Container**:

   - Open the project in VS Code
   - Press `F1` or `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux)
   - Select "Dev Containers: Reopen in Container"
   - Wait for the container to build and install dependencies

3. **Development**:
   - Once the container is ready, dependencies will be automatically installed
   - Run `npm run dev` to start the development server
   - The server will be available on port 5173 (dev) or 4173 (preview)
   - Ports are automatically forwarded to your host machine

## Available Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm test` - Run tests with Ava
- `npm run vitest` - Run Vitest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:browser` - Run browser tests with Vitest
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check with TypeScript
- `npm run checks` - Run both lint and typecheck

## Port Forwarding

The following ports are automatically forwarded:

- **5173** - Vite dev server
- **4173** - Vite preview server

## Customization

To customize the dev container:

1. Edit `.devcontainer/devcontainer.json`
2. Add features from the [Dev Container Features](https://containers.dev/features) catalog
3. Modify VS Code settings in the `customizations` section

## Troubleshooting

- **Container won't start**: Ensure Docker is running
- **Port conflicts**: Modify `forwardPorts` in `devcontainer.json`
- **Dependencies not installing**: Check the `postCreateCommand` in `devcontainer.json`
- **Extensions not loading**: Verify the extension IDs in the `customizations` section

