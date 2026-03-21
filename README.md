# DojoCode Challenge Creator

> **Prompt to Challenge** — Describe a coding challenge, and AI builds it for you.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js >=18](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![Platform: DojoCode](https://img.shields.io/badge/Platform-DojoCode-purple.svg)](https://dojocode.io)

## Overview

DojoCode Challenge Creator is a starter repo for creating coding challenges on the [DojoCode](https://dojocode.io) platform. It uses AI-powered tools via the **Model Context Protocol (MCP)** to generate complete challenge packages — including starter code, solutions, and test suites — from natural language descriptions. Connect your preferred AI coding tool, describe a challenge, and publish it directly to DojoCode.

## Features

- AI-powered challenge creation via natural language
- MCP integration with Claude Code, Codex, Cursor, VS Code Copilot, Gemini CLI, and more
- 18 language/framework templates (terminal + browser)
- Structured output: starter code, solutions, test suites
- Automated packaging and platform upload
- Sample challenges for every supported template

## Supported Languages & Frameworks

### Terminal

| Template | Language | Test Framework |
|----------|----------|----------------|
| `nodejs-jest` | Javascript | Jest |
| `nodets-jest` | TypeScript | Jest |
| `python` | Python | pytest |
| `php` | PHP | PHPUnit |
| `java` | Java | JUnit Jupiter |
| `ruby` | Ruby | RSpec |
| `rust` | Rust | Built-in test |
| `c` | C | Criterion |
| `cpp` | C++ | Catch2 |
| `solidity` | Solidity | Mocha |

### Browser

| Template | Framework | Test Framework |
|----------|-----------|----------------|
| `reactjs-jest` | React (Javascript) | Jest + Testing Library |
| `reactts-jest` | React (TypeScript) | Jest + Testing Library |
| `vuejs-jest` | Vue.js | Jest + Testing Library |
| `vuets-jest` | Vue.js (TypeScript) | Jest + Testing Library |
| `svelte-jest` | Svelte | Jest + Testing Library |
| `angular-jest` | Angular | Jest + Testing Library |
| `vanillajs-jest` | Vanilla JS | Jest + Testing Library |
| `vanillats-jest` | Vanilla TS | Jest + Testing Library |

## Requirements

- [Node.js](https://nodejs.org/) 18+
- npm
- A [DojoCode](https://dojocode.io) account with challenge creation access (Premium subscription, Business account, or learner level Ambitious Dojo / Persistence Dojo / Expert Dojo)
- An AI coding tool: [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Codex](https://openai.com/index/codex/), [Cursor](https://www.cursor.com/), [VS Code + Copilot](https://code.visualstudio.com/docs/copilot/overview), [Gemini CLI](https://github.com/google-gemini/gemini-cli), or any MCP-compatible client

## Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/dojo-coder/challenge-creator.git
   cd challenge-creator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Connect your AI tool via MCP** — see [IDE Setup](#ide-setup) below

4. **Start creating challenges** — describe a challenge in natural language and the AI will generate everything

## IDE Setup

Pre-configured MCP files are included for all supported tools. Follow the setup guide for your IDE:

| AI Tool | Config File | Setup Guide |
|---------|-------------|-------------|
| Claude Code | `.mcp.json` | [Claude Code setup](https://docs.dojocode.io/ide-integration/claude-code) |
| Codex | `.codex/config.toml` | [Codex setup](https://docs.dojocode.io/ide-integration/codex) |
| Cursor | `.cursor/mcp.json` | [Cursor setup](https://docs.dojocode.io/ide-integration/cursor) |
| VS Code (Copilot) | `.vscode/mcp.json` | [VS Code setup](https://docs.dojocode.io/ide-integration/vscode) |
| Gemini CLI | `.gemini/settings.json` | [Gemini CLI setup](https://docs.dojocode.io/ide-integration/gemini-cli) |
| Other MCP clients | Manual config | Use endpoint: `https://api.dojocode.io/api/v1/mcp` |

## Usage

Once connected, describe what you want in your AI tool. Example prompts:

```
create a challenge on data structures and strings in javascript
```

```
get the challenge with id X from live and update main file with more debug messages for all templates
```

```
add python translation for fizz-buzz-challenge and update on live
```

```
fully test the challenge fizz-buzz-challenge for template nodejs-jest
```


See `AGENTS.md` for the full list of workflows and MCP commands.

## How It Works

![Challenge creation demo in Claude Code](prompt-to-challenge-claude-code-example.gif)

1. **Describe** — Tell the AI what challenge you want to create
2. **Generate** — The AI produces starter code, solution, tests, and metadata following the templates in `AGENTS.md`
3. **Package** — Files are bundled into a `exportedContent.zip` via `createExportContent.js`
4. **Publish** — The challenge is uploaded to DojoCode through MCP commands
5. **Review** — Validate with automated test runs (initial tests, all tests, preloaded file tests)

## Project Structure

```
challenge-creator/
├── .codex/config.toml           # Codex MCP config
├── .cursor/mcp.json             # Cursor MCP config
├── .gemini/settings.json        # Gemini CLI MCP config
├── .vscode/mcp.json             # VS Code MCP config
├── .mcp.json                    # Claude Code MCP config
├── AGENTS.md                    # AI agent guidelines & workflows
├── CLAUDE.md                    # Claude-specific instructions
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # MIT License
├── README.md                    # This file
├── package.json                 # Project dependencies
├── createExportContent.js       # Packages challenge files into zip
├── uploadChallengeFiles.js      # Uploads challenge zip to DojoCode
├── downloadChallengeFiles.js    # Downloads challenges from DojoCode
├── challenges/                  # Your generated challenges go here
│   └── .gitkeep
├── samples/                     # Reference challenges for all 18 templates
│   ├── nodejs-example-challenge/
│   ├── python-example-challenge/
│   ├── reactjs-example-challenge/
│   └── ... (18 templates)
└── temp/                        # Temporary working directory
```

## Challenge Structure

Each generated challenge follows this structure:

```
challenges/[challenge-name]/
├── challengeCreate.json              # Platform metadata (after creation)
└── templates/
    └── [template-name]/
        ├── details.json              # Title and description
        ├── README.md                 # Challenge description (for zip export)
        ├── metadata.json             # Variation ID, main file path, active file
        ├── preloadedFiles/           # Starter code for students
        ├── preloadedFiles.json       # File visibility config
        ├── solutionFiles/            # Complete solution
        ├── solutionFiles.json        # File visibility config
        ├── initialTests/             # Basic test cases (5-7 tests)
        ├── initialTests.json         # File visibility config
        ├── allTests/                 # Comprehensive tests (8-12 tests)
        ├── allTests.json             # File visibility config
        └── exportedContent.zip       # Packaged for upload
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Feedback & Support

- [DojoCode Platform](https://dojocode.io)
- [Documentation](https://docs.dojocode.io)
- [GitHub Issues](https://github.com/dojo-coder/challenge-creator/issues)
