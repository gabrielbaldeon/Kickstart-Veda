import { Metadata } from "next";
import { notFound } from "next/navigation";
import Preview from "@/components/Pages/Preview";
import ProductLine from "@/components/Pages/ProductLine";
import { createMetadata, fetchProductLineData } from "@/lib/pageUtils";

interface ProductLinePageProps {
  params: Promise<{
    line: string;
  }>;
}

export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: ProductLinePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return createMetadata("productLine", resolvedParams);
}

export default async function ProductLinePage({
  params,
}: ProductLinePageProps) {
  const resolvedParams = await params;
  const {
    content: entry,
    header,
    path,
    isPreview,
    previewType,
  } = await fetchProductLineData(resolvedParams);

  if (isPreview) {
    return <Preview path={path} header={header} type={previewType} />;
  }

  if (!entry) {
    return notFound();
  }

  return <ProductLine entry={entry} header={header} />;
}
