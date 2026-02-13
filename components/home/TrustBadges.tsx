const badges = [
  { icon: '✅', title: 'FDA Approved', description: 'All devices meet FDA standards' },
  { icon: '🔬', title: 'Certified Equipment', description: 'ISO 13485 certified' },
  { icon: '🚚', title: 'Fast Shipping', description: '2-3 day delivery' },
  { icon: '💯', title: '1 Year Warranty', description: 'Full coverage included' },
];

export const TrustBadges = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {badges.map((badge) => (
        <div key={badge.title} className="flex items-center space-x-3">
          <span className="text-2xl">{badge.icon}</span>
          <div>
            <h3 className="font-semibold text-slate-800">{badge.title}</h3>
            <p className="text-sm text-slate-600">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
