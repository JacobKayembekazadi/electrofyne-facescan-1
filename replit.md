# Electrofyne AI Skincare Analysis Platform

## Overview

Electrofyne is a modern full-stack web application that provides AI-powered skincare analysis and personalized recommendations. The platform uses advanced computer vision and machine learning technologies to analyze facial skin conditions and deliver tailored skincare advice through an intuitive user interface.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for development
- **Styling**: Tailwind CSS with Radix UI components for consistent design
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion and GSAP for smooth animations and transitions
- **UI Components**: ShadCN/UI component library built on Radix primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with memory store
- **API Structure**: RESTful endpoints for user management, analysis, and data retrieval

### AI/ML Integration
- **Face Detection**: TensorFlow.js with MediaPipe for real-time face analysis
- **Computer Vision**: Custom texture analysis and skin condition detection
- **3D Visualization**: Three.js with React Three Fiber for AR skin visualization

## Key Components

### Core Features
1. **AI Skin Analysis**: Real-time face scanning with detailed skin health metrics
2. **Personalized Recommendations**: Product suggestions based on analysis results
3. **Progress Tracking**: Timeline view of skin improvement over time
4. **Educational Content**: Interactive learning modules about skincare
5. **Gamification**: Achievement system with streaks and leaderboards

### User Interface Components
- **Mobile-First Design**: Responsive layout with bottom navigation for mobile
- **Camera Integration**: Advanced camera permissions handling and real-time video processing
- **Interactive Results**: Annotated skin analysis with hover/tap details
- **Chat Assistant**: AI-powered skincare advice chatbot
- **Social Sharing**: Privacy-focused sharing of anonymized results

### Data Visualization
- **Progress Charts**: Recharts integration for skin health metrics
- **Comparison Tools**: Before/after image slider with progress overlays
- **Interactive Maps**: Texture analysis visualization on face models

## Data Flow

### Analysis Pipeline
1. User captures or uploads facial image
2. TensorFlow.js processes image for face detection and landmarks
3. Custom algorithms analyze skin texture, hydration, and concerns
4. Results stored in database with user progress tracking
5. AI generates personalized product recommendations
6. User receives comprehensive analysis report

### User Journey
1. **Onboarding**: Interactive tutorial with feature highlights
2. **Skin Analysis**: Camera-based or upload analysis with real-time feedback
3. **Results Review**: Detailed breakdown with educational context
4. **Product Discovery**: Tailored recommendations with purchase options
5. **Progress Tracking**: Historical data and improvement visualization

## External Dependencies

### AI/ML Libraries
- TensorFlow.js for client-side machine learning
- MediaPipe for face detection and mesh generation
- Custom texture analysis algorithms

### UI/Animation Libraries
- Framer Motion for component animations
- GSAP for advanced timeline animations
- Lottie for complex animated graphics
- React Three Fiber for 3D visualizations

### Utility Libraries
- React Hook Form for form management
- Date-fns for date manipulation
- Recharts for data visualization

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for rapid development
- TypeScript checking with path aliases for clean imports
- PostCSS with Tailwind for optimized CSS processing

### Production Build
- Vite builds optimized frontend bundle
- esbuild compiles server code for Node.js
- Static assets served from dist/public directory
- Environment variables for database and API configuration

### Database Integration
- Drizzle ORM with PostgreSQL driver
- Schema-first approach with type-safe queries
- Migration system for database versioning
- Connection string configuration via environment variables

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 27, 2025. Initial setup