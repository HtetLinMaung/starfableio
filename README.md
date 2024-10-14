# 🌟 StarfableIO

**StarfableIO** is a blog and tutorial website built with [Astro.js](https://astro.build/), designed to provide engaging, educational content with speed and simplicity.

## ✨ Features

- ⚡ **Astro.js** for fast and modern web development
- 🧪 **Cypress** for end-to-end testing
- 🚀 **Terraform** for infrastructure as code, deploying to AWS

## 🛠️ Getting Started

### Prerequisites

Make sure you have the following installed:

- 🟢 **Node.js** (v20.17.0+)
- 🟠 **npm** (v10.8.2+)
- 🌍 **Terraform** (v1.9.7+)
- 🦀 **rustc** (v1.80.0+)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/HtetLinMaung/starfableio.git
cd starfableio
npm install
```

## 🚧 Running in Development

To start the project in development mode:

```bash
npm run dev
```

This command launches a local development server and watches for file changes. ✨ Hot reload for the win!

## 🏗️ Building for Production

To build the project for deployment:

```bash
npm run build
```

This will create an optimized build of Astro.js website, ready for deployment.

## 🧪 End-to-End Testing

To run Cypress tests:

### For interactive mode:

```bash
npm run cy:open
```

This will open the Cypress test runner for running end-to-end tests interactively. You can add new tests under the cypress/e2e folder.

### For headless mode:

```bash
npm run cy:run
```

This will run Cypress tests in headless mode, which is useful for continuous integration (CI) or automated testing pipelines.

### 💡 Example simple test (TypeScript):

```ts
describe("Homepage Test", () => {
  it("should visit the homepage", () => {
    cy.visit("/");
    cy.contains("Welcome to StarfableIO");
  });
});
```

You can use cy:run for faster, non-interactive test execution, and cy:open when debugging or developing tests interactively.

## 🌍 Deploying with Terraform

After building the project, you can deploy it to AWS using Terraform:

1. Navigate to the infrastructure folder:

   ```bash
   cd infrastructure
   ```

2. Initialize Terraform (only needed the first time or when updating providers/backends):

   ```bash
   terraform init
   ```

3. Apply the Terraform plan to deploy:

   ```bash
   terraform apply
   ```

⚠️ Make sure your AWS credentials are properly configured!

## 📁 Folder Structure

- src/ - Source code for the Astro.js project
- public/ - Static assets
- cypress/ - End-to-end tests
- infrastructure/ - Terraform scripts for deployment

## 🤝 Contributing

We welcome contributions! Feel free to submit issues, suggestions, or pull requests to help improve StarfableIO. 🙌
