# 🎭 SwiftAssess Playwright Automation

Automated **end-to-end UI testing** for the [SwiftAssess](https://app.swiftassess.com/) platform built with **Playwright + TypeScript**.  
This suite validates the **Sign-Up workflow** under different user scenarios, including both **Happy Path** (successful registration) and **Duplicate Account** (validation error handling).

---

## 🚀 Key Features
- ✅ **Playwright + TypeScript** end-to-end automation framework  
- 🔄 **Dynamic test data generation** (unique email, account name, and organization per run)  
- 💥 **Cross-browser testing**: Chromium, Firefox, and Edge  
- 📸 **Automatic screenshot capture** for success and failure states  
- 🧾 **HTML & list reporters** for test results  
- ☁️ **Azure Pipeline integration** (CI/CD)  
- 🧠 **Page Object Model (POM)** for modularity and scalability  
- ⚙️ **Environment-driven configuration** via `.env`  
- 🧍 Two main automated test cases:
  1. **Happy Path** — Verifies user can sign up successfully and sees confirmation message.
  2. **Duplicate Account Test** — Re-uses same input data to ensure duplicate email error appears.

---

## 🧩 Project Structure

├── pages/ # Page Object Model (SignupPage.ts)
├── tests/ # Test specs (signup.spec.ts)
├── utils/ # Helper utilities (helpers.ts, testData.ts)
├── test-results/ # Execution results and screenshots
├── playwright-report/ # HTML reports
├── azure-pipelines.yml # CI/CD pipeline configuration
├── playwright.config.ts # Playwright global configuration
├── package.json # Project dependencies and scripts
├── .env # Environment variables (e.g., BASE_URL)
└── README.md # Project documentation

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ansjamil/swiftassess-playwright-tests.git
cd swiftassess-playwright-tests

2. Install Dependencies
npm install

3. Configure Environment

Create a .env file and specify:
BASE_URL_STG=https://app-stg.swiftassess.com
BASE_URL_PROD=https://app.swiftassess.com
STAGE=stg
HEADLESS=0

Running the Tests
▶️ Run Happy Path Test
$env:HEADLESS='0'; $env:SLOWMO='300'; npx playwright test -g "Happy path" --project=chromium --workers=1
This launches a headed browser, fills the sign-up form with new random data,
and asserts the success message:

“An email confirmation has been sent to your address.”
Run Duplicate Account Validation Test
npx playwright test -g "Duplicate check" --project=chromium --workers=1
This re-runs the sign-up with identical credentials and asserts that a duplicate email warning appears:

“There is an account registered with this email previously. Try with another email.”
🌍 Run All Tests (Cross-Browser)
npx playwright test --project=all

Runs both tests sequentially across Chromium, Firefox, and Edge.

Continuous Integration (Azure Pipelines)

This project is integrated with Azure DevOps for automated CI/CD.
Each push to the main branch triggers:

Dependency installation (npm ci)

Browser setup (npx playwright install --with-deps)

Test execution

Report and screenshot generation for failed runs

azure-pipelines.yml

trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Use Node.js 18'

  - script: |
      npm ci
      npx playwright install --with-deps
    displayName: 'Install dependencies and browsers'

  - script: |
      npm run test:ci
    displayName: 'Run Playwright tests'

    📸 Screenshots
✅ Happy Path – Successful Sign-Up

User sees success confirmation after registration.


⚠️ Duplicate Account – Validation Message

User re-submits same email, and duplicate warning toast appears.


🧩 Dynamic Data Generation

The tests automatically create unique accounts and emails per run:

export const uniqueEmail = (domain = 'gmail.com') => {
  const firstNames = ['alex', 'jamie', 'liam', 'sofia', 'noah', 'mia'];
  const lastNames = ['smith', 'jones', 'brown', 'lee'];
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]}.${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  return `${name}${Math.floor(Math.random() * 1000)}@${domain}`;
};

🧾 Reports

After every execution, Playwright automatically generates:

HTML report: playwright-report/index.html

JSON summary: test-results/.last-run.json

Screenshots: stored in test-results/

To open the report manually:

npx playwright show-report

💡 Key Assertions

await expect(successToast).toHaveText("An email confirmation has been sent...")

await expect(duplicateToast).toHaveText("There is an account registered...")

👨‍💻 Author

Ans Jamil
Senior QA Automation Engineer 

🏁 Summary

This project demonstrates a complete Playwright automation lifecycle:

From test design and cross-browser validation

To CI/CD integration and dynamic data generation

With clear pass/fail visual reporting for both happy and edge-case flows
