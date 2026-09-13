"use client";

import { useState, useEffect, useCallback } from "react";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import Page from "@/components/Pages/Page";
import Image from "next/image";
import Category from "./Category";
import ProductLine from "./ProductLine";
import Product from "./Product";

import {
  getCategory,
  getPage,
  getProduct,
  getProductLine,
  initLivePreview,
} from "@/lib/contentstack";

import type {
  Page as PageProps,
  Product as ProductProps,
  Pdp as PdpProps,
  ProductLine as ProductLineProps,
  Category as CategoryProps,
  MegaMenu as MegaMenuProps,
} from "@/lib/types";

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <Image
      src="/images/veda.svg"
      width={69}
      height={26}
      alt="Veda Logo"
      className="mb-2"
      priority={true}
    />
    <p className="text-xs font-light">Preview mode loading...</p>
  </div>
);

async function getPreviewData(
  type: "page" | "product" | "productLine" | "category",
  path: string
) {
  switch (type) {
    case "page":
      return getPage(path);
    case "product":
      return getProduct(path);
    case "productLine":
      return getProductLine(path);
    case "category":
      return getCategory(path);
    default:
      throw new Error(`Invalid type: ${type}`);
  }
}

export default function Preview({
  path,
  header,
  type,
}: {
  path: string;
  header?: MegaMenuProps;
  type: "page" | "productLine" | "category" | "product";
}) {
  const [content, setContent] = useState<PageProps>();

  const getContent = useCallback(async () => {
    const data = await getPreviewData(type, path);
    setContent(data);
  }, [path, type]);

  useEffect(() => {
    initLivePreview();
    ContentstackLivePreview.onEntryChange(getContent);
  }, [path, getContent]);

  if (!content) {
    return <LoadingState />;
  }

  switch (type) {
    case "page":
      return <Page page={content as PageProps} header={header} />;
    case "productLine":
      return (
        <ProductLine entry={content as ProductLineProps} header={header} />
      );
    case "category":
      return <Category entry={content as CategoryProps} header={header} />;
    case "product":
      return (
        <Product entry={content as ProductProps | PdpProps} header={header} />
      );
    default:
      return null;
  }
}
