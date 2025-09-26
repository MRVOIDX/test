# Overview

This is a flashcard generation web application that transforms study notes into interactive flashcards using AI. The application features a medieval warrior theme with a character named "Osamah" acting as an AI study assistant. Users can input their study material and receive automatically generated flashcards using Google's Gemini AI model.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React + TypeScript**: Modern React application with full TypeScript support
- **Vite Build System**: Fast development server and optimized production builds
- **UI Components**: shadcn/ui component library with Radix UI primitives for consistent, accessible components
- **Styling**: Tailwind CSS with custom dark warrior theme featuring crimson and black color scheme
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth UI transitions and effects

## Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript support
- **Development Mode**: Vite middleware integration for hot reloading during development
- **Production Build**: esbuild bundling for optimized server-side code
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Request Logging**: Custom middleware for API request/response logging

## Data Storage Solutions
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **Schema Management**: Shared schema definitions between client and server using Zod validation
- **Development Storage**: In-memory storage implementation for development/testing
- **Migration System**: Drizzle-kit for database schema migrations

## Database Schema
- **Notes Table**: Stores user study notes with title, content, and timestamps
- **Flashcards Table**: Stores generated flashcards linked to notes with question/answer pairs and ordering

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Current State**: No authentication implemented (stateless operation)

## API Design
- **RESTful Endpoints**: Standard HTTP methods for CRUD operations
- **Validation**: Zod schemas for request/response validation
- **Error Responses**: Consistent JSON error format with descriptive messages
- **Development Logging**: Request/response logging for debugging

## AI Integration Architecture
- **AI Provider**: Google Gemini 2.5 Flash model via @google/genai
- **Flashcard Generation**: Structured prompts for consistent flashcard format
- **Response Validation**: JSON schema validation for AI responses
- **Batch Generation**: Support for generating multiple flashcards (default: 20 cards)
- **Incremental Generation**: Ability to generate additional flashcards avoiding duplicates

## Theme and Styling
- **Design System**: Dark warrior theme with medieval aesthetic
- **Typography**: Custom font stack with Cinzel and specialized fonts
- **Color Palette**: Deep blacks with crimson red accents
- **Visual Effects**: Glowing effects, gradients, and particle animations
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

# External Dependencies

## Core Framework Dependencies
- **React**: Frontend UI library with hooks and modern patterns
- **Express.js**: Backend web application framework
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the entire application

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Radix UI**: Primitive components for accessibility
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library for consistent iconography

## Database and ORM
- **Drizzle ORM**: Type-safe ORM for PostgreSQL
- **Neon Database**: Serverless PostgreSQL provider
- **PostgreSQL**: Primary database system

## AI and External Services
- **Google Gemini AI**: AI model for flashcard generation via @google/genai
- **Environment Variables**: GEMINI_API_KEY or GOOGLE_AI_API_KEY required

## Development and Build Tools
- **esbuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **Drizzle-kit**: Database migration and management tool

## Deployment Platform
- **Vercel**: Cloud platform for frontend deployment
- **API Routes**: Serverless functions for backend endpoints
- **Environment Configuration**: Production environment variables and build settings