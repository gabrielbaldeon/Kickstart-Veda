import { Metadata } from "next";
import { getHeaderCached } from "@/lib/pageUtils";
import MegaMenu from "@/components/MegaMenu";
import { getAllProducts, getAllProductsForCounting } from "@/lib/filterSearch";
import FilterSearch from "@/components/FilterSearch";
import Breadcrumb from "@/components/Breadcrumb";

export const dynamic = "force-static";
export const revalidate = 1800;

const breadcrumbLinks = [
  { title: "Home", url: "/" },
  { title: "Products", url: "/products" },
];

export async function generateMetadata(): Promise<Metadata> {
  try {
    return {
      title: "Veda Products - Luxury Jewelry Collection",
      description:
        "Discover our complete collection of luxury jewelry. Filter by materials, product type, and collection to find your perfect piece.",
    };
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading this product",
    };
  }
}

export default async function ProductsPage() {
  const header = await getHeaderCached();

  const [{ products }, allProductsForCounting] = await Promise.all([
    getAllProducts(),
    getAllProductsForCounting(),
  ]);

  return (
    <>
      {header && (
        <MegaMenu header={header.header} product_lines={header.product_lines} />
      )}

      <Breadcrumb links={breadcrumbLinks} />

      <div className="px-4 pb-4 bg-white">
        <FilterSearch
          initialProducts={products}
          allProductsForCounting={allProductsForCounting}
        />
      </div>
    </>
  );
}
