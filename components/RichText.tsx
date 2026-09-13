import Cta from "./Atoms/Cta";
import Title from "./Atoms/Title";
import RichTextRenderer from "./RichTextRenderer";
import { RichText as RichTextProps } from "@/lib/types";

export default function RichText({
  title,
  title_tag,
  content,
  alternative_content,
  ctas,
  $,
}: RichTextProps) {
  return (
    <div className="text-center p-12">
      {title && (
        <Title
          $={$ && $.title}
          text={title}
          theme={"dark"}
          uppercase={true}
          size="lg"
          classes="mb-2"
          as={title_tag || "p"}
        />
      )}

      {alternative_content ? (
        <div
          {...($ && $.alternative_content)}
          dangerouslySetInnerHTML={{ __html: alternative_content }}
          className="font-light richtext-content"
        />
      ) : (
        <>
          {content ? (
            <RichTextRenderer
              json={content}
              {...($ && $.content)}
              className="font-light richtext-content"
            />
          ) : null}
        </>
      )}

      {ctas ? (
        <div className="mt-4 flex space-x-4 justify-center" {...($ && $.ctas)}>
          <Cta link={ctas?.link} text={ctas?.text} theme="dark" />
        </div>
      ) : null}
    </div>
  );
}
