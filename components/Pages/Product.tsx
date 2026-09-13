import type {
  Product as ProductProps,
  MegaMenu as MegaMenuProps,
} from "@/lib/types";
import ProductDetails from "@/components/ProductDetails";
import List from "@/components/List";
import Breadcrumb from "@/components/Breadcrumb";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";

export default function Page({
  entry,
  header,
}: {
  entry?: ProductProps;
  header?: MegaMenuProps;
}) {
  const breadcrumbLinks = [
    { title: "Home", url: "/" },
    { title: "Products", url: "/products" },
  ];

  if (entry && "product_line" in entry && entry.product_line?.[0]) {
    breadcrumbLinks.push({
      title: entry.product_line[0].title,
      url: entry.product_line[0].url || "",
    });
  }

  if (entry?.title && entry?.url) {
    breadcrumbLinks.push({
      title: entry.title,
      url: entry.url || "",
    });
  }

  return (
    <>
      {header && (
        <MegaMenu header={header.header} product_lines={header.product_lines} />
      )}

      <Breadcrumb links={breadcrumbLinks} />
      {entry && (
        <>
          <ProductDetails product={entry} />

          <List
            reference={entry.product_line?.[0].products || []}
            title={`Explore ${entry.product_line?.[0].title}`}
            title_tag="h2"
            description={entry.product_line?.[0].description}
            load_first_image_eager={true}
            $={entry.$}
          />

          <List
            reference={entry.category?.[0].products || []}
            title={`More ${entry.category?.[0].title}`}
            title_tag="h2"
            description={entry.category?.[0].description}
            load_first_image_eager={true}
            $={entry.$}
          />
        </>
      )}

      <Footer />
    </>
  );
}
