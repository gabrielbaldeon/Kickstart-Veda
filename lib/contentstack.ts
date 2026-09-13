import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";
import { Page, ProductLine, Header, MegaMenu, Category, Product } from "./types";
import { getContentstackEndpoint, type ContentstackEndpoints } from "@contentstack/utils";
import type { Metadata } from "next";
import type { EmbeddedItem } from '@contentstack/utils/dist/types/Models/embedded-object'

const endpoints = getContentstackEndpoint(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'NA', '', true) as ContentstackEndpoints
export const isPreview = process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === "true";

export const stack = contentstack.stack({
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,

  // Certain API endpoints can be set via environment variables for custom or dedicated Contentstack environments.
  // You can omit these in your project. Use @contentstack/utils getContentstackEndpoint to get the right urls for your region.
  region: process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints.contentDelivery as string,

  live_preview: {
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints.preview as string
  }
});

export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: false,
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',
    mode: "builder",
    stackSdk: stack.config as IStackSdk,
    stackDetails: {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,
    },
    clientUrlParams: {
      host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_APPLICATION || endpoints.application as string
    },
    editButton: {
      enable: true,
      exclude: ["outsideLivePreviewPortal"]
    },
  });
}

export async function getPage(url: string): Promise<Page> {
  const pageQuery = stack
    .contentType("page")
    .entry()

  pageQuery.addParams({ include_all: true });
  pageQuery.addParams({ include_all_depth: 2 });

  const result = await pageQuery
    .query()
    .where('url', QueryOperation.EQUALS, url)
    .find<Page>();

  if (result.entries) {
    const entry = result.entries[0]

    if (isPreview) {
      contentstack.Utils.addEditableTags(entry as EmbeddedItem, 'page', true);
    }

    return entry
  }
  else {
    throw new Error(`Page not found for url: ${url}`);
  }
}

export async function getHeader(): Promise<MegaMenu> {
  const [header, productLines] = await Promise.all([
    stack
      .contentType("header")
      .entry()
      .addParams({ include_all: "true" })
      .addParams({ include_all_depth: 1 })
      .find<Header>(),

    stack
      .contentType("product_line")
      .entry()
      .only(['url', 'title'])
      .query()
      .find<ProductLine>()
  ])

  if (header && header.entries && header.entries.length > 0) {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(header.entries[0] as EmbeddedItem, 'header', true);
    }
  }
  else {
    throw new Error("Header not found");
  }

  if (productLines) {
    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      productLines.entries?.map((productLine) => {
        contentstack.Utils.addEditableTags(productLine as EmbeddedItem, 'product_line', true);
      });
    }
  }

  else {
    throw new Error("Product lines not found");
  }

  return {
    header: header.entries[0],
    product_lines: productLines.entries as ProductLine[]
  }
}

export async function getCategory(url: string): Promise<Category> {
  const categoryQuery = await stack
    .contentType("category")
    .entry()

  categoryQuery.addParams({ include_all: true });
  categoryQuery.addParams({ include_all_depth: 2 });

  const result = await categoryQuery
    .query()
    .where('url', QueryOperation.EQUALS, url)
    .find<Category>();

  if (result.entries) {
    const entry = result.entries[0] as Category

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry as EmbeddedItem, 'category', true);
    }

    return entry
  }
  else {
    throw new Error(`Category not found for url: ${url}`);
  }
}

export async function getProduct(url: string): Promise<Product> {
  const productQuery = await stack
    .contentType("product")
    .entry()

  productQuery.addParams({ include_all: true });
  productQuery.addParams({ include_all_depth: 2 });

  const result = await productQuery
    .query()
    .where('url', QueryOperation.EQUALS, url)
    .find<Product>();

  if (result.entries) {
    const entry = result.entries[0] as Product

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry as EmbeddedItem, 'product', true);
    }

    return entry
  }
  else {
    throw new Error(`Product not found for url: ${url}`);
  }
}

export async function getProductLine(url: string): Promise<ProductLine> {
  const productLineQuery = await stack
    .contentType("product_line")
    .entry()

  productLineQuery.addParams({ include_all: true });
  productLineQuery.addParams({ include_all_depth: 2 });

  const result = await productLineQuery
    .query()
    .where('url', QueryOperation.EQUALS, url)
    .find<ProductLine>();

  if (result.entries) {
    const entry = result.entries[0] as ProductLine

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry as EmbeddedItem, 'product_line', true);
    }

    return entry
  }
  else {
    throw new Error(`ProductLine not found for url: ${url}`);
  }
}

export function createOgTags(content: Page): Metadata {
  return {
    title: content.title,
    description: content?.description,
    openGraph: {
      title: content.title,
      description: content?.description,
      url: content.url,
      images: [
        {
          url: content?.image?.url || '',
          width: 1200,
          height: 630,
          alt: content.title,
        },
      ],
    },
  };
}