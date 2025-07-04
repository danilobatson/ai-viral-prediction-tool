#!/usr/bin/env node
/**
 * Viral Post Pattern Analysis - Phase 1.2
 * Extracts engagement patterns, timing data, and content characteristics
 */

// Sample viral posts data based on our LunarCrush collection
const viralPostsData = [
  // Bitcoin viral posts (>10K interactions)
  {
    id: "1940932399057305682",
    content: "Selling 1 btc @ 107k and dumping all the capital into $msty was the best decision I ever made. Quit my 9-5 slave job and now I get to enjoy my life with complete freedom.",
    creator: "vol_farmer",
    followers: 1903,
    interactions: 16900,
    platform: "X",
    timestamp: "2025-07-04T00:35:19Z",
    topics: ["bitcoin", "financial_freedom", "quit_job"],
    sentiment: "positive",
    hasEmojis: false,
    hasNumbers: true,
    hasAllCaps: false,
    contentType: "personal_success"
  },
  {
    id: "1940924428746936814", 
    content: "The Big Boomer Bill is now law in America. They continue to enrich themselves with entitlements while impoverishing future generations that will deal with their selfishness.",
    creator: "operationdanish",
    followers: 41000,
    interactions: 15000,
    platform: "X",
    timestamp: "2025-07-04T00:03:39Z",
    topics: ["bitcoin", "politics", "generational_wealth"],
    sentiment: "negative",
    hasEmojis: false,
    hasNumbers: false,
    hasAllCaps: true,
    contentType: "political_commentary"
  },
  {
    id: "1940867513358651725",
    content: "Let me tell you why Tom Lee is the most bullish thing to happen to ETH this year. Tom Lee was the guy in 2017 on CNBC calling for $55k bitcoin when it was trading at $2k.",
    creator: "RyanSAdams",
    followers: 261500,
    interactions: 147700,
    platform: "X", 
    timestamp: "2025-07-03T20:17:29Z",
    topics: ["ethereum", "tom_lee", "price_prediction"],
    sentiment: "positive",
    hasEmojis: false,
    hasNumbers: true,
    hasAllCaps: false,
    contentType: "expert_analysis"
  },
  // Add more sample data...
];

console.log('🔍 Analyzing Viral Post Patterns...\n');

// Analysis Functions
function analyzeEngagementPatterns(posts) {
  const engagementRates = posts.map(post => post.interactions / post.followers);
  const avgEngagementRate = engagementRates.reduce((a, b) => a + b, 0) / engagementRates.length;
  
  return {
    totalPosts: posts.length,
    avgInteractions: posts.reduce((sum, post) => sum + post.interactions, 0) / posts.length,
    avgEngagementRate: avgEngagementRate,
    highestEngagement: Math.max(...posts.map(p => p.interactions)),
    viralThreshold: 10000
  };
}

function analyzeContentPatterns(posts) {
  const contentTypes = {};
  const topics = {};
  const sentiments = {};
  
  posts.forEach(post => {
    // Content type analysis
    contentTypes[post.contentType] = (contentTypes[post.contentType] || 0) + 1;
    
    // Topic analysis
    post.topics.forEach(topic => {
      topics[topic] = (topics[topic] || 0) + 1;
    });
    
    // Sentiment analysis
    sentiments[post.sentiment] = (sentiments[post.sentiment] || 0) + 1;
  });
  
  return { contentTypes, topics, sentiments };
}

function analyzeTimingPatterns(posts) {
  const hourCounts = {};
  const dayOfWeekCounts = {};
  
  posts.forEach(post => {
    const date = new Date(post.timestamp);
    const hour = date.getUTCHours();
    const dayOfWeek = date.getUTCDay();
    
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
  });
  
  return { hourCounts, dayOfWeekCounts };
}

function analyzeCreatorPatterns(posts) {
  const followerRanges = {
    'micro': 0, // <10K
    'mid': 0,   // 10K-100K  
    'macro': 0, // 100K-1M
    'mega': 0   // >1M
  };
  
  posts.forEach(post => {
    if (post.followers < 10000) followerRanges.micro++;
    else if (post.followers < 100000) followerRanges.mid++;
    else if (post.followers < 1000000) followerRanges.macro++;
    else followerRanges.mega++;
  });
  
  return followerRanges;
}

// Run Analysis
const engagementAnalysis = analyzeEngagementPatterns(viralPostsData);
const contentAnalysis = analyzeContentPatterns(viralPostsData);
const timingAnalysis = analyzeTimingPatterns(viralPostsData);
const creatorAnalysis = analyzeCreatorPatterns(viralPostsData);

// Output Results
console.log('📊 ENGAGEMENT PATTERNS:');
console.log(`Average Interactions: ${engagementAnalysis.avgInteractions.toLocaleString()}`);
console.log(`Average Engagement Rate: ${(engagementAnalysis.avgEngagementRate * 100).toFixed(2)}%`);
console.log(`Highest Engagement: ${engagementAnalysis.highestEngagement.toLocaleString()}`);

console.log('\n🎯 CONTENT PATTERNS:');
console.log('Top Content Types:', Object.entries(contentAnalysis.contentTypes).sort((a,b) => b[1] - a[1]));
console.log('Top Topics:', Object.entries(contentAnalysis.topics).sort((a,b) => b[1] - a[1]));

console.log('\n⏰ TIMING PATTERNS:');
console.log('Peak Hours (UTC):', Object.entries(timingAnalysis.hourCounts).sort((a,b) => b[1] - a[1]).slice(0, 5));

console.log('\n👥 CREATOR PATTERNS:');
console.log('Follower Distribution:', creatorAnalysis);

console.log('\n✅ Phase 1.2 Analysis Complete!');
