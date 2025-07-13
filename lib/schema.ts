import { store } from '@/redux/store';
import { getSeoPageByUrl, SeoPageConfig } from './seo';

// Base interface for all schema types
interface SchemaBase {
  '@context': string;
  '@type': string;
}

// Organization schema
export interface OrganizationSchema extends SchemaBase {
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
  description?: string;
  address?: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    '@type': string;
    telephone: string;
    contactType: string;
  };
}

// WebPage schema
export interface WebPageSchema extends SchemaBase {
  name: string;
  description: string;
  url: string;
  isPartOf: {
    '@id': string;
  };
  datePublished?: string;
  dateModified?: string;
  breadcrumb?: {
    '@id': string;
  };
  inLanguage?: string;
  potentialAction?: {
    '@type': string;
    target: string;
  }[];
}

// BlogPosting schema
export interface BlogPostingSchema extends SchemaBase {
  headline: string;
  description: string;
  image: string | string[];
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  articleBody?: string;
  keywords?: string;
}

// ItemList schema (for content table/map)
export interface ItemListSchema extends SchemaBase {
  itemListElement: {
    '@type': string;
    position: number;
    name: string;
    item: string;
  }[];
}

/**
 * Generate Organization schema for the homepage
 */
export function generateOrganizationSchema(): OrganizationSchema {
  const state = store.getState();
  const general = state.general.general;
  const siteName = general?.siteName || 'WordPress Clone';
  const siteDescription = general?.siteDescription || 'Modern CMS Solution';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wordpress-clone.com';
  
  // Get schema settings if available
  const schemaSettings = general?.seo?.schema?.organization;
  const socialLinks = schemaSettings?.socialLinks || [
    'https://facebook.com/wordpressclone',
    'https://twitter.com/wordpressclone',
    'https://instagram.com/wordpressclone',
    'https://linkedin.com/company/wordpressclone'
  ];
  
  const logo = schemaSettings?.logo || '/logo.png';
  const address = schemaSettings?.address;
  
  // Create organization schema
  const organizationSchema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: logo.startsWith('http') ? logo : `${siteUrl}${logo}`,
    description: siteDescription,
    sameAs: socialLinks,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: general?.phone?.phoneNumber || '+905555555555',
      contactType: 'customer service'
    }
  };
  
  // Add address if available
  if (address && (address.streetAddress || address.addressLocality)) {
    organizationSchema.address = {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress || '',
      addressLocality: address.addressLocality || '',
      addressRegion: address.addressRegion || '',
      postalCode: address.postalCode || '',
      addressCountry: address.addressCountry || 'TR'
    };
  }
  
  return organizationSchema;
}

/**
 * Generate WebPage schema for any page
 */
export function generateWebPageSchema(pageUrl: string, title: string, description: string, lastModified?: string): WebPageSchema {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wordpress-clone.com';
  const fullUrl = `${siteUrl}${pageUrl}`;
  const state = store.getState();
  const siteName = state.general.general?.siteName || 'WordPress Clone';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: fullUrl,
    isPartOf: {
      '@id': siteUrl
    },
    dateModified: lastModified || new Date().toISOString(),
    inLanguage: 'tr-TR',
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: fullUrl
      }
    ]
  };
}

/**
 * Generate BlogPosting schema for blog articles
 */
export function generateBlogPostingSchema(
  title: string,
  description: string,
  imageUrl: string,
  authorName: string,
  datePublished: string,
  dateModified: string | undefined,
  content: string,
  url: string
): BlogPostingSchema {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wordpress-clone.com';
  const fullUrl = `${siteUrl}${url}`;
  const state = store.getState();
  const siteName = state.general.general?.siteName || 'WordPress Clone';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl
    },
    articleBody: content
  };
}

/**
 * Generate ItemList schema for content map/table of contents
 */
export function generateItemListSchema(items: { name: string; url: string }[]): ItemListSchema {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wordpress-clone.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
    }))
  };
}

/**
 * Convert schema object to JSON-LD script string
 */
export function schemaToString(schema: any): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * Generate multiple schema objects for a page
 */
export function generatePageSchemas(
  pageUrl: string,
  title: string,
  description: string,
  lastModified?: string,
  isHomePage = false,
  isBlogPost = false,
  blogData?: {
    title: string;
    description: string;
    image: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    content: string;
  },
  contentItems?: { name: string; url: string }[]
): string {
  const schemas = [];
  const state = store.getState();
  const general = state.general.general;
  const schemaSettings = general?.seo?.schema;
  
  // Add WebPage schema for all pages if enabled
  if (!schemaSettings || schemaSettings.enableWebPageSchema !== false) {
    schemas.push(generateWebPageSchema(pageUrl, title, description, lastModified));
  }
  
  // Add Organization schema only for homepage
  if (isHomePage) {
    schemas.push(generateOrganizationSchema());
  }
  
  // Add BlogPosting schema for blog posts if enabled
  if (isBlogPost && blogData && (!schemaSettings || schemaSettings.enableBlogPostingSchema !== false)) {
    schemas.push(generateBlogPostingSchema(
      blogData.title,
      blogData.description,
      blogData.image,
      blogData.author,
      blogData.datePublished,
      blogData.dateModified,
      blogData.content,
      pageUrl
    ));
  }
  
  // Add ItemList schema if content items are provided and enabled
  if (contentItems && contentItems.length > 0 && (!schemaSettings || schemaSettings.enableItemListSchema !== false)) {
    schemas.push(generateItemListSchema(contentItems));
  }
  
  // Convert all schemas to JSON-LD script tags
  return schemas.map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join('\n');
} 