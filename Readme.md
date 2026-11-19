# Authorized Partner — Sign Up Application & Automated QA Suite

[![Playwright Tests](https://img.shields.io/badge/Playwright-Automated_QA-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A complete, production-ready **Next.js Sign Up Application** replicating the agency onboarding flow of [Authorized Partner](https://authorized-partner.vercel.app/), paired with a **Playwright End-to-End Automation Test Suite** that automates the entire multi-step registration flow without requiring any manual intervention.

---

## 📌 Project Overview

This repository satisfies two key requirements:
1. **Fully Automated QA Script**: An end-to-end automation script built with Playwright that handles all signup pages, accepts terms, fills out personal details, overcomes duplicate user constraints, completes OTP verification, and verifies final submission.
2. **GitHub-Ready Sign Up Application**: A modern, responsive web application containing the exact multi-step registration flow, terms agreement, real-time validation, and mobile OTP screens.

---

## 🚀 Key Features

* **Zero-Intervention Signup Automation**: Automates the complete signup flow from start to finish without pausing for user input.
* **Dynamic Data Generation**: Automatically generates unique email addresses and 10-digit mobile phone numbers with timestamps to avoid `"User with this mobile number already exists!"` or duplicate email conflicts.
* **Multi-Step Form Architecture**:
  * **Step 0 — Terms & Agreement**: Terms of service & privacy policy acceptance checkbox.
  * **Step 1 — Account Setup**: Personal details (First Name, Last Name, Email, Country Code combobox, Phone Number with live async validation, Password, Confirm Password, Show/Hide password toggles).
  * **Step 2 — Email Verification**: 6-digit numeric OTP verification modal with resend countdown timer.
  * **Step 3 — Agency Details**: Agency name, business registration number, website, and operating location.
  * **Step 4 — Success Confirmation**: Post-onboarding confirmation and navigation back to the portal login.
* **Production Validation**: Built using [Zod](https://zod.dev/) and [React Hook Form](https://react-hook-form.com/) with field-level error messages.

---

## 📁 Repository Structure

```text
authorized-partner-signup/
├── app/
│   ├── globals.css                # Tailwind CSS global styles
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Landing page linking to registration
│   ├── register/
│   │   └── page.tsx               # Multi-step signup page (Terms, Setup, OTP, Agency)
│   ├── login/
│   │   └── page.tsx               # Agency login page
│   ├── terms-and-conditions/
│   │   └── page.tsx               # Terms of Service page
│   └── privacy-policy/
│       └── page.tsx               # Privacy Policy page
├── tests/
│   └── signup-automation.spec.ts  # End-to-end Playwright automation script
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI/CD workflow
├── playwright.config.ts           # Playwright test configuration
├── tailwind.config.ts             # Tailwind CSS theme configuration
├── postcss.config.mjs             # PostCSS configuration
├── next.config.mjs                # Next.js configuration
├── tsconfig.json                  # TypeScript compiler options
├── package.json                   # Project scripts and dependencies
└── README.md                      # Documentation & instructions
```

---

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
* `npm` (comes with Node.js) or `pnpm` / `yarn`
* [Git](https://git-scm.com/)

---

## 🧪 Running the Automated QA Script

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install chromium
```

### 3. Run the Automated Signup Test
By default, the script targets the live site (`https://authorized-partner.vercel.app`):

```bash
# Run tests headlessly in terminal
npm test

# Run tests in headed mode (watches Chromium open and fill out the forms automatically)
npm run test:headed

# Run tests using the interactive Playwright UI Runner
npm run test:ui
```

### 4. View Test Reports
```bash
npm run test:report
```

### 5. Running Against a Local Server
To run the automated script against your local Next.js server instead of production:
```bash
# In Terminal 1 (Start Next.js):
npm run dev

# In Terminal 2 (Run test against localhost):
BASE_URL=http://localhost:3000 npm test
```

---

## 💻 Running the Next.js Sign Up App Locally

To start the local development server:

```bash
npm run dev
```

Open your browser and navigate to:
* **Landing Page**: [http://localhost:3000](http://localhost:3000)
* **Sign Up Page**: [http://localhost:3000/register](http://localhost:3000/register)
* **Login Page**: [http://localhost:3000/login](http://localhost:3000/login)

To create a production build:
```bash
npm run build
npm start
```

---

## 📤 Step-by-Step Guide to Publish to GitHub

Follow these steps to publish this repository to your personal or organization GitHub account:

### Step 1: Create a New Repository on GitHub
1. Go to [GitHub](https://github.com) and log in.
2. Click the **+** icon in the top right corner and select **New repository**.
3. Name your repository (e.g., `authorized-partner-signup` or `qa-signup-automation`).
4. Keep it **Public** (or **Private**) and **DO NOT** initialize with a README, .gitignore, or license (these are already included).
5. Click **Create repository**.

### Step 2: Push Your Local Code to GitHub
Open your terminal inside the project directory:

```bash
# 1. Initialize git
git init

# 2. Stage all project files
git add .

# 3. Create initial commit
git commit -m "feat: complete signup application and automated QA test suite"

# 4. Set branch name to main
git branch -M main

# 5. Connect to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🤖 Continuous Integration (CI) with GitHub Actions

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/playwright.yml`. Whenever you push code or open a pull request, GitHub Actions will automatically install dependencies, launch a headless browser, execute the signup automation test suite, and upload the test report as an artifact.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
