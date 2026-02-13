import { useState } from 'react';
import toast from 'react-hot-toast';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Subscribed successfully!');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-4">
        Stay Updated with Medical Innovations
      </h2>
      <p className="text-blue-100 mb-8">
        Subscribe to our newsletter for new products, healthcare tips, and exclusive offers.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-6 py-3 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-medical-blue px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};
