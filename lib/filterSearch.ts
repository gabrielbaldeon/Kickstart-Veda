import { stack } from "./contentstack";
import { Product, Taxonomy } from "./types";

export interface ProductFilters {
  taxonomies?: {
    [taxonomyUid: string]: string | string[];
  };
  limit?: number;
  skip?: number;
  orderBy?: 'title' | 'price' | 'created_at' | 'updated_at';
  orderDirection?: 'asc' | 'desc';
}

export async function getAllProductsForCounting(): Promise<{
  uid: string;
  taxonomies?: Taxonomy[];
}[]> {
  try {
    const result = await stack
      .contentType("product")
      .entry()
      .only(["uid", "taxonomies"])
      .query()
      .find<{ uid: string; taxonomies?: Taxonomy[] }>();

    return result.entries || [];
  } catch (error) {
    console.error('Error fetching products for counting:', error);
    return [];
  }
}

export async function getAllProducts(filters?: ProductFilters): Promise<{
  products: Product[];
  totalCount?: number;
}> {
  const productQuery = stack
    .contentType("product")
    .entry()
    .only(["uid", "title", "price", "media.url", "short_description", "taxonomies", "url"])
    .query();

  if (!filters?.skip) {
    productQuery.includeCount();
  }

  if (filters?.taxonomies) {
    Object.entries(filters.taxonomies).forEach(([taxonomyUid, terms]) => {
      const termArray = Array.isArray(terms) ? terms : [terms];
      productQuery.containedIn(`taxonomies.${taxonomyUid}.term_uid`, termArray);
    });
  }

  if (filters?.orderBy) {
    if (filters.orderDirection === 'desc') {
      productQuery.orderByDescending(filters.orderBy);
    } else {
      productQuery.orderByAscending(filters.orderBy);
    }
  } else {
    productQuery.orderByAscending('title');
  }

  if (filters?.limit) {
    productQuery.limit(filters.limit);
  }

  if (filters?.skip) {
    productQuery.skip(filters.skip);
  }

  try {
    const result = await productQuery.find<Product>();

    if (result.entries) {
      return {
        products: result.entries,
        totalCount: result.count || result.entries.length
      };
    } else {
      return {
        products: [],
        totalCount: 0
      };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Mapping from display names to API taxonomy keys
const TAXONOMY_MAP: Record<string, string> = {
  Materials: "materials",
  "Product Type": "product_type",
  "Product Line": "product_line",
};

export interface FacetData {
  name: string;
  terms: {
    uid: string;
    name: string;
    count: number;
    disabled: boolean;
  }[];
}

export function calculateFacets(
  allProductsForCounting: { uid: string; taxonomies?: Taxonomy[] }[],
  currentFilters: Record<string, string[]>,
  baseFilterOptions: ReturnType<typeof getFilterOptions>
): FacetData[] {
  return baseFilterOptions.map((category) => {
    const taxonomyKey = TAXONOMY_MAP[category.name];

    return {
      name: category.name,
      terms: category.terms.map((term) => {
        // Calculate count for this term considering current filters
        const count = allProductsForCounting.filter((product) => {
          if (!product.taxonomies) return false;

          // Check if product has this specific term
          const hasThisTerm = product.taxonomies.some(
            (taxonomy) => taxonomy.taxonomy_uid === taxonomyKey && taxonomy.term_uid === term.uid
          );

          if (!hasThisTerm) return false;

          // Check if product matches all other selected filters (excluding current category)
          return Object.entries(currentFilters).every(([filterCategory, selectedTerms]) => {
            if (filterCategory === category.name || selectedTerms.length === 0) {
              return true; // Skip current category and empty filters
            }

            const filterTaxonomyKey = TAXONOMY_MAP[filterCategory];
            return product.taxonomies!.some(
              (taxonomy) =>
                taxonomy.taxonomy_uid === filterTaxonomyKey &&
                selectedTerms.includes(taxonomy.term_uid)
            );
          });
        }).length;

        // Determine if this term should be disabled
        const isSelected = currentFilters[category.name]?.includes(term.uid) ?? false;
        const disabled = !isSelected && count === 0;

        return {
          uid: term.uid,
          name: term.name,
          count,
          disabled,
        };
      }),
    };
  });
}

export function getFilterOptions() {
  return [
    {
      "name": "Materials",
      "terms": [
        {
          "uid": "white_gold",
          "name": "White Gold",
          "count": 0
        },
        {
          "uid": "gold",
          "name": "Gold",
          "count": 0
        },
        {
          "uid": "silver",
          "name": "Silver",
          "count": 0
        },
        {
          "uid": "diamond",
          "name": "Diamond",
          "count": 0
        }
      ]
    },
    {
      "name": "Product Type",
      "terms": [
        {
          "uid": "necklace",
          "name": "Necklace",
          "count": 0
        },
        {
          "uid": "earring",
          "name": "Earring",
          "count": 0
        },
        {
          "uid": "bracelet",
          "name": "Bracelet",
          "count": 0
        },
        {
          "uid": "ring",
          "name": "Ring",
          "count": 0
        }
      ]
    },
    {
      "name": "Product Line",
      "terms": [
        {
          "uid": "digital_dawn",
          "name": "Digital Dawn",
          "count": 0
        },
        {
          "uid": "charmed_revival",
          "name": "Charmed Revival",
          "count": 0
        },
        {
          "uid": "urban_armor",
          "name": "Urban Armor",
          "count": 0
        },
        {
          "uid": "elegant_rebellion",
          "name": "Elegant Rebellion",
          "count": 0
        }
      ]
    }
  ]
}