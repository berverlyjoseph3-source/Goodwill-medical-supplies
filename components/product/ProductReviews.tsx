import { useState } from 'react';
import Image from 'next/image';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Review {
  id: number;
  user: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: number;
  reviews?: Review[];
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    user: 'Dr. Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&q=80',
    rating: 5,
    date: '2024-01-15',
    title: 'Excellent quality, highly recommend',
    content: 'This equipment has been a game changer for our clinic. The build quality is exceptional and it\'s very easy to use.',
    verified: true,
  },
  {
    id: 2,
    user: 'James Wilson',
    rating: 4,
    date: '2024-01-10',
    title: 'Good product, fast shipping',
    content: 'Very satisfied with the purchase. Shipping was faster than expected and the product works perfectly.',
    verified: true,
  },
  {
    id: 3,
    user: 'Maria Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80',
    rating: 5,
    date: '2024-01-05',
    title: 'Outstanding customer service',
    content: 'Had a question about installation and their support team was incredibly helpful. Product is top notch.',
    verified: true,
  },
];

export const ProductReviews = ({ productId, reviews = MOCK_REVIEWS }: ProductReviewsProps) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const filteredReviews = reviews
    .filter(r => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="bg-white rounded-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Customer Reviews</h2>
      
      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-baseline space-x-4">
            <span className="text-5xl font-bold text-slate-900">
              {averageRating.toFixed(1)}
            </span>
            <div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  i < Math.round(averageRating) ? (
                    <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <StarOutlineIcon key={i} className="w-5 h-5 text-gray-300" />
                  )
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Based on {reviews.length} reviews
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn-primary w-full md:w-auto"
          >
            Write a Review
          </button>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-3">
              <button
                onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
                className={`text-sm font-medium w-12 ${
                  filterRating === rating ? 'text-medical-blue' : 'text-slate-600'
                } hover:text-medical-blue`}
              >
                {rating} ★
              </button>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-yellow-400"
                />
              </div>
              <span className="text-sm text-slate-500 w-12">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-600">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-gray-200 last:border-0 pb-8 last:pb-0"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {review.avatar ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={review.avatar}
                      alt={review.user}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-medical-blue/10 rounded-full flex items-center justify-center">
                    <span className="text-medical-blue font-semibold">
                      {review.user.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-slate-900">{review.user}</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        i < review.rating ? (
                          <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
                        )
                      ))}
                    </div>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {review.verified && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs font-medium">
                          Verified Purchase
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <h5 className="font-semibold text-slate-900 mb-2">{review.title}</h5>
            <p className="text-slate-600 leading-relaxed">{review.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
