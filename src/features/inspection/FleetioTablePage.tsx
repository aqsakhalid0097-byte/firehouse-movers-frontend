'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { InspectionLayout } from './InspectionLayout';
import { ArrowLeft, Search, Loader2, RefreshCw } from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface FleetioTablePageProps<T> {
  title: string;
  totalCountText?: string;
  actionButton?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  backHref?: string;
  columns: ColumnDef<T>[];
  data?: T[];
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  queryHook?: (params: { q?: string; page?: number }) => {
    data?: T[];
    isLoading?: boolean;
    isFetching?: boolean;
    isError?: boolean;
    error?: any;
    refetch?: () => void;
  };
  useQueryHook?: (params: { q?: string; page?: number }) => {
    data?: T[];
    isLoading?: boolean;
    isFetching?: boolean;
    isError?: boolean;
    error?: any;
    refetch?: () => void;
  };
}

export function FleetioTablePage<T extends { id?: string | number }>({
  title,
  totalCountText,
  actionButton,
  backHref = '/truck-inspection/',
  columns,
  data = [],
  searchPlaceholder = 'Search records...',
  searchFilter,
  queryHook,
  useQueryHook,
}: FleetioTablePageProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const activeHook = queryHook || useQueryHook;
  const liveQuery = activeHook ? activeHook({ q: searchQuery }) : null;
  const isQueryLoading = liveQuery?.isLoading || false;
  const isFetching = liveQuery?.isFetching || false;

  // Use live data from query if hook is provided; otherwise fallback to prop data
  const rawData = useMemo(() => {
    if (activeHook) {
      return liveQuery?.data || [];
    }
    return data;
  }, [activeHook, liveQuery?.data, data]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return rawData;
    if (searchFilter) {
      return rawData.filter((item) => searchFilter(item, searchQuery.toLowerCase()));
    }
    return rawData.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rawData, searchQuery, searchFilter]);

  const countDisplay = totalCountText || `Total: ${filteredData.length}`;

  return (
    <InspectionLayout>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="animate-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h1>
              {isFetching && (
                <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
              )}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">{countDisplay}</p>
          </div>

          <div className="flex items-center gap-3">
            {liveQuery?.refetch && (
              <button
                type="button"
                onClick={() => liveQuery.refetch?.()}
                className="inline-flex items-center bg-[#262626] hover:bg-[#333333] border border-gray-700 text-gray-300 px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer"
                title="Sync from Fleetio"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? 'animate-spin' : ''}`} />
                Sync
              </button>
            )}

            {actionButton ? (
              <Link
                href={actionButton.href}
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
              >
                {actionButton.icon && <span className="mr-2">{actionButton.icon}</span>}
                {actionButton.label}
              </Link>
            ) : (
              <Link
                href={backHref}
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar & Count */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-[#1a1a1a] border border-[#333333] text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>Showing {filteredData.length} records</span>
          </div>
        </div>

        {/* Table Container */}
        {isQueryLoading ? (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#2b2b2b] p-12 text-center">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading records...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg shadow-lg border border-[#2b2b2b] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-white text-sm">
                <thead className="border-b border-gray-700 bg-[#262626]">
                  <tr>
                    {columns.map((col, idx) => (
                      <th
                        key={idx}
                        className={`text-left p-3.5 font-semibold text-gray-200 ${col.className || ''}`}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredData.map((row, rowIdx) => (
                    <tr
                      key={row.id ? String(row.id) : rowIdx}
                      className="border-b border-gray-800/80 hover:bg-gray-900/60 transition-colors"
                    >
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className={`p-3.5 whitespace-nowrap ${col.className || ''}`}>
                          {col.cell
                            ? col.cell(row)
                            : col.accessorKey
                            ? String(row[col.accessorKey] ?? '-')
                            : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-gray-800/80 bg-[#161616] flex items-center justify-between text-xs text-gray-400">
              <span>Showing 1 to {filteredData.length} of {filteredData.length} records</span>
              <span className="font-mono text-gray-500">Fleetio Sync Active</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg p-12 text-center border border-[#2b2b2b]">
            <p className="text-gray-400 text-sm">No {title.toLowerCase()} found.</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </InspectionLayout>
  );
}

export default FleetioTablePage;
