"use server";

import fs from "fs/promises";
import path from "path";
import { User } from "../../types/user";

const DATA_FILE_PATH = path.join(process.cwd(), "src/data", "users.json");
console.log(DATA_FILE_PATH);

async function readUsersFile(): Promise<User[]> {
  const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
  return JSON.parse(data);
}

async function writeUsersFile(users: User[]): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(users, null, 2));
}

export async function getUsers(): Promise<User[]> {
  return readUsersFile();
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  const users = await readUsersFile();
  const newUser: User = {
    ...user,
    id: (users.length + 1).toString(),
  };
  users.push(newUser);
  await writeUsersFile(users);
  return newUser;
}

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

export async function deleteUser(id: string): Promise<boolean> {
  const users = await readUsersFile();
  const updatedUsers = users.filter((u) => u.id !== id);
  if (updatedUsers.length === users.length) return false;

  await writeUsersFile(updatedUsers);
  return true;
}

export async function deleteUsers(ids: string[]): Promise<boolean> {
  const users = await readUsersFile();
  const updatedUsers = users.filter((u) => !ids.includes(u.id));
  if (updatedUsers.length === users.length) return false;

  await writeUsersFile(updatedUsers);
  return true;
}
