import { Button } from "@/components/ui/button";

interface UserActionsProps {
  onAddUser: () => void;
  onDeleteSelected: () => void;
  isDeleteDisabled: boolean;
}

export function UserActionButtons({
  onAddUser,
  onDeleteSelected,
  isDeleteDisabled,
}: UserActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onAddUser}>Add User</Button>
      <Button
        variant="destructive"
        onClick={onDeleteSelected}
        disabled={isDeleteDisabled}
      >
        Delete Selected
      </Button>
    </div>
  );
}
