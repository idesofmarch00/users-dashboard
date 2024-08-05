"use server";
//dependencies
import toast, { Toaster } from "react-hot-toast";
import bcrypt from "bcrypt";
// Importing necessary modules for file operations and path manipulation
import fs from "fs/promises";
import path from "path";

// Importing the User type definition
import { User } from "../../types/user";

// Defining the path to the users data file
const DATA_FILE_PATH =
  process.env.DATA_FILE_PATH ||
  path.join(process.cwd(), "src/data", "users.json");

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

// Exporting a function to check if a user exists by email
export async function checkIfUserExists(email: string): Promise<boolean> {
  const users = await readUsersFile();
  return users.some((user) => user.email === email);
}

// Exporting a function to check if a user exists by email and id
export async function checkIfUserExistsByEmailAndId(
  email: string,
  id: string
): Promise<boolean> {
  const users = await readUsersFile();
  return users.some((user) => user.email === email && user.id === id);
}

// Exporting a function to create a new user and add them to the data file
export async function createUser(
  userData: Omit<User, "id">
): Promise<User | null | undefined> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const users = await readUsersFile();

  // Check if a user with the same email already exists
  const existingUser = await checkIfUserExists(userData.email);

  if (existingUser) {
    throw new Error("User with email already exists");
  }

  const newUser = {
    id: (users.length + 1).toString(),
    ...userData,
    password: hashedPassword,
  };

  users.push(newUser);
  await writeUsersFile(users);
  return newUser;
}

// Function to update a user in the data file
export async function updateUser(
  id: string,
  updatedUser: Partial<User>
): Promise<User | null> {
  const users = await readUsersFile();

  // Check if the user updating is the same one
  const sameUser = await checkIfUserExistsByEmailAndId(
    updatedUser.email as string,
    id
  );

  if (!sameUser) {
    throw new Error("Cannot update email to already existing email.");
  }

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) return null;

  const existingUser = users[userIndex];
  // If the password is being updated, hash it
  if (updatedUser.password) {
    const isPasswordMatch = await bcrypt.compare(
      updatedUser.password,
      existingUser.password
    );

    // Only hash the new password if it does not match the existing password
    if (!isPasswordMatch) {
      const saltRounds = 10;
      updatedUser.password = await bcrypt.hash(
        updatedUser.password,
        saltRounds
      );
    } else {
      // If passwords match, keep the existing password
      delete updatedUser.password;
    }
  }

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
