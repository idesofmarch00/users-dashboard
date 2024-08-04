import { useState } from "react";
import { useForm } from "react-hook-form";
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

interface AddUserModalProps {
  addUser: UseMutationResult<any, unknown, UserFormData, unknown>;
}

export default function AddUserModal({ addUser }: AddUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await addUser.mutateAsync(data);
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        reset();
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
                {(errors.alternate_email.message as string) || "Error}"}
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
