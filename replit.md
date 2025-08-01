# Quiz Learning Platform

## Overview

This is a full-stack learning platform that transforms reading materials into interactive quiz experiences. The application allows users to upload documents (PDF, DOCX, TXT) which are parsed into quiz questions, and provides a comprehensive quiz-taking interface with progress tracking and results analysis. Built with React on the frontend and Express on the backend, it features a modern UI using shadcn/ui components and comprehensive quiz management capabilities.

### Current Content
- **"The First Minute" by Chris Fenning**: Features two practice quizzes:
  - "Framing: Setting the Stage" - 3 questions about setting context and expectations
  - "GPS Method: Goal, Path, Success" - 4 questions about the GPS communication framework
- Uses the actual book cover image provided by the user

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for home, quiz-taking, results, progress tracking, and admin
- **State Management**: TanStack Query (React Query) for server state management with custom query client
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and custom color scheme
- **Form Handling**: React Hook Form with Zod schema validation for type-safe forms

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with routes for resources, quizzes, and user progress
- **File Upload**: Multer middleware for handling document uploads with file type validation
- **Development**: Custom Vite integration for hot module replacement in development

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL via `@neondatabase/serverless`
- **Schema**: Shared schema definitions between client and server using Drizzle schema
- **Session Storage**: PostgreSQL-backed sessions using `connect-pg-simple`
- **Development Storage**: In-memory storage implementation for development/demo purposes

### Data Models
- **Resources**: Learning materials with metadata (title, description, cover images)
- **Quizzes**: Question sets linked to resources with JSONB storage for flexible question structures
- **User Progress**: Quiz completion tracking with scores, answers, and timestamps
- **Questions**: Complex objects with multiple choice options, correct answers, and explanations

### File Processing
- **Document Parsing**: Placeholder implementation for PDF, DOCX, and TXT file processing
- **File Validation**: Multer-based file type and size restrictions (10MB limit)
- **Question Extraction**: Framework for converting uploaded documents into structured quiz questions

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **Type Safety**: Strict TypeScript configuration with path mapping
- **Code Quality**: ESLint integration through Vite plugins
- **Development Server**: Express with Vite middleware integration for seamless development

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating component variants with Tailwind

### Data and Forms
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation library for type-safe data parsing
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect

### Database and Storage
- **Neon Database**: Serverless PostgreSQL database service
- **Drizzle Kit**: Database migration and schema management tools
- **PostgreSQL**: Primary database with session storage support

### File Processing
- **Multer**: Node.js middleware for handling multipart/form-data file uploads
- **File Type Support**: PDF, DOCX, and TXT document processing capabilities

### Development and Build
- **Vite**: Modern build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Custom plugins for Replit development environment