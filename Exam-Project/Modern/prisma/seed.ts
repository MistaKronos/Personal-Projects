import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hashed = crypto.pbkdf2Sync(password, salt, 310_000, 32, 'sha256').toString('hex')
  return { salt, hashedPassword: hashed }
}

async function main() {
  // Roles
  const adminRole = await prisma.role.upsert({ where: { name: 'Admin' }, update: {}, create: { name: 'Admin' } })
  const userRole  = await prisma.role.upsert({ where: { name: 'User'  }, update: {}, create: { name: 'User'  } })

  // Memberships
  const bronze = await prisma.membership.upsert({ where: { name: 'Bronze' }, update: {}, create: { name: 'Bronze', discountRate: 0    } })
  const silver = await prisma.membership.upsert({ where: { name: 'Silver' }, update: {}, create: { name: 'Silver', discountRate: 0.05 } })
                 await prisma.membership.upsert({ where: { name: 'Gold'   }, update: {}, create: { name: 'Gold',   discountRate: 0.10 } })

  // Brands
  const [nike, adidas, sony, samsung, apple] = await Promise.all([
    prisma.brand.upsert({ where: { name: 'Nike'    }, update: {}, create: { name: 'Nike'    } }),
    prisma.brand.upsert({ where: { name: 'Adidas'  }, update: {}, create: { name: 'Adidas'  } }),
    prisma.brand.upsert({ where: { name: 'Sony'    }, update: {}, create: { name: 'Sony'    } }),
    prisma.brand.upsert({ where: { name: 'Samsung' }, update: {}, create: { name: 'Samsung' } }),
    prisma.brand.upsert({ where: { name: 'Apple'   }, update: {}, create: { name: 'Apple'   } }),
  ])

  // Categories
  const [shoes, clothing, electronics, audio, phones] = await Promise.all([
    prisma.category.upsert({ where: { name: 'Shoes'       }, update: {}, create: { name: 'Shoes'       } }),
    prisma.category.upsert({ where: { name: 'Clothing'    }, update: {}, create: { name: 'Clothing'    } }),
    prisma.category.upsert({ where: { name: 'Electronics' }, update: {}, create: { name: 'Electronics' } }),
    prisma.category.upsert({ where: { name: 'Audio'       }, update: {}, create: { name: 'Audio'       } }),
    prisma.category.upsert({ where: { name: 'Phones'      }, update: {}, create: { name: 'Phones'      } }),
  ])

  // Users
  const adminCreds = hashPassword('P@ssword2023')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@noroff.no' },
    update: {},
    create: {
      firstName: 'Admin', lastName: 'User', username: 'admin',
      email: 'admin@noroff.no',
      hashedPassword: adminCreds.hashedPassword, salt: adminCreds.salt,
      address: '1 Admin Street', telephone: '0000000000',
      roleId: adminRole.id, membershipId: bronze.id,
    },
  })

  const user1Creds = hashPassword('P@ssword2023')
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      firstName: 'Alice', lastName: 'Johnson', username: 'alice_j',
      email: 'alice@example.com',
      hashedPassword: user1Creds.hashedPassword, salt: user1Creds.salt,
      address: '42 Oak Lane', telephone: '1234567890',
      roleId: userRole.id, membershipId: silver.id,
    },
  })

  const user2Creds = hashPassword('P@ssword2023')
  await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      firstName: 'Bob', lastName: 'Smith', username: 'bob_s',
      email: 'bob@example.com',
      hashedPassword: user2Creds.hashedPassword, salt: user2Creds.salt,
      address: '7 Maple Ave', telephone: '9876543210',
      roleId: userRole.id, membershipId: bronze.id,
    },
  })

  // Products
  const products = await Promise.all([
    prisma.product.upsert({ where: { id: 1 }, update: {}, create: { name: 'Air Max 90',        description: 'Classic running shoe with visible Air unit.',   quantity: 50, price: 129.99, brandId: nike.id,    categoryId: shoes.id,       imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' } }),
    prisma.product.upsert({ where: { id: 2 }, update: {}, create: { name: 'Stan Smith',         description: 'Iconic leather tennis shoe, timeless style.',    quantity: 40, price: 89.99,  brandId: adidas.id,  categoryId: shoes.id,       imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=300&fit=crop' } }),
    prisma.product.upsert({ where: { id: 3 }, update: {}, create: { name: 'WH-1000XM5',         description: 'Industry-leading noise cancelling headphones.',  quantity: 20, price: 349.99, brandId: sony.id,    categoryId: audio.id,       imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop' } }),
    prisma.product.upsert({ where: { id: 4 }, update: {}, create: { name: 'Galaxy S24',         description: 'Flagship Android smartphone with AI features.',  quantity: 30, price: 899.99, brandId: samsung.id, categoryId: phones.id,      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop' } }),
    prisma.product.upsert({ where: { id: 5 }, update: {}, create: { name: 'iPhone 15',          description: 'Apple flagship with Dynamic Island display.',    quantity: 25, price: 999.99, brandId: apple.id,   categoryId: phones.id,      imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=300&fit=crop' } }),
    prisma.product.upsert({ where: { id: 6 }, update: {}, create: { name: 'AirPods Pro',         description: 'Active noise cancellation with transparency.',   quantity: 60, price: 249.99, brandId: apple.id,   categoryId: audio.id,       imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop' } }),
    prisma.product.upsert({ where: { id: 7 }, update: {}, create: { name: 'Dri-FIT T-Shirt',    description: 'Lightweight moisture-wicking training shirt.',   quantity: 100, price: 34.99, brandId: nike.id,    categoryId: clothing.id,    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop' } }),
    prisma.product.upsert({ where: { id: 8 }, update: {}, create: { name: 'Galaxy Tab S9',      description: 'Premium Android tablet with AMOLED display.',   quantity: 15, price: 699.99, brandId: samsung.id, categoryId: electronics.id, imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop' } }),
  ])

  // Orders
  await prisma.order.upsert({
    where: { id: 1 }, update: {},
    create: {
      userId: user1.id, total: 379.98, status: 'Completed',
      orderItems: { create: [
        { productId: products[0].id, quantity: 1, price: 129.99 },
        { productId: products[5].id, quantity: 1, price: 249.99 },
      ]},
    },
  })

  await prisma.order.upsert({
    where: { id: 2 }, update: {},
    create: {
      userId: admin.id, total: 349.99, status: 'Pending',
      orderItems: { create: [
        { productId: products[2].id, quantity: 1, price: 349.99 },
      ]},
    },
  })

  console.log('Seed complete.')
  console.log('Admin login: admin@noroff.no / P@ssword2023')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
