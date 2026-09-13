import { Metadata } from "next";
import { notFound } from "next/navigation";
import Preview from "@/components/Pages/Preview";
import Category from "@/components/Pages/Category";
import { createMetadata, fetchCategoryData } from "@/lib/pageUtils";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return createMetadata("category", resolvedParams);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    const resolvedParams = await params;
    const {
      content: entry,
      header,
      path,
      isPreview,
      previewType,
    } = await fetchCategoryData(resolvedParams);

    if (isPreview) {
      return <Preview path={path} header={header} type={previewType} />;
    }

    if (!entry) {
      return notFound();
    }

    return <Category entry={entry} header={header} />;
  } catch (error) {
    console.error("Error loading category:", error);
    throw error;
  }
}
