export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[] | object;
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  _metadata?: Metadata;
  description?: string;
  dimension?: {
    height: number;
    width: number;
  };
  publish_details: PublishDetails;
}

export interface Link {
  title: string;
  href: string;
}

export interface Taxonomy {
  taxonomy_uid: string;
  max_terms?: number;
  mandatory: boolean;
  non_localizable: boolean;
  term_uid: string;
}

export interface JSONRTENode {
  type: string;
  uid: string;
  _version: number;
  attrs: Record<string, any>;
  children?: JSONRTENode[];
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  src?: string;
  alt?: string;
  href?: string;
  target?: string;
  embed?: {
    type: string;
    uid: string;
    _version: number;
    attrs: Record<string, any>;
  };
}

export interface CSLPAttribute {
  "data-cslp"?: string;
  "data-cslp-parent-field"?: string;
}
export type CSLPFieldMapping = CSLPAttribute;

// ComponentsRenderer types
export type ComponentName = keyof Components;

export interface ComponentKV {
  name: ComponentName;
  props: any | null;
}

export type ComponentsRendererProps = {
  components: Components[];
  cslp?: { [key: string]: CSLPFieldMapping | undefined };
  cslpWrapper?: string;
};

export interface Metadata {
  uid: string;
}

export interface SystemFields {
  uid?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  _content_type_uid?: string;
  tags?: string[];
  ACL?: any[];
  _version?: number;
  _in_progress?: boolean;
  locale?: string;
  publish_details?: PublishDetails;
  title?: string;
  _metadata?: Metadata;
}

export interface MegaMenu {
  header: Header,
  product_lines: ProductLine[]
}

export interface Cards extends SystemFields {
  card: Card;
}

export interface List {
  _version?: number;
  title?: string;
  title_tag?: ("h1" | "h2" | "h3" | "h4") | null;
  description?: string;
  load_first_image_eager: boolean;
  reference?: (ProductLine | Product | Category)[];
  cards?: Cards[];
  $?: {
    title?: CSLPFieldMapping;
    title_tag?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    load_first_image_eager?: CSLPFieldMapping;
    reference?: CSLPFieldMapping;
    cards?: CSLPFieldMapping;
    [key: string]: CSLPFieldMapping | undefined;
  };
}

export interface SideA extends SystemFields {
  list: List;
  media: Media;
  rich_text: RichText;
}

export interface TwoColumn {
  _version?: number;
  side_a?: SideA[];
  side_b?: SideA[];
  $?: {
    side_a?: CSLPFieldMapping;
    side_b?: CSLPFieldMapping;
  };
}

export interface Card extends SystemFields {
  _version?: number;
  title?: string;
  description?: string;
  image?: File | null;
  link?: Link;
  $?: {
    title?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    image?: CSLPFieldMapping;
    link?: CSLPFieldMapping;
  };
}

export interface Media {
  _version?: number;
  image: File;
  width?: number | null;
  height?: number | null;
  crop: boolean;
  widths?: number[] | null;
  $?: {
    image?: CSLPFieldMapping;
    width?: CSLPFieldMapping;
    height?: CSLPFieldMapping;
    crop?: CSLPFieldMapping;
    widths?: CSLPFieldMapping;
  };
}

export interface Cta {
  text?: string;
  link?: Link;
  $?: {
    text?: CSLPFieldMapping;
    link?: CSLPFieldMapping;
  };
}

export interface Ctas extends SystemFields {
  cta: Cta
}

export interface RichText {
  _version?: number;
  title?: string;
  title_tag?: ("h1" | "h2" | "h3" | "h4") | null;
  content?: {
    type: string;
    uid: string;
    _version: number;
    attrs: Record<string, any>;
    children: JSONRTENode[];
  };
  alternative_content?: string;
  ctas?: Cta;
  $?: {
    title?: CSLPFieldMapping;
    title_tag?: CSLPFieldMapping;
    content?: CSLPFieldMapping;
    alternative_content?: CSLPFieldMapping;
    ctas?: CSLPFieldMapping;
  };
}

export interface PageHeader {
  _version?: number;
  reference: Header[];
  $?: {
    reference?: CSLPFieldMapping;
  };
}

export interface Hero {
  _version?: number;
  title?: string;
  title_tag?: ("h1" | "h2" | "h3" | "h4") | null;
  description?: string;
  ctas?: Ctas[];
  image?: File | null;
  video?: File | null;
  design?: {
    copy_location: "left" | "right";
    overlay_opacity: number;
    theme: "dark" | "light";
    $?: {
      copy_location?: CSLPFieldMapping;
      overlay_opacity?: CSLPFieldMapping;
      theme?: CSLPFieldMapping;
    };
  };
  $?: {
    title?: CSLPFieldMapping;
    title_tag?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    ctas?: CSLPFieldMapping;
    image?: CSLPFieldMapping;
    video?: CSLPFieldMapping;
    design?: CSLPFieldMapping;
  };
}

export interface Components extends SystemFields {
  list: List;
  media: Media;
  rich_text: RichText;
  two_column: TwoColumn;
  hero: Hero;
}

export interface Pdp extends SystemFields {
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  product?: Product[];
  components?: Components[];
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    image?: CSLPFieldMapping;
    product?: CSLPFieldMapping;
    components?: CSLPFieldMapping;
  };
}

export interface Links extends SystemFields {
  link: {
    label: string;
    item?: Link;
    reference?: (ProductLine | Product | Page | Category)[];
    featured_product?: Product[];
    show_product_lines: boolean;
    show_all_products_links: boolean;
    $?: {
      label?: CSLPFieldMapping;
      item?: CSLPFieldMapping;
      reference?: CSLPFieldMapping;
      featured_product?: CSLPFieldMapping;
      show_product_lines?: CSLPFieldMapping;
      show_all_products_links?: CSLPFieldMapping;
    };
  };
}

export interface Header extends SystemFields {
  _version?: number;
  title: string;
  logo?: File | null;
  links?: Links[];
  $?: {
    title?: CSLPFieldMapping;
    logo?: CSLPFieldMapping;
    links?: CSLPFieldMapping;
  };
}

export interface Page extends SystemFields {
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  components?: Components[];
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    image?: CSLPFieldMapping;
    components?: CSLPFieldMapping;
  };
}

export interface Category extends SystemFields {
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  media?: File | null;
  products?: Product[];
  taxonomies?: Taxonomy[];
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    media?: CSLPFieldMapping;
    products?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}

export interface ProductLine extends SystemFields {
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  products?: Product[];
  taxonomies?: Taxonomy[];
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    image?: CSLPFieldMapping;
    products?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}

export interface Product extends SystemFields {
  _version?: number;
  title: string;
  url?: string;
  short_description?: string;
  description?: string;
  price?: number | null;
  category?: Category[];
  product_line?: ProductLine[];
  media?: File[] | null;
  taxonomies?: Taxonomy[];
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    short_description?: CSLPFieldMapping;
    description?: CSLPFieldMapping;
    price?: CSLPFieldMapping;
    category?: CSLPFieldMapping;
    product_line?: CSLPFieldMapping;
    media?: CSLPFieldMapping;
    media__parent?: CSLPFieldMapping;
    taxonomies?: CSLPFieldMapping;
  };
}
