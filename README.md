# ApniLab — School Science Virtual Labs 🔬⚛️📐

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2058-blue.svg?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB.svg?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Expo Router](https://img.shields.io/badge/Expo%20Router-v58-purple.svg)](https://docs.expo.dev/router/introduction/)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80-emerald.svg)](https://github.com/SaranshPatidar03/ApniLab)

**ApniLab** is an interactive, school-science virtual laboratory mobile application built with **React Native**, **Expo Router**, and **TypeScript**. Designed for secondary and higher secondary curriculums, ApniLab empowers students to conduct hands-on experiments, observe real-time calculations, record findings, and test their understanding through quizzes — all in **English** and **हिन्दी (Hindi)**.

---

## 📱 Live Preview & Quick Start

You can preview ApniLab instantly on your physical device or web browser using Expo:

### 1. Run in Expo Go (Mobile Preview)

1. Install **Expo Go** from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [Apple App Store](https://apps.apple.com/app/expo-go/id982107779).
2. Clone and run the project:
   ```bash
   git clone https://github.com/SaranshPatidar03/ApniLab.git
   cd ApniLab
   npm install
   npx expo start
   ```
3. Scan the terminal's **QR code** using:
   - **Android**: Expo Go app camera scanner.
   - **iOS**: Default Camera app.

### 2. Run in Web Browser
```bash
npx expo start --web
```

---

## ✨ Key Features

### ⚡ Interactive Lab Simulators
- **Ohm's Law Simulator (`/lab/ohms-law`)**:
  - Real-time circuit schematic with interactive SVG rendering.
  - Interactive voltage ($V$) and resistance ($R$) sliders.
  - Live calculations ($I = V / R$) with animated ammeter needle deflection.
  - Observation logging table for data recording and analysis.
- **8-Bit Binary Converter (`/lab/binary-converter`)**:
  - Interactive switchboard with 8 toggleable bits ($2^7$ to $2^0$).
  - Step-by-step successive division by 2 table with remainder tracing.
  - Live conversions across Decimal, Binary, Hexadecimal, and Octal formats.
  - Built-in binary challenge game mode.
- **Curriculum-Aligned Practical Labs (`/lab/[id]`)**:
  - Subject coverage spanning **Physics**, **Chemistry**, **Biology**, and **Mathematics**.
  - Interactive apparatus checklist with completion indicators.
  - Step-by-step procedures, observation entries, and conclusion summaries.

### 🤖 ApniLab Assistant (Bilingual Help Chatbot)
- Floating assistant button on **Home**, **Explore**, **My Learning**, and **Profile** screens.
- Completely local, zero-latency FAQ knowledge engine (no external API keys or paid backend needed).
- Intelligent keyword matching and suggested quick-reply chips.
- Direct quick-navigation shortcuts to launch corresponding virtual experiments.
- Full bilingual English and Hindi response matching.

### 📝 Experiment Knowledge Checks
- In-experiment multi-choice quizzes for instant student assessment.
- Immediate feedback with scientific explanations for each choice.
- Score tracking and celebratory completion screens.

### 🌐 Bilingual & Accessibility First
- Instant language toggle between **English** and **हिन्दी** across the entire UI.
- Custom typography pairing: **Inter** (Latin) and **Noto Sans Devanagari** (Hindi).
- Full **Light** and **Dark** theme modes with WCAG-compliant contrast ratios.
- Guest and offline student modes — works seamlessly without internet connectivity.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Expo SDK 58](https://expo.dev) (Continuous Native Generation)
- **Runtime**: [React Native 0.88](https://reactnative.dev) with React 19
- **Navigation**: [Expo Router v58](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Vector Graphics**: `react-native-svg` (Circuit diagrams, meters, and icons)
- **Storage**: `@react-native-async-storage/async-storage` (Local state & progress persistence)
- **Styling & Theming**: Context-driven dynamic tokens (`ThemeContext`, `LanguageContext`)
- **Code Quality**: ESLint 9 + TypeScript strict mode (0 warnings, 0 errors)

---

## 📂 Project Structure

```text
ApniLab/
├── app/                        # Expo Router file-based screens
│   ├── (auth)/                 # Welcome, login, and registration screens
│   ├── (tabs)/                 # Bottom tab navigation
│   │   ├── index.tsx           # Home dashboard (Hero simulator, discipline grid, progress)
│   │   ├── explore.tsx         # Experiment discovery & category filters
│   │   ├── learning.tsx        # Student progress, completed labs & certifications
│   │   └── profile.tsx         # User profile, theme & language settings
│   └── lab/                    # Virtual experiment simulators
│       ├── ohms-law.tsx        # Ohm's Law interactive circuit lab
│       ├── binary-converter.tsx# 8-bit digital logic & number systems lab
│       └── [id].tsx            # Dynamic curriculum practical lab
├── assets/                     # Images, icons, and static assets
├── constants/                  # Color palettes, typography & theme tokens
└── src/
    ├── components/             # Reusable UI widgets
    │   ├── AppIcon.tsx         # Clean custom SVG iconography
    │   ├── ChatbotFab.tsx      # Floating Assistant trigger
    │   ├── ChatbotModal.tsx    # Bilingual FAQ chat interface
    │   ├── DisciplineCard.tsx  # 2x2 school subject cards
    │   ├── ExperimentKnowledgeCheck.tsx # In-lab interactive quizzes
    │   └── FeaturedSimulatorHero.tsx    # Home screen hero showcase
    ├── context/                # Auth, Theme, and Language providers
    ├── data/                   # Mock labs, curriculum catalog & chatbot FAQ
    ├── i18n/                   # English & Hindi translation dictionaries
    └── types/                  # TypeScript data interfaces
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- npm, yarn, or bun
- Mobile device with **Expo Go** app installed

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SaranshPatidar03/ApniLab.git
   cd ApniLab
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Verify Type-Safety & Code Quality**:
   ```bash
   npx tsc --noEmit
   npx expo lint
   ```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

