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
import { useFoodFilters, FoodFilters } from "@/hooks/useFoodFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
//

interface FoodFilterBarProps {
  filters: FoodFilters;
}

export function FoodFilterBar({ filters }: FoodFilterBarProps) {
  const [search, setSearch] = useState(filters.search ?? "");
  const [brand, setBrand] = useState(filters.brand ?? "");
  const [caloriesRange, setCaloriesRange] = useState(
    filters.caloriesRange ?? ""
  );
  const isMobile = useIsMobile();
  const { setFilters } = useFoodFilters();

  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    newSearch?: string,
    newBrand?: string,
    newCaloriesRange?: string
  ) => {
    const filters = {
      search: newSearch ?? search,
      brand: newBrand ?? brand,
      caloriesRange: newCaloriesRange ?? caloriesRange,
    };
    setFilters(filters);
  };

  // Debounce search updates
  useEffect(() => {
    const id = setTimeout(() => {
      setFilters({ search });
    }, 300);
    return () => clearTimeout(id);
  }, [search, setFilters]);

  return (
    <Card className="mb-4">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isMobile ? (
            <div className="grid grid-cols-6 gap-4 w-full items-center">
              <div className="col-span-5">
                <Input
                  id="search"
                  placeholder="Search foods..."
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
                    <Input
                      id="brand"
                      placeholder="Search brands..."
                      value={brand}
                      onChange={(e) => {
                        setBrand(e.target.value);
                        handleFilterChange(undefined, e.target.value);
                      }}
                    />
                  </div>
                  <div className="space-y-2 w-full">
                    <Select
                      value={caloriesRange}
                      onValueChange={(value) => {
                        setCaloriesRange(value);
                        handleFilterChange(undefined, undefined, value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All calories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All calories</SelectItem>
                        <SelectItem value="0-100">0-100 cal</SelectItem>
                        <SelectItem value="100-300">100-300 cal</SelectItem>
                        <SelectItem value="300-500">300-500 cal</SelectItem>
                        <SelectItem value="500+">500+ cal</SelectItem>
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
                  placeholder="Search foods..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2 w-full">
                <Input
                  id="brand"
                  placeholder="Search brands..."
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    handleFilterChange(undefined, e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2 w-full">
                <Select
                  value={caloriesRange}
                  onValueChange={(value) => {
                    setCaloriesRange(value);
                    handleFilterChange(undefined, undefined, value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All calories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All calories</SelectItem>
                    <SelectItem value="0-100">0-100 cal</SelectItem>
                    <SelectItem value="100-300">100-300 cal</SelectItem>
                    <SelectItem value="300-500">300-500 cal</SelectItem>
                    <SelectItem value="500+">500+ cal</SelectItem>
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
