# Osisi Frontend

This is the frontend repository for the **Osisi** project. It is built to provide a user-friendly interface for interacting with the Osisi platform.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- Responsive design for various devices.
- Seamless integration with the backend API.
- User authentication and authorization.
- Dynamic content rendering.

## Technologies Used
- **Framework**: Next.js
- **State Management**: Zustand
- **Styling**: CSS and Tailwind
- **Build Tool**: Webpack
- **Package Manager**: npm
- **Backend**: Convex
- **Canvas**: React flow
- **Authentication**: Auth0 (we are moving to better auth)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/osisi-dev/osisi-website.git
    ```
2. Navigate to the project directory:
    ```bash
    cd osisi
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

### Running the Application
To start the web development server:
```bash
npm run start
```
The application will be available at `http://localhost:3000`.

To start the convex development server:
```bash
npx convex dev --env-file .env.development
```
Note ask nwachukwu for the .env files

### Building for Production
To create a production build:
```bash
npm run build
```

## Folder Structure
```
osisi/
├── .vscode/
├── convex/
│   ├── _generated/
│   ├── authorization/
│   ├── collaborators/
│   ├── emails/
│   ├── families/
│   ├── familyContributions/
│   ├── familyMemberMatches/
│   ├── familyMembers/
│   ├── familyMemberships/
│   ├── familyRelationships/
│   ├── familyRequests/
│   ├── feedback/
│   ├── files/
│   ├── notifications/
│   ├── profiles/
│   ├── relationships/
│   ├── subscriptions/
│   ├── templates/
│   ├── users/
│   ├── utils/
│   ├── waitlist/
│   ├── auth.config.ts
│   ├── constants.ts
│   ├── convex.config.ts
│   ├── crons.ts
│   ├── http.ts
│   ├── migrations.ts
│   ├── rateLimiter.ts
│   ├── README.md
│   ├── schema.ts
│   ├── tables.ts
│   └── tsconfig.json
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── features/
│   ├── fullstack/
│   ├── hooks/
│   ├── lib/
│   ├── sketches/
│   ├── utils/
│   ├── middleware.ts
│   └── types.ts
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── vitest.config.mts
```

## Contributing
Contributions are welcome! Please follow these steps:
1. clone the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add feature-name"
    ```
4. Push to your branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.



