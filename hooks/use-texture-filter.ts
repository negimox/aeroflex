"use client"

import { useState, useMemo } from "react"
import { textures, CATEGORIES } from "@/lib/textures"

export type SortKey = "name" | "category"

export function useTextureFilter() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState<SortKey>("category")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return textures
      .filter((t) => {
        if (category !== "All" && t.category !== category)
          return false
        if (q && !t.name.toLowerCase().includes(q) && !t.tag.toLowerCase().includes(q))
          return false
        return true
      })
      .sort((a, b) =>
        sort === "name"
          ? a.name.localeCompare(b.name)
          : CATEGORIES.indexOf(a.category as (typeof CATEGORIES)[number]) -
            CATEGORIES.indexOf(b.category as (typeof CATEGORIES)[number])
      )
  }, [search, category, sort])

  return {
    search, setSearch,
    category, setCategory,
    sort, setSort,
    filtered,
    categories: ["All", ...CATEGORIES],
  }
}
