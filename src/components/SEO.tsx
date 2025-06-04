import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = "Women's Weight Loss & Fitness in Kakinada | Rebuild Women",
  description = "Join Kakinada's exclusive fitness programs for women: Strength Training, Weight Loss Program, and Zumba with certified female trainers. Transform your body and health today!",
  keywords = "women fitness, Kakinada gym, weight loss, fitness for women, rebuild women, women-only gym",
  image = "https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747488784/ukxacg9kkjcewvwgml2u.png",
  url = "https://www.rebuildwomens.fit",
  type = "website",
  article = false,
}) => {
  const siteUrl = "https://www.rebuildwomens.fit";
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Rebuild Women" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rebuildwomen" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;
