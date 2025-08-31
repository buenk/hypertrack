"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useSymptomLogFilters,
  SymptomLogFilters,
} from "@/hooks/useSymptomLogFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";

interface SymptomLogFilterBarProps {
  filters: SymptomLogFilters;
}

export function SymptomLogFilterBar({ filters }: SymptomLogFilterBarProps) {
  const [search, setSearch] = useState(filters.search ?? "");
  const [severityRange, setSeverityRange] = useState(
    filters.severityRange ?? ""
  );
  const isMobile = useIsMobile();
  const { setFilters } = useSymptomLogFilters();
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    newSearch?: string,
    newSeverityRange?: string
  ) => {
    const nextFilters = {
      search: newSearch ?? search,
      severityRange: newSeverityRange ?? severityRange,
    };
    setFilters(nextFilters);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      setFilters({ search });
    }, 300);
    return () => clearTimeout(id);
  }, [search, setFilters]);

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isMobile ? (
            <div className="grid grid-cols-6 gap-4 w-full items-center">
              <div className="col-span-5">
                <Input
                  id="search"
                  placeholder="Search logs by symptom name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                className="col-span-1 w-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                <SlidersHorizontal />
              </Button>
              {isOpen && (
                <div className="col-span-6 grid grid-cols-2 gap-4">
                  <div className="space-y-2 w-full">
                    <Select
                      value={severityRange}
                      onValueChange={(value) => {
                        setSeverityRange(value);
                        handleFilterChange(undefined, value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All severities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All severities</SelectItem>
                        <SelectItem value="1-3">1-3</SelectItem>
                        <SelectItem value="4-7">4-7</SelectItem>
                        <SelectItem value="8-10">8-10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Input
                  id="search"
                  placeholder="Search logs by symptom name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2 w-full">
                <Select
                  value={severityRange}
                  onValueChange={(value) => {
                    setSeverityRange(value);
                    handleFilterChange(undefined, value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severities</SelectItem>
                    <SelectItem value="1-3">1-3</SelectItem>
                    <SelectItem value="4-7">4-7</SelectItem>
                    <SelectItem value="8-10">8-10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
