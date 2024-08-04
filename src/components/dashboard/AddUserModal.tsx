// react imports
import { useState } from "react";
// Dependencies
import { z } from "zod";
import { UseMutationResult } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";

// Actions and utils
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Types
import { userSchema, UserFormData } from "@/lib/schemas/userSchema";

// Component imports
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

// Define the interface for AddUserModalProps
interface AddUserModalProps {
  addUser: UseMutationResult<any, unknown, UserFormData, unknown>; // addUser mutation result
}

// Define the AddUserModal component
export default function AddUserModal({ addUser }: AddUserModalProps) {
  // State for modal visibility and password visibility
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize useForm with userSchema for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Function to handle form submission
  const onSubmit = async (data: UserFormData) => {
    try {
      // Call the addUser mutation with the form data
      await addUser.mutateAsync(data);
      // Close the modal and reset the form after successful submission
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Render the AddUserModal component
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        reset(); // Reset the form when modal is closed
      }}
    >
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields for user data */}
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" {...register("first_name")} />
            {errors.first_name && (
              <p className="text-red-500">
                {(errors.first_name.message as string) || "Error"}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" {...register("last_name")} />
            {errors.last_name && (
              <p className="text-red-500">
                {(errors.last_name.message as string) || "Error"}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
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
              {...register("alternate_email")}
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
              {...register("age", { valueAsNumber: true })}
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
                {...register("password")}
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
          <Button type="submit">Add User</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
