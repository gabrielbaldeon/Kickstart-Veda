import { Page as PageProps, MegaMenu as MegaMenuProps } from "@/lib/types";
import { ComponentsRenderer } from "@/components/ComponentsRenderer";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";

export default function Page({
  page,
  header,
}: {
  page: PageProps;
  header?: MegaMenuProps;
}) {
  const components = page?.components || [];

  return (
    <>
      {header && (
        <MegaMenu header={header.header} product_lines={header.product_lines} />
      )}
      {components && (
        <ComponentsRenderer
          components={components}
          cslp={page.$}
          cslpWrapper="components"
        />
      )}
      <Footer />
    </>
  );
}
