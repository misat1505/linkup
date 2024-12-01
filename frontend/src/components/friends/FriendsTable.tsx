import { flexRender, Table as TableType } from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Friendship } from "../../types/Friendship";

type FriendsTableProps = {
  table: TableType<Friendship>;
};

export default function FriendsTable({ table }: FriendsTableProps) {
  const focusNavigationBar = () => {
    const navSearch = document.querySelector(
      "[data-testid=cy-nav-search-input]"
    ) as HTMLInputElement;
    navSearch?.focus();
  };

  return (
    <>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className="h-32 text-center"
            >
              <h2 className="text-lg font-semibold">No results.</h2>
              <p>
                Search for people using the{" "}
                <span
                  onClick={focusNavigationBar}
                  className="text-blue-500 underline hover:cursor-pointer"
                >
                  navigation bar
                </span>
                .
              </p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
}
