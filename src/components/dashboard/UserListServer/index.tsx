// Importing the function to fetch users from the server
import { getUsers } from "@/lib/actions/userActions";
// Importing the UserListClient component
import UserListClient from "../UserListClient";

// The UserListServer function fetches the initial users and passes them to UserListClient
export default async function UserListServer() {
  // Fetching the initial users from the server
  const initialUsers = await getUsers();

  // Returning the UserListClient component with the initial users
  return <UserListClient initialUsers={initialUsers} />;
}
