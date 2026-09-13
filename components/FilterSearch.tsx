"use client";

import { useState, useCallback, useEffect } from "react";
import { Product, Taxonomy } from "@/lib/types";
import {
  getAllProducts,
  getFilterOptions,
  calculateFacets,
  FacetData,
} from "@/lib/filterSearch";
import Filters from "./Filters";
import ProductCard from "./Cards/product";

interface ProductsPageClientProps {
  initialProducts: Product[];
  allProductsForCounting: { uid: string; taxonomies?: Taxonomy[] }[];
}

// Mapping from display names to API taxonomy keys
const TAXONOMY_MAP: Record<string, string> = {
  Materials: "materials",
  "Product Type": "product_type",
  "Product Line": "product_line",
};

export default function ProductsPageClient({
  initialProducts,
  allProductsForCounting,
}: ProductsPageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [facetData, setFacetData] = useState<FacetData[]>([]);

  // Initialize facet data on mount
  useEffect(() => {
    const baseFilterOptions = getFilterOptions();
    const initialFacets = calculateFacets(
      allProductsForCounting,
      {},
      baseFilterOptions
    );
    setFacetData(initialFacets);
  }, [allProductsForCounting]);

  const handleFiltersChange = useCallback(
    async (filters: Record<string, string[]>) => {
      setLoading(true);

      try {
        // Transform filter names to taxonomy keys, filtering out empty arrays
        const taxonomyFilters = Object.fromEntries(
          Object.entries(filters)
            .filter(([key, values]) => values.length > 0 && TAXONOMY_MAP[key])
            .map(([key, values]) => [TAXONOMY_MAP[key], values])
        );

        // Update products
        const result = await getAllProducts({
          taxonomies:
            Object.keys(taxonomyFilters).length > 0
              ? taxonomyFilters
              : undefined,
        });
        setProducts(result.products);

        // Update facet data
        const baseFilterOptions = getFilterOptions();
        const updatedFacets = calculateFacets(
          allProductsForCounting,
          filters,
          baseFilterOptions
        );
        setFacetData(updatedFacets);
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        setLoading(false);
      }
    },
    [allProductsForCounting]
  );

  return (
    <div className="max-w-[1440px] mx-auto py-8">
      <div className="lg:grid lg:grid-cols-5 lg:gap-8">
        <div className="mb-8 lg:mb-0">
          <Filters
            filterOptions={facetData}
            onFiltersChange={handleFiltersChange}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-4">
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.uid} product={product} loading="lazy" />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
