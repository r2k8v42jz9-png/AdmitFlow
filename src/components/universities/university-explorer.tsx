"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, Bookmark, X, Telescope, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { UniversityCard } from "@/components/universities/university-card";
import { useSavedUniversities } from "@/lib/saved-universities";
import { searchUniversities, getUniversityFacets } from "@/lib/supabase/universities";
import type { University } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;

export function UniversityExplorer() {
  const { ids: savedIds, toggle, isSaved, count } = useSavedUniversities();

  // Filters (country/field are single-select to match the search_universities RPC).
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [country, setCountry] = useState<string | null>(null);
  const [field, setField] = useState<string | null>(null);
  const [needsScholarship, setNeedsScholarship] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);

  // Facets for the filter dropdown (loaded from the DB, local fallback inside).
  const [facets, setFacets] = useState<{ countries: string[]; fields: string[] }>({
    countries: [],
    fields: [],
  });

  // Results + pagination state.
  const [results, setResults] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // Refs read by the IntersectionObserver / async loaders to avoid stale state.
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(false);
  const loadingRef = useRef(false);
  const reqIdRef = useRef(0);

  useEffect(() => {
    let active = true;
    getUniversityFacets().then((f) => {
      if (active) setFacets(f);
    });
    return () => {
      active = false;
    };
  }, []);

  // Debounce the search box (server-side FTS on every keystroke would be wasteful).
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  /** Loads a page from the DB. reset=true starts a new query from offset 0. */
  const load = useCallback(
    async (reset: boolean) => {
      if (!reset && (loadingRef.current || !hasMoreRef.current)) return;
      const reqId = reset ? ++reqIdRef.current : reqIdRef.current;
      const offset = reset ? 0 : offsetRef.current;
      loadingRef.current = true;
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const batch = await searchUniversities({
        q: debouncedQuery || undefined,
        country: country || undefined,
        field: field || undefined,
        needsScholarship: needsScholarship || undefined,
        limit: PAGE_SIZE,
        offset,
      });

      // Ignore responses from superseded queries (filters changed mid-flight).
      if (reqId !== reqIdRef.current) return;

      offsetRef.current = offset + batch.length;
      const more = batch.length === PAGE_SIZE;
      hasMoreRef.current = more;
      setHasMore(more);
      setResults((prev) => (reset ? batch : [...prev, ...batch]));
      setLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    },
    [debouncedQuery, country, field, needsScholarship],
  );

  // Re-run from page 0 whenever a server-side filter changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(true);
  }, [load]);

  // Infinite scroll: observe a sentinel near the bottom of the grid.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) load(false);
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  // "Saved" is a per-user, client-side refinement over the loaded results.
  const visible = savedOnly ? results.filter((u) => savedIds.includes(u.id)) : results;

  const activeFilters = (country ? 1 : 0) + (field ? 1 : 0) + (needsScholarship ? 1 : 0);
  const clearAll = () => {
    setCountry(null);
    setField(null);
    setNeedsScholarship(false);
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
          {/* Filters */}
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
              {facets.countries.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c}
                  checked={country === c}
                  onCheckedChange={() => setCountry((cur) => (cur === c ? null : c))}
                  onSelect={(e) => e.preventDefault()}
                >
                  {c}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Focus area</DropdownMenuLabel>
              {facets.fields.map((f) => (
                <DropdownMenuCheckboxItem
                  key={f}
                  checked={field === f}
                  onCheckedChange={() => setField((cur) => (cur === f ? null : f))}
                  onSelect={(e) => e.preventDefault()}
                >
                  {f}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={needsScholarship}
                onCheckedChange={() => setNeedsScholarship((v) => !v)}
                onSelect={(e) => e.preventDefault()}
              >
                Offers scholarships
              </DropdownMenuCheckboxItem>
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
          {country && <FilterChip label={country} onClear={() => setCountry(null)} />}
          {field && <FilterChip label={field} onClear={() => setField(null)} />}
          {needsScholarship && <FilterChip label="Offers scholarships" onClear={() => setNeedsScholarship(false)} />}
          {savedOnly && <FilterChip label="Saved only" onClear={() => setSavedOnly(false)} />}
          <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
            Clear all
          </button>
        </div>
      )}

      {/* Result count */}
      <p className="mt-5 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{visible.length}</span>{" "}
        {savedOnly ? "saved" : `universities loaded${hasMore ? "+" : ""}`}
        <span className="ml-2 text-xs">· ranked by world ranking</span>
      </p>

      {/* Grid */}
      {loading ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl border border-border/50 bg-card/40" />
          ))}
        </div>
      ) : visible.length > 0 ? (
        <>
          <motion.div layout className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((u, i) => (
                <UniversityCard key={u.id} university={u} saved={isSaved(u.id)} onToggleSave={toggle} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Infinite-scroll sentinel + loader (hidden in saved-only view) */}
          {!savedOnly && (
            <div ref={sentinelRef} className="mt-6 flex justify-center py-4">
              {loadingMore ? (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Loading more…
                </span>
              ) : !hasMore ? (
                <span className="text-xs text-muted-foreground">You&apos;ve reached the end.</span>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border bg-card/30 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
            <Telescope className="size-7" />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold">No universities match</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {savedOnly
              ? "You haven't saved any universities in this view yet."
              : "Try adjusting your filters or search terms to discover more options."}
          </p>
          <Button variant="outline" className="mt-5" onClick={clearAll}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-2.5 py-1 text-xs">
      {label}
      <button onClick={onClear}>
        <X className="size-3 text-muted-foreground hover:text-foreground" />
      </button>
    </span>
  );
}
