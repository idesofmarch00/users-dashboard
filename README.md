# Dashboard with CRUD Operations

This project is a dashboard application built with Next.js 14, featuring CRUD operations for user management. It utilizes modern web development technologies and best practices to create a robust and efficient user interface.

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- shadcn UI
- Tanstack Query
- Tanstack Table

## Features

- User management (CRUD operations)
- Server-side rendering and actions with Next.js 14
- Responsive design with Tailwind CSS
- Advanced table features with Tanstack Table
- Efficient data fetching and caching with Tanstack Query
- Form handling and validation

## Architecture and Design Decisions

1. **Separation of Concerns**: The project structure separates client-side and server-side code, with clear distinctions between components, server actions, and data management.

2. **Type Safety**: TypeScript is used throughout the project to ensure type safety and improve developer experience.

3. **Server Actions**: Next.js 14 server actions are utilized for handling data mutations, providing a seamless integration between client and server.

4. **Component-Based Architecture**: The UI is built using reusable components, promoting maintainability and consistency.

5. **State Management**: Tanstack Query is used for efficient state management and data synchronization.

6. **Styling**: Tailwind CSS and shadcn UI are employed for rapid UI development and consistent styling.

7. **Table Management**: Tanstack Table is used to create a powerful and flexible user list with advanced features like sorting, filtering, and pagination.

8. **Form Handling**: shadcn UI's form components are used in conjunction with Zod for robust form validation.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Folder Structure

- `app/`: Next.js app directory containing pages and API routes
- `components/`: Reusable React components
- `lib/`: Utility functions, types, and server actions
- `data/`: JSON data files (simulating a database)
- `styles/`: Global styles

## Future Improvements

- Implement authentication and authorization
- Add more advanced filtering and search capabilities
- Integrate with a real database
- Implement error boundary and improve error handling
- Add unit and integration tests