"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, Bookmark, X, ArrowUpDown, Telescope, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UniversityCard } from "@/components/universities/university-card";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { universities, countries, allTags } from "@/lib/data/universities";
import { cn } from "@/lib/utils";

type SortKey = "fit" | "rank" | "tuition-asc" | "acceptance";
const sortLabels: Record<SortKey, string> = {
  fit: "Best AI fit",
  rank: "World ranking",
  "tuition-asc": "Lowest tuition",
  acceptance: "Acceptance rate",
};

export function UniversityExplorer() {
  const { ids, toggle, isSaved, count } = useBookmarks();
  const [query, setQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("fit");
  const [savedOnly, setSavedOnly] = useState(false);

  const toggleIn = (arr: string[], set: (v: string[]) => void, value: string) =>
    set(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);

  const results = useMemo(() => {
    let list = universities.filter((u) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.shortName.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(u.country);
      const matchesTags = selectedTags.length === 0 || selectedTags.every((t) => u.tags.includes(t));
      const matchesSaved = !savedOnly || ids.includes(u.id);
      return matchesQuery && matchesCountry && matchesTags && matchesSaved;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "rank":
          return a.rankWorld - b.rankWorld;
        case "tuition-asc":
          return a.tuitionPerYear - b.tuitionPerYear;
        case "acceptance":
          return b.acceptanceRate - a.acceptanceRate;
        default:
          return b.fitScore - a.fitScore;
      }
    });
    return list;
  }, [query, selectedCountries, selectedTags, sort, savedOnly, ids]);

  const activeFilters = selectedCountries.length + selectedTags.length;
  const clearAll = () => {
    setSelectedCountries([]);
    setSelectedTags([]);
    setQuery("");
    setSavedOnly(false);
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search universities, countries, fields…"
            className="h-11 pl-10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Country filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11">
                <SlidersHorizontal className="size-4" /> Filters
                {activeFilters > 0 && (
                  <span className="ml-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {activeFilters}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-96 w-64 overflow-y-auto">
              <DropdownMenuLabel>Country</DropdownMenuLabel>
              {countries.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c}
                  checked={selectedCountries.includes(c)}
                  onCheckedChange={() => toggleIn(selectedCountries, setSelectedCountries, c)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {c}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Focus area</DropdownMenuLabel>
              {allTags.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={selectedTags.includes(t)}
                  onCheckedChange={() => toggleIn(selectedTags, setSelectedTags, t)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11">
                <ArrowUpDown className="size-4" /> {sortLabels[sort]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {(Object.keys(sortLabels) as SortKey[]).map((k) => (
                <DropdownMenuItem key={k} onClick={() => setSort(k)} className="justify-between">
                  {sortLabels[k]}
                  {sort === k && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Saved toggle */}
          <Button
            variant={savedOnly ? "primary" : "outline"}
            className="h-11"
            onClick={() => setSavedOnly((v) => !v)}
          >
            <Bookmark className={cn("size-4", savedOnly && "fill-current")} /> Saved
            <span className={cn("ml-0.5 text-xs", savedOnly ? "text-primary-foreground/80" : "text-muted-foreground")}>
              {count}
            </span>
          </Button>
        </div>
      </div>

      {/* Active filter chips */}
      {(activeFilters > 0 || savedOnly) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[...selectedCountries, ...selectedTags].map((f) => (
            <span key={f} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-2.5 py-1 text-xs">
              {f}
              <button
                onClick={() => {
                  setSelectedCountries((c) => c.filter((x) => x !== f));
                  setSelectedTags((t) => t.filter((x) => x !== f));
                }}
              >
                <X className="size-3 text-muted-foreground hover:text-foreground" />
              </button>
            </span>
          ))}
          <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
            Clear all
          </button>
        </div>
      )}

      {/* Result count */}
      <p className="mt-5 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{results.length}</span> universities found
      </p>

      {/* Grid */}
      {results.length > 0 ? (
        <motion.div layout className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((u, i) => (
              <UniversityCard key={u.id} university={u} saved={isSaved(u.id)} onToggleSave={toggle} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border bg-card/30 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <Telescope className="size-7" />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold">No universities match</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try adjusting your filters or search terms to discover more options.
          </p>
          <Button variant="outline" className="mt-5" onClick={clearAll}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
