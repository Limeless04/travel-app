# Travel App

A modern travel application built with React, TypeScript, and Vite. This application provides a platform for users to explore travel destinations, plan trips, and share their travel experiences.

## Features

- Modern, responsive UI built with React and Tailwind CSS
- Type-safe development with TypeScript
- Fast development and build times with Vite
- State management with Zustand
- Form validation with Zod
- API integration with Axios
- Beautiful icons with React Icons
- Client-side routing with React Router

## Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Validation**: Zod
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd travel-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

5. Preview production build
```bash
npm run preview
```

## Development

The project uses ESLint for code linting. The configuration can be found in `eslint.config.js`.

### TypeScript Configuration

The project uses multiple TypeScript configurations:
- `tsconfig.json`: Base configuration
- `tsconfig.app.json`: Application-specific configuration
- `tsconfig.node.json`: Node.js specific configuration

### Project Structure

```
travel-app/
├── src/
│   ├── assets/        # Static assets
│   ├── components/    # Reusable components
│   ├── lib/          # Utility functions and helpers
│   ├── pages/        # Page components
│   ├── routes/       # Route definitions
│   ├── store/        # State management
│   ├── App.tsx       # Root component
│   └── main.tsx      # Application entry point
├── public/           # Public assets
└── ...config files
```

## Docker Support

The application includes Docker configuration for containerization. To build and run the Docker container:

```bash
docker build -t travel-app .
docker run -p 80:80 travel-app
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
