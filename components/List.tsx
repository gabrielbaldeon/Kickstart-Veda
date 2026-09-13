import { isPreview } from "@/lib/contentstack";
import Title from "./Atoms/Title";
import ProductCard from "./Cards/product";
import CategoryCard from "./Cards/category";
import { List as BaseListProps, Product, Category } from "@/lib/types";
import { twMerge } from "tailwind-merge";
import React from "react";
import Static from "./Cards/static";

interface ListProps extends BaseListProps {
  cslpName?: string;
}

export default function List({
  title,
  title_tag,
  description,
  reference,
  cards,
  load_first_image_eager,
  $,
  cslpName = "reference",
}: ListProps) {
  return (
    <div className="mx-auto bg-white text-center p-10">
      {title && (
        <Title
          $={$ && $.title}
          text={title}
          theme={"dark"}
          uppercase={true}
          size="lg"
          classes="mb-2 text-2xl"
          as={title_tag || "h3"}
        />
      )}

      {description && (
        <p
          {...($ && $.description)}
          className="font-light text-center mb-8 max-w-prose mx-auto"
        >
          {description}
        </p>
      )}

      {cards && (
        <ul
          className={twMerge(
            "mt-8 grid grid-cols-2 gap-5 md:gap-10",
            cards.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-4",
            "justify-around md:px-24"
          )}
          {...($ && $[cslpName])}
        >
          {cards.map((card, index) => (
            <Static
              key={card.card._metadata?.uid || card.card.uid || `card-${index}`}
              $={card.card.$}
              card={card.card}
            />
          ))}
        </ul>
      )}

      {reference && (
        <ul
          className={twMerge(
            "mt-8 grid grid-cols-2 gap-5 md:gap-10",
            reference.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-4",
            "justify-around md:px-24"
          )}
          {...($ && $[cslpName])}
        >
          {reference.map((item, index) =>
            isPreview ? (
              <div key={item.uid} {...($ && $[`${cslpName}__${index}`])}>
                {item?._content_type_uid === "product" && (
                  <ProductCard
                    $={item.$}
                    product={item as Product}
                    loading={
                      index === 0 && load_first_image_eager ? "eager" : "lazy"
                    }
                  />
                )}
                {item?._content_type_uid === "category" && (
                  <CategoryCard
                    $={item.$}
                    category={item as Category}
                    loading={
                      index === 0 && load_first_image_eager ? "eager" : "lazy"
                    }
                  />
                )}
              </div>
            ) : (
              <React.Fragment key={item.uid}>
                {item?._content_type_uid === "product" && (
                  <ProductCard
                    key={item.uid}
                    $={item.$}
                    product={item as Product}
                    loading={
                      index === 0 && load_first_image_eager ? "eager" : "lazy"
                    }
                  />
                )}
                {item?._content_type_uid === "category" && (
                  <CategoryCard
                    key={item.uid}
                    $={item.$}
                    category={item as Category}
                    loading={
                      index === 0 && load_first_image_eager ? "eager" : "lazy"
                    }
                  />
                )}
              </React.Fragment>
            )
          )}
        </ul>
      )}
    </div>
  );
}
