# English Learning App

A streamlined, interactive application designed to help beginners master the fundamentals of American English. Built with **Astro**, this project focuses on delivering high-performance content for grammar acquisition and speaking practice.

## 🚀 Overview

The **English Learning App** provides a structured environment for users to learn basic grammar, improve pronunciation, and practice conversation. By leveraging **Astro's** static site generation capabilities alongside **React** for interactivity, the app ensures a fast and seamless learning experience.

## ✨ Key Features

-   **Grammar Usage**: Interactive modules covering essential grammar rules, including verbs, nouns, and sentence structure.
-   **Speaking Drills**: Audio-integrated exercises tailored to improve American English pronunciation.
-   **Roleplay Scenarios**: Immersive scenarios that allow users to practice conversational English in context.
-   **Shadowing Technique**: Specialized exercises to enhance intonation, rhythm, and speaking speed.
-   **Writing Practice**: Modules designed to reinforce grammar concepts through written exercises.
-   **Review System**: A dedicated section for revisiting and solidifying previously learned material.

## 🛠️ Technology Stack

This project allows for a modern, component-based development approach while maintaining optimal performance.

-   **Core Framework**: [Astro](https://astro.build) (v5) - For static site generation and content-focused architecture.
-   **Build Tool**: Vite - Fast build times and hot module replacement.
-   **UI Components**:
    -   **React** - For handling interactive elements and state management.
    -   **Tailwind CSS** (v4) - For utility-first, responsive styling.
    -   **Tabler Icons** - For consistent and clean visual iconography.
-   **Data Strategy**: Local JSON files are used to manage lesson content, ensuring simplicity and ease of maintenance without complex API dependencies.

## 📂 Project Structure

The project follows a standard Astro directory layout:

```text
/
├── public/       # Static assets (images, audio files)
├── src/
│   ├── components/ # Reusable UI components (buttons, cards)
│   ├── layouts/    # Page layouts (e.g., LessonLayout)
│   ├── pages/      # Application routes (grammar, speaking, visual logic)
│   ├── utils/      # Helper functions for logic and validation
│   └── assets/     # Source assets processed by Vite
└── package.json  # Project dependencies and scripts
```

### Core Routes (`src/pages`)
-   `/grammar`: Grammar lessons and exercises.
-   `/speaking`: Pronunciation drills.
-   `/roleplay`: Conversational scenarios.
-   `/shadowing`: Shadowing practice exercises.
-   `/writing`: Writing tasks.
-   `/review`: Review past lessons.

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
-   **Node.js**: Ensure you have a recent version of Node.js installed.
-   **npm**: The Node package manager.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd english-app
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Development

To start the local development server:

```bash
npm run dev
```
The application will be available at `http://localhost:4321`.

### Build for Production

To create a production-ready build:

```bash
npm run build
```
The output will be generated in the `dist/` directory.

### Preview

To preview the production build locally:

```bash
npm run preview
```

## 🗺️ Roadmap

-   [ ] **Progress Tracking**: Implement a system to save and track user progress.
-   [ ] **Expanded Content**: Add quizzes and advanced interactive lessons.
-   [ ] **Mobile Optimization**: Further refine responsive design for mobile devices.

---

*This project is designed for educational purposes, focusing on simplicity and effectiveness in language learning.*
