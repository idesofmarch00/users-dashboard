"use client";

import { useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  FilterFn,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { User } from "@/types/user";
import {
  getUsers,
  deleteUsers as deleteUsersAction,
  createUser,
  updateUser,
} from "@/lib/actions/userActions";
import { AgeRangeFilter } from "./AgeRangeFilter";
import AddUserModal from "./AddUserModal";
import UpdateUserModal from "./UpdateUserModal";
import toast, { Toaster } from "react-hot-toast";

// Function to fetch users from the server
const fetchUsers = async (): Promise<User[]> => {
  return getUsers();
};

// Function to delete users from the server
const deleteUsers = async (ids: string[]) => {
  return deleteUsersAction(ids);
};

// Custom filter function for age range
const ageRangeFilter: FilterFn<User> = (row, columnId, value) => {
  const age = row.getValue(columnId) as number;
  const [min, max] = value as [number, number];
  return age >= min && age <= max;
};

export default function UserList() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredData = useMemo(() => {
    return users.filter((user) => {
      const matchesAgeRange =
        user.age >= ageRange[0] && user.age <= ageRange[1];
      const matchesGlobalFilter =
        globalFilter === "" ||
        Object.values(user).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(globalFilter.toLowerCase())
        );
      return matchesAgeRange && matchesGlobalFilter;
    });
  }, [users, ageRange, globalFilter]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const debouncedSetAgeRange = useCallback(
    (newRange: [number, number]) => {
      debounce((range: [number, number]) => {
        setAgeRange(range);
      }, 50)(newRange);
    },
    [setAgeRange]
  );
  const handleRowSelectionChange = useCallback(
    (updater: any) => {
      setRowSelection((prev) => updater(prev));
    },
    [setRowSelection]
  );

  const debouncedSetGlobalFilter = debounce((query: string) => {
    setGlobalFilter(query);
  }, 50);
  const handleGlobalFilterChange = useCallback(
    (query: string) => {
      debouncedSetGlobalFilter(query);
    },
    [debouncedSetGlobalFilter]
  );

  // Mutation to delete users
  const deleteMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setRowSelection({});
      toast.success("User(s) deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user(s)");
    },
  });

  // Mutation to add users
  const addUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setRowSelection({});
      toast.success("User added successfully");
    },
    onError: () => {
      toast.error("Failed to add user");
    },
  });

  // Mutation to add users
  const updateUserMutation = useMutation({
    mutationFn: ({
      id,
      updatedUser,
    }: {
      id: string;
      updatedUser: Partial<User>;
    }) => updateUser(id, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setRowSelection({});
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            id={`select-${row.id}`}
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: "first_name",
        header: "First Name",
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "age",
        header: "Age",
        filterFn: ageRangeFilter,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div>
            <UpdateUserModal
              userData={row.original}
              updateUser={updateUserMutation as any}
            />

            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteMutation.mutate([row.original.id])}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation, updateUserMutation]
  );

  const tableOptions = useMemo(
    () => ({
      data: paginatedData,
      columns,
      state: {
        rowSelection,
      },
      enableRowSelection: true,
      onRowSelectionChange: handleRowSelectionChange,
      getCoreRowModel: getCoreRowModel(),
      manualPagination: true,
      pageCount: totalPages,
    }),
    [paginatedData, columns, rowSelection, handleRowSelectionChange, totalPages]
  );

  const table = useReactTable(tableOptions);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;

  return (
    <div>
      <Toaster />
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex w-full justify-between mb-4">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center w-1/3 relative">
              <Input
                id="user-search"
                placeholder="Search users..."
                value={globalFilter ?? ""}
                onChange={(e) =>
                  handleGlobalFilterChange(String(e.target.value))
                }
              />
              <MagnifyingGlassIcon className="absolute right-2" />
            </div>
            <AgeRangeFilter
              ageRange={ageRange}
              resetFilter={() => debouncedSetAgeRange([0, 100])}
              setAgeRange={debouncedSetAgeRange}
            />
          </div>

          <div className="flex items-center gap-2">
            <AddUserModal addUser={addUserMutation as any} />
            <Button
              variant="destructive"
              onClick={() => {
                const selectedIds = Object.keys(rowSelection).map(
                  (index) => users[parseInt(index)].id
                );
                deleteMutation.mutate(selectedIds);
              }}
              disabled={Object.keys(rowSelection).length === 0}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {cell.column.id === "select" ? (
                      <input
                        id={`select-${row.id}`}
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                      />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          Showing {currentPage * pageSize + 1} to{" "}
          {Math.min((currentPage + 1) * pageSize, filteredData.length)} of{" "}
          {filteredData.length} results
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
