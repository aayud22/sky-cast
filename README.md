# Weather App

A beautiful and responsive weather application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Current weather conditions
- Search by city name
- Automatic location detection
- Responsive design
- Beautiful UI with weather icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your OpenWeatherMap API key:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
sky-cast/
├── app/               # Next.js 14 app directory
├── components/        # Reusable UI components
├── config/           # Configuration files
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── models/           # TypeScript interfaces/types
├── public/           # Static assets
├── services/         # API services
├── store/            # State management
└── styles/           # Global styles
```

## Dependencies

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Framer Motion
- Zustand (for state management)
- Heroicons

## License

MIT
