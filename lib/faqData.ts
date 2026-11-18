export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    question: 'Who is Hanuman Bhatta Company and where is it located?',
    answer:
      'Hanuman Bhatta Company is an established red clay brick manufacturer (ईंट भट्टा) located on Kahlpa-Bhanderi Road, V.P.O. Kahlpa, Gohana, Sonipat District, Haryana (PIN: 131301). The facility produces high-compressive-strength red clay bricks fired in traditional kilns, supplying home owners, civil contractors, and construction developers directly from the kiln.',
    category: 'About & Location',
  },
  {
    question: 'Where can I buy bricks in Gohana and what areas do you serve?',
    answer:
      'You can buy kiln-direct bricks directly from Hanuman Bhatta Company at our Kahlpa manufacturing kiln near Gohana. We provide prompt tractor-trolley delivery throughout Gohana and surrounding regions, including Sonipat, Rohtak, Jind, Safidon, Panipat, Baroda, Mundlana, Rukhi, Kasandi, and neighboring rural and suburban construction sites.',
    category: 'Delivery Areas',
  },
  {
    question: 'What types and grades of red clay bricks are available?',
    answer:
      'We manufacture premium grades of kiln-fired red clay bricks: 1) First-Class Bricks (अव्वल ईंट / Awwal) with 10.5+ N/mm² compressive strength for primary load-bearing walls; 2) Second Class Bricks (Duyam / 2 Number Eent / दुयम) at 8 rupee per brick (₹8,000 per 1,000 bricks) for internal partition walls and general masonry; and 3) Premium Bricks at 9 rupee per brick (₹9,000 per 1,000 bricks) for high-strength architectural construction and load-bearing structures.',
    category: 'Products',
  },
  {
    question: 'How many bricks are delivered in one tractor trolley?',
    answer:
      'A standard tractor-trolley load from Hanuman Bhatta Company carries 3,000 bricks. We calculate transparent pricing both per 1,000 bricks and per full trolley (3,000 bricks), helping customers plan transport and unloading accurately for their site budget.',
    category: 'Ordering & Delivery',
  },
  {
    question: 'How do I contact Hanuman Bhatta Company or place an order?',
    answer:
      'You can contact Hanuman Bhatta Company directly by calling +91 99966 69463 or chatting with our sales team on WhatsApp at +91 82956 69463. Customers are also welcome to visit our kiln at Kahlpa, Gohana from Monday to Saturday, 8:00 AM to 6:00 PM, to inspect brick batches in person before booking.',
    category: 'Contact',
  },
  {
    question: 'What quality checks should I perform before purchasing construction bricks?',
    answer:
      'Before purchasing bricks, check: 1) Metallic Ringing Sound: Striking two Grade-1 bricks together should produce a clear ringing bell sound, not a dull thud. 2) Water Absorption: Good red clay bricks absorb less than 20% of their dry weight in water. 3) Hardness: Scratching with a fingernail should leave no noticeable mark. 4) Shape & Edges: Look for rectangular, sharp, compact edges without deep cracks or curved warping.',
    category: 'Quality Guide',
  },
  {
    question: 'How many bricks are required to construct a typical house or room?',
    answer:
      'A standard 9-inch load-bearing wall requires approximately 95 to 100 bricks per 10 square feet of wall area (accounting for standard cement-mortar joints and 5% wastage). A single 10x10 ft room with 9-inch exterior walls typically needs approximately 4,000 to 4,500 bricks. You can use our on-site Brick Calculator to compute exact requirements based on your wall length, height, and thickness.',
    category: 'Estimation',
  },
  {
    question: 'What makes Hanuman Bhatta Company’s brick manufacturing process reliable?',
    answer:
      'Our process combines carefully selected agricultural clay (free of excess sand or pebbles), uniform mechanical and hand-tempered molding, slow open-air drying to prevent shrinkage fissures, and controlled thermal firing in natural-draft kilns. Every trolley load is hand-sorted at dispatch to remove broken or under-burnt pieces.',
    category: 'Manufacturing',
  },
];
