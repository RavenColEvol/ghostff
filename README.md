# GhostFF

A monorepo for GhostFF packages - Core, CLI, and React components for Contentstack feature flags management.

## Packages

- **@ghostff/core**: Core package for fetching feature flags from Contentstack
- **@ghostff/cli**: Command line interface for managing feature flags
- **@ghostff/react**: React components and hooks for feature flags

## Module Support

All packages support both **ESM** and **CommonJS** module formats:

- **ESM**: Use `import` statements in modern environments
- **CommonJS**: Use `require()` statements in Node.js environments

The packages automatically provide the appropriate format based on your environment:
- Modern bundlers and ESM environments will use the ESM version
- Node.js and CommonJS environments will use the CommonJS version

## Development

This project uses Lerna for monorepo management.

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies for all packages
npm run install:all

# Or use lerna directly
lerna bootstrap
```

### Development Scripts

```bash
# Build all packages (both ESM and CommonJS)
npm run build

# Watch mode for all packages (parallel)
npm run dev

# Run tests for all packages
npm run test

# Lint all packages
npm run lint

# Clean all packages
npm run clean
```

### Build Output

Each package generates two build outputs:
- `dist/cjs/` - CommonJS format for Node.js environments
- `dist/esm/` - ESM format for modern bundlers and browsers

### Lerna Commands

```bash
# Check which packages have changed
npm run changed

# See differences between packages
npm run diff

# Version and publish packages
npm run version --conventional-commits --no-push --yes
npm run publish from-git
```

## CLI Usage

The GhostFF CLI helps you fetch and manage feature flags from Contentstack.

### Setup

1. Create a `.env` file with your Contentstack configuration:

```env
CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_ENVIRONMENT=production
CONTENTSTACK_REGION=us
CONTENTSTACK_CONTENT_TYPE_UID=your_content_type_uid
GHOSTFF_OUTPUT_PATH=./feature-flags.json

# OPTIONAL
CONTENTSTACK_HOST=your_host
```

### Fetch Feature Flags

```bash
# Fetch feature flags using default .env file
ghostff fetch

# Fetch feature flags using custom .env file
ghostff fetch --env ./custom.env
```

The CLI will:
1. Validate all required environment variables
2. Fetch feature flags from Contentstack
3. Write the flags to the specified output file as default values

### Output Format

The feature flags are written to a JSON file with the following structure:

```json
[
  {
    "flaguid": "feature-flag-1",
    "enabled": true,
    "defaultValue": "some-value"
  },
  {
    "flaguid": "feature-flag-2",
    "enabled": false
  }
]
```

## Core Package

The core package provides the main functionality for fetching and managing feature flags:

### ESM Usage
```typescript
import { fetchFeatureFlags, isFeatureEnabled } from '@ghostff/core';

// Fetch feature flags from Contentstack
const flags = await fetchFeatureFlags({
  apiKey: 'your_api_key',
  deliveryToken: 'your_delivery_token',
  environment: 'production',
  region: 'us',
  contentTypeUid: 'your_content_type_uid'
});

// Check if a feature is enabled
const isEnabled = isFeatureEnabled('feature-flag-uid');
```

### CommonJS Usage
```javascript
const { fetchFeatureFlags, isFeatureEnabled } = require('@ghostff/core');

// Fetch feature flags from Contentstack
const flags = await fetchFeatureFlags({
  apiKey: 'your_api_key',
  deliveryToken: 'your_delivery_token',
  environment: 'production',
  region: 'us',
  contentTypeUid: 'your_content_type_uid'
});

// Check if a feature is enabled
const isEnabled = isFeatureEnabled('feature-flag-uid');
```

## React Package

The React package provides components and hooks for using feature flags in React applications:

### ESM Usage
```typescript
import { useFeatureFlag } from '@ghostff/react';

function MyComponent() {
  const isEnabled = useFeatureFlag('feature-flag-uid');
  
  return isEnabled ? <NewFeature /> : <OldFeature />;
}
```

### CommonJS Usage
```javascript
const { FeatureEnabled } = require('@ghostff/react');

function MyComponent() {
  return (
    <FeatureEnabled uid="feature-flag-uid">
      <NewFeature />
    </FeatureEnabled>
  );
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
