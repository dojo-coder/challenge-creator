# AI Code Challenge Curator - Agent Guidelines

This file provides comprehensive context for AI code challenge curators on how to create, structure, and manage coding challenges in this system.
You will work based on Workflow Summary provided at the final of this file

## Session start (mandatory first step)

**Before doing any other operation**, at the start of the chat/session:

1. **Call `get_templates`**: Use the MCP command `get_templates` with `{}` to fetch all live templates. The response returns only the fields needed for configuration: `_id`, `key`, and `language` for each template.
2. **Build templates config**: From the response array, build a JSON object where:
   - **Key**: each template's `key` (e.g. `nodejs-jest`, `python`, `reactjs-jest`)
   - **Value**: `{ "_id": "<template._id>", "selectedLanguage": "<template.language>" }`
3. **Save to `templatesConfiguration.json`**:
   - If `templatesConfiguration.json` does not exist, create it and write the built object.
   - If it already exists, replace its entire content with the built object.

Use the resulting `templatesConfiguration.json` as the source of truth for template `_id` and `selectedLanguage` in all subsequent operations (creating challenges, adding variations, etc.). Do not rely on hardcoded IDs in this document; always use values from `templatesConfiguration.json` (or from the file you just wrote at session start).

## Challenge Creation Process

### Template Types

The system supports two main categories of challenges:

#### Terminal Challenges

- **nodejs-jest**: Node.js with Jest testing framework
- **nodets-jest**: NodeTS with Jest testing framework
- **python**: Python with pytest testing framework
- **php**: Php with PHPUnit testing framework
- **java**: Java with jupiter testing framework
- **ruby**: Ruby with rspec testing framework
- **rust**: Rust with test
- **c**: C with Criterion testing framework
- **cpp**: C++ with Catch2 testing framework
- **csharp**: C# with xUnit testing framework
- **solidity**: Solidity with mocha testing

Note: The Node templates (`nodejs-jest`, `nodets-jest`) support running an HTTP server (for example using Node's built-in `http` or `express`). This enables two optional interactive behaviors that a challenge variation may expose:

- **Live Preview**: Runs the challenge as a web app and exposes a browser preview. Useful for UI or interactive endpoint demos.
- **API Tester**: Starts a backend HTTP server so automated API tests (or a manual API tester) can call challenge endpoints.

A variation may enable only Live Preview, only the API Tester, or both. When authoring such variations.

- **When creating the challenge variation**, ensure the following `runtimeOptions` are set in the backend:
  - `runtimeOptions.browserPreviewVisibility`: Set to `true` if Live Preview should be enabled
  - `runtimeOptions.enableApiTester`: Set to `true` if API Tester should be enabled

Note: A reference sample demonstrating both Live Preview and API Tester is included at `samples/nodejs_jest_with_preview_and_apiTester-example-challenge`. Use it as a template when creating `nodejs-jest` or `nodets-jest` variations that expose a web server.

#### Browser Challenges

- **vuejs-jest**: Vue.js with Jest testing framework using @testing-library/vue
- **vuets-jest**: Vue.js TypeScript with Jest testing framework using @testing-library/vue
- **reactjs-jest**: React.js with Jest testing framework using @testing-library/react
- **reactts-jest**: React.js TypeScript with Jest testing framework using @testing-library/react
- **svelte-jest**: Svelte with Jest testing framework using @testing-library/svelte
- **vanillajs-jest**: Vanilla JavaScript with Jest testing framework using @testing-library/dom
- **vanillats-jest**: Vanilla TypeScript with Jest testing framework using @testing-library/dom
- **angular-jest**: Angular with Jest testing framework using @testing-library/angular

### Challenge Structure

All challenges follow this standardized structure:

```
challenges/[challenge-name]/
└── templates/
    ├── [template-name]/
    │   ├── details.json                # Challenge description and examples
    │   ├── README.md                   # Challenge description (for zip export)
    │   ├── metadata.json               # Variation metadata (variationId, mainFilePath, activeFilePath)
    │   ├── package.json                # Node.js dependencies (browser challenges only)
    │   ├── preloadedFiles/             # Starter code for students
    │   │   └── preloaded files required to solve this challenge
    │   ├── preloadedFiles.json         # Config: file visibility, readonly, redacted, activeFilePath
    │   ├── solutionFiles/              # Complete solution implementation
    │   │   └── author solution files, similar with preloaded but fully implemented
    │   ├── solutionFiles.json          # Config: file visibility, readonly, redacted
    │   ├── initialTests/               # Basic test cases (5-7 tests)
    │   │   └── test files used to test the challenge, can work with multiple files
    │   ├── initialTests.json           # Config: file visibility, readonly, redacted
    │   ├── allTests/                   # Comprehensive test cases (8-12 tests)
    │   │   └── test files used to test the challenge, can work with multiple files, same tests from initialTests + more edge cases
    │   ├── allTests.json               # Config: file visibility, readonly, redacted
    │   └── exportedContent.zip         # Generated zip file for backend import
    └── [other-template-name]/
        └── [same structure as above]
```

### Configuration Files Format

Each directory has a corresponding JSON configuration file:

**preloadedFiles.json** (includes activeFilePath):

```json
{
  "folders": {},
  "files": {
    "/app.py": { "visible": true, "readonly": false, "redacted": false },
    "/main.py": { "visible": true, "readonly": false, "redacted": false }
  },
  "activeFilePath": "/app.py"
}
```

**solutionFiles.json / initialTests.json / allTests.json**:

```json
{
  "folders": {},
  "files": {
    "/app.py": { "visible": true, "readonly": false, "redacted": false },
    "/main.py": { "visible": true, "readonly": false, "redacted": false }
  }
}
```

**metadata.json**:

```json
{
  "variationId": "placeholder-variation-id",
  "mainFilePath": "/main.py",
  "activeFilePath": "/app.py"
}
```

- **variationId**: Placeholder ID (replaced during upload) or actual variation ID from server
- **mainFilePath**: Path to entry point file for "Run" button (terminal challenges only, omit for browser)
- **activeFilePath**: Path to file that opens first in the editor

## Challenge Creation Rules

### 1. Template-Specific Generation

- When instructed to "generate a terminal/browser challenge in [templateName]", create files **only** in `/challenges/[challenge-name]/templates/[templateName]`
- Each template is independent and self-contained
- Do not create files in other templates unless explicitly requested
- When instructed to "generate translation for [challenge-name] in [templateName]", you will proceed to generate it inside the `/challenges/[challenge-name]/templates/[templateName]`

### 2. All Translations Generation

- Only when explicitly instructed to "generate for all translations" should you create files for all available templates
- Currently supports terminal templates: nodejs-jest, nodets-jest, python, php, java, ruby, rust, c, cpp, csharp, solidity
- Currently supports browser templates: vuejs-jest, vuets-jest, reactjs-jest, reactts-jest, svelte-jest, vanillajs-jest, vanillats-jest, angular-jest

### 3. Export Content Generation

- **After generating challenge files**, always run the `createExportContent.js` script to create the `exportedContent.zip` file
- This ensures the challenge is properly packaged for distribution and matches the frontend's ZIP format

### 4. README.md Requirement

- **Every template folder must contain a `README.md` file** (`challenges/[challenge-name]/templates/[template-name]/README.md`)
- The `README.md` content **must match the `description` field from `details.json`** (same markdown text)
- The `README.md` must **not be empty** — it is required by the `createExportContent.js` script and is included in the exported zip
- **Always create or verify `README.md` exists before running `createExportContent.js`** or any update/upload workflow

### 5. Browser Challenge Package Setup

When creating browser challenges (vuejs-jest, vuets-jest, reactjs-jest, reactts-jest, svelte-jest, vanillajs-jest, vanillats-jest, or angular-jest):

1. **Create challenge directory structure**: `challenges/[challenge-name]/templates/[templateName]/`
2. **Copy package.json from sample directory inside new directory**: Copy package.json from the corresponding sample challenge:
   - **Vue.js**: Copy from `samples/vuejs-example-challenge/package.json`
   - **Vue.js TypeScript**: Copy from `samples/vuets-example-challenge/package.json`
   - **React.js**: Copy from `samples/reactjs-example-challenge/package.json`
   - **React.js TypeScript**: Copy from `samples/reactts-example-challenge/package.json`
   - **Svelte**: Copy from `samples/svelte-example-challenge/package.json`
   - **VanillaJS**: Copy from `samples/vanilla-js-example-challenge/package.json`
   - **VanillaTS**: Copy from `samples/vanilla-ts-example-challenge/package.json`
   - **Angular**: Copy from `samples/angular-example-challenge/package.json`

_Note: Package files are pre-configured in samples with only core framework packages. Testing dependencies (@testing-library, jest, etc.) are already included in the Docker images._

### 6. Challenge Naming Convention

- Use kebab-case for challenge names: `valid-parentheses-challenge`, `two-sum-challenge`
- Challenge names should be descriptive and indicate the problem type

## File Requirements

### details.json

Contains challenge translation metadata and description. Based on translation this description can differ but should also required same for all translations.

**Critical Requirement:** Challenge descriptions must include **ALL information necessary for implementation** without requiring users to look at test files. **Users do NOT have access to test files**, so the description must be completely self-contained and comprehensive.

**Important:** Challenge descriptions must be **concise and under 5000 characters** to ensure readability and maintainability. Focus on essential information:

- Clear problem statement
- **Complete function/method signatures with all parameters, return types, and expected behavior** (only required if specific functions/methods are tested in the challenge)
- **All edge cases and error handling requirements (what errors to throw, when to throw them, error messages)**
- **Input/output format specifications (data types, constraints, validation rules)**
- **Complete examples with inputs and expected outputs for all scenarios**
- Core requirements and features
- Algorithm explanation (if applicable)
- Key implementation details
- Test selectors (for browser challenges)
- Sample test cases with expected behavior
- Learning outcomes

**What MUST be included:**

- Exact function/method signatures (parameter names, types, return types) - **only if specific functions/methods are tested**
- All edge cases and how they should be handled
- Error messages that must be thrown (exact text)
- Input validation rules and constraints
- Output format specifications
- Multiple examples covering different scenarios
- Any special requirements or constraints

**What to avoid:**

- Vague descriptions that require reading tests to understand requirements
- Missing error handling specifications
- Incomplete examples
- Assumptions that users can infer behavior from test files

Avoid lengthy implementation details or extensive code examples that can be found in the code files themselves, but ensure all functional requirements are explicitly stated.

**Format Guidelines:**

- **Do NOT include titles or headers** (e.g., "# Title", "## Problem Description") in the description field
- The `title` field already provides the challenge name
- Start the `description` directly with the challenge content as a paragraph
- The description should immediately explain what the challenge is about

**Example:**

```json
{
  "title": "Pacman Game",
  "description": "Build a simplified Pacman game where the player navigates a maze, collects dots, and tries to achieve the highest score! This challenge will help you practice Vue.js concepts..."
}
```

**Incorrect (Don't do this):**

```json
{
  "title": "Pacman Game",
  "description": "# Pacman Game: Build a Classic Arcade Game\n\n## Problem Description\n\nBuild a simplified Pacman game..."
}
```

### Preloaded Files

- Provide starter code with empty function implementations
- Include proper function signatures and return statements
- Use appropriate naming conventions for each language
- Don't add comments or hints inside preloaded files

### Main Files (Terminal Challenges Only)

**Important**: All terminal challenges (nodejs-jest, python, php, java, ruby, rust, c, cpp, csharp, solidity) **must include a main file** in both `preloadedFiles/` and `solutionFiles/` directories. The main file enables users to run and debug their code directly using the Run button without executing the full test suite.

**Purpose**: The main file serves as an entry point that imports/calls functions from the solution file and outputs results to the console, allowing users to:

- Quickly debug without running tests
- Test functions with custom inputs
- See intermediate outputs via print/console.log statements

**Main File Requirements**:

- **Must be included in both `preloadedFiles/` and `solutionFiles/`** (same content in both)
- Should import/require the solution file and call the main function(s) with example inputs
- Should print/output the results using appropriate language-specific output methods
- Use descriptive output messages to show what is being tested

**Main File Naming by Template**:

- **nodejs-jest**: `main.js`
- **nodets-jest**: `main.ts`,
- **python**: `main.py`
- **php**: `main.php`
- **java**: `Main.java` (in `challenge` package)
- **ruby**: `main.rb`
- **rust**: `main.rs`
- **c**: `main.c`
- **cpp**: `main.cpp`
- **csharp**: `Main.cs` (in `Challenge` namespace)
- **solidity**: `main.js`

**Main File Examples**:

**Node.js (main.js)**:

```javascript
const { functionName } = require("./index");

const result = functionName("example input");
console.log('functionName("example input"):', result);
```

**Python (main.py)**:

```python
from app import function_name

result = function_name('example input')
print('function_name("example input"):', result)
```

**PHP (main.php)**:

```php
<?php
require_once 'app.php';

$result = functionName('example input');
echo 'functionName("example input"): ' . $result . "\n";
```

**Java (Main.java)**:

```java
package challenge;

public class Main {
    public static void main(String[] args) {
        String result = App.functionName("example input");
        System.out.println("functionName(\"example input\"): " + result);
    }
}
```

**Ruby (main.rb)**:

```ruby
require_relative 'app'

result = function_name('example input')
puts "function_name('example input'): #{result}"
```

**Rust (main.rs)**:

```rust
mod app;
use app::function_name;

fn main() {
    let result = function_name("example input");
    println!("function_name(\"example input\"): {}", result);
}
```

**C (main.c or run.c)**:

```c
#include <stdio.h>
#include <stdlib.h>
#include "main.h"

int main() {
    char* result = longestPalindromicSubstring("example input");
    printf("longestPalindromicSubstring(\"example input\"): %s\n", result);
    free(result);
    return 0;
}
```

**Note**: If `main.c` is already used as the solution file name (as in some legacy challenges), use `run.c` as the entry point file name instead.

**C++ (main.cpp)**:

```cpp
#include <iostream>
#include "app.hpp"

int main() {
    std::string result = longestPalindromicSubstring("example input");
    std::cout << "longestPalindromicSubstring(\"example input\"): " << result << std::endl;
    return 0;
}
```

**C# (Main.cs)**:

```csharp
namespace Challenge
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string result = HelloWorld.Hello();
            Console.WriteLine(result);
        }
    }
}
```

**Note**: Browser challenges (vuejs-jest, vuets-jest, reactjs-jest, reactts-jest, svelte-jest, vanillajs-jest, vanillats-jest, angular-jest) do **not** require main files as they use browser preview instead of code execution.

### Solution Files (solutionFiles/)

- Complete, working solution implementations
- Should pass all test cases
- Use efficient algorithms and best practices

### Test Files

- **Initial Tests**: basic test cases covering core functionality (5-7 tests)
- **All Tests**: basic tests from initial tests + comprehensive test cases including edge cases (8-12 tests total)

#### Initial Tests vs All Tests Relationship

**Initial Tests** should include:

- Basic functionality tests (happy path scenarios)
- Simple edge cases (empty input, single element)
- Core algorithm validation
- Essential user interactions (for browser challenges)

**All Tests** should include:

- **All tests from Initial Tests** (copy the same test cases)
- Additional edge cases and boundary conditions
- Complex scenarios and stress tests
- Advanced user interactions (for browser challenges)
- Error handling and validation tests

**Example progression**:

- Initial Tests: 5 tests covering basic functionality
- All Tests: Same 5 tests + 3-7 additional edge case tests = 8-12 total tests

- Use appropriate testing frameworks (Jest for Node.js, VueJS, ReactJS, pytest for Python, PHPUnit for php, Jupiter for Java, rspec for Ruby, test for Rust, Criterion for C, Catch2 for C++, xUnit for C#)
- Include descriptive test names and clear assertions

#### Test Structure by Template

**Node.js/Jest (Terminal)**:

- Use `const { describe, it, expect } = require("@jest/globals");`
- Import functions from `"./index"` (not from solutionFiles)
- Structure: `describe("Challenge Name", () => { it("test description", () => { ... }); });`
- Use descriptive test names: `"returns 'expected' for input='value'"`

**NodeTS/Jest (Terminal)**:

- Use `import { describe, expect, it } from '@jest/globals';`
- Import functions from `"./index"` (not from solutionFiles)
- Structure: `describe("Challenge Name", () => { it("test description", () => { ... }); });`
- Use descriptive test names: `"returns 'expected' for input='value'"`

**Python/pytest (Terminal)**:

- Use `from pytest import mark as m`
- Import from `challenge.app` module
- Structure: `@m.describe("Challenge Name")` class with `@m.it("test description")` methods
- Use descriptive test names: `"Should return 'expected' for input='value'"`

**Java/Jupiter (Terminal)**:

- Use `@DisplayName` annotations for class and methods
- Import static assertions: `import static org.junit.jupiter.api.Assertions.*;`
- Structure: `@DisplayName("Challenge Name")` class with `@Test @DisplayName("test description")` methods
- Use descriptive test names: `"Returns 'expected' for input='value'"`

**PHP/PHPUnit (Terminal)**:

- Use `use PHPUnit\Framework\TestCase;`
- Include author file: `require_once __DIR__ . '/App.php';`
- Structure: `@testdox` annotations for class and methods
- Use descriptive test names: `"Returns 'expected' for input='value'"`

**Ruby/RSpec (Terminal)**:

- Use `require 'rspec'` and `require_relative '../solutionFiles/App'`
- Structure: `describe "Challenge Name"` with `it "test description"` blocks
- Use descriptive test names: `"returns 'expected' for input='value'"`

**Vue.js/Jest (Browser)**:

- Use `import { render, screen, fireEvent } from "@testing-library/vue";`
- Import component from `"./ComponentName.vue"` (not from solutionFiles)
- Structure: `describe("ComponentName", () => { it("test description", () => { ... }); });`
- Use descriptive test names: `"displays the first image"`, `"has the previous button initially disabled"`

**Vue.js TypeScript/Jest (Browser)**:

- Use `import { render, fireEvent } from "@testing-library/vue";` and `import { screen } from "@testing-library/dom";`
- Use `import { describe, expect, it } from "@jest/globals";`
- Import component from `"./ComponentName.vue"` (not from solutionFiles)
- Structure: `describe("ComponentName", () => { it("test description", async () => { ... }); });`
- Use descriptive test names: `"displays the first image"`, `"has the previous button initially disabled"`
- Use `async` for test functions that involve user interactions with `await fireEvent.click()`

**React.js/Jest (Browser)**:

- Use `import { render, screen, fireEvent } from "@testing-library/react";`
- Import component from `"./ComponentName.jsx"` (not from solutionFiles)
- Structure: `describe("ComponentName", () => { it("test description", () => { ... }); });`
- Use descriptive test names: `"displays the first image"`, `"has the previous button initially disabled"`

**React.js TypeScript/Jest (Browser)**:

- Use `import { render, screen, fireEvent } from "@testing-library/react";` and `import '@testing-library/jest-dom/jest-globals';`
- Use `import { describe, expect, it, beforeEach } from '@jest/globals';`
- Import component from `"./ComponentName"` (not from solutionFiles, TypeScript files use .tsx extension)
- Structure: `describe("ComponentName", () => { it("test description", () => { ... }); });`
- Use descriptive test names: `"displays the first image"`, `"has the previous button initially disabled"`

**Svelte/Jest (Browser)**:

- Use `import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";`
- Import component from `"./ComponentName.svelte"` (not from solutionFiles)
- Structure: `describe("ComponentName", () => { it("test description", () => { ... }); });`
- Use descriptive test names: `"displays the first image"`, `"has the previous button initially disabled"`
- **Timer Testing**: For components using timers/intervals, use Jest fake timers:

  ```javascript
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    cleanup();
  });

  async function advance(ms) {
    jest.advanceTimersByTime(ms);
    // allow pending microtasks to flush after advancing timers
    await Promise.resolve();
  }
  ```

- Use `await advance(time)` to advance timers in tests

**VanillaJS/Jest (Browser)**:

- Use `import { render, screen, fireEvent, cleanup } from "@testing-library/dom";`
- Import component from `"./ComponentName.js"` (not from solutionFiles)
- Structure: `describe("ComponentName", () => { it("test description", () => { ... }); });`
- Use descriptive test names: `"displays the first image"`, `"has the previous button initially disabled"`
- Use `cleanup()` in `afterEach` to clean up DOM

**VanillaTS/Jest (Browser)**:

- Use `import { render, screen, fireEvent, cleanup } from "@testing-library/dom";`
- Import component from `"./ComponentName.ts"` (not from solutionFiles)
- Structure: `describe("ComponentName", () => { it("test description", () => { ... }); });`
- Use descriptive test names: `"displays the first image"`, `"has the previous button initially disabled"`
- Use `cleanup()` in `afterEach` to clean up DOM

**Angular/Jest (Browser)**:

- Use `import { render, screen, fireEvent } from "@testing-library/angular";`
- Import component from `"./ComponentName.component.ts"` (not from solutionFiles)
- Structure: `describe("ComponentName", () => { it("test description", () => { ... }); });`
- Use descriptive test names: `"displays the first image"`, `"has the previous button initially disabled"`
- Use Angular-specific testing utilities when needed

**Rust (Terminal)**:

- Use `#[cfg(test)]` module with `use crate::app::function_name as alias;`
- Structure: `#[test] fn test_name() { ... }` with doc comments `/// Description`
- Use descriptive test names: `"babad_returns_bab_or_aba"`, `"empty_string_returns_empty"`
- Import functions with aliases: `use crate::app::longest_palindromic_substring as lps;`

**C (Terminal)**:

- Use `#include <criterion/criterion.h>` and `#include "main.h"`
- Structure: `Test(functionName, test_description) { ... }`
- Use descriptive test names: `"returns_bab_or_aba_for_babad"`, `"returns_empty_for_empty_input"`
- Always free allocated memory: `free(res);`
- Use Criterion assertions: `cr_assert_str_eq()`, `cr_assert()`

**C++ (Terminal)**:

- Use `#include <catch2/catch_test_macros.hpp>` and `#include "app.hpp"`
- Structure: `TEST_CASE("description") { ... }`
- Use descriptive test names: `"babad -> 'bab' or 'aba'"`, `"empty -> ''"`
- Use Catch2 assertions: `REQUIRE()`, `REQUIRE_THAT()`

**C#/xUnit (Terminal)**:

- Use `using Xunit;`
- Structure: `public class TestClassName { [Fact(DisplayName = "test description")] public void TestMethodName() { ... } }`
- Use `namespace Challenge` for all test classes
- Use descriptive `DisplayName` attributes: `"It should return 'Hello World!'"`, `"Returns empty for null input"`
- Use xUnit assertions: `Assert.Equal()`, `Assert.True()`, `Assert.Throws<>()`

#### Test File Imports

**Important**: During test execution, author solution files are copied to the test root directory. Therefore, test files should import components/modules from the current directory, **not** from `../solutionFiles/`:

**Correct Import**:

```javascript
// Node.js/Jest
const { functionName } = require("./index");

// NodeTS/Jest
import { functionName } from "./index";

// Python/pytest
from challenge.app import function_name

// Java/Jupiter
// No imports needed - methods are called directly on App class

// PHP/PHPUnit
require_once __DIR__ . '/App.php';

// Ruby/RSpec
require_relative './App'

// Vue.js/Jest
import ComponentName from "./ComponentName.vue";

// Vue.js TypeScript/Jest
import ComponentName from "./ComponentName.vue";

// React.js/Jest
import ComponentName from "./ComponentName.jsx";

// React.js TypeScript/Jest
import ComponentName from "./ComponentName";

// Svelte/Jest
import ComponentName from "./ComponentName.svelte";

// VanillaJS/Jest
import ComponentName from "./ComponentName.js";

// VanillaTS/Jest
import ComponentName from "./ComponentName.ts";

// Angular/Jest
import ComponentName from "./ComponentName.component.ts";

// Rust
use crate::app::function_name as alias;

// C
#include "main.h"

// C++
#include "app.hpp"

// C#
using Xunit; // test framework
// Classes in same namespace are auto-resolved (namespace Challenge)
```

**Incorrect Import**:

```javascript
// ❌ Wrong - Don't import from solutionFiles
import ComponentName from "../solutionFiles/ComponentName.vue";
import ComponentName from "../solutionFiles/ComponentName.jsx";
import ComponentName from "../solutionFiles/ComponentName.tsx";
import ComponentName from "../solutionFiles/ComponentName.svelte";
import ComponentName from "../solutionFiles/ComponentName.js";
import ComponentName from "../solutionFiles/ComponentName.ts";
import ComponentName from "../solutionFiles/ComponentName.component.ts";
const { functionName } = require("../solutionFiles/index");
use crate::solutionFiles::app::function_name; // ❌ Wrong for Rust
import { functionName } from "../solutionFiles/index"; // ❌ Wrong for NodeTS
#include "../solutionFiles/main.h" // ❌ Wrong for C
#include "../solutionFiles/app.hpp" // ❌ Wrong for C++
using Challenge.solutionFiles; // ❌ Wrong for C#
```

This applies to all test files in both `initialTests/` and `allTests/` directories across all templates.

### Browser Challenge Styling

When generating browser challenges (Vue.js, Vue.js TypeScript, React.js, React.js TypeScript, Svelte, VanillaJS, VanillaTS, Angular), always ensure the UI is elegant and modern:

- **Visual Design**: Create custom CSS with cohesive color schemes and professional aesthetics
- **Typography**: Use appropriate Google Fonts or system fonts for visual appeal
- **Color Palette**: Choose themed color palettes that match the challenge context (e.g., Dracula theme, modern gradients, professional corporate)
- **Animations**: Include smooth transitions, hover effects, and interactive feedback animations
- **Responsiveness**: Ensure mobile-friendly designs with proper breakpoints
- **User Experience**: Add visual feedback for user interactions (hover states, active states, success/error states)
- **Layout**: Use modern CSS techniques (Flexbox, Grid) for clean, organized layouts
- **Shadows & Depth**: Apply appropriate shadows, borders, and depth effects for visual hierarchy
- **Icons & Decorations**: Include relevant decorative elements when appropriate (emojis, symbols, patterns)

**Note**: Avoid generic or plain styling. Each browser challenge should be visually engaging and demonstrate modern web design principles.

### Vue.js Component Structure

**Always use `<script setup>` syntax for Vue.js challenges (applies to both vuejs-jest and vuets-jest):**

- Use `<script setup>` instead of Options API (`export default {}`)
- Import Vue composition functions: `import { ref, computed, nextTick } from 'vue'`
- Use `ref()` for reactive state instead of `data()`
- Use `computed()` for computed properties
- Use `defineProps()` for component props
- Define functions directly as `const functionName = () => {}`
- Use template refs with `const refName = ref(null)` and bind with `ref="refName"` in template
- Access ref values with `.value` (e.g., `count.value++`)
- Access props with `props.propName`

**Example**:

```vue
<script setup>
import { ref, computed, nextTick } from "vue";

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});

const count = ref(0);
const containerRef = ref(null);

const doubleCount = computed(() => count.value * 2);

const increment = () => {
  count.value++;
  nextTick(() => {
    // DOM updated
  });
};
</script>
```

## Testing Infrastructure

### Test Execution

- Tests run in isolated Docker containers
- Results captured as `.log` files with summary output
- Browser tests (Vue.js, Vue.js TypeScript, React.js, React.js TypeScript, Svelte, VanillaJS, VanillaTS, Angular) use Jest with @testing-library

**Note**: Terminal challenges (nodejs-jest, nodets-jest, python, php, Java, Ruby, Rust, C, C++, C#, solidity) do not require package.json files.

## Challenge Types and Examples

### Algorithm Challenges

- **Two Sum**: Find two numbers that add up to target
- **Valid Parentheses**: Check if brackets are properly matched
- **Reverse String**: Reverse a given string
- **Longest Palindromic Substring**: Find longest palindrome in string

### Data Structure Challenges

- **Binary Tree Traversal**: Implement tree traversal algorithms
- **Linked List Operations**: Manipulate linked list structures
- **Stack/Queue Operations**: Implement stack and queue functionality

### Problem-Solving Challenges

- **Array Manipulation**: Sort, search, or transform arrays
- **String Processing**: Parse, validate, or transform strings
- **Mathematical Problems**: Implement mathematical algorithms

## Best Practices

### Challenge Design

- Start with simple, clear problem statements
- Provide multiple examples with expected outputs
- Include edge cases in test suites
- Ensure challenges are byte-sized (solvable in 15-30 minutes)
- **For browser challenges**: Create thematic, visually appealing designs that enhance the learning experience
- **For TypeScript challenges**: Use proper TypeScript types and interfaces, ensure type safety in all implementations

### Code Quality

- Use consistent naming conventions
- Write clean, readable solutions
- Follow language-specific best practices
- **For browser challenges**: Write organized, maintainable CSS with proper structure and comments

### Documentation

- Write clear, concise problem descriptions
- **CRITICAL: Include ALL implementation requirements in the description** - users cannot see test files, so every detail needed for implementation must be explicitly stated in the description
- Provide helpful examples and clarifications with complete input/output pairs
- Specify exact error messages, edge cases, and validation rules
- Use consistent formatting across all files
- Include proper file structure documentation

## Export Content Generation

### createExportContent.js Script

After generating challenge files, use the `createExportContent.js` script to create the `exportedContent.zip` file and folder structure:

```bash
node createExportContent.js challenges/[challenge-name]/templates/[template-name]
```

**What the script does:**

- ✅ Reads `details.json` for challenge description
- 📁 Processes `preloadedFiles`, `solutionFiles`, `initialTests`, `allTests` directories
- 📦 Creates `exportedContent.zip` file matching frontend's `createChallengeZipFile` format
- 📄 Generates JSON configuration files for each directory
- 📋 Copies individual files to `exportedContent` subdirectories

**Example usage:**

```bash
# After generating a Vue.js challenge
node createExportContent.js challenges/two-sum-challenge/templates/vuejs-jest

# After generating a Python challenge
node createExportContent.js challenges/two-sum-challenge/templates/python
```

## Workflow Summary

0. **Session start (first)**: Call `get_templates` with `{}`, build the keyed config (template key → `{ _id, selectedLanguage }`), and save it to `templatesConfiguration.json` (create or overwrite). Use `templatesConfiguration.json` for all template IDs thereafter.
1. **Create Challenge Structure**: Set up directories and basic files following the structure of template from samples folder.
2. **Write Problem Description**: Create detailed challenge description following the structure of template from samples folder.
3. **Implement Solutions**: Write complete author solutions following the structure of template from samples folder.
4. **Create Test Suites**: Develop initial and comprehensive test cases following the structure of template from samples folder.
5. **Generate ExportedContent**: Run `createExportContent.js` script to package challenge for distribution

This system enables rapid creation of high-quality coding challenges with comprehensive testing and easy distribution capabilities.

# MCP Commands to use when finishing generating variations

## Templates configuration

Template `_id` and `selectedLanguage` for each template are stored in **`templatesConfiguration.json`** at the project root. That file is created or updated at **session start** when you call `get_templates` (see "Session start (mandatory first step)" above).

- **Read template IDs from `templatesConfiguration.json`**: For any operation that needs a template's `_id` or `selectedLanguage` (e.g. creating a challenge, adding a variation), read the value from `templatesConfiguration.json` using the template key (e.g. `nodejs-jest`, `python`, `reactjs-jest`). Do not use hardcoded IDs from this document.
- **Format**: Each key in `templatesConfiguration.json` is a template key; each value is `{ "_id": "<template id>", "selectedLanguage": "<language id>" }`.

## Challenge Creation Workflow with MCP Commands

When instructed to create an existing generated challenge, follow this workflow:

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Challenge Already Created**: Check if `challengeCreate.json` file exists in the challenge folder:
   - **If the file exists**: Return a message "Challenge already created" and stop the workflow
   - **If the file does not exist**: Continue to step 3

3. **Extract Challenge Slug**: Get the slug from the challenge folder name (the challenge name itself, e.g., `two-sum-challenge`)

4. **Check Slug Uniqueness**: Call the MCP command `check_slug_uniqueness` with:
   - `slug`: The challenge name/slug

5. **Handle Uniqueness Response**:
   - **If `isUnique` is `true`**: Continue to step 6
   - **If `isUnique` is `false`**: Generate a new slug (append a number or modify the name) and repeat step 4 (call `check_slug_uniqueness` again)

6. **Get Available Tags**: Call the MCP command `get_all_tags` to retrieve all available tags. This returns an array of tag objects:

   ```typescript
   interface Tag {
     _id: string;
     name: string;
   }
   ```

7. **Select Challenge Metadata**: Based on the challenge content and theme:
   - **Tags**: Select 3-5 tags from the available tags that best match the challenge theme (e.g., "algorithms", "strings", "arrays", "math", etc.)
   - **Estimate**: Determine how many minutes it would take for a person to solve the challenge (e.g., 10, 30, 60, 120 minutes)
   - **Default Difficulty**: Assign a difficulty level:
     - `1` = Beginner (simple concepts, straightforward implementation)
     - `2` = Intermediate (requires some problem-solving skills)
     - `3` = Expert (complex algorithms, advanced concepts)

8. **Create Challenge**: Once the slug is unique, call the MCP command `create_challenge` with:
   - `title`: The challenge title (from `details.json`)
   - `slug`: The unique challenge slug
   - `template`: The template `_id` from the first generated template variation
   - `selectedLanguage`: The `selectedLanguage` from the first generated template variation
   - `estimate`: Integer number representing minutes that would take a person to solve the challenge
   - `tags`: Array of tag objects (3-5 tags) selected from `get_all_tags` response, each containing `_id` and `name`
   - `defaultDifficulty`: Integer (1, 2, or 3) representing the difficulty level
   - `runtimeOptions` _(only for `nodejs-jest` or `nodets-jest` templates that expose an HTTP server)_: An object with:
     - `browserPreviewVisibility`: Set to `true` if Live Preview should be enabled
     - `enableApiTester`: Set to `true` if API Tester should be enabled

9. **Save Challenge Response**: After successfully creating the challenge, save the response from the `create_challenge` MCP command to `challengeCreate.json` file in the challenge folder (`challenges/[challenge-name]/challengeCreate.json`)

We only need a json like this. Two fields \_id which is the \_id of the challenge and the defaultVariation object containing the \_id of the default variation (first variation in what was the challenge created):

```json
{
  "_id": "_id of the challenge",
  "defaultVariation": {
    "_id": "690cb7c590bca759b2401415"
  }
}
```

10. **Update metadata.json with variationId**: After saving the challenge response, update the `metadata.json` file:

- Read the existing `metadata.json` from the first template folder
- Replace the `variationId` field (which has `"placeholder-variation-id"`) with the actual `defaultVariation._id` from `challengeCreate.json`
- Save the updated `metadata.json` back to `challenges/[challenge-name]/templates/[first-template-name]/metadata.json`

```json
{
  "variationId": "actual-variation-id-from-response",
  "mainFilePath": "/main.py",
  "activeFilePath": "/app.py"
}
```

11. **Template ID Lookup**: To get the `template` and `selectedLanguage`:

- Identify the name of the first variation/template generated (e.g., `nodejs-jest`, `python`, `vuejs-jest`)
- Look up this template key in **`templatesConfiguration.json`** (see "Templates configuration" above)
- Use the `_id` value as the `template` parameter
- Use the `selectedLanguage` value as the `selectedLanguage` parameter

These values are then used in the `create_challenge` request.

12. **Update the challenge first variation files**: After creation we need to update the challenge first variation files:

- **Verify Exported Content Exists**: Ensure `exportedContent.zip` file exists in the first template folder. If not, run:
  ```bash
  node createExportContent.js challenges/[challenge-name]/templates/[first-template-name]
  ```
- **Prepare upload**: Call the MCP command `prepare_file_upload` with `{}`. This returns `{ uploadId, uploadUrl }` — **capture the `uploadUrl`**.
- **Upload the zip file**: Run the `uploadChallengeFiles.js` script to upload the zip directly via REST (binary data never passes through the AI context):
  ```bash
  node uploadChallengeFiles.js <uploadUrl> <challengeId> <variationId> challenges/[challenge-name]/templates/[first-template-name]/exportedContent.zip
  ```
  Where `<uploadUrl>` is from the previous step, `<challengeId>` is the `_id` from `challengeCreate.json`, and `<variationId>` is the `defaultVariation._id` from `challengeCreate.json`.

13. **Validate challenge solution**

- Follow the **"Fully test the challenge"** section below, which includes:
  1. **Run initial tests** (author solution) — all tests must pass, no errors
  2. **Run all tests** (author solution) — all tests must pass, no errors
  3. **Run initial tests with preloaded files** — `tests` array must contain at least one test (failures are expected)
  4. **Run all tests with preloaded files** — `tests` array must contain at least one test (failures are expected)
  5. **Run challenge code** (terminal challenges only) — verify main file executes correctly with expected output. Skip for browser challenges.
  6. **Run challenge code with preloaded files** (terminal challenges only) — verify starter code runs without errors. Skip for browser challenges.

14. **Display challenge edit link**: After all validation passes, call the MCP command `get_challenge_edit_url` with:
    - `challengeId`: The `_id` from `challengeCreate.json`
    - `variationId`: The `defaultVariation._id` from `challengeCreate.json`

    Display the returned `editUrl` to the user with a message like: "You can access the challenge by following this link: <editUrl>"

## Adding Variation Workflow with MCP Commands

When instructed to add a variation for a specific challenge (e.g., "add variation for python"), follow this workflow:

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Variation Already Exists**: Check if the template variation folder exists (e.g., `challenges/[challenge-name]/templates/python/`)

3. **Check if Variation Already Created**: Check if `metadata.json` in the variation folder has a real `variationId` (not `"placeholder-variation-id"`):
   - **If `variationId` is NOT `"placeholder-variation-id"`**: Return a warning message "Variation already created" and stop the workflow
   - **If `variationId` IS `"placeholder-variation-id"`**: Continue to step 4

4. **Lookup Template Configuration**: Look up the template name (e.g., `python`) in **`templatesConfiguration.json`** to get:
   - `template`: The `_id` value for the template
   - `selectedLanguage`: The `selectedLanguage` value for the template

5. **Get Challenge ID**: Read the `challengeId` from `challengeCreate.json` file in the challenge folder (the `_id` property)

6. **Add Variation**: Call the MCP command `add_variation` with:
   - `challengeId`: The `_id` property from `challengeCreate.json`
   - `template`: The template `_id` from step 4
   - `selectedLanguage`: The `selectedLanguage` from step 4
   - `runtimeOptions` _(only for `nodejs-jest` or `nodets-jest` templates that expose an HTTP server)_: An object with:
     - `browserPreviewVisibility`: Set to `true` if Live Preview should be enabled
     - `enableApiTester`: Set to `true` if API Tester should be enabled

7. **Update metadata.json with variationId**: After successfully adding the variation, update the `metadata.json` file:
   - Read the existing `metadata.json` from the template folder
   - Replace the `variationId` field with the `_id` from the `add_variation` response
   - Save the updated `metadata.json` back to `challenges/[challenge-name]/templates/[template-name]/metadata.json`

```json
{
  "variationId": "_id from add_variation response",
  "mainFilePath": "/main.py",
  "activeFilePath": "/app.py"
}
```

8. **Update the challenge variation files**: After adding the variation we need to update the challenge variation files:

- **Verify Exported Content Exists**: Ensure `exportedContent.zip` file exists in the template folder. If not, run:
  ```bash
  node createExportContent.js challenges/[challenge-name]/templates/[template-name]
  ```
- **Prepare upload**: Call the MCP command `prepare_file_upload` with `{}`. This returns `{ uploadId, uploadUrl }` — **capture the `uploadUrl`**.
- **Upload the zip file**: Run the `uploadChallengeFiles.js` script to upload the zip directly via REST:
  ```bash
  node uploadChallengeFiles.js <uploadUrl> <challengeId> <variationId> challenges/[challenge-name]/templates/[template-name]/exportedContent.zip
  ```
  Where `<uploadUrl>` is from the previous step, `<challengeId>` is the `_id` from `challengeCreate.json`, and `<variationId>` is the `variationId` from `metadata.json`.

**Example**: If adding a variation for `python`:

- Look up `python` in **`templatesConfiguration.json`** for `_id` and `selectedLanguage`
- Use these values in the `add_variation` request
- Update the `variationId` in `challenges/[challenge-name]/templates/python/metadata.json` with the `_id` from response
- Call `prepare_file_upload` MCP tool to get `uploadUrl`
- Run `node uploadChallengeFiles.js <uploadUrl> <challengeId> <variationId> challenges/[challenge-name]/templates/python/exportedContent.zip`

9. **Validate challenge solution**

- Follow the **"Fully test the challenge"** section below, which includes:
  1. **Run initial tests** (author solution) — all tests must pass, no errors
  2. **Run all tests** (author solution) — all tests must pass, no errors
  3. **Run initial tests with preloaded files** — `tests` array must contain at least one test (failures are expected)
  4. **Run all tests with preloaded files** — `tests` array must contain at least one test (failures are expected)
  5. **Run challenge code** (terminal challenges only) — verify main file executes correctly with expected output. Skip for browser challenges.
  6. **Run challenge code with preloaded files** (terminal challenges only) — verify starter code runs without errors. Skip for browser challenges.

10. **Display challenge edit link**: After all validation passes, call the MCP command `get_challenge_edit_url` with:
    - `challengeId`: The `_id` from `challengeCreate.json`
    - `variationId`: The variation `_id` from `metadata.json`

    Display the returned `editUrl` to the user with a message like: "You can access the challenge by following this link: <editUrl>"

## Update Challenge Files Workflow with MCP Commands

When instructed to update a challenge files for a specific template (e.g., "update challenge x files for template y"), follow this workflow:

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Challenge Was Created**: Check if `challengeCreate.json` file exists in the challenge folder:
   - **If the file does not exist**: Return a message "Challenge was not created" and stop the workflow
   - **If the file exists**: Continue to step 3

3. **Navigate to Template Folder**: Go to the specific template folder (`challenges/[challenge-name]/templates/[template-name]/`)

4. **Check if Variation Was Created**: Check if `metadata.json` in the template folder has a real `variationId` (not `"placeholder-variation-id"`):
   - **If `variationId` IS `"placeholder-variation-id"`**: Return a message "Variation was not created" and stop the workflow
   - **If `variationId` is NOT `"placeholder-variation-id"`**: Continue to step 5

5. **Get Variation ID**: Read the `metadata.json` file and extract the `variationId` property

6. **Get Challenge ID**: Read the `challengeId` from `challengeCreate.json` file in the challenge folder (the `_id` property)

7. **Verify Exported Content Exists**: Check if `exportedContent.zip` file exists in the template folder (`challenges/[challenge-name]/templates/[template-name]/exportedContent.zip`):
   - **If the file does not exist**: Run the `createExportContent.js` script first to generate the zip file:
     ```bash
     node createExportContent.js challenges/[challenge-name]/templates/[template-name]
     ```
   - **If the file exists**: Continue to step 8

8. **Prepare upload**: Call the MCP command `prepare_file_upload` with `{}`. This returns `{ uploadId, uploadUrl }` — **capture the `uploadUrl`**.

9. **Upload the zip file**: Run the `uploadChallengeFiles.js` script to upload the zip directly via REST:

   ```bash
   node uploadChallengeFiles.js <uploadUrl> <challengeId> <variationId> challenges/[challenge-name]/templates/[template-name]/exportedContent.zip
   ```

   Where `<uploadUrl>` is from step 8, `<challengeId>` is the challenge `_id` from step 6, and `<variationId>` is the variation `_id` from step 5.

10. **Validate challenge solution**

- Follow the **"Fully test the challenge"** section below, which includes:
  1. **Run initial tests** (author solution) — all tests must pass, no errors
  2. **Run all tests** (author solution) — all tests must pass, no errors
  3. **Run initial tests with preloaded files** — `tests` array must contain at least one test (failures are expected)
  4. **Run all tests with preloaded files** — `tests` array must contain at least one test (failures are expected)
  5. **Run challenge code** (terminal challenges only) — verify main file executes correctly with expected output. Skip for browser challenges.
  6. **Run challenge code with preloaded files** (terminal challenges only) — verify starter code runs without errors. Skip for browser challenges.

11. **Display challenge edit link**: After all validation passes, call the MCP command `get_challenge_edit_url` with:
    - `challengeId`: The challenge `_id` from step 6
    - `variationId`: The variation `_id` from step 5

    Display the returned `editUrl` to the user with a message like: "You can access the challenge by following this link: <editUrl>"

## Run challenge initial tests

When instructed to run the initial tests for a specific variation (e.g., "run intitial tests for challenge x for template y")

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Challenge Was Created**: Check if `challengeCreate.json` file exists in the challenge folder:
   - **If the file does not exist**: Return a message "Challenge was not created" and stop the workflow
   - **If the file exists**: Continue to step 3

3. **Navigate to Template Folder**: Go to the specific template folder (`challenges/[challenge-name]/templates/[template-name]/`)

4. **Check if Variation Was Created**: Check if `metadata.json` in the template folder has a real `variationId` (not `"placeholder-variation-id"`):
   - **If `variationId` IS `"placeholder-variation-id"`**: Return a message "Variation was not created" and stop the workflow
   - **If `variationId` is NOT `"placeholder-variation-id"`**: Continue to step 5

5. **Get Variation ID**: Read the `metadata.json` file and extract the `variationId` property

6. **Get Challenge ID**: Read the `challengeId` from `challengeCreate.json` file in the challenge folder (the `_id` property)

7. **Verify Exported Content Exists**: Check if `exportedContent.zip` file exists in the template folder (`challenges/[challenge-name]/templates/[template-name]/exportedContent.zip`):
   - **If the file does not exist**: Run the `createExportContent.js` script first to generate the zip file:
     ```bash
     node createExportContent.js challenges/[challenge-name]/templates/[template-name]
     ```
   - **If the file exists**: Continue to step 8

8. **Prepare upload**: Call the MCP command `prepare_file_upload` with `{}`. This returns `{ uploadId, uploadUrl }` — **capture the `uploadUrl`**.

9. **Upload the zip file**: Run the `uploadChallengeFiles.js` script to upload the zip directly via REST:

   ```bash
   node uploadChallengeFiles.js <uploadUrl> <challengeId> <variationId> challenges/[challenge-name]/templates/[template-name]/exportedContent.zip
   ```

   Where `<uploadUrl>` is from step 8, `<challengeId>` is the challenge `_id` from step 6, and `<variationId>` is the variation `_id` from step 5.

10. **Call Run Initial Tests**: Call the MCP command `run_initial_tests` with:

    **Required Parameters:**

- `variationId`: The variation `_id` from step 5
- `challengeId`: The challenge `_id` from step 6

11. Verify the response

- Verify if response json contains errors array and if the length of it is greater than 0
- Verify if the response json tests array is present and if some tests object from it have the property passed: false
- If errors of failed tests you will need to update the template and fix the issues (initialTests if there are problems, allTests if there are problems, preloadedFiles if there are problems and also the solutionFiles if there are issues)
- After updating and fixing the errors you will have to generate again the `exportedContent.zip`
- After regeneration of `exportedContent.zip` you will have to update the challenge again
- After update you will have to run the `run_initial_tests` again basically step **10** and redo the process until no errors and no passed failed tests

## Run challenge all tests

When instructed to run the all tests for a specific variation (e.g., "run intitial tests for challenge x for template y")

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Challenge Was Created**: Check if `challengeCreate.json` file exists in the challenge folder:
   - **If the file does not exist**: Return a message "Challenge was not created" and stop the workflow
   - **If the file exists**: Continue to step 3

3. **Navigate to Template Folder**: Go to the specific template folder (`challenges/[challenge-name]/templates/[template-name]/`)

4. **Check if Variation Was Created**: Check if `metadata.json` in the template folder has a real `variationId` (not `"placeholder-variation-id"`):
   - **If `variationId` IS `"placeholder-variation-id"`**: Return a message "Variation was not created" and stop the workflow
   - **If `variationId` is NOT `"placeholder-variation-id"`**: Continue to step 5

5. **Get Variation ID**: Read the `metadata.json` file and extract the `variationId` property

6. **Get Challenge ID**: Read the `challengeId` from `challengeCreate.json` file in the challenge folder (the `_id` property)

7. **Verify Exported Content Exists**: Check if `exportedContent.zip` file exists in the template folder (`challenges/[challenge-name]/templates/[template-name]/exportedContent.zip`):
   - **If the file does not exist**: Run the `createExportContent.js` script first to generate the zip file:
     ```bash
     node createExportContent.js challenges/[challenge-name]/templates/[template-name]
     ```
   - **If the file exists**: Continue to step 8

8. **Prepare upload**: Call the MCP command `prepare_file_upload` with `{}`. This returns `{ uploadId, uploadUrl }` — **capture the `uploadUrl`**.

9. **Upload the zip file**: Run the `uploadChallengeFiles.js` script to upload the zip directly via REST:

   ```bash
   node uploadChallengeFiles.js <uploadUrl> <challengeId> <variationId> challenges/[challenge-name]/templates/[template-name]/exportedContent.zip
   ```

   Where `<uploadUrl>` is from step 8, `<challengeId>` is the challenge `_id` from step 6, and `<variationId>` is the variation `_id` from step 5.

10. **Call Run Initial Tests**: Call the MCP command `run_all_tests` with:

    **Required Parameters:**

- `variationId`: The variation `_id` from step 5
- `challengeId`: The challenge `_id` from step 6

11. Verify the response

- Verify if response json contains errors array and if the length of it is greater than 0
- Verify if the response json tests array is present and if some tests object from it have the property passed: false
- If errors of failed tests you will need to update the template and fix the issues (initialTests if there are problems, allTests if there are problems, preloadedFiles if there are problems and also the solutionFiles if there are issues)
- After updating and fixing the errors you will have to generate again the `exportedContent.zip`
- After regeneration of `exportedContent.zip` you will have to update the challenge again
- After update you will have to run the `run_all_tests` again basically step **10** and redo the process until no errors and no passed failed tests

## Run challenge initial tests with preloaded files

When instructed to run the initial tests with preloaded files for a specific variation (e.g., "run initial tests with preloaded files for challenge x for template y")

**Note**: This runs the tests using the **starter code (preloaded files)** instead of the author solution. The purpose is to verify that tests actually run and produce test results (even if some or all fail). The important thing is that tests exist in the response — not that they all pass.

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Challenge Was Created**: Check if `challengeCreate.json` file exists in the challenge folder:
   - **If the file does not exist**: Return a message "Challenge was not created" and stop the workflow
   - **If the file exists**: Continue to step 3

3. **Navigate to Template Folder**: Go to the specific template folder (`challenges/[challenge-name]/templates/[template-name]/`)

4. **Check if Variation Was Created**: Check if `metadata.json` in the template folder has a real `variationId` (not `"placeholder-variation-id"`):
   - **If `variationId` IS `"placeholder-variation-id"`**: Return a message "Variation was not created" and stop the workflow
   - **If `variationId` is NOT `"placeholder-variation-id"`**: Continue to step 5

5. **Get Variation ID**: Read the `metadata.json` file and extract the `variationId` property

6. **Get Challenge ID**: Read the `challengeId` from `challengeCreate.json` file in the challenge folder (the `_id` property)

7. **Call Run Initial Tests with Preloaded Files**: Call the MCP command `run_initial_tests_preloaded` with:

   **Required Parameters:**

- `variationId`: The variation `_id` from step 5
- `challengeId`: The challenge `_id` from step 6

8. Verify the response

- **Critical check**: Verify if the response json `tests` array is present and contains at least one test. **If the `tests` array is empty or missing, this is a problem** — it means the tests could not run at all against the preloaded files. You will need to fix the preloaded files (syntax errors, missing imports, etc.) in the `preloadedFiles/` directory, regenerate `exportedContent.zip`, update the challenge files, and re-run the tests.
- The `errors` array **may contain errors** — this is acceptable and not a problem on its own.
- Tests with `passed: false` are **EXPECTED** and **CORRECT** when running with preloaded files (the starter code does not implement the solution). It is also OK if some tests pass and some fail. The important thing is that **tests exist in the results**.
- Repeat the fix cycle only if the `tests` array is empty (no test results returned).

## Run challenge all tests with preloaded files

When instructed to run the all tests with preloaded files for a specific variation (e.g., "run all tests with preloaded files for challenge x for template y")

**Note**: This runs all tests using the **starter code (preloaded files)** instead of the author solution. The purpose is to verify that tests actually run and produce test results (even if some or all fail). The important thing is that tests exist in the response — not that they all pass.

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Challenge Was Created**: Check if `challengeCreate.json` file exists in the challenge folder:
   - **If the file does not exist**: Return a message "Challenge was not created" and stop the workflow
   - **If the file exists**: Continue to step 3

3. **Navigate to Template Folder**: Go to the specific template folder (`challenges/[challenge-name]/templates/[template-name]/`)

4. **Check if Variation Was Created**: Check if `metadata.json` in the template folder has a real `variationId` (not `"placeholder-variation-id"`):
   - **If `variationId` IS `"placeholder-variation-id"`**: Return a message "Variation was not created" and stop the workflow
   - **If `variationId` is NOT `"placeholder-variation-id"`**: Continue to step 5

5. **Get Variation ID**: Read the `metadata.json` file and extract the `variationId` property

6. **Get Challenge ID**: Read the `challengeId` from `challengeCreate.json` file in the challenge folder (the `_id` property)

7. **Call Run All Tests with Preloaded Files**: Call the MCP command `run_all_tests_preloaded` with:

   **Required Parameters:**

- `variationId`: The variation `_id` from step 5
- `challengeId`: The challenge `_id` from step 6

8. Verify the response

- **Critical check**: Verify if the response json `tests` array is present and contains at least one test. **If the `tests` array is empty or missing, this is a problem** — it means the tests could not run at all against the preloaded files. You will need to fix the preloaded files (syntax errors, missing imports, etc.) in the `preloadedFiles/` directory, regenerate `exportedContent.zip`, update the challenge files, and re-run the tests.
- The `errors` array **may contain errors** — this is acceptable and not a problem on its own.
- Tests with `passed: false` are **EXPECTED** and **CORRECT** when running with preloaded files (the starter code does not implement the solution). It is also OK if some tests pass and some fail. The important thing is that **tests exist in the results**.
- Repeat the fix cycle only if the `tests` array is empty (no test results returned).

## Run challenge code

When instructed to run the challenge code for a specific variation (e.g., "run code for challenge x for template y"), follow this workflow:

**Note**: This is NOT running tests - this executes the main file of the challenge template to verify the solution code runs correctly.

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Challenge Was Created**: Check if `challengeCreate.json` file exists in the challenge folder:
   - **If the file does not exist**: Return a message "Challenge was not created" and stop the workflow
   - **If the file exists**: Continue to step 3

3. **Navigate to Template Folder**: Go to the specific template folder (`challenges/[challenge-name]/templates/[template-name]/`)

4. **Check if Variation Was Created**: Check if `metadata.json` in the template folder has a real `variationId` (not `"placeholder-variation-id"`):
   - **If `variationId` IS `"placeholder-variation-id"`**: Return a message "Variation was not created" and stop the workflow
   - **If `variationId` is NOT `"placeholder-variation-id"`**: Continue to step 5

5. **Get Variation ID**: Read the `metadata.json` file and extract the `variationId` property

6. **Get Challenge ID**: Read the `challengeId` from `challengeCreate.json` file in the challenge folder (the `_id` property)

7. **Get Main File Path (Optional)**: Read the `metadata.json` file and extract the `mainFilePath` property if it exists

8. **Verify Exported Content Exists**: Check if `exportedContent.zip` file exists in the template folder:
   - **If the file does not exist**: Run the `createExportContent.js` script first:
     ```bash
     node createExportContent.js challenges/[challenge-name]/templates/[template-name]
     ```
   - **If the file exists**: Continue to step 9

9. **Prepare upload**: Call the MCP command `prepare_file_upload` with `{}`. This returns `{ uploadId, uploadUrl }` — **capture the `uploadUrl`**.

10. **Upload the zip file**: Run the `uploadChallengeFiles.js` script to upload the zip directly via REST:

    ```bash
    node uploadChallengeFiles.js <uploadUrl> <challengeId> <variationId> challenges/[challenge-name]/templates/[template-name]/exportedContent.zip
    ```

    Where `<uploadUrl>` is from step 9, `<challengeId>` is the challenge `_id` from step 6, and `<variationId>` is the variation `_id` from step 5.

11. **Call Run Challenge Code**: Call the MCP command `run_challenge_code` with:

    **Required Parameters:**
    - `challengeId`: The challenge `_id` from step 6
    - `variationId`: The variation `_id` from step 5

    **Optional Parameters:**
    - `mainFile`: The `mainFilePath` from step 7 (if available)

12. **Analyze the Response**:
    - Check if the response contains any errors or unexpected output
    - Verify the `consoleOutput` shows the expected results from the main file execution
    - If there are errors or the output is incorrect:
      - Fix the issues in `solutionFiles/` (the main implementation files)
      - Regenerate the `exportedContent.zip`
      - Update the challenge again
      - Run the code again to verify the fix
    - Repeat until the code runs successfully with expected output

**Example Response Analysis:**

```json
{
  "consoleOutput": "fizzBuzz(3): Fizz\nfizzBuzz(5): Buzz\nfizzBuzz(15): FizzBuzz\nfizzBuzz(2): 2\n",
  "errors": []
}
```

- If `errors` array is empty and `consoleOutput` shows expected values → Code runs correctly
- If `errors` array has items → Fix the solution files and retry
- If `consoleOutput` shows unexpected values → Debug and fix the solution logic

## Run challenge code with preloaded files

When instructed to run the challenge code with preloaded files for a specific variation (e.g., "run code with preloaded files for challenge x for template y"), follow this workflow:

**Note**: This runs the main file using the **starter code (preloaded files)** instead of the author solution. The purpose is to verify that the starter code runs without errors. There should be **no errors** when running the preloaded code.

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Challenge Was Created**: Check if `challengeCreate.json` file exists in the challenge folder:
   - **If the file does not exist**: Return a message "Challenge was not created" and stop the workflow
   - **If the file exists**: Continue to step 3

3. **Navigate to Template Folder**: Go to the specific template folder (`challenges/[challenge-name]/templates/[template-name]/`)

4. **Check if Variation Was Created**: Check if `metadata.json` in the template folder has a real `variationId` (not `"placeholder-variation-id"`):
   - **If `variationId` IS `"placeholder-variation-id"`**: Return a message "Variation was not created" and stop the workflow
   - **If `variationId` is NOT `"placeholder-variation-id"`**: Continue to step 5

5. **Get Variation ID**: Read the `metadata.json` file and extract the `variationId` property

6. **Get Challenge ID**: Read the `challengeId` from `challengeCreate.json` file in the challenge folder (the `_id` property)

7. **Call Run Challenge Code with Preloaded Files**: Call the MCP command `run_challenge_code_preloaded` with:

   **Required Parameters:**
   - `challengeId`: The challenge `_id` from step 6
   - `variationId`: The variation `_id` from step 5

   **Optional Parameters:**
   - `mainFile`: The `mainFilePath` from `metadata.json` (if available)

8. **Analyze the Response**:
   - Check if the response contains any errors
   - Verify the `consoleOutput` does not contain unexpected errors
   - If there are errors:
     - Fix the issues in `preloadedFiles/` (the starter code files)
     - Regenerate the `exportedContent.zip`
     - Update the challenge again
     - Run the code again to verify the fix
   - Repeat until the code runs successfully without errors

## Fully test the challenge

When instructed to fully test for a specific variation (e.g., "fully test for challenge x for template y")

1. **Run challenge initial tests** (with author solution) - Follow the "Run challenge initial tests" instructions above. All tests should pass (no errors, no failed tests).
2. **Run challenge all tests** (with author solution) - Follow the "Run challenge all tests" instructions above. All tests should pass (no errors, no failed tests).
3. **Run challenge initial tests with preloaded files** - Follow the "Run challenge initial tests with preloaded files" instructions above. The `tests` array must contain at least one test result. Errors are acceptable, and some or all tests may fail — the important thing is that tests exist in the results. If the `tests` array is empty, fix the preloaded files.
4. **Run challenge all tests with preloaded files** - Follow the "Run challenge all tests with preloaded files" instructions above. The `tests` array must contain at least one test result. Errors are acceptable, and some or all tests may fail — the important thing is that tests exist in the results. If the `tests` array is empty, fix the preloaded files.
5. **Run challenge code** (terminal challenges only) - Follow the "Run challenge code" instructions above to verify the main file executes correctly. **Skip this step for browser challenges** (vuejs-jest, vuets-jest, reactjs-jest, reactts-jest, svelte-jest, vanillajs-jest, vanillats-jest, angular-jest) as they use browser preview instead of code execution.
6. **Run challenge code with preloaded files** (terminal challenges only) - Follow the "Run challenge code with preloaded files" instructions above to verify the starter code runs without errors. **Skip this step for browser challenges** (vuejs-jest, vuets-jest, reactjs-jest, reactts-jest, svelte-jest, vanillajs-jest, vanillats-jest, angular-jest) as they use browser preview instead of code execution.

## Get Challenge from Live Platform

When instructed to get a challenge from the live DojoCode platform (e.g., "Get the live challenge with id 62a9aa5e87d07e7b5c63e69f"), follow this workflow:

1. **Extract Challenge ID**: Get the challenge ID from the instruction (e.g., `62a9aa5e87d07e7b5c63e69f`)

2. **Call Get Challenge MCP**: Call the MCP command `get_challenge` with:
   - `challengeId`: The challenge ID from step 1

3. **Extract Slug**: From the response, extract the `slug` property (e.g., `"fizz-buzz"`)

4. **Check if Challenge Already Exists Locally**: Check if a challenge folder with the slug name already exists in the `challenges/` directory:
   - **If the folder exists**: Return a message "Challenge already on local environment" and stop the workflow
   - **If the folder does not exist**: Continue to step 5

5. **Create Challenge Folder Structure**: Create the challenge folder structure:
   - Create folder: `challenges/[slug]/`
   - Create folder: `challenges/[slug]/templates/`

6. **Save Challenge Response**: Save the challenge metadata from `get_challenge` response to `challenges/[slug]/challengeCreate.json`:

   ```json
   {
     "_id": "challenge_id from response",
     "defaultVariation": {
       "_id": "first variation _id from challengeVariations array"
     }
   }
   ```

7. **Prepare Challenge Download**: Call the MCP command `prepare_challenge_download` with:
   - `challengeId`: The challenge ID from step 1

   This returns `{ downloadId, downloadUrl }` — **capture the `downloadUrl`**.

8. **Download and Extract Templates**: Run the `downloadChallengeFiles.js` script to download the zip via REST and extract all templates in one step (binary data never passes through the AI context):

   ```bash
   node downloadChallengeFiles.js <downloadUrl> challenges/[slug]/templates
   ```

   Where `<downloadUrl>` is from step 7. The script will:
   - Download the main zip from the MCP REST endpoint
   - Extract each inner zip (nodejs.zip, python.zip, etc.) to its corresponding folder
   - Each extracted template will include:
     - `README.md` - Challenge description
     - `metadata.json` - Contains variationId, mainFilePath, activeFilePath
     - `preloadedFiles.json` + `preloadedFiles/` - Starter code configuration and files
     - `solutionFiles.json` + `solutionFiles/` - Solution configuration and files
     - `initialTests.json` + `initialTests/` - Initial tests configuration and files
     - `allTests.json` + `allTests/` - All tests configuration and files

9. **Create details.json for Each Template**: After extraction, create a `details.json` file in each template folder:
   - Read the `README.md` content from the extracted files
   - Get the challenge title from the `get_challenge` response
   - Create `details.json`:
     ```json
     {
       "title": "Challenge Title from get_challenge response",
       "description": "Content from README.md"
     }
     ```

10. **Generate Exported Content**: For each template variation, run the `createExportContent.js` script to regenerate the `exportedContent.zip`:

    ```bash
    node createExportContent.js challenges/[slug]/templates/[template-name]
    ```

**Important Notes:**

- The downloaded zip structure matches the backend export format
- Each inner zip contains a complete variation with all necessary files
- The `metadata.json` already contains the correct `variationId` from the live platform
- Template folder names come directly from the inner zip filenames
- File paths and structures are preserved from the live platform

**Example Workflow:**

- Instruction: "Get the live challenge with id 62a9aa5e87d07e7b5c63e69f"
- Call `get_challenge` with `challengeId: "62a9aa5e87d07e7b5c63e69f"`
- Extract slug: `"fizz-buzz"`
- Check if `challenges/fizz-buzz/` exists
- If not, create folder structure
- Save challengeCreate.json with challenge metadata
- Call `prepare_challenge_download` with `challengeId: "62a9aa5e87d07e7b5c63e69f"` to get `{ downloadId, downloadUrl }`
- Download and extract using script:
  ```bash
  node downloadChallengeFiles.js <downloadUrl> challenges/fizz-buzz/templates
  ```
- Create details.json for each extracted template
- Generate `exportedContent.zip` for each template:
  ```bash
  node createExportContent.js challenges/fizz-buzz/templates/nodejs-jest
  node createExportContent.js challenges/fizz-buzz/templates/python
  # ... for each template
  ```
- Display challenge edit link: Call `get_challenge_edit_url` with `challengeId` and the `defaultVariation._id` from `challengeCreate.json` as `variationId`. Display the returned `editUrl` to the user with a message like: "You can access the challenge by following this link: <editUrl>"

## Update Challenge Info Workflow with MCP Commands

When instructed to update a challenge info for a specific challenge id (e.g., "update challenge x info with next fields...", "help me set a default difficulty for challenge x...", "set title, estimate and defaultDifficulty fields for challenge x"), follow this workflow:

1. **Navigate to Challenge Folder**: Go to the challenge folder (`challenges/[challenge-name]/`)

2. **Check if Challenge Was Created**: Check if `challengeCreate.json` file exists in the challenge folder:
   - **If the file does not exist**: Return a message "Challenge was not created" and stop the workflow
   - **If the file exists**: Continue to step 3

3. **Check what fields the user wants to update**: Check the requested updated fields that user wants to update for specific challenge

We can update the next fields: title, estimate, defaultDifficulty any other requested fields are not possible to edit:

- `title`: The challenge title (from `details.json`)
- `estimate`: Integer number representing minutes that would take a person to solve the challenge
- `defaultDifficulty`: Integer (1, 2, or 3) representing the difficulty level

After thinking of fields requested by user and having them we can go to step 4

4. **Call update_challenge_info**: Use the MCP command `update_challenge_info` with:

- `variationId`: The `defaultVariation._id` from `challengeCreate.json`
- `challengeId`: The `_id` from `challengeCreate.json`
- `info`: An object containing the fields that should be updated (e.g. title, estimate, defaultDifficulty based on what user asked)

5. **Printing response message**: Print what the response returned:

If the response is an object containing challenge info then print a message and let user know that challenge was successfully updated. Call the MCP command `get_challenge_edit_url` with the `challengeId` and `variationId` (the `defaultVariation._id` from `challengeCreate.json`) to get the edit link, and display it to the user with a message like: "You can access the challenge by following this link: <editUrl>". Otherwise print the error.

## Get info about existing templates from live

**Template IDs and selectedLanguage**: For template `_id` and `selectedLanguage` (e.g. when creating challenges or adding variations), **read from `templatesConfiguration.json`**. That file is populated at session start by calling `get_templates` and saving the result in the format described in "Session start (mandatory first step)".

When the user explicitly asks for live template info (e.g. "Get all live templates from database", "What are the existing live templates?", "Give me info regarding live template NodeJS"):

### Usage

1. **Call `get_templates`**: Use the MCP command `get_templates` with optional filtering (and at session start, use the response to build and save `templatesConfiguration.json` as described in "Session start (mandatory first step)").

   **Get all templates:**

   ```json
   {}
   ```

   **Filter by name (partial match):**

   ```json
   { "name": "python" }
   ```

### Parameters

| Parameter | Type   | Required | Description                                               |
| --------- | ------ | -------- | --------------------------------------------------------- |
| `name`    | string | No       | Filter templates by name (case-insensitive partial match) |

### Response

Returns an array of slim template objects. Print the response as a table with information including:

| Column               | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `_id`                | Template unique identifier (used when creating challenges)                   |
| `key`                | Template key identifier (e.g. `nodejs_jest`, `python`)                       |
| `name`               | Template display name (e.g. `NodeJS`, `Python`)                              |
| `language`           | Language ID associated with the template (used as `selectedLanguage`)        |
| `environment`        | Template environment type (e.g. `terminal`, `browser`)                       |
| `enableDependencies` | Whether the template supports custom dependencies                            |
| `enableRunCode`      | Whether the template supports running code via the Run button                |
| `deprecated`         | Whether the template is deprecated and should not be used for new challenges |

### Examples

**Example 1: Get all templates**

- User: "What live templates are available?"
- Action: Call `get_templates` with `{}`
- Display: Table of all templates with their IDs, keys, names, language IDs, environment, and feature flags

**Example 2: Search for specific template**

- User: "Give me info about Python live template"
- Action: Call `get_templates` with `{ "name": "python" }`
- Display: Table showing Python template details

**Example 3: Find templates for web development**

- User: "What live templates exist for React?"
- Action: Call `get_templates` with `{ "name": "react" }`
- Display: Table showing React-related templates

**When you need template \_id or selectedLanguage for an operation**: Read from `templatesConfiguration.json` (keyed by template key, e.g. `nodejs-jest`, `python`). Do not call `get_templates` again for that; use the cached file.

## Get info about existing languages from live

When instructed to get info regarding existing languages from live, e.g. "Get all languages from database", "What are the existing languages?", "Give me info regarding language Python".

### Usage

1. **Call `get_languages`**: Use the MCP command `get_languages`:

   **Get all languages:**

   ```json
   {}
   ```

### Parameters

No parameters required.

### Response

Returns an array of language objects. Print the response as a table with information including:

| Column | Description                                                        |
| ------ | ------------------------------------------------------------------ |
| `_id`  | Language unique identifier (used when filtering challenges)        |
| `name` | Language display name (e.g., "Python", "JavaScript", "TypeScript") |
| `key`  | Language key identifier                                            |

### Examples

**Example 1: Get all languages**

- User: "What languages are available?"
- Action: Call `get_languages` with `{}`
- Display: Table of all languages with their IDs, names, and keys

**Example 2: Find specific language**

- User: "What is the Python language ID?"
- Action: Call `get_languages` with `{}`, then filter the results for Python
- Display: Table showing Python language details including its ID

### Notes

- The `_id` field from the response can be used when filtering challenges by language
- Language names can be used directly in `get_challenges` - they will be automatically mapped to IDs

## Get info about existing challenges from live

When instructed to get info regarding existing challenges from live, e.g. "Get all live challenges from database", "What challenges exist?", "Show me challenges by author X", "Find Python challenges".

### Usage

1. **Call `get_challenges`**: Use the MCP command `get_challenges` with optional filtering:

   **Get all challenges (paginated):**

   ```json
   {}
   ```

   **Filter by search term:**

   ```json
   { "search": "binary tree" }
   ```

   **Filter by multiple criteria:**

   ```json
   { "tags": ["algorithms"], "difficulty": 2, "language": "Python" }
   ```

### Parameters

| Parameter    | Type             | Required | Description                                                                                                                                          |
| ------------ | ---------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`       | number           | No       | Page number (default: 1)                                                                                                                             |
| `limit`      | number           | No       | Items per page (default: 20)                                                                                                                         |
| `search`     | string           | No       | Search term to filter challenges by title/description                                                                                                |
| `tags`       | array of strings | No       | Filter by tag names (automatically mapped to tag objects)                                                                                            |
| `difficulty` | number           | No       | Filter by difficulty level (0-3)                                                                                                                     |
| `language`   | string or array  | No       | Filter by programming language name(s) - **must have the first letter capitalized** (e.g., `"Python"`, `"Javascript"`, `  ["Python", "Javascript"]`) |
| `template`   | string or array  | No       | Filter by template name(s) (e.g., `"Python"` or `["Python", "NodeJS"]`)                                                                              |
| `author`     | string           | No       | Filter by author username                                                                                                                            |
| `status`     | string           | No       | Filter by challenge status                                                                                                                           |

### Response

Returns a paginated response with challenge objects. Print the response as a table with information including:

| Column                | Description                               |
| --------------------- | ----------------------------------------- |
| `_id`                 | Challenge unique identifier               |
| `title`               | Challenge title                           |
| `slug`                | URL-friendly identifier                   |
| `difficulty`          | Difficulty level (0-3)                    |
| `estimate`            | Estimated time to complete (in minutes)   |
| `author`              | Author information                        |
| `tags`                | Array of associated tags                  |
| `status`              | Challenge status (draft, published, etc.) |
| `challengeVariations` | Available template/language variations    |

### Examples

**Example 1: Get all challenges**

- User: "What live challenges are available?"
- Action: Call `get_challenges` with `{}`
- Display: Table of challenges with their IDs, titles, difficulty, and tags

**Example 2: Search for specific challenges**

- User: "Find challenges about sorting algorithms"
- Action: Call `get_challenges` with `{ "search": "sorting" }`
- Display: Table showing matching challenges

**Example 3: Filter by difficulty**

- User: "Show me easy challenges"
- Action: Call `get_challenges` with `{ "difficulty": 1 }`
- Display: Table showing easy difficulty challenges

**Example 4: Filter by language**

- User: "What Python challenges exist?"
- Action: Call `get_challenges` with `{ "language": "Python" }`
- Display: Table showing Python challenges

**Example 5: Filter by author**

- User: "Show challenges created by johnsmith"
- Action: Call `get_challenges` with `{ "author": "johnsmith" }`
- Display: Table showing challenges by that author

**Example 6: Paginated results**

- User: "Show me page 2 of challenges with 10 per page"
- Action: Call `get_challenges` with `{ "page": 2, "limit": 10 }`
- Display: Table showing the second page of results

**Example 7: Combined filters**

- User: "Find medium difficulty algorithm challenges in JavaScript"
- Action: Call `get_challenges` with `{ "tags": ["algorithms"], "difficulty": 2, "language": "Javascript" }`
- Display: Table showing matching challenges
