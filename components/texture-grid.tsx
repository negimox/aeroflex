"use client"

import { Search } from "iconoir-react"
import { useTextureFilter } from "@/hooks/use-texture-filter"
import { TextureCard } from "@/components/texture-card"

export function TextureGrid() {
  const {
    search, setSearch,
    category, setCategory,
    sort, setSort,
    filtered, categories,
  } = useTextureFilter()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <label className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Search
          </label>
          <Search className="pointer-events-none absolute bottom-2 left-2.5 size-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="name or tag..."
            className="w-full border border-border bg-secondary py-1.5 pl-8 pr-3 font-sans text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-end gap-4">
          <div>
            <label className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-border bg-secondary px-2 py-1.5 font-sans text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Sort
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "name" | "category")}
              className="border border-border bg-secondary px-2 py-1.5 font-sans text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="category">Category</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="font-mono">{filtered.length}</span>
        <span className="font-sans">{" "}specimen{filtered.length !== 1 ? "s" : ""}</span>
      </span>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((t, i) => (
          <TextureCard key={t.slug} t={t} index={i} />
        ))}
      </div>
    </div>
  )
}
