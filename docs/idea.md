
# 📦 WebLinter – Baseline-Aware Web Feature Linter

## 🔍 Overview

**WebLinter** is a CLI tool that helps developers identify the use of modern web features that are not yet considered safe or widely supported across modern browsers according to the [Web Platform Baseline](https://web.dev/compat-baseline/).

By analyzing project files (starting with CSS), WebLinter cross-references usage against the official [`web-features`](https://www.npmjs.com/package/web-features) dataset to detect non-baseline features and warn developers during development or CI/CD.

---

## 🎯 Goal

> To accelerate the safe adoption of modern web features by providing actionable feedback during development using reliable compatibility data.

WebLinter saves developers from manually checking browser support on caniuse.com, MDN, or blog posts. Instead, it integrates this awareness directly into their workflow.

---

## ⚙️ How It Works

1. **Reads a required config file** (`.weblinter`) with the list of:

   * File paths to scan (e.g., `src/`, `components/`)
   * Extensions to include (e.g., `css`, `html`)
   * Exclusions (e.g., `node_modules`, `*.json`)
2. **Finds matching files** using glob patterns
3. **Parses CSS files** using `postcss`
4. **Extracts CSS features** (e.g., properties like `backdrop-filter`)
5. **Matches features** against the [`web-features`](https://www.npmjs.com/package/web-features) dataset
6. **Warns** if any features are not part of the latest baseline

---

## 🧰 Tech Stack

| Technology     | Purpose                                 |
| -------------- | --------------------------------------- |
| `Node.js`      | Runtime for CLI tool                    |
| `postcss`      | Parses CSS and extracts properties      |
| `globby`       | Finds relevant project files            |
| `commander`    | CLI argument parsing                    |
| `chalk`        | Terminal output formatting              |
| `web-features` | Official baseline compatibility dataset |

---

## 📄 Configuration Example (`.weblinter`)

```json
{
  "paths": ["src", "components"],
  "extensions": ["css", "html"],
  "exclude": ["node_modules", "**/*.json", "dist"]
}
```

> 🔒 Configuration is **required**. If missing or invalid, WebLinter will exit with a helpful error message.

---

## 🚀 Example Usage

```bash
npx weblinter

🔍 Scanning 8 files...

❌ Non-baseline feature found:
  - Property: backdrop-filter
  - File: src/styles/hero.css:14
  - Baseline status: ❌ (added in Baseline May 2023)

✅ Scan complete. 1 non-baseline feature found.
```

---

## ✅ Current Scope (MVP)

* [x] CLI with required `.weblinter` config
* [x] CSS feature detection via `postcss`
* [x] Cross-referencing against `web-features` data
* [x] Clear, readable CLI output
* [x] File matching using paths, extensions, and exclusion rules

---

## 📈 Future Improvements

* [ ] JavaScript & HTML feature support
* [ ] TS/JSX parser using Babel/Acorn
* [ ] ESLint plugin version
* [ ] CI integration support
* [ ] Config file validation schema
* [ ] Web-based report output (optional)

---

## 🧠 Why It Matters

WebLinter reduces the friction in using modern web technologies by:

* Providing instant feedback about browser support risks
* Promoting safe usage of modern APIs
* Saving developer time and context switching

It enables teams to confidently adopt new features without fear of breaking compatibility — right from the command line.
