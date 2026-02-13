import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarIcon, 
  UserIcon, 
  TagIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

// Mock blog posts - In production, fetch from CMS
const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Future of Home Healthcare: Smart Medical Devices',
    slug: 'future-home-healthcare-smart-devices',
    excerpt: 'Discover how IoT-enabled medical devices are transforming patient care at home, improving outcomes, and reducing hospital readmissions.',
    content: '',
    author: 'Dr. Sarah Chen',
    authorRole: 'Chief Medical Officer',
    authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&q=80',
    category: 'Healthcare Technology',
    tags: ['Smart Devices', 'IoT', 'Home Care'],
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80',
    date: '2024-01-15',
    readTime: 6,
    featured: true,
  },
  {
    id: 2,
    title: 'Understanding FDA Medical Device Classifications',
    slug: 'understanding-fda-medical-device-classifications',
    excerpt: 'A comprehensive guide to FDA device classifications and what they mean for healthcare providers and patients.',
    content: '',
    author: 'Michael Rodriguez',
    authorRole: 'Quality Assurance Director',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
    category: 'Regulations',
    tags: ['FDA', 'Compliance', 'Safety'],
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
    date: '2024-01-10',
    readTime: 8,
    featured: true,
  },
  {
    id: 3,
    title: 'Essential PPE Guide for Healthcare Facilities',
    slug: 'essential-ppe-guide-healthcare-facilities',
    excerpt: 'Best practices for PPE selection, usage, and inventory management in hospitals and clinics.',
    content: '',
    author: 'Dr. Emily Watson',
    authorRole: 'Infection Control Specialist',
    authorImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80',
    category: 'PPE',
    tags: ['PPE', 'Safety', 'Infection Control'],
    image: 'https://images.unsplash.com/photo-1584636633446-b9c3d91a8d24?w=800&q=80',
    date: '2024-01-05',
    readTime: 5,
    featured: false,
  },
  {
    id: 4,
    title: 'Mobility Aids: Choosing the Right Equipment',
    slug: 'mobility-aids-choosing-right-equipment',
    excerpt: 'How to select the appropriate mobility aid for different patient needs and conditions.',
    content: '',
    author: 'James Park',
    authorRole: 'Physical Therapist',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    category: 'Mobility',
    tags: ['Wheelchairs', 'Walkers', 'Patient Care'],
    image: 'https://images.unsplash.com/photo-1584518938427-8fd3918eb3c0?w=800&q=80',
    date: '2023-12-28',
    readTime: 7,
    featured: false,
  },
  {
    id: 5,
    title: 'Respiratory Care: Advances in Oxygen Therapy',
    slug: 'respiratory-care-advances-oxygen-therapy',
    excerpt: 'New developments in portable oxygen concentrators and CPAP machines improving patient quality of life.',
    content: '',
    author: 'Dr. Sarah Chen',
    authorRole: 'Chief Medical Officer',
    authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&q=80',
    category: 'Respiratory',
    tags: ['Oxygen', 'CPAP', 'Sleep Apnea'],
    image: 'https://images.unsplash.com/photo-1584547366618-c4673b5e9b16?w=800&q=80',
    date: '2023-12-20',
    readTime: 6,
    featured: false,
  },
  {
    id: 6,
    title: 'Hospital Bed Maintenance: Best Practices',
    slug: 'hospital-bed-maintenance-best-practices',
    excerpt: 'Extend the life of your hospital beds with proper maintenance and care protocols.',
    content: '',
    author: 'Michael Rodriguez',
    authorRole: 'Quality Assurance Director',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
    category: 'Equipment Maintenance',
    tags: ['Hospital Beds', 'Maintenance'],
    image: 'https://images.unsplash.com/photo-1587351021759-3772687fe598?w=800&q=80',
    date: '2023-12-15',
    readTime: 5,
    featured: false,
  },
];

const categories = [
  { name: 'All', count: BLOG_POSTS.length },
  { name: 'Healthcare Technology', count: 1 },
  { name: 'Regulations', count: 1 },
  { name: 'PPE', count: 1 },
  { name: 'Mobility', count: 1 },
  { name: 'Respiratory', count: 1 },
  { name: 'Equipment Maintenance', count: 1 },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState(BLOG_POSTS);

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = BLOG_POSTS.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setPosts(filtered);
  };

  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setPosts(BLOG_POSTS);
    } else {
      const filtered = BLOG_POSTS.filter(post => post.category === category);
      setPosts(filtered);
    }
  };

  return (
    <>
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-medical-blue/5 via-white to-white py-16 md:py-24">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                Healthcare{' '}
                <span className="text-medical-blue">Insights</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Expert advice, industry news, and educational resources for healthcare professionals
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                  />
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-gray-200">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => filterByCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${selectedCategory === category.name
                      ? 'bg-medical-blue text-white'
                      : 'bg-soft-gray text-slate-600 hover:bg-gray-200'
                    }`}
                >
                  {category.name}
                  <span className={`ml-1 text-xs ${
                    selectedCategory === category.name
                      ? 'text-blue-100'
                      : 'text-slate-400'
                  }`}>
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && selectedCategory === 'All' && (
          <section className="py-12">
            <div className="container-padding max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Featured Articles</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-64">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-medical-blue text-white rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
                        <span className="px-2 py-1 bg-soft-gray rounded-full">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-medical-blue transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={post.authorImage}
                              alt={post.author}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{post.author}</p>
                            <p className="text-xs text-slate-500">{post.authorRole}</p>
                          </div>
                        </div>
                        <span className="text-medical-blue font-medium text-sm group-hover:translate-x-1 transition-transform">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-12 bg-soft-gray">
          <div className="container-padding max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              {selectedCategory === 'All' ? 'Latest Articles' : selectedCategory}
            </h2>
            
            {posts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="bg-soft-gray rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TagIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No articles found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(selectedCategory === 'All' ? regularPosts : posts).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
                        <span className="px-2 py-1 bg-soft-gray rounded-full">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-medical-blue transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={post.authorImage}
                              alt={post.author}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-xs text-slate-600">{post.author}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-medical-blue to-medical-blue-dark">
          <div className="container-padding max-w-7xl mx-auto">
            <div className="text-center text-white max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Get the latest healthcare insights and product updates delivered to your inbox
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 rounded-lg text-slate-900 placeholder:text-slate-400 
                           focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-white text-medical-blue rounded-lg font-semibold 
                           hover:bg-blue-50 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-blue-200 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
