"use client";

import { useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type SymptomLogFilters = {
  search?: string;
  severityRange?: string;
  page?: number;
  pageSize?: number;
};

export function useSymptomLogFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const filters: SymptomLogFilters = useMemo(() => {
    const sp = searchParams;
    const toNum = (v: string | null | undefined) =>
      v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined;

    return {
      search: sp.get("search") || undefined,
      severityRange: sp.get("severityRange") || undefined,
      page: toNum(sp.get("page")) || 1,
      pageSize: toNum(sp.get("pageSize")) || 10,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<SymptomLogFilters>) => {
      const sp = new URLSearchParams(searchParams.toString());

      const setOrDelete = (key: string, value: string | number | undefined) => {
        if (value === undefined || value === null || value === "")
          sp.delete(key);
        else sp.set(key, String(value));
      };

      setOrDelete("search", next.search ?? filters.search);
      setOrDelete("severityRange", next.severityRange ?? filters.severityRange);
      setOrDelete("page", next.page ?? filters.page);
      setOrDelete("pageSize", next.page ?? filters.pageSize);

      router.replace(`${pathname}?${sp.toString()}`);
    },
    [router, pathname, searchParams, filters]
  );

  return { filters, setFilters } as const;
}
