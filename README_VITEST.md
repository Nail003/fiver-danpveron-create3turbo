# Vitest Testing Guidlines

Contains information about how to setup vitest testing and common known issues and there solutions.

## Running Test

Run the following turbo command from root directory to run all tests in parallel from all workspaces:

```
    turbo test
```

These tests will be cached. For non-cache tests run:

```
    turbo test:watch
```

To run tests of a particullar workspace cd into that workspace and run the following command:

```
    pnpm run test
```

For watch mode run,

```
    pnpm run test:watch
```

## Installation

### For Backend Workspace

cd into the workspace where you want to set up vitest and run the following command:

```bash
  pnpm add -D vitest @vitest/coverage-c8 @types/node ts-node typescript vite-tsconfig-paths
```

In package.json of that particular work space add the following scripts to run tests:

```
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch"
  },
```

Add vitest.config.js at the root of that workspace (where package.json is located). Config should contain following code:

```
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enables global test APIs like `describe` and `it`
    environment: "node", // Use 'jsdom' for frontend projects
    coverage: {
      reporter: ["text", "json", "html"], // Optional: Generates coverage reports
    },
  },
  plugins: [tsconfigPaths()], // Automatically adds current workspace tsconfig settings to vitest-config
});
```

Check the Running Tests section for how to run the tests.

### For Frontend Workspace

cd into the workspace where you want to set up vitest and run the following command:

```bash
  pnpm add -D vitest @vitest/coverage-c8 @types/node ts-node typescript vite-tsconfig-paths
  pnpm add -D @testing-library/react @testing-library/dom @types/react @types/react-dom @testing-library/user-event @testing-library/jest-dom
```

In package.json of that particular work space add the following scripts to run tests:

```
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch"
  },
```

Add vitest.config.js at the root of that workspace (where package.json is located). Config should contain following code:

```
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Enables global test APIs like `describe` and `it`
    environment: "jsdom", // Use 'node' for backend projects
    coverage: {
      reporter: ["text", "json", "html"], // Optional: Generates coverage reports
    },
  },
  plugins: [tsconfigPaths()], // Automatically adds current workspace tsconfig settings to vitest-config
});
```

Check the Running Tests section for how to run the tests.

### Full Stack Workspace

For full stack workspace use the frontend workspace setup.

## Common Known Issues

#### Getting dom related error while testing react component

Always import react and jest-dom at the top of test files whenever testing react component.

```
    import React from "react";
    import "@testing-library/jest-dom";
```

#### Cannot find React error

Import react at to top of test file and the component your are testing.
For example,

ReactComponent.tsx

```
    import React from "react"; // add react import at top of component file
```

ReactComponent.test.tsx

```
    import React from "react"; // add react import at top of test file
```

#### Getting Error when trying to import something from another workspace.

This is a path resolving error. In this case you have to explicilty define the path of that component in exports of package.json of the workspace from where you are importing.
For example,
You are trying to import Button from ui workspace and the import looks like this.

```
    import {Button} from "@packageName/button"
```

In that ui workspace package.json define the export path for your button.

package.json

```
    name: "@packageName"
    exports: {
        "./button": {
            default: "./src/components/button.tsx"
        }
    }
```

#### Cannot import next/server did you mean next/server.js error

This is a NextJs specific error caused by Next-Auth.
In this case you have to mock any external dependencies that are using Next-Auth during testing.
