# Dashboard with CRUD Operations for User Management

This project is a dashboard application built with Next.js 14, featuring CRUD operations for user management. It utilizes modern web development technologies and best practices to create a robust and efficient user interface. The project is designed to meet the requirements outlined in the task description for the Senior Frontend Engineer position at Simply Jet.

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- ShadCN UI
- Tanstack Query
- Tanstack Table
- React Hook Form
- Zod

## Features

- User management (CRUD operations)
- Server-side rendering and actions with Next.js 14
- Responsive design with Tailwind CSS
- Advanced table features with Tanstack Table
- Efficient data fetching and caching with Tanstack Query
- Form handling with React Hook Form
- Validation with Zod

## Architecture and Design Decisions

1. **Separation of Concerns**: The project structure separates client-side and server-side code, with clear distinctions between components, server actions, and data management.
2. **Type Safety**: TypeScript is used throughout the project to ensure type safety and improve developer experience.
3. **Server Actions**: Next.js 14 server actions are utilized for handling data mutations, providing a seamless integration between client and server.
4. **Component-Based Architecture**: The UI is built using reusable components, promoting maintainability and consistency.
5. **State Management**: Tanstack Query is used for efficient state management and data synchronization.
6. **Styling**: Tailwind CSS and ShadCN UI are employed for rapid UI development and consistent styling.
7. **Table Management**: Tanstack Table is used to create a powerful and flexible user list with advanced features like sorting, filtering, and pagination.
8. **Form Handling**: React Hook Form is used for managing form state efficiently.
9. **Validation**: Zod is used for schema validation to ensure data integrity.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Folder Structure

- `app/`: Next.js app directory containing pages and API routes
- `components/`: Reusable React components
- `lib/`: Utility functions, types, and server actions
- `data/`: JSON data files (simulating a database)
- `styles/`: Global styles

## User Management Features

- **List Users**: Displays a list of users with columns for first name, last name, email, alternate email, hashed password, and age.
- **Add User**: Form to add a new user, with validation to ensure age is greater than 18.
- **Edit User**: Form to edit existing user details.
- **Delete User**: Option to delete a user.
- **Search and Filter**: Search users by name and filter by age.
- **Pagination**: Navigate through user list pages.
- **Multi-Select**: Select multiple users for batch deletion.

## Data Management

- **Tanstack Query**: Used for data fetching, caching, and synchronization.
- **Tanstack Table**: Used for displaying and managing user data with advanced table features.

## Live Demo

Check out the live demo of the application [here](https://users-dashboard-delta.vercel.app/dashboard).

## Video Demo (Optional)

A video demo of the application is available [here](https://drive.google.com/file/d/143ouUdUJvqohWfPIpClOhT5AZztiA1Fq/view?usp=drive_link).

## Future Improvements

- Implement authentication and authorization
- Add more advanced filtering and search capabilities
- Integrate with a real database
- Implement error boundary and improve error handling
- Add unit and integration tests
