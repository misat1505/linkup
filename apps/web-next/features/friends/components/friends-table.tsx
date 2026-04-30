import FocusableSpan from "@/components/shared/focusable-span";
import { I18nText } from "@/components/shared/i18n-text";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Friendship } from "@packages/schemas";
import { flexRender, Table as TableType } from "@tanstack/react-table";

type FriendsTableProps = {
  table: TableType<Friendship>;
};

export default function FriendsTable({ table }: FriendsTableProps) {
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
                <I18nText translationKey="friends.no-result.title" />
              </h2>
              <p className="text-muted-foreground">
                <I18nText translationKey="friends.no-result.description" />{" "}
                <FocusableSpan
                  fn={focusNavigationBar}
                  className="text-blue-500 underline hover:cursor-pointer"
                >
                  <I18nText translationKey="friends.no-result.link.text" />
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
