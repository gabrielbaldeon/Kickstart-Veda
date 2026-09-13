import { Metadata } from "next";
import { cache } from "react";
import {
  getHeader,
  getPage,
  getCategory,
  getProduct,
  getProductLine,
  createOgTags,
  isPreview
} from "@/lib/contentstack";

// Cached functions to avoid repeated calls
export const getHeaderCached = cache(getHeader);
export const getPageCached = cache(getPage);
export const getCategoryCached = cache(getCategory);
export const getProductCached = cache(getProduct);
export const getProductLineCached = cache(getProductLine);

// Helper function to build paths from URL parameters
export function buildPath(
  type: "page" | "category" | "product" | "productLine",
  params: any
): string {
  switch (type) {
    case "page":
      return params.slug ? `/${params.slug.join("/")}` : "/";
    case "category":
      return `/category/${params.category}`;
    case "product":
      return `/products/${params.line}/${params.slug}`;
    case "productLine":
      return `/products/${params.line}`;
    default:
      throw new Error(`Unknown path type: ${type}`);
  }
}

// Unified metadata generator
export async function createMetadata(
  type: "page" | "category" | "product" | "productLine",
  params: any
): Promise<Metadata> {
  try {
    const path = buildPath(type, params);
    let content;

    switch (type) {
      case "page":
        content = await getPageCached(path);
        break;
      case "category":
        content = await getCategoryCached(path);
        break;
      case "product":
        content = await getProductCached(path);
        break;
      case "productLine":
        content = await getProductLineCached(path);
        break;
      default:
        throw new Error(`Unknown content type: ${type}`);
    }

    if (!content) {
      const notFoundTitles = {
        page: "Page Not Found",
        category: "Category Not Found",
        product: "Product Not Found",
        productLine: "Product Line Not Found"
      };

      const notFoundDescriptions = {
        page: "The requested page could not be found",
        category: "The requested category could not be found",
        product: "The requested product could not be found",
        productLine: "The requested product line could not be found"
      };

      return {
        title: notFoundTitles[type],
        description: notFoundDescriptions[type],
      };
    }

    return createOgTags(content);
  } catch (error) {
    console.error(`Error generating ${type} metadata:`, error);
    return {
      title: "Error",
      description: `An error occurred while loading this ${type}`,
    };
  }
}

// Unified data fetcher
export async function fetchData(
  type: "page" | "category" | "product" | "productLine",
  params: any
) {
  const path = buildPath(type, params);
  const header = await getHeaderCached();
  let content;

  switch (type) {
    case "page":
      content = await getPageCached(path);
      break;
    case "category":
      content = await getCategoryCached(path);
      break;
    case "product":
      content = await getProductCached(path);
      break;
    case "productLine":
      content = await getProductLineCached(path);
      break;
    default:
      throw new Error(`Unknown content type: ${type}`);
  }

  return {
    content,
    header,
    path,
    isPreview,
    previewType: type,
  };
}

// Typed wrapper functions for better type safety
export async function fetchPageData(params: { slug?: string[] }) {
  const result = await fetchData("page", params);
  return {
    content: result.content as Awaited<ReturnType<typeof getPageCached>>,
    header: result.header,
    path: result.path,
    isPreview: result.isPreview,
    previewType: "page" as const,
  };
}

export async function fetchCategoryData(params: { category: string }) {
  const result = await fetchData("category", params);
  return {
    content: result.content as Awaited<ReturnType<typeof getCategoryCached>>,
    header: result.header,
    path: result.path,
    isPreview: result.isPreview,
    previewType: "category" as const,
  };
}

export async function fetchProductData(params: { line: string; slug: string }) {
  const result = await fetchData("product", params);
  return {
    content: result.content as Awaited<ReturnType<typeof getProductCached>>,
    header: result.header,
    path: result.path,
    isPreview: result.isPreview,
    previewType: "product" as const,
  };
}

export async function fetchProductLineData(params: { line: string }) {
  const result = await fetchData("productLine", params);
  return {
    content: result.content as Awaited<ReturnType<typeof getProductLineCached>>,
    header: result.header,
    path: result.path,
    isPreview: result.isPreview,
    previewType: "productLine" as const,
  };
}
