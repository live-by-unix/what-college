import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allStates, allMajors } from "@/lib/colleges";

const ratingOptions = ["All Ratings", "Safety", "Match", "Reach", "Ultra Reach"];
const difficultyOptions = ["All Levels", "Easy (1-3)", "Moderate (4-6)", "Hard (7-8)", "Elite (9-10)"];

export default function SearchAndFilter({ filters, onFilterChange }) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="search"
          placeholder="Search universities..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10 h-11 rounded-xl border-slate-200 bg-white text-sm"
          aria-label="Search universities"
        />
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </div>

        <Select value={filters.rating} onValueChange={(val) => onFilterChange("rating", val)}>
          <SelectTrigger className="h-8 text-xs rounded-lg border-slate-200 min-w-[120px]" aria-label="Filter by rating">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map(r => (
              <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.state} onValueChange={(val) => onFilterChange("state", val)}>
          <SelectTrigger className="h-8 text-xs rounded-lg border-slate-200 min-w-[100px]" aria-label="Filter by state">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All States" className="text-xs">All States</SelectItem>
            {allStates.map(s => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.difficulty} onValueChange={(val) => onFilterChange("difficulty", val)}>
          <SelectTrigger className="h-8 text-xs rounded-lg border-slate-200 min-w-[120px]" aria-label="Filter by difficulty">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficultyOptions.map(d => (
              <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.major} onValueChange={(val) => onFilterChange("major", val)}>
          <SelectTrigger className="h-8 text-xs rounded-lg border-slate-200 min-w-[120px]" aria-label="Filter by major">
            <SelectValue placeholder="Major" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Majors" className="text-xs">All Majors</SelectItem>
            {allMajors.map(m => (
              <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}