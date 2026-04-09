import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  render?: (value: any, row: T) => ReactNode;
  className?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  hideOnMobile?: boolean;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  testId?: string;
  skeletonRows?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'Aucune donnée disponible',
  onRowClick,
  rowClassName,
  testId,
  skeletonRows = 5,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="border border-border rounded-2xl overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    'font-semibold text-foreground',
                    column.hideOnMobile && 'hidden md:table-cell',
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center'
                  )}
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(skeletonRows)].map((_, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(column.hideOnMobile && 'hidden md:table-cell')}
                  >
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border border-border rounded-2xl overflow-hidden bg-card p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card" data-testid={testId}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/40 transition-colors">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    'font-semibold text-foreground uppercase text-xs tracking-wider',
                    column.hideOnMobile && 'hidden md:table-cell',
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                    column.className
                  )}
                  style={{ width: column.width }}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'hover:bg-muted/20 transition-all duration-150 border-b border-border/50 last:border-0',
                  onRowClick && 'cursor-pointer',
                  rowClassName?.(row)
                )}
                data-testid={`${testId}-row-${rowIndex}`}
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  const content = column.render ? column.render(value, row) : value;

                  return (
                    <TableCell
                      key={column.key}
                      className={cn(
                        'py-4',
                        column.hideOnMobile && 'hidden md:table-cell',
                        column.align === 'right' && 'text-right',
                        column.align === 'center' && 'text-center',
                        column.className
                      )}
                    >
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

