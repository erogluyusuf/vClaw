# vClaw: Advanced Code Scope Intelligence & Selection Tool

![Project Status](https://img.shields.io/badge/Status-Stable-success)
![Platform](https://img.shields.io/badge/Platform-Visual%20Studio%20Code-blue)
![License](https://img.shields.io/badge/License-MIT-purple)

**vClaw** is a high-performance Visual Studio Code extension designed to master code navigation through structural intelligence. By using advanced indentation analysis and scope detection, it allows developers to "grab" and visualize complex code blocks instantly, increasing refactoring speed and structural awareness.

---

##  Features

###  Structural "Pincer" Selection (Context-Aware)
vClaw doesn't just select text; it understands the hierarchy of your source code:

- **Multi-Language Intelligence:** Seamlessly analyzes indentation for Python/YAML and bracket-depth for C-style languages (JS, TS, C++, Java).
- **Visual Feedback:** Uses non-intrusive, high-visibility decorations to highlight the "captured" scope without losing your cursor position.
- **Root-Level Detection:** Automatically identifies the global boundaries (HTML tags, Class definitions) to grasp the entire architectural unit.

### 🛡 Hybrid Logic Engine
Designed to handle everything from simple scripts to massive enterprise files:

- **Indent-Based Logic:** Perfect for clean-up in YAML, Python, and Slim files where braces are absent.
- **Bracket-Aware Parsing:** Precision-tracking for curly braces `{}` to ensure no logic is left behind.
- **Empty Line Handling:** Intelligently skips whitespace while maintaining the integrity of the selection.

---

##  Usage Scenarios

1. **Snap (Inner Scope) - `Alt + X`**
   Instantly captures the immediate logic block or the current line. Think of it as opening a single drawer in a cabinet.

2. **Grip (Parent Scope) - `Alt + C`**
   Expands the "claw" to the containing function or parent block. Selecting the entire room instead of just a drawer.

3. **Clench (Global Root) - `Alt + V`**
   Grasps the ultimate parent structure (e.g., the entire `<html>` tag or `class` body). Capturing the whole building in one click.

4. **Release (Clear) - `Alt + B`**
   Instantly clears all active highlights and resets the pincer.

---

##  Installation

###  Quick Install (VSIX)
1. Download the `vclaw-0.1.0.vsix` file from the [releases](https://github.com/erogluyusuf/vClaw/releases) section.
2. Open VS Code and go to the Extensions view (`Ctrl+Shift+X`).
3. Click the **"..."** (three dots) in the top right corner.
4. Select **Install from VSIX...** and choose the downloaded file.

### Build from Source
```bash
git clone [https://github.com/erogluyusuf/vClaw.git](https://github.com/erogluyusuf/vClaw.git)
cd vClaw
npm install
npm run compile
```
##  Configuration
vClaw can be integrated into your existing workflow:

| Feature | Trigger | Description |
|:---|:---|:---|
| **Snap** | Context Menu / Keybind | Captures Inner Scope |
| **Grip** | Context Menu / Keybind | Captures Parent Scope |
| **Clench** | Context Menu / Keybind | Captures Root Scope |
| **Release** | Context Menu / Keybind | Clears active decorations |

---

##  Contribution
Pull requests are welcome. For major changes, please open an **issue** first to discuss what you plan to modify. 

Help us make code navigation even more intuitive!

##  License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Maintained by:** Yusuf Eroğlu  
_Code hierarchy, captured._