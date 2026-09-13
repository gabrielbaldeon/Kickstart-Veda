import { Metadata } from "next";
import { notFound } from "next/navigation";
import Product from "@/components/Pages/Product";
import Preview from "@/components/Pages/Preview";
import { createMetadata, fetchProductData } from "@/lib/pageUtils";

interface ProductPageProps {
  params: Promise<{
    line: string;
    slug: string;
  }>;
}

export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return createMetadata("product", resolvedParams);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const {
    content: product,
    header,
    path,
    isPreview,
    previewType,
  } = await fetchProductData(resolvedParams);

  if (isPreview) {
    return <Preview path={path} header={header} type={previewType} />;
  }

  if (!product) {
    return notFound();
  }

  return <Product entry={product} header={header} />;
}
