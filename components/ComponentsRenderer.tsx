import React from "react";
import { isPreview } from "@/lib/contentstack";
import { VB_EmptyBlockParentClass } from "@contentstack/live-preview-utils";
import {
  ComponentKV,
  ComponentName,
  Components,
  ComponentsRendererProps,
} from "@/lib/types";

import HeroComponent from "@/components/Hero";
import ListComponent from "@/components/List";
import TwoColumnComponent from "@/components/TwoColumn";
import MediaComponent from "@/components/Media";
import RichTextComponent from "@/components/RichText";

const componentMap = {
  hero: HeroComponent,
  list: ListComponent,
  two_column: TwoColumnComponent,
  media: MediaComponent,
  rich_text: RichTextComponent,
} as const;

export function mapComponentsToKV(components: Components[]): ComponentKV[] {
  return components.map((component) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = Object.entries(component) as [ComponentName, any][];

    if (entries.length === 0) {
      return { name: "" as ComponentName, props: null };
    }

    const [name, props] = entries[0];

    return { name, props };
  });
}

export const ComponentsRenderer: React.FC<ComponentsRendererProps> = ({
  components,
  cslp,
  cslpWrapper,
}) => {
  const mappedComponents = mapComponentsToKV(components);

  // Early return for empty components in preview
  if (mappedComponents.length === 0 && isPreview) {
    return (
      <div className={VB_EmptyBlockParentClass} {...cslp?.[cslpWrapper!]} />
    );
  }

  const renderComponent = (component: any, index: number) => {
    if (!component.name || !component.props) return null;

    const key = component.props?._metadata?.uid || `component--${index}`;
    const Component = componentMap[component.name as keyof typeof componentMap];

    if (!Component) {
      return (
        <div
          className="p-4 bg-red-200 border border-red-600 m-4 overflow-auto"
          key={key}
        >
          <h1 className="text-xl mb-4">
            No component found for: <strong>{component.name}</strong>
          </h1>
          <pre>{JSON.stringify(component.props, null, 2)}</pre>
        </div>
      );
    }

    const element = <Component {...component.props} key={key} />;

    // Wrap with CSLP attributes if in preview mode
    return isPreview && cslp?.[`${cslpWrapper}__${index}`] ? (
      <div {...cslp?.[`${cslpWrapper}__${index}`]} key={key}>
        {element}
      </div>
    ) : (
      element
    );
  };

  const renderedComponents = mappedComponents.map(renderComponent);

  return isPreview ? (
    <div {...cslp?.[cslpWrapper!]}>{renderedComponents}</div>
  ) : (
    <>{renderedComponents}</>
  );
};
