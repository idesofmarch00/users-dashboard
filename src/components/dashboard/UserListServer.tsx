// app/dashboard/UserListServer.tsx
import { getUsers } from "@/lib/actions/userActions";
import UserListClient from "./UserListClient";

export default async function UserListServer() {
  const initialUsers = await getUsers();

  return <UserListClient initialUsers={initialUsers} />;
}
