import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CalendarIcon, 
  UserIcon, 
  TagIcon,
  ChevronLeftIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CommentSection } from '../../components/blog/CommentSection';
import toast from 'react-hot-toast';

// Mock blog posts - In production, fetch from CMS
const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Future of Home Healthcare: Smart Medical Devices',
    slug: 'future-home-healthcare-smart-devices',
    excerpt: 'Discover how IoT-enabled medical devices are transforming patient care at home...',
    content: `
      <p class="lead">The healthcare landscape is undergoing a dramatic transformation. With the advent of Internet of Things (IoT) technology, medical devices are becoming smarter, more connected, and increasingly capable of providing real-time patient monitoring and care outside traditional clinical settings.</p>
      
      <h2>The Rise of Connected Medical Devices</h2>
      <p>Smart medical devices are revolutionizing home healthcare. From blood pressure monitors that automatically sync with your smartphone to insulin pumps that adjust dosage based on real-time glucose readings, these devices are making it easier for patients to manage their health conditions from the comfort of their homes.</p>
      
      <h3>Key Benefits of Smart Home Healthcare Devices</h3>
      <ul>
        <li><strong>Real-time monitoring:</strong> Healthcare providers can track patient vital signs continuously, enabling early intervention when issues arise.</li>
        <li><strong>Improved patient compliance:</strong> Smart reminders and easy-to-use interfaces help patients adhere to treatment plans.</li>
        <li><strong>Reduced hospital readmissions:</strong> Early detection of complications prevents emergency room visits.</li>
        <li><strong>Cost savings:</strong> Home-based care is significantly more cost-effective than hospital stays.</li>
      </ul>
      
      <h2>Current Innovations in Smart Medical Devices</h2>
      <p>Several groundbreaking technologies are currently available or in development:</p>
      
      <h3>1. Smart Inhalers</h3>
      <p>Connected inhalers track usage patterns, remind patients to take their medication, and provide data to healthcare providers about trigger patterns and medication effectiveness.</p>
      
      <h3>2. Wearable ECG Monitors</h3>
      <p>Modern wearable devices can now provide medical-grade ECG monitoring, detecting arrhythmias and other cardiac conditions in real-time.</p>
      
      <h3>3. Intelligent Medication Dispensers</h3>
      <p>Smart pill dispensers ensure patients take the right medication at the right time, reducing medication errors among elderly patients.</p>
      
      <h2>The Role of AI in Medical Device Technology</h2>
      <p>Artificial intelligence is playing an increasingly important role in smart medical devices. Machine learning algorithms can analyze patient data to predict health deterioration before it becomes critical, allowing for proactive rather than reactive care.</p>
      
      <h2>Challenges and Considerations</h2>
      <p>While the potential of smart medical devices is enormous, several challenges remain:</p>
      <ul>
        <li><strong>Data security and privacy:</strong> Protecting sensitive health information is paramount.</li>
        <li><strong>Regulatory compliance:</strong> Devices must meet strict FDA requirements.</li>
        <li><strong>Interoperability:</strong> Different devices and systems need to communicate seamlessly.</li>
        <li><strong>User adoption:</strong> Devices must be intuitive enough for patients of all ages and technical abilities.</li>
      </ul>
      
      <h2>The Future Outlook</h2>
      <p>As technology continues to advance and costs decrease, smart medical devices will become increasingly accessible. We're moving toward a future where proactive, personalized, and preventive care is the norm rather than the exception.</p>
      
      <p>The integration of 5G networks will enable even more sophisticated remote monitoring capabilities, while advances in battery technology will make devices smaller and more convenient to use.</p>
      
      <h2>Conclusion</h2>
      <p>The future of home healthcare is bright, and smart medical devices are at the forefront of this transformation. As healthcare providers, patients, and technology companies continue to collaborate, we can expect to see even more innovative solutions that improve patient outcomes and quality of life.</p>
    `,
    author: 'Dr. Sarah Chen',
    authorRole: 'Chief Medical Officer',
    authorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80',
    authorBio: 'Dr. Sarah Chen has over 20 years of experience in hospital administration and medical technology. She leads our clinical research initiatives.',
    category: 'Healthcare Technology',
    tags: ['Smart Devices', 'IoT', 'Home Care', 'AI'],
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200&q=80',
    date: '2024-01-15',
    readTime: 6,
    views: 1234,
    likes: 89,
    comments: 24,
  },
  // ... other posts
];

interface BlogPostPageProps {
  post: typeof BLOG_POSTS[0];
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  if (router.isFallback) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-medical-blue border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1);
      toast.success('Removed like');
    } else {
      setLikesCount(likesCount + 1);
      toast.success('Liked this article');
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved' : 'Article saved');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const relatedPosts = BLOG_POSTS
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] lg:h-[600px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container-padding max-w-4xl mx-auto pb-12 md:pb-16">
              <Link
                href="/blog"
                className="inline-flex items-center text-white/90 hover:text-white mb-6 group"
              >
                <ChevronLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-medical-blue text-white rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="text-white/80 text-sm">
                    {post.readTime} min read
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl">
                  {post.title}
                </h1>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{post.author}</p>
                      <p className="text-white/80 text-sm">{post.authorRole}</p>
                    </div>
                  </div>
                  <span className="text-white/60">•</span>
                  <div className="flex items-center text-white/80 text-sm">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container-padding max-w-4xl mx-auto">
            {/* Article Actions */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-soft-gray hover:bg-gray-200 transition-colors"
                >
                  {isLiked ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-slate-600" />
                  )}
                  <span className="text-sm font-medium text-slate-700">{likesCount}</span>
                </button>
                
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-soft-gray hover:bg-gray-200 transition-colors"
                >
                  <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'text-medical-blue fill-current' : 'text-slate-600'}`} />
                  <span className="text-sm font-medium text-slate-700">
                    {isSaved ? 'Saved' : 'Save'}
                  </span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-soft-gray hover:bg-gray-200 transition-colors"
                >
                  <ShareIcon className="w-5 h-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Share</span>
                </button>
              </div>
              
              <div className="flex items-center text-sm text-slate-500">
                <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
                {post.comments} comments
              </div>
            </div>

            {/* Article Content */}
            <article 
              className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 
                        prose-a:text-medical-blue prose-strong:text-slate-900
                        prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag.toLowerCase()}`}
                    className="px-3 py-1 bg-soft-gray hover:bg-gray-200 rounded-full text-sm text-slate-600 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-soft-gray rounded-2xl">
              <div className="flex items-start space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post.authorImage}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{post.author}</h3>
                  <p className="text-sm text-medical-blue mb-2">{post.authorRole}</p>
                  <p className="text-sm text-slate-600">{post.authorBio}</p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <CommentSection postId={post.id} />
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-soft-gray">
            <div className="container-padding max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-medical-blue transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = BLOG_POSTS.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = BLOG_POSTS.find((p) => p.slug === params?.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 3600,
  };
};
