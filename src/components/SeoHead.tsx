import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/config/site";
import { SEO_KEYWORDS } from "@/config/seo";

const ogImage = `${SITE_URL}/2.jpg`;

type SeoHeadProps = {
  title: string;
  description: string;
  path: string;
  /** Omit to use the site-wide keyword set from `config/seo`. */
  keywords?: string;
};

export function SeoHead({ title, description, path, keywords = SEO_KEYWORDS }: SeoHeadProps) {
  const pathname = path.startsWith("/") ? path : `/${path}`;
  const url = `${SITE_URL}${pathname}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
