// Fixed categories for ViralPredictor - inject these directly

// Enhanced content types
export const enhancedContentTypes = [
  { value: 'text', label: '📄 Text Tweet', description: 'Standard text-based tweet' },
  { value: 'image', label: '📸 Image Tweet', description: 'Tweet with image attachment' },
  { value: 'video', label: '🎥 Video Tweet', description: 'Tweet with video content' },
  { value: 'thread', label: '🧵 Twitter Thread', description: 'Multi-tweet thread series' },
  { value: 'poll', label: '📊 Twitter Poll', description: 'Interactive poll tweet' },
  { value: 'quote', label: '💬 Quote Tweet', description: 'Quote tweet with commentary' },
  { value: 'reply', label: '↩️ Reply Tweet', description: 'Reply to another tweet' },
  { value: 'news', label: '📰 News Tweet', description: 'News or update content' },
  { value: 'announcement', label: '📢 Announcement', description: 'Official announcements' },
  { value: 'tutorial', label: '📚 Tutorial/Guide', description: 'Educational content' },
  { value: 'meme', label: '😂 Meme/Humor', description: 'Humorous content' },
  { value: 'question', label: '❓ Question/AMA', description: 'Questions or Q&A' },
  { value: 'tip', label: '💡 Tip/Advice', description: 'Tips and advice' },
  { value: 'live', label: '🔴 Live Update', description: 'Live or real-time content' },
  { value: 'other', label: '📋 Option Not Listed', description: 'Content type not listed' }
];

// Enhanced niches with categories
export const enhancedNiches = [
  // Cryptocurrency & Blockchain
  { value: 'bitcoin', label: '₿ Bitcoin', category: 'Cryptocurrency' },
  { value: 'ethereum', label: '⟠ Ethereum', category: 'Cryptocurrency' },
  { value: 'altcoins', label: '🪙 Altcoins', category: 'Cryptocurrency' },
  { value: 'defi', label: '🌐 DeFi', category: 'Cryptocurrency' },
  { value: 'nft', label: '🖼️ NFTs', category: 'Cryptocurrency' },
  { value: 'crypto_trading', label: '📈 Crypto Trading', category: 'Cryptocurrency' },
  { value: 'blockchain', label: '⛓️ Blockchain Tech', category: 'Cryptocurrency' },
  { value: 'web3', label: '🕸️ Web3', category: 'Cryptocurrency' },
  { value: 'crypto_news', label: '📰 Crypto News', category: 'Cryptocurrency' },
  { value: 'mining', label: '⛏️ Mining', category: 'Cryptocurrency' },
  { value: 'staking', label: '🏦 Staking', category: 'Cryptocurrency' },

  // AI & Technology
  { value: 'ai', label: '🤖 Artificial Intelligence', category: 'Technology' },
  { value: 'machine_learning', label: '🧠 Machine Learning', category: 'Technology' },
  { value: 'chatgpt', label: '💬 ChatGPT/LLMs', category: 'Technology' },
  { value: 'programming', label: '💻 Programming', category: 'Technology' },
  { value: 'software_dev', label: '🛠️ Software Development', category: 'Technology' },
  { value: 'tech_news', label: '📱 Tech News', category: 'Technology' },
  { value: 'cybersecurity', label: '🔒 Cybersecurity', category: 'Technology' },
  { value: 'data_science', label: '📊 Data Science', category: 'Technology' },
  { value: 'cloud_computing', label: '☁️ Cloud Computing', category: 'Technology' },
  { value: 'automation', label: '⚙️ Automation', category: 'Technology' },

  // Business & Finance
  { value: 'startup', label: '🚀 Startups', category: 'Business' },
  { value: 'entrepreneurship', label: '💼 Entrepreneurship', category: 'Business' },
  { value: 'investing', label: '📈 Investing', category: 'Business' },
  { value: 'stock_market', label: '📊 Stock Market', category: 'Business' },
  { value: 'business_strategy', label: '🎯 Business Strategy', category: 'Business' },
  { value: 'leadership', label: '👔 Leadership', category: 'Business' },
  { value: 'productivity', label: '⚡ Productivity', category: 'Business' },
  { value: 'finance', label: '💰 Personal Finance', category: 'Business' },
  { value: 'saas', label: '☁️ SaaS', category: 'Business' },
  { value: 'ecommerce', label: '🛒 E-commerce', category: 'Business' },

  // Marketing & Growth
  { value: 'digital_marketing', label: '📱 Digital Marketing', category: 'Marketing' },
  { value: 'content_marketing', label: '📝 Content Marketing', category: 'Marketing' },
  { value: 'social_media', label: '📱 Social Media', category: 'Marketing' },
  { value: 'seo', label: '🔍 SEO', category: 'Marketing' },
  { value: 'growth_hacking', label: '🚀 Growth Hacking', category: 'Marketing' },
  { value: 'branding', label: '🎨 Branding', category: 'Marketing' },
  { value: 'influencer', label: '🌟 Influencer Marketing', category: 'Marketing' },

  // Lifestyle & Personal
  { value: 'fitness', label: '💪 Fitness & Health', category: 'Lifestyle' },
  { value: 'travel', label: '✈️ Travel', category: 'Lifestyle' },
  { value: 'food', label: '🍕 Food & Cooking', category: 'Lifestyle' },
  { value: 'fashion', label: '👗 Fashion', category: 'Lifestyle' },
  { value: 'music', label: '🎵 Music', category: 'Lifestyle' },
  { value: 'gaming', label: '🎮 Gaming', category: 'Lifestyle' },
  { value: 'photography', label: '📷 Photography', category: 'Lifestyle' },

  // Education & Learning
  { value: 'education', label: '🎓 Education', category: 'Education' },
  { value: 'science', label: '🔬 Science', category: 'Education' },
  { value: 'tutorials', label: '📚 Tutorials', category: 'Education' },
  { value: 'online_learning', label: '💻 Online Learning', category: 'Education' },

  // Entertainment & Media
  { value: 'movies', label: '🎬 Movies & TV', category: 'Entertainment' },
  { value: 'sports', label: '⚽ Sports', category: 'Entertainment' },
  { value: 'comedy', label: '😂 Comedy', category: 'Entertainment' },
  { value: 'news', label: '📰 News & Current Events', category: 'Entertainment' },
  { value: 'memes', label: '😄 Memes', category: 'Entertainment' },

  // Emerging Technologies
  { value: 'vr_ar', label: '🥽 VR/AR', category: 'Emerging' },
  { value: 'metaverse', label: '🌐 Metaverse', category: 'Emerging' },
  { value: 'sustainability', label: '🌱 Sustainability', category: 'Emerging' },
  { value: 'space', label: '🚀 Space & Astronomy', category: 'Emerging' },

  // Fallback
  { value: 'other', label: '📋 Option Not Listed', category: 'Other' }
];
