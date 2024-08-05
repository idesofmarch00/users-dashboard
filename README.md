# Dashboard with CRUD Operations for User Management

This project is a dashboard application built with Next.js 14, featuring CRUD operations for user management. It utilizes modern web development technologies and best practices to create a robust and efficient user interface. The project is designed to meet the requirements outlined in the task description for the Senior Frontend Engineer position at Simply Jet.

## Live Demo

Check out the live demo of the application [here](https://users-dashboard-delta.vercel.app/dashboard).

## Video Demo (Optional)

A video demo of the application is available [here](https://drive.google.com/file/d/143ouUdUJvqohWfPIpClOhT5AZztiA1Fq/view?usp=drive_link).

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


## User Management Features

- **List Users**: Displays a list of users with columns for first name, last name, email, alternate email, hashed password, and age.
- **Add User**: Form to add a new user, with validation to ensure age is greater than 18.
- **Edit User**: Form to edit existing user details.
- **Delete User**: Option to delete a user.
- **Search and Filter**: Search users by name and filter by age.
- **Pagination**: Navigate through user list pages.
- **Multi-Select**: Select multiple users for batch deletion.


## Architecture and Design Decisions / though process behind implementation

Chose Next.js 14 as the framework for its server-side rendering capabilities and built-in API routes.
Set up TypeScript for type safety and improved developer experience.
Configured Tailwind CSS for rapid and consistent styling (as seen in tailwind.config.ts).

Architecture Design:
Adopted a component-based architecture for reusability and maintainability.
Separated concerns by organizing code into distinct directories (app/, components/, lib/).
Implemented server-side rendering and server actions using Next.js 14 features.

Data Management:
Simulated a database using JSON files (stored in the data/ directory) for simplicity in development.
Implemented CRUD operations in server-side functions (as seen in the userActions.ts file).
Used bcrypt for password hashing to ensure security (visible in the createUser and updateUser functions).

State Management and Data Fetching:
Integrated Tanstack Query for efficient data fetching and caching (setup visible in providers.tsx).
Implemented custom hooks or server actions for data operations.

User Interface:
Created reusable UI components using React and ShadCN UI (example seen in popover.tsx).
Implemented a responsive design using Tailwind CSS classes.
Developed a dashboard layout with navigation and user list components.

Form Handling and Validation:
Utilized React Hook Form for efficient form state management.
Implemented Zod for schema validation (as seen in userSchema.ts).

Table Management:
Integrated Tanstack Table for advanced table features like sorting, filtering, and pagination.

Performance Optimization:
Utilized Next.js's built-in code splitting and dynamic imports.
Implemented suspense boundaries for better loading states (seen in DashboardPage component).

Development Experience:
Set up ESLint for code quality (visible in .eslintrc.json).
Configured the project for optimal TypeScript usage (tsconfig.json).

Deployment:
Prepared the application for deployment, likely using Vercel (as evidenced by the live demo link).

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

## Future Improvements

- Implement authentication and authorization
- Add more advanced filtering and search capabilities
- Integrate with a real database
- Implement error boundary and improve error handling
- Add unit and integration tests
