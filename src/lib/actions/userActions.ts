"use server";
import bcrypt from "bcrypt";
import { UserFormData } from "@/lib/schemas/userSchema";
// Importing necessary modules for file operations and path manipulation
import fs from "fs/promises";
import path from "path";
// Importing the User type definition
import { User } from "../../types/user";

// Defining the path to the users data file
const DATA_FILE_PATH = path.join(process.cwd(), "src/data", "users.json");
console.log(DATA_FILE_PATH);

// Function to read the users data file and return the users array
async function readUsersFile(): Promise<User[]> {
  const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
  return JSON.parse(data);
}

// Function to write the users array to the users data file
async function writeUsersFile(users: User[]): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(users, null, 2));
}

// Exporting a function to fetch all users from the data file
export async function getUsers(): Promise<User[]> {
  return readUsersFile();
}

// Exporting a function to create a new user and add them to the data file
export async function createUser(userData: Omit<User, "id">): Promise<User> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const users = await readUsersFile();
  const newUser = {
    ...userData,
    password: hashedPassword,
    id: (users.length + 1).toString(),
  };

  users.push(newUser);
  await writeUsersFile(users);
  return newUser;
}

// Exporting a function to update a user in the data file
export async function updateUser(
  id: string,
  updatedUser: Partial<User>
): Promise<User | null> {
  const users = await readUsersFile();
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], ...updatedUser };
  await writeUsersFile(users);
  return users[userIndex];
}

// Exporting a function to delete a single user from the data file
export async function deleteUser(id: string): Promise<boolean> {
  const users = await readUsersFile();
  const updatedUsers = users.filter((u) => u.id !== id);
  if (updatedUsers.length === users.length) return false;

  await writeUsersFile(updatedUsers);
  return true;
}

// Exporting a function to delete multiple users from the data file
export async function deleteUsers(ids: string[]): Promise<boolean> {
  const users = await readUsersFile();
  const updatedUsers = users.filter((u) => !ids.includes(u.id));
  if (updatedUsers.length === users.length) return false;

  await writeUsersFile(updatedUsers);
  return true;
}
