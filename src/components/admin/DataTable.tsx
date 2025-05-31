import React from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ArrowDown, ArrowUp, Search } from 'lucide-react';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  searchField?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function DataTable<TData>({
  data,
  columns,
  searchField,
  searchPlaceholder = "Search...",
  emptyMessage = "No data found."
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      {/* Search input - better mobile styling */}
      {searchField && (
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gym-yellow/70" />
          </div>
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 bg-gym-gray-dark border-gym-gray-light text-white focus:border-gym-yellow"
          />
        </div>
      )}

      {/* Responsive table wrapper */}
      <div className="w-full overflow-x-auto rounded-lg border border-gym-gray-light mb-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-gym-gray-dark text-white border-b border-gym-gray-light uppercase text-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id} 
                    className="px-4 py-3 whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="ml-1">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp size={14} className="text-gym-yellow" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown size={14} className="text-gym-yellow" />
                          ) : (
                            <div className="w-4 h-4 opacity-0">|</div>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gym-gray-light">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="bg-gym-gray hover:bg-gym-gray-dark/80">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-white/80">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-white/60">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - mobile friendly layout */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
        <div className="flex justify-between w-full sm:w-auto gap-2 order-2 sm:order-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-gym-yellow/30 text-gym-yellow hover:bg-gym-yellow/10"
          >
            <ChevronLeft size={16} />
            <span className="ml-1 hidden xs:inline">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-gym-yellow/30 text-gym-yellow hover:bg-gym-yellow/10"
          >
            <span className="mr-1 hidden xs:inline">Next</span>
            <ChevronRight size={16} />
          </Button>
        </div>
        
        {/* Page info */}
        <div className="text-sm text-white/70 order-1 sm:order-2 text-center sm:text-right">
          Page{" "}
          <span className="font-medium text-gym-yellow">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gym-yellow">
            {table.getPageCount() || 1}
          </span>
        </div>
      </div>
    </div>
  );
}
