# Hanuman Bhatta - Red Clay Brick Manufacturing Website

A professional, modern website for Hanuman Bhatta, a premium red clay brick manufacturing company.

## 🎨 Design & Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom earthy color palette
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Language**: TypeScript

## 🎨 Color Palette

- **Terracotta Red**: `#B2422F` - Primary brand color
- **Charcoal Grey**: `#333333` - Text and dark elements
- **Sandy Beige**: `#F5F5DC` - Backgrounds and light elements

## 🚀 Features

### ✅ Completed
- **Brick Calculator**: Interactive calculator for estimating brick requirements
  - Wall length and height inputs
  - Multiple brick size options
  - 5% wastage allowance toggle
  - Automatic trolley calculation (3000 bricks per trolley)
  - Real-time calculation with mortar joint spacing
- **Responsive Design**: Mobile-first approach
- **Custom Tailwind Theme**: Earthy color palette with extended utilities
- **Hero Section**: Compelling landing with CTAs

### 🔄 Planned Features
- **Our Process Section**: Horizontal scroll showing Molding → Drying → Firing
- **Live Inventory Ticker**: Real-time stock updates
- **Product Catalog**: Grid showing First Class, Second Class, and Brick Bats with pricing
- **Contact Form**: WhatsApp integration
- **Google Maps**: Location embed

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Development Server

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## 📁 Project Structure

```
the-frontend/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles and Tailwind imports
├── components/
│   └── BrickCalculator.tsx # Interactive brick calculator component
├── lib/                    # Utility functions
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration with custom theme
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## 🧮 Brick Calculator

The calculator uses the following formula:

**Bricks Needed** = (Wall Area) / (Effective Brick Area with Mortar Joints)

Where:
- Wall Area = Length (inches) × Height (inches)
- Effective Brick Area = (Brick Length + 0.5") × (Brick Height + 0.5")
- Optional 5% wastage allowance
- Trolley calculation = Total Bricks / 3000

## 🎯 Key Components

### BrickCalculator Component
- Real-time calculation with React hooks
- Support for 4 standard brick sizes
- Wastage toggle functionality
- Responsive grid layout
- Smooth animations with Framer Motion
- Clear visual feedback with custom color scheme

## 📝 Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:
- `terracotta`: Primary brand color
- `charcoal`: Dark text and elements
- `sandy`: Light backgrounds

### Fonts
The project uses Google Fonts:
- **Inter**: Body text
- **Poppins**: Headings and display text

## 🤝 Contributing

This is a private project for Hanuman Bhatta. For any changes or improvements, please contact the development team.

## 📄 License

Private and Confidential - © 2026 Hanuman Bhatta

---

**Built with ❤️ for Hanuman Bhatta**
