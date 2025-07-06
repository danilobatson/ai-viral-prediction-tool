// Test Posts for Twitter Viral Probability Analyzer
// Various categories and viral potential levels

export const TEST_POSTS = {
  // High Viral Potential (Crypto + Trending Topics)
  high_viral: [
    "🚀 BREAKING: Bitcoin just hit $100K! This is history in the making. The bull run we've all been waiting for is here! #Bitcoin #Crypto #BullRun 📈",

    "🔥 THREAD: Why Ethereum 2.0 will change everything (1/7)\n\nThe merge was just the beginning. What's coming next will blow your mind... 🧵👇",

    "💡 I called Bitcoin at $30K when everyone said it was dead. Now at $100K, here's my next prediction... \n\n(This might surprise you) 🎯",

    "🚨 URGENT: Major crypto exchange just announced something that could crash the market in 24 hours. Here's what you need to know... ⚠️",

    "Just made $50K in 48 hours using this simple DeFi strategy. Sharing the exact steps for FREE below 👇 #DeFi #CryptoTrading"
  ],

  // Medium Viral Potential (Engagement + Questions)
  medium_viral: [
    "What's the biggest crypto mistake you've made? I'll go first... 😅 #CryptoLessons",

    "Unpopular opinion: 90% of crypto influencers have no idea what they're talking about. Change my mind 🤔",

    "If you could only hold 3 cryptos for the next 5 years, what would they be? 🤔 Mine: BTC, ETH, and... 👀",

    "The AI revolution is happening faster than we thought. Which companies will survive the next 2 years? 🤖",

    "Building in public: Day 30 of my startup journey. Revenue hit $10K MRR! Here's what I learned... 📈"
  ],

  // Low-Medium Viral Potential (Informational)
  low_medium_viral: [
    "Understanding blockchain basics: A simple explanation of how transactions work in the Bitcoin network ⛓️",

    "Market update: BTC is consolidating around $95K. Technical analysis suggests we might see movement this week 📊",

    "Reminder: Always do your own research before investing in any cryptocurrency. Never invest more than you can afford to lose 💡",

    "The difference between Layer 1 and Layer 2 scaling solutions, explained in simple terms 🧠",

    "Weekly crypto portfolio review: Up 12% this week thanks to some strategic moves in the DeFi space 📈"
  ],

  // Low Viral Potential (Basic/Personal)
  low_viral: [
    "Good morning crypto fam! Hope everyone has a great day trading 🌅",

    "Just finished reading another whitepaper. The technology behind some of these projects is fascinating 📚",

    "Coffee and charts - my daily routine. What's yours? ☕",

    "Thinking about the long-term implications of digital currencies on traditional banking systems 🏦",

    "Another day, another dollar. Or should I say, another day, another satoshi? 😊"
  ],

  // Non-Crypto (Different Niches)
  other_niches: [
    "🧵 THREAD: 10 AI tools that will save you 20+ hours per week (most people don't know about #7) 🤖",

    "Just launched my SaaS product after 8 months of building. Here's my honest Day 1 revenue report... 💰",

    "The future of work is changing. Remote work isn't just a trend - it's the new reality. Here's how to adapt 🌍",

    "Unpopular opinion: Most productivity advice is garbage. Here's what actually works... 💡",

    "Building a $10M company from my bedroom. Here's the daily routine that got me here 🚀"
  ]
};

export const TEST_POST_DESCRIPTIONS = {
  high_viral: "Should score 70-95% - Uses urgency, numbers, emojis, trending topics",
  medium_viral: "Should score 50-75% - Engagement-focused with questions and opinions",
  low_medium_viral: "Should score 30-55% - Informational but less engaging",
  low_viral: "Should score 15-35% - Basic personal content",
  other_niches: "Should score 40-80% - Depends on niche and engagement factors"
};
