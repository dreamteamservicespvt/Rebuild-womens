import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  imageUrl?: string;
  imageAlt?: string;
  structuredData?: Record<string, any>;
}

/**
 * Component for adding SEO metadata to pages
 * Usage: <SEOHead title="Page Title" description="Page description" path="/path" />
 */
const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  path,
  keywords,
  imageUrl = "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747488784/ukxacg9kkjcewvwgml2u.png",
  imageAlt = "Rebuild Women Fitness",
  structuredData,
}) => {
  const url = `https://www.rebuildwomens.fit${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Rebuild Women" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
