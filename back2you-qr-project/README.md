# Back2You QR Project

## Overview
The Back2You QR Project is a web application designed to help users recover lost items using QR codes. The application allows users to scan QR codes associated with their items, check the activation status of the tags, and activate them if necessary.

## Features
- **QR Code Scanning**: Users can scan QR codes to retrieve information about their lost items.
- **Tag Activation**: Users can activate their tags if they are not already activated.
- **User Authentication**: Users must sign in to activate their tags if they are not activated.
- **Responsive Design**: The application is designed to be fully responsive, providing a seamless experience across devices.

## Project Structure
```
back2you-qr-project
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   ├── components
│   │   ├── Navbar.tsx
│   │   ├── QRScanner.tsx
│   │   └── TagDetails.tsx
│   ├── return
│   │   └── [tag_number]
│   │       └── page.tsx
│   ├── activate
│   │   └── page.tsx
│   ├── auth
│   │   └── signin
│   │       └── page.tsx
│   └── api
│       ├── qr
│       │   └── route.ts
│       └── tags
│           ├── route.ts
│           └── [tag_number]
│               └── route.ts
├── lib
│   ├── db.ts
│   └── tags.ts
├── prisma
│   └── schema.prisma
├── package.json
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/back2you-qr-project.git
   ```
2. Navigate to the project directory:
   ```
   cd back2you-qr-project
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the development server:
   ```
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:3000` to view the application.

## API Endpoints
- **Generate QR Code**: `POST /api/qr`
- **Manage Tags**: `GET /api/tags`, `POST /api/tags`
- **Tag Details**: `GET /api/tags/[tag_number]`

## Database Schema
The database schema is defined using Prisma in the `prisma/schema.prisma` file. It includes models for QR codes and tags.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.