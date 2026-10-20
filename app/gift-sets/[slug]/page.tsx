import { notFound } from "next/navigation";

type GiftSet = {
  title: string;
  url: string;
  gift_message?: string;
  image?: { url: string; title?: string };
  products?: { uid: string; title: string; url: string }[];
  product_lines?: { uid: string; title: string }[];
};

async function getGiftSet(slug: string): Promise<GiftSet | undefined> {
  const params = new URLSearchParams({
    environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
  });
  params.append("query", JSON.stringify({ url: `/gift-sets/${slug}` }));
  params.append("include[]", "products");
  params.append("include[]", "product_lines");

  const res = await fetch(
    `https://cdn.contentstack.io/v3/content_types/gift_set/entries?${params}`,
    {
      headers: {
        api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
        access_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
      },
      next: { revalidate: 1800 },
    }
  );

  const data = await res.json();
  return data.entries?.[0];
}

export default async function GiftSetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const giftSet = await getGiftSet(slug);
  if (!giftSet) notFound();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">{giftSet.title}</h1>
      {giftSet.image?.url && <img src={giftSet.image.url} alt={giftSet.title} />}
      {giftSet.gift_message && <p className="italic">{giftSet.gift_message}</p>}
      <ul>
        {giftSet.products?.map((p) => (
          <li key={p.uid}>
            <a href={p.url}>{p.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
