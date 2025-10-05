# WebLinter – Baseline-Aware Feature Checker

**WebLinter** is a CLI tool that helps developers detect the use of web features (like CSS properties or HTML elements) that **aren’t yet part of the [Web Platform Baseline](https://developer.chrome.com/blog/web-platform-baseline/)** — helping ensure broader browser compatibility and fewer surprises in production.

## 🌐 Why WebLinter?

In the fast-moving world of frontend development, it's easy to use features that are *technically standardized* but still *not universally supported*.

The **Web Platform Baseline** defines the set of features that are reliably available across all modern browsers — without requiring polyfills or fallback logic.

### ❗ The Problem

You add a shiny new CSS feature like `backdrop-filter`, it works on your machine, and looks great. But your users on other browsers? Blank screens. Broken layouts. Confusion.

### ✅ The Solution

**WebLinter** scans your codebase, detects features not yet in the Baseline, and alerts you — early. No surprises. No regressions.

It’s powered by [web-features](https://github.com/web-platform-dx/web-features), the same dataset used by MDN and Chrome DevRel.

## 🔍 Features

* **Baseline-Aware Detection**
  Flags usage of CSS and HTML features that are not in the Baseline.

* **CSS & HTML Analysis**
  Uses **PostCSS** and **Parse5** to deeply parse files for accurate results.

* **Smart File Scanning**
  Supports custom `paths`, `extensions`, and `exclude` patterns for precise scanning.

* **Caching System**
  Feature usage data is cached locally, improving performance for repeated runs. Configurable via `cacheDays`.

* **Helpful Warnings**
  CLI output includes **line numbers**, **context**, and **baseline status** — with both warnings and errors.

## ⚙️ Configuration

Create a `.weblinterrc` file in your project root:

```json
{
  "paths": ["src", "components"],
  "extensions": ["css", "html"],
  "exclude": ["node_modules", "**/*.json", "dist"],
  "cacheDays": 10
}
```

> `cacheDays`: Number of days to cache parsed files to speed up repeat runs.

## 🚀 Installation

Install globally:

```bash
npm install -g weblinter
```

Or use directly with `npx`:

```bash
npx weblinter
```

## 🧪 Example Output

```bash
❌ Non-baseline feature found:

→ /example/style.css
  Warnings (low baseline):
    ⚠ css.properties.backdrop-filter
  Errors (non-baseline):
    ✖ css.properties.interpolate-size
    ✖ css.properties.overlay
    ✖ css.properties.reading-flow
```

> Each result is tied to real feature identifiers from the `web-features` dataset — the same canonical source used by Chrome and MDN.

## 🧱 How It Works

| Component        | Role                                       |
| ---------------- | ------------------------------------------ |
| `web-features`   | Official dataset of web platform features  |
| `PostCSS`        | Parses CSS to find feature usage           |
| `Parse5`         | Parses HTML and extracts relevant features |
| `Globby`         | Efficient file searching via glob patterns |
| `Commander.js`   | CLI argument parsing and interface         |
| `Chalk`          | Styled terminal output                     |
| **Custom Cache** | Stores analysis results for performance    |

## 🚧 Roadmap / Future Improvements

* JS/TS support (via Babel parsing)
* Framework-aware detection (React, Vue, Svelte, etc.)
* Plugin support (Webpack, Vite, etc.)
* VS Code extension for real-time linting

## 🤝 Contributing

Contributions are welcome — especially during the Chrome Hackathon!

* Open an issue
* Suggest a feature
* Submit a pull request

Let’s make the web baseline-friendly together.

## 📄 License

MIT License — see [`LICENSE`](./LICENSE) for details.

## ❤️ Made for the Chrome Hackathon

WebLinter was built to promote a more resilient and accessible web by helping developers respect the boundaries of today’s browser capabilities. By sticking to the Web Platform Baseline, your projects remain **stable**, **inclusive**, and **future-friendly** — for everyone, everywhere.
