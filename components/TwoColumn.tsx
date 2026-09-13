import Media from "./Media";
import RichText from "./RichText";

type TwoColumnProps = {
  media_first?: boolean;
  media?: any;
  rich_text?: any;
  $?: any;
};

export default function TwoColumn({
  media_first,
  media,
  rich_text,
  $,
}: TwoColumnProps) {
  return (
    <div className="mx-auto bg-[#FFF3E0] grid grid-cols-1 md:grid-cols-2 gap-4">
      {media_first ? (
        <>
          <div className="flex flex-col justify-center items-center">
            <Media {...media} $={$ && $.media} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <RichText {...rich_text} $={$ && $.rich_text} />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center">
            <RichText {...rich_text} $={$ && $.rich_text} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <Media {...media} $={$ && $.media} />
          </div>
        </>
      )}
    </div>
  );
}
