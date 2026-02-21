# SEO Configuration Guide

## Overview
Comprehensive SEO metadata has been implemented using Next.js App Router with OpenGraph tags, Twitter cards, and JSON-LD structured data.

## Files Updated/Created

### 1. `app/layout.tsx`
**Enhanced with:**
- Meta title with template support
- Comprehensive meta description (bilingual)
- 40+ relevant keywords (Hindi + English)
- OpenGraph tags for social media sharing
- Twitter card metadata
- Search engine verification placeholders
- Robots configuration

### 2. `app/page.tsx`
**Added:**
- Page-specific metadata
- JSON-LD structured data (LocalBusiness schema)
- Product catalog schema with pricing
- Business hours, location, and contact info

### 3. `app/sitemap.ts`
**Created:**
- Dynamic sitemap generation
- Includes all main sections (home, products, calculator, contact)
- Proper priority and change frequency settings

### 4. `public/robots.txt`
**Created:**
- Allows all search engine crawlers
- References sitemap location

## Required Customizations

### ⚠️ IMPORTANT: Replace these placeholders with actual values

#### In `app/layout.tsx` (lines 23-104):
- [ ] `metadataBase` URL: Replace 'https://hanumanbhatta.com' with actual domain
- [ ] `openGraph.url`: Replace with actual URL
- [ ] `openGraph.images`: Add actual `/og-image.jpg` (1200x630px recommended)
- [ ] `twitter.images`: Add actual `/twitter-image.jpg` (1200x630px recommended)
- [ ] `twitter.creator`: Add actual Twitter handle or remove line
- [ ] `verification.google`: Add Google Search Console verification code

#### In `app/page.tsx` (lines 29-133):
- [ ] `url`: Replace 'https://hanumanbhatta.com' with actual domain
- [ ] `telephone`: Replace '+91-98765-43210' with actual phone number
- [ ] `email`: Replace 'info@hanumanbhatta.com' with actual email
- [ ] `address`: Update complete address details (street, city, state, postal code)
- [ ] `geo.latitude` & `geo.longitude`: Add actual GPS coordinates
- [ ] `openingHoursSpecification`: Update actual business hours
- [ ] `aggregateRating`: Update when you have real reviews (or remove)
- [ ] `sameAs`: Add actual social media profile URLs

#### In `app/sitemap.ts` (line 4):
- [ ] `baseUrl`: Replace 'https://hanumanbhatta.com' with actual domain

#### In `public/robots.txt` (line 5):
- [ ] Update sitemap URL with actual domain

## Image Requirements

Create and add these images to `/public` folder:

1. **`og-image.jpg`** (1200x630px)
   - For Facebook, LinkedIn sharing
   - Should include logo, tagline, and key visual

2. **`twitter-image.jpg`** (1200x630px)
   - For Twitter card
   - Can be same as OG image or custom

3. **`og-home.jpg`** (1200x630px)
   - Specific to homepage
   - Show brick products or facility

## Verification Steps

### Google Search Console:
1. Go to search.google.com/search-console
2. Add property with your domain
3. Copy verification code
4. Add to `verification.google` in layout.tsx

### Test Your SEO:
- **OpenGraph**: Use https://metatags.io/ to preview social cards
- **Twitter Cards**: Use https://cards-dev.twitter.com/validator
- **Structured Data**: Use https://search.google.com/test/rich-results
- **Mobile Friendly**: Use https://search.google.com/test/mobile-friendly

## Keywords Strategy

Current keywords target:
- **Hindi/Local**: eent bhatta, ईंट भट्टा, laal eent, mitti ki eent
- **Product Types**: first class bricks, second class bricks, brick bats, rora
- **Business Terms**: brick supplier, manufacturer, kiln, factory
- **Location**: Add your city/region specific keywords as needed
- **Construction**: building materials, wall construction, masonry

## Local SEO Tips

1. **Add location-specific keywords** in keywords array
2. **Update JSON-LD address** with exact business location
3. **Add GPS coordinates** for Google Maps integration
4. **Claim Google Business Profile** listing
5. **Add schema.org/GeoCoordinates** (already included)

## Monitoring

After deployment, monitor:
- Google Search Console for indexing status
- Google Analytics for organic traffic
- Rich results test for structured data
- Page speed insights for performance

## Next Steps

1. ✅ Replace all placeholder values
2. ✅ Create and add OG/Twitter images
3. ✅ Verify with Google Search Console
4. ✅ Submit sitemap to search engines
5. ✅ Test with SEO tools mentioned above
6. ✅ Regularly update lastModified dates in sitemap
