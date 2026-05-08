import { Friendship } from "@packages/schemas";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import { TRANSLATION_COMPONENT } from "../../../config";
import { FocusableSpan } from "../../misc/focusable-span";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";

type FriendsTableProps = {
  table: TableType<Friendship>;
};

export function FriendsTable({ table }: FriendsTableProps) {
  const focusNavigationBar = () => {
    const navSearch = document.querySelector(
      "[data-testid=cy-nav-search-input]",
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
                        header.getContext(),
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
              <h2 className="text-lg font-semibold">
                <TRANSLATION_COMPONENT translationKey="friends.no-result.title" />
              </h2>
              <p className="text-muted-foreground">
                <TRANSLATION_COMPONENT translationKey="friends.no-result.description" />{" "}
                <FocusableSpan
                  fn={focusNavigationBar}
                  className="text-blue-500 underline hover:cursor-pointer"
                >
                  <TRANSLATION_COMPONENT translationKey="friends.no-result.link.text" />
                </FocusableSpan>
                .
              </p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
}
