import MediaItem from "./Atoms/MediaItem";
import { Media as MediaProps } from "@/lib/types";

export default function Media({ image, width, height, widths, $ }: MediaProps) {
  return (
    <MediaItem
      {...($ && $.image)}
      src={image?.url}
      alt={image?.title || ""}
      width={width || 700}
      height={height || 700}
      ratio={(width || 700) / (height || 700)}
      loading="lazy"
      fit={"crop"}
      sizes="100vw,md:50vw"
      widths={widths || [380, 480, 680, 960, 1200, 1440, 1800]}
    />
  );
}
