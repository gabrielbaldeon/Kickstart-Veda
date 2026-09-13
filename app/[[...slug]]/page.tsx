import { Metadata } from "next";
import { notFound } from "next/navigation";
import Page from "@/components/Pages/Page";
import Preview from "@/components/Pages/Preview";
import { createMetadata, fetchPageData } from "@/lib/pageUtils";

interface SlugPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return createMetadata("page", resolvedParams);
}

export default async function SlugPage({ params }: SlugPageProps) {
  const resolvedParams = await params;
  const {
    content: page,
    header,
    path,
    isPreview,
    previewType,
  } = await fetchPageData(resolvedParams);

  if (isPreview) {
    return <Preview path={path} header={header} type={previewType} />;
  }

  if (!page) {
    return notFound();
  }

  return <Page page={page} header={header} />;
}
