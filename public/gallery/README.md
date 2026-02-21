# Gallery Images Directory

This folder contains all images for the brick manufacturing gallery section.

## How to Add New Images

1. **Add your images to this folder** with descriptive filenames:
   - `brick-kiln.jpg` - Traditional brick kiln
   - `brick-stacks.jpg` - Stacked bricks
   - `firing-process.jpg` - Kiln firing process
   - `brick-loading.jpg` - Loading/dispatch
   - `raw-clay.jpg` - Raw materials
   - `brick-drying.jpg` - Drying process
   - `quality-check.jpg` - Quality control
   - `brick-factory.jpg` - Facility overview
   - `delivery-truck.jpg` - Delivery vehicles

2. **Update Gallery.tsx** component:
   - Open `/components/Gallery.tsx`
   - Add new image objects to the `galleryImages` array
   - Follow this format:
   ```typescript
   {
     id: 10, // Increment ID
     src: '/gallery/your-image-name.jpg',
     alt: 'SEO-friendly description',
     caption: 'Display caption',
     category: 'Production|Inventory|Logistics|Materials|Quality|Facility'
   }
   ```

## Image Requirements

### Technical Specs
- **Format:** JPG or WebP (PNG for transparency if needed)
- **Size:** Minimum 1200px width for quality
- **Aspect Ratio:** Square (1:1) works best, but any ratio is supported
- **File Size:** Under 500KB per image (compress before uploading)
- **Color Space:** sRGB

### Compression Tools
- [TinyPNG](https://tinypng.com/) - Free online compression
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- ImageMagick CLI: `convert input.jpg -quality 85 -resize 1200x output.jpg`

### Photography Tips
1. **Lighting:** Natural daylight works best
2. **Focus:** Show clear details of bricks and processes
3. **Authenticity:** Real photos build more trust than staged ones
4. **Variety:** Mix wide shots (facility) with close-ups (bricks)
5. **People:** Include workers (with permission) for authenticity

## Categories Explained

- **Production:** Manufacturing processes (molding, firing, drying)
- **Inventory:** Finished product stacks and storage
- **Logistics:** Loading, trucks, delivery process
- **Materials:** Raw clay, inputs, resources
- **Quality:** Testing, inspection, quality control
- **Facility:** Factory views, equipment, infrastructure

## Current Placeholder Status

⚠️ **All images are currently placeholders**

The gallery is fully functional but will show "Image Coming Soon" placeholders until you add actual photos. The layout and functionality work perfectly - just add your real images to this folder.

## Next.js Image Optimization

Images are automatically:
- ✅ Optimized for different screen sizes
- ✅ Lazy loaded (only load when visible)
- ✅ Converted to WebP automatically
- ✅ Served with blur placeholder
- ✅ Properly cached for performance

No manual optimization needed - just add your images here!

## Troubleshooting

**Images not showing?**
- Check filename matches exactly in Gallery.tsx
- Ensure image is in `/public/gallery/` folder
- Clear browser cache and refresh
- Check browser console for errors

**Images look blurry?**
- Upload higher resolution (min 1200px width)
- Reduce compression quality in your export settings

**Slow loading?**
- Compress images to under 500KB each
- Use JPG instead of PNG for photos
- Consider using WebP format for better compression
