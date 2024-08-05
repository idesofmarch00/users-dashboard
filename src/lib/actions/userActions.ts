"use server";
import bcrypt from "bcrypt";
import { User } from "../../types/user";

// Define in-memory storage for users
const inMemoryUsers: User[] = []; // This will be reset on every serverless function invocation

// Function to simulate reading users from in-memory storage
async function readUsers(): Promise<User[]> {
  return inMemoryUsers;
}

// Function to simulate writing users to in-memory storage
async function writeUsers(users: User[]): Promise<void> {
  // Replace the contents of in-memory storage with the updated users array
  inMemoryUsers.splice(0, inMemoryUsers.length, ...users);
}

// Exporting a function to fetch all users from the in-memory storage
export async function getUsers(): Promise<User[]> {
  return readUsers();
}

// Exporting a function to check if a user exists by email
export async function checkIfUserExists(email: string): Promise<boolean> {
  const users = await readUsers();
  return users.some((user) => user.email === email);
}

// Exporting a function to check if a user exists by email and id
export async function checkIfUserCanEdit(
  id: string,
  newEmail: string
): Promise<boolean | { error: string }> {
  const users = await readUsers();
  const user = users.find((user) => user.id === id);

  if (!user) return false; // User not found

  // Check if the new email is already taken by another user
  const emailExists = users.some((u) => u.email === newEmail && u.id !== id);

  if (emailExists) {
    return { error: "Email is already in use by another user." };
  }

  return true; // User can edit their own email
}

// Exporting a function to create a new user and add them to the in-memory storage
export async function createUser(
  userData: Omit<User, "id">
): Promise<User | { error: string } | null | undefined> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const users = await readUsers();

  // Check if a user with the same email already exists
  const existingUser = await checkIfUserExists(userData.email);

  if (existingUser) {
    return { error: "User with email already exists" };
  }

  const newUser = {
    id: (users.length + 1).toString(),
    ...userData,
    password: hashedPassword,
  };

  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

// Function to update a user in the in-memory storage
export async function updateUser(
  id: string,
  updatedUser: Partial<User>
): Promise<User | { error: string } | null> {
  const users = await readUsers();

  // Check if the user updating is the same one
  const response = await checkIfUserCanEdit(id, updatedUser.email as string);

  // Check if response is an object with an error property
  if (typeof response === 'object' && response !== null && 'error' in response) {
    return { error: "Cannot update email to already existing email." };
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
  await writeUsers(users);
  return users[userIndex];
}

// Exporting a function to delete a single user from the in-memory storage
export async function deleteUser(id: string): Promise<boolean> {
  const users = await readUsers();
  const updatedUsers = users.filter((u) => u.id !== id);
  if (updatedUsers.length === users.length) return false;

  await writeUsers(updatedUsers);
  return true;
}

// Exporting a function to delete multiple users from the in-memory storage
export async function deleteUsers(ids: string[]): Promise<boolean> {
  const users = await readUsers();
  const updatedUsers = users.filter((u) => !ids.includes(u.id));
  if (updatedUsers.length === users.length) return false;

  await writeUsers(updatedUsers);
  return true;
}