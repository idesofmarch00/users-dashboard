import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "@/lib/schemas/userSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseMutationResult } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

interface UpdateUserModalProps {
  updateUser: UseMutationResult<any, unknown, UserFormData, unknown>;
  userData: UserFormData;
}

export default function UpdateUserModal({
  updateUser,
  userData,
}: UpdateUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<{
    [key: string]: boolean;
  }>({
    first_name: false,
    last_name: false,
    email: false,
    alternate_email: false,
    age: false,
    password: false,
  });
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: userData,
  });

  useEffect(() => {
    reset(userData);
    setPassword(""); // Clear password for editing
  }, [userData, reset]);

  const validatePassword = (password: string) => {
    // Define password schema for validation
    const passwordSchema = z
      .string()
      .min(8, "Password must be at least 8 characters");
    try {
      passwordSchema.parse(password);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onSubmit = async (data: UserFormData) => {
    // Validate password if it's edited
    if (password) {
      if (!validatePassword(password)) {
        setError("password", {
          type: "manual",
          message: "Password must be at least 8 characters",
        });
        console.error("Password does not meet the requirements.");
        return; // Do not proceed with the submission
      }
    } else {
      data.password = userData.password;
    }
    try {
      await updateUser.mutateAsync(data);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleInputClick = (field: keyof UserFormData) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: true,
    }));
  };

  const handlePasswordClick = () => {
    setIsEditing((prevState) => ({
      ...prevState,
      password: true,
    }));
    setPassword(""); // Clear the password field for editing
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        reset(userData);
      }}
    >
      <DialogTrigger asChild>
        <Button>Edit User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              {...control.register("first_name")}
              defaultValue={userData.first_name}
              readOnly={!isEditing.first_name}
              onClick={() => handleInputClick("first_name")}
            />
            {errors.first_name && (
              <p className="text-red-500">
                {(errors.first_name.message as string) || "Error"}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              {...control.register("last_name")}
              defaultValue={userData.last_name}
              readOnly={!isEditing.last_name}
              onClick={() => handleInputClick("last_name")}
            />
            {errors.last_name && (
              <p className="text-red-500">
                {(errors.last_name.message as string) || "Error"}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...control.register("email")}
              defaultValue={userData.email}
              readOnly={!isEditing.email}
              onClick={() => handleInputClick("email")}
            />
            {errors.email && (
              <p className="text-red-500">
                {(errors.email.message as string) || "Error"}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="alternate_email">Alternate Email</Label>
            <Input
              id="alternate_email"
              type="email"
              {...control.register("alternate_email")}
              defaultValue={userData.alternate_email || ""}
              readOnly={!isEditing.alternate_email}
              onClick={() => handleInputClick("alternate_email")}
            />
            {errors.alternate_email && (
              <p className="text-red-500">
                {(errors.alternate_email.message as string) || "Error"}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...control.register("age", { valueAsNumber: true })}
              defaultValue={userData.age}
              readOnly={!isEditing.age}
              onClick={() => handleInputClick("age")}
            />
            {errors.age && (
              <p className="text-red-500">
                {(errors.age.message as string) || "Error"}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={isEditing.password ? password : "********"}
                readOnly={!isEditing.password}
                placeholder="Click to edit password"
                onClick={handlePasswordClick}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500">
                {(errors.password.message as string) || "Error"}
              </p>
            )}
          </div>
          <Button type="submit">Update User</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}