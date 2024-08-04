"use client";

import { useState, useMemo } from "react";
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
import { MagnifyingGlassIcon, DropdownMenuIcon } from "@radix-ui/react-icons";
import { User } from "@/types/user";
import {
  getUsers,
  deleteUsers as deleteUsersAction,
} from "@/lib/actions/userActions";
import { AgeRangeFilter } from "./AgeRangeFilter";
import { UserActionButtons } from "./UserActionButtons";
// Function to fetch users from the server
const fetchUsers = async (): Promise<User[]> => {
  // Call the getUsers function to fetch users
  return getUsers();
};

// Function to delete users from the server
const deleteUsers = async (ids: string[]) => {
  // Call the deleteUsersAction function to delete users
  return deleteUsersAction(ids);
};

// Custom filter function for age range
const ageRangeFilter: FilterFn<User> = (row, columnId, value) => {
  const age = row.getValue(columnId) as number;
  const [min, max] = value as [number, number];
  return age >= min && age <= max;
};

export default function UserList() {
  // State to manage the global filter for the table
  const [globalFilter, setGlobalFilter] = useState("");
  // State to manage the selection of rows in the table
  const [rowSelection, setRowSelection] = useState({});
  // State to manage the age range filter
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 100]);
  // Use the query client to manage queries
  const queryClient = useQueryClient();

  // Query to fetch users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Mutation to delete users
  const deleteMutation = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      // Invalidate the users query to refetch after deletion
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Reset row selection after deletion
      setRowSelection({});
    },
  });

  // Memoized columns for the table
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          // Checkbox to select all rows
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          // Checkbox to select individual rows
          <input
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
          // Actions column with edit and delete buttons
          <div>
            <Button variant="outline" size="sm" className="mr-2">
              Edit
            </Button>
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
    [deleteMutation]
  );

  // Initialize the table with the columns and data
  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
      rowSelection,
      columnFilters: [
        {
          id: "age",
          value: ageRange,
        },
      ],
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Display loading message if data is being fetched
  if (isLoading) return <div>Loading...</div>;
  // Display error message if an error occurs
  if (error) return <div>An error occurred</div>;

  return (
    <div>
      {/* Header section */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
      </div>
      {/* Filter and action section */}
      <div className="flex justify-between items-center">
        <div className="flex w-full justify-between mb-4">
          {/* Input field for filtering users with search icon */}
          <div className="flex items-center w-1/3 relative">
            <Input
              placeholder="Search users..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
            />
            <MagnifyingGlassIcon className="absolute right-2" />
          </div>
          {/* Age range filter */}
          <AgeRangeFilter ageRange={ageRange} setAgeRange={setAgeRange} />
          {/* Buttons for adding and deleting users */}
          <UserActionButtons
            onAddUser={() => {
              /* Add user logic */
            }}
            onDeleteSelected={() => {
              const selectedIds = Object.keys(rowSelection).map(
                (index) => users[parseInt(index)].id
              );
              deleteMutation.mutate(selectedIds);
            }}
            isDeleteDisabled={Object.keys(rowSelection).length === 0}
          />
        </div>
      </div>
      {/* Table section */}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination section */}
      <div className="flex items-center justify-between mt-4">
        <div>
          {/* Display pagination information */}
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            users.length
          )}{" "}
          of {users.length} results
        </div>
        <div className="space-x-2">
          {/* Buttons for navigating pagination */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
