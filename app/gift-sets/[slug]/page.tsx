import { notFound } from "next/navigation";
import { QueryOperation } from "@contentstack/delivery-sdk";
import { stack } from "../../../lib/contentstack";

type GiftSet = {
  title: string;
  url: string;
  gift_message?: string;
  image?: { url: string; title?: string };
  products?: { uid: string; title: string; url: string }[];
  product_lines?: { uid: string; title: string }[];
};

export default async function GiftSetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const result = await stack
    .contentType("gift_set")
    .entry()
    .addParams({ include_all: true, include_all_depth: 1 })
    .query()
    .where("url", QueryOperation.EQUALS, `/gift-sets/${slug}`)
    .find<GiftSet>();

  const giftSet = result.entries?.[0];
  if (!giftSet) notFound();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">{giftSet.title}</h1>
      {giftSet.image?.url && <img src={giftSet.image.url} alt={giftSet.title} />}
      {giftSet.gift_message && <p className="italic">{giftSet.gift_message}</p>}
      <ul>
        {giftSet.products?.map((p) => (
          <li key={p.uid}><a href={p.url}>{p.title}</a></li>
        ))}
      </ul>
    </main>
  );
}
