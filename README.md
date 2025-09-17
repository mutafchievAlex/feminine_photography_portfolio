# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🧪 Testing

Run the Vitest-powered unit tests locally with coverage enabled:

```bash
npm test -- --coverage
```

The Vitest configuration enforces minimum 70 % thresholds for statements, functions, and lines across the covered frontend directories so local runs match the CI gate. 【F:vite.config.mjs†L21-L40】

## ✅ Continuous Integration

Automated checks for the repository live in `.github/workflows/ci.yml` and run on every push or pull request to `main`.

### Frontend quality gates

- Installs dependencies with Node 20, reusing cached modules for faster builds. 【F:.github/workflows/ci.yml†L27-L46】
- Requires a `test` script in `package.json`, executes the Vitest suite with coverage enabled, and uploads the generated report artifact while enforcing ≥70 % line/function coverage on targeted frontend modules. 【F:.github/workflows/ci.yml†L48-L67】【F:vite.config.mjs†L5-L40】
- Builds the Vite bundle to ensure production assets remain healthy. 【F:.github/workflows/ci.yml†L57-L58】

### Backend quality gates

- Uses Temurin JDK 17 with Maven dependency caching, then runs `mvn clean verify`, which enforces a 70 % minimum line-coverage threshold via JaCoCo. 【F:.github/workflows/ci.yml†L78-L101】【F:api/pom.xml†L148-L224】
- Executes OWASP Dependency Check, Checkstyle, PMD, and SpotBugs as failing gates for security and static analysis regressions. 【F:.github/workflows/ci.yml†L102-L119】
- Uploads the Jacoco HTML and binary reports for reference in job artifacts. 【F:.github/workflows/ci.yml†L111-L118】

### Docker packaging

After the quality gates succeed, a final job builds the API Docker image and publishes it to GitHub Container Registry using metadata-driven tags (`latest` and the commit SHA). 【F:.github/workflows/ci.yml†L121-L168】

### Required GitHub secrets

Configure the following repository secrets before enabling the workflow:

| Secret | Description |
| --- | --- |
| `GHCR_USERNAME` | The GitHub username or organization that will own the published GHCR image. |
| `GHCR_TOKEN` | A Personal Access Token with `read:packages`, `write:packages`, and `delete:packages` scopes for pushing images to GHCR. |

The Docker job logs in with these secrets before pushing to `ghcr.io/<GHCR_USERNAME>/feminine-photography-portfolio`. 【F:.github/workflows/ci.yml†L135-L168】

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new
