import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============ PRODUCTS DATABASE ============
const PRODUCTS = [
  {
    id: 1,
    name: 'Premium Lightweight Wheelchair',
    slug: 'premium-lightweight-wheelchair',
    sku: 'MW-1001',
    price: 299.99,
    salePrice: 249.99,
    image: 'https://images.unsplash.com/photo-1584518938427-8fd3918eb3c0?w=600&q=80',
    category: 'Mobility Aids',
    categorySlug: 'mobility-aids',
    brand: 'Goodwill Medical',
    rating: 4.8,
    reviewCount: 124,
    inventory: 15,
    description: 'Lightweight aluminum frame wheelchair with comfortable padded seat and durable wheels. Perfect for daily use.',
    features: [
      'Weight capacity: 300 lbs',
      'Frame material: Aluminum',
      'Seat width: 18 inches',
      'Weight: 35 lbs',
      'Foldable design'
    ],
    deliveryEstimate: '2-3 business days',
    warranty: '2 years',
  },
  {
    id: 2,
    name: 'Electric Power Wheelchair',
    slug: 'electric-power-wheelchair',
    sku: 'MW-1002',
    price: 1299.99,
    salePrice: 1099.99,
    image: 'https://images.unsplash.com/photo-1584518962554-17041c39b3f8?w=600&q=80',
    category: 'Mobility Aids',
    categorySlug: 'mobility-aids',
    brand: 'Goodwill Medical',
    rating: 4.7,
    reviewCount: 56,
    inventory: 8,
    description: 'Electric wheelchair with joystick control, long battery life, and comfortable seating.',
    features: [
      'Weight capacity: 350 lbs',
      'Battery range: 15 miles',
      'Top speed: 5 mph',
      'Weight: 120 lbs',
      'Adjustable armrests'
    ],
    deliveryEstimate: '5-7 business days',
    warranty: '3 years',
  },
  {
    id: 3,
    name: 'Portable Oxygen Concentrator',
    slug: 'portable-oxygen-concentrator',
    sku: 'RE-2001',
    price: 899.99,
    salePrice: 799.99,
    image: 'https://images.unsplash.com/photo-1584547366618-c4673b5e9b16?w=600&q=80',
    category: 'Respiratory Equipment',
    categorySlug: 'respiratory',
    brand: 'HealthCare Pro',
    rating: 4.9,
    reviewCount: 89,
    inventory: 12,
    description: 'Compact and lightweight, provides continuous oxygen flow. Battery lasts up to 5 hours.',
    features: [
      'Oxygen output: 1-5 L/min',
      'Weight: 5 lbs',
      'Battery life: 5 hours',
      'Noise level: <40 dB',
      'Includes carrying case'
    ],
    deliveryEstimate: '2-3 business days',
    warranty: '2 years',
  },
  {
    id: 4,
    name: 'CPAP Machine with Heated Humidifier',
    slug: 'cpap-machine',
    sku: 'RE-2002',
    price: 599.99,
    salePrice: 549.99,
    image: 'https://images.unsplash.com/photo-1584547366618-c4673b5e9b16?w=600&q=80',
    category: 'Respiratory Equipment',
    categorySlug: 'respiratory',
    brand: 'MedTech',
    rating: 4.8,
    reviewCount: 142,
    inventory: 18,
    description: 'Auto-adjusting CPAP with heated humidifier for comfortable sleep therapy.',
    features: [
      'Pressure range: 4-20 cmH2O',
      'Auto-ramp feature',
      'Heated humidifier',
      'Whisper-quiet operation',
      'Data tracking via app'
    ],
    deliveryEstimate: '2-3 business days',
    warranty: '2 years',
  },
  {
    id: 5,
    name: 'Adjustable Electric Hospital Bed',
    slug: 'adjustable-hospital-bed',
    sku: 'HF-3001',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1587351021759-3772687fe598?w=600&q=80',
    category: 'Hospital Furniture',
    categorySlug: 'hospital-furniture',
    brand: 'CarePlus',
    rating: 4.7,
    reviewCount: 56,
    inventory: 7,
    description: 'Fully adjustable electric bed with remote control. Includes side rails and locking casters.',
    features: [
      'Weight capacity: 450 lbs',
      'Electric adjustment',
      'Includes side rails',
      'Locking casters',
      'Mattress included'
    ],
    deliveryEstimate: '7-10 business days',
    warranty: '5 years',
  },
  {
    id: 6,
    name: 'Digital Blood Pressure Monitor',
    slug: 'digital-bp-monitor',
    sku: 'DD-4001',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&q=80',
    category: 'Diagnostic Devices',
    categorySlug: 'diagnostic',
    brand: 'Vital Signs',
    rating: 4.8,
    reviewCount: 203,
    inventory: 45,
    description: 'Automatic inflation, large LCD display, detects irregular heartbeat.',
    features: [
      'One-touch operation',
      'Large LCD display',
      'Irregular heartbeat detection',
      '200 memory recall',
      'Includes 4 AA batteries'
    ],
    deliveryEstimate: '1-2 business days',
    warranty: '1 year',
  },
  {
    id: 7,
    name: 'Professional Stethoscope',
    slug: 'professional-stethoscope',
    sku: 'DD-4002',
    price: 89.99,
    salePrice: 79.99,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80',
    category: 'Diagnostic Devices',
    categorySlug: 'diagnostic',
    brand: 'MedTech',
    rating: 4.9,
    reviewCount: 178,
    inventory: 32,
    description: 'Dual-head stethoscope with non-chill rim and adjustable frequency.',
    features: [
      'Dual-head design',
      'Non-chill rim',
      'Adjustable frequency',
      'Latex-free tubing',
      'Includes 2 sets of ear tips'
    ],
    deliveryEstimate: '1-2 business days',
    warranty: '2 years',
  },
  {
    id: 8,
    name: 'N95 Respirator Masks (50 pack)',
    slug: 'n95-masks-50-pack',
    sku: 'PPE-5001',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1584636633446-b9c3d91a8d24?w=600&q=80',
    category: 'PPE & Disposables',
    categorySlug: 'ppe',
    brand: 'HealthCare Pro',
    rating: 4.7,
    reviewCount: 167,
    inventory: 0,
    description: 'FDA-approved N95 respirator masks. 95% filtration efficiency.',
    features: [
      'FDA approved',
      'NIOSH certified',
      '95% filtration',
      'Adjustable nose clip',
      'Latex-free straps'
    ],
    deliveryEstimate: '3-5 business days',
    warranty: 'Non-returnable',
  }
];

// ============ CATEGORIES DATABASE ============
const CATEGORIES = [
  {
    id: 1,
    name: 'Mobility Aids',
    slug: 'mobility-aids',
    image: 'https://images.unsplash.com/photo-1584518938427-8fd3918eb3c0?w=800&q=80',
    description: 'Wheelchairs, walkers, scooters, and rollators',
    icon: '🦽',
  },
  {
    id: 2,
    name: 'Respiratory Equipment',
    slug: 'respiratory',
    image: 'https://images.unsplash.com/photo-1584547366618-c4673b5e9b16?w=800&q=80',
    description: 'Oxygen concentrators, CPAP, ventilators',
    icon: '💨',
  },
  {
    id: 3,
    name: 'Hospital Furniture',
    slug: 'hospital-furniture',
    image: 'https://images.unsplash.com/photo-1587351021759-3772687fe598?w=800&q=80',
    description: 'Hospital beds, examination tables, patient chairs',
    icon: '🛏️',
  },
  {
    id: 4,
    name: 'Diagnostic Devices',
    slug: 'diagnostic',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    description: 'BP monitors, stethoscopes, thermometers',
    icon: '🩺',
  },
  {
    id: 5,
    name: 'PPE & Disposables',
    slug: 'ppe',
    image: 'https://images.unsplash.com/photo-1584636633446-b9c3d91a8d24?w=800&q=80',
    description: 'Masks, gloves, gowns, sanitizers',
    icon: '🧤',
  },
  {
    id: 6,
    name: 'Home Care Supplies',
    slug: 'home-care',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80',
    description: 'Daily living aids, bathroom safety',
    icon: '🏠',
  },
];

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============ CLEAN DATABASE ============
  console.log('🧹 Cleaning database...');
  
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.review.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.address.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.specification.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
    prisma.verificationToken.deleteMany(),
  ]);
  
  console.log('✅ Database cleaned\n');

  // ============ CREATE USERS ============
  console.log('👥 Creating users...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@goodwillmedical.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('   ✅ Admin created:', admin.email);

  // Manager user
  const managerPassword = await bcrypt.hash('manager123', 12);
  const manager = await prisma.user.create({
    data: {
      email: 'manager@goodwillmedical.com',
      password: managerPassword,
      name: 'Manager User',
      role: 'MANAGER',
      emailVerified: new Date(),
    },
  });
  console.log('   ✅ Manager created:', manager.email);

  // Customer user
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.create({
    data: {
      email: 'customer@goodwillmedical.com',
      password: customerPassword,
      name: 'John Customer',
      role: 'CUSTOMER',
      phone: '(555) 123-4567',
      emailVerified: new Date(),
    },
  });
  console.log('   ✅ Customer created:', customer.email);
  console.log('✅ Users created successfully\n');

  // ============ CREATE CATEGORIES ============
  console.log('📁 Creating categories...');

  for (const category of CATEGORIES) {
    await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        icon: category.icon,
        order: category.id,
      },
    });
    console.log(`   ✅ Created: ${category.name}`);
  }
  console.log(`✅ Created ${CATEGORIES.length} categories\n`);

  // ============ CREATE PRODUCTS ============
  console.log('📦 Creating products...');

  for (const product of PRODUCTS) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
    });

    if (category) {
      await prisma.product.create({
        data: {
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.description.slice(0, 100) + '...',
          categoryId: category.id,
          brand: product.brand,
          price: product.price,
          salePrice: product.salePrice || null,
          inventory: product.inventory,
          rating: product.rating,
          reviewCount: product.reviewCount,
          deliveryEstimate: product.deliveryEstimate,
          warranty: product.warranty,
          isFeatured: product.id <= 4,
          isNew: product.id > 6,
          tags: [product.categorySlug, product.brand.toLowerCase().replace(' ', '-')],
          features: product.features,
          images: {
            create: [
              {
                url: product.image,
                alt: product.name,
                order: 0,
              },
            ],
          },
        },
      });
      console.log(`   ✅ Created: ${product.name}`);
    }
  }
  console.log(`✅ Created ${PRODUCTS.length} products\n`);

  // ============ CREATE SAMPLE ORDER ============
  console.log('📋 Creating sample order...');

  const product1 = await prisma.product.findUnique({
    where: { slug: PRODUCTS[0].slug },
  });
  
  const product2 = await prisma.product.findUnique({
    where: { slug: PRODUCTS[5].slug },
  });

  if (product1 && product2) {
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: customer.id,
        email: customer.email,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        subtotal: 349.98,
        tax: 28.00,
        shippingCost: 0,
        total: 377.98,
        paymentMethod: 'Credit Card',
        stripePaymentId: 'pi_sample123456',
        carrier: 'FedEx',
        trackingNumber: '789012345678',
        items: {
          create: [
            {
              productId: product1.id,
              name: product1.name,
              price: product1.salePrice || product1.price,
              quantity: 1,
              image: product1.images?.[0]?.url || product1.image,
            },
            {
              productId: product2.id,
              name: product2.name,
              price: product2.price,
              quantity: 2,
              image: product2.images?.[0]?.url || product2.image,
            },
          ],
        },
        shippingAddress: {
          create: {
            userId: customer.id,
            type: 'SHIPPING',
            firstName: 'John',
            lastName: 'Customer',
            address1: '123 Main Street',
            city: 'Chicago',
            state: 'IL',
            postalCode: '60601',
            country: 'US',
            phone: '(555) 123-4567',
            isDefault: true,
          },
        },
      },
    });
    console.log(`   ✅ Created order: ${order.orderNumber}`);
  }
  console.log('✅ Sample order created\n');

  // ============ CREATE WISHLIST ITEM ============
  console.log('❤️ Creating wishlist item...');

  const wishlistProduct = await prisma.product.findUnique({
    where: { slug: PRODUCTS[1].slug },
  });

  if (wishlistProduct) {
    await prisma.wishlistItem.create({
      data: {
        userId: customer.id,
        productId: wishlistProduct.id,
      },
    });
    console.log('   ✅ Added product to wishlist');
  }
  console.log('✅ Wishlist item created\n');

  // ============ CREATE REVIEW ============
  console.log('⭐ Creating product review...');

  const reviewProduct = await prisma.product.findUnique({
    where: { slug: PRODUCTS[0].slug },
  });

  if (reviewProduct) {
    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: reviewProduct.id,
        rating: 5,
        title: 'Excellent wheelchair!',
        content: 'This wheelchair is very comfortable and easy to maneuver. Highly recommend for both hospital and home use.',
        verified: true,
      },
    });

    // Update product rating
    await prisma.product.update({
      where: { id: reviewProduct.id },
      data: {
        rating: 4.8,
        reviewCount: { increment: 1 },
      },
    });
    console.log('   ✅ Added 5-star review');
  }
  console.log('✅ Product review created\n');

  // ============ SUMMARY ============
  console.log('🎉 Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   👥 Users: 3 created`);
  console.log(`   📁 Categories: ${CATEGORIES.length} created`);
  console.log(`   📦 Products: ${PRODUCTS.length} created`);
  console.log(`   📋 Orders: 1 created`);
  console.log(`   ❤️ Wishlist: 1 item`);
  console.log(`   ⭐ Reviews: 1 created\n`);
  
  console.log('🔐 Test Credentials:');
  console.log('   ┌─────────────────┬──────────────────────────────┬─────────────┐');
  console.log('   │ Role            │ Email                        │ Password    │');
  console.log('   ├─────────────────┼──────────────────────────────┼─────────────┤');
  console.log('   │ Admin           │ admin@goodwillmedical.com    │ admin123    │');
  console.log('   │ Manager         │ manager@goodwillmedical.com  │ manager123  │');
  console.log('   │ Customer        │ customer@goodwillmedical.com │ customer123 │');
  console.log('   └─────────────────┴──────────────────────────────┴─────────────┘\n');
  
  console.log('🚀 Ready to start! Run: npm run dev');
}

main()
  .catch((e) => {
    console.error('\n❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
