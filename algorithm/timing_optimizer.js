/**
 * Timing Optimization System
 * Calculates optimal posting times for viral potential
 * Key insight: Tuesday-Thursday, 12-16 UTC = 2x engagement boost
 */

class TimingOptimizer {
  constructor() {
    // Optimal timing data from Phase 1 analysis
    this.OPTIMAL_TIMES = {
      // Peak engagement hours (UTC)
      PEAK_HOURS: {
        START: 12,  // 12:00 UTC
        END: 16     // 16:00 UTC
      },
      
      // Peak engagement days (0 = Sunday, 1 = Monday, etc.)
      PEAK_DAYS: [2, 3, 4], // Tuesday, Wednesday, Thursday
      
      // Timezone adjustments for crypto audience
      CRYPTO_TIMEZONES: {
        'America/New_York': -5,    // EST
        'America/Los_Angeles': -8,  // PST
        'Europe/London': 0,         // GMT
        'Asia/Tokyo': 9,            // JST
        'Asia/Singapore': 8,        // SGT
        'Australia/Sydney': 11      // AEDT
      }
    };

    // Engagement multipliers based on Phase 1 data
    this.ENGAGEMENT_MULTIPLIERS = {
      PEAK_HOUR_MULTIPLIER: 2.0,     // 12-16 UTC boost
      PEAK_DAY_MULTIPLIER: 1.8,      // Tuesday-Thursday boost
      WEEKEND_PENALTY: 0.6,          // Saturday-Sunday penalty
      LATE_NIGHT_PENALTY: 0.4,       // 00-06 UTC penalty
      EARLY_MORNING_PENALTY: 0.7     // 06-09 UTC penalty
    };

    // Audience activity patterns
    this.AUDIENCE_PATTERNS = {
      CRYPTO_TRADERS: {
        peak_hours: [13, 14, 15, 16], // Market hours
        peak_days: [1, 2, 3, 4],      // Monday-Thursday
        timezone_weight: 'Europe/London'
      },
      GENERAL_CRYPTO: {
        peak_hours: [12, 13, 14, 15, 16],
        peak_days: [2, 3, 4],         // Tuesday-Thursday
        timezone_weight: 'America/New_York'
      },
      GLOBAL_AUDIENCE: {
        peak_hours: [14, 15],         // Overlap hours
        peak_days: [2, 3],            // Tuesday-Wednesday
        timezone_weight: 'Europe/London'
      }
    };
  }

  /**
   * Calculate optimal posting time and engagement multiplier
   * @param {Object} timingData - Current time and posting preferences
   * @returns {Object} Timing analysis with optimal posting suggestions
   */
  calculateOptimalTiming(timingData) {
    const {
      current_time = new Date(),
      target_timezone = 'UTC',
      audience_type = 'GENERAL_CRYPTO',
      post_immediately = false,
      planning_horizon_hours = 72
    } = timingData;

    const currentDate = new Date(current_time);
    const currentMultiplier = this.calculateCurrentMultiplier(currentDate);
    
    // Find optimal posting times within planning horizon
    const optimalTimes = this.findOptimalTimes(currentDate, planning_horizon_hours);
    
    // Calculate timezone-adjusted recommendations
    const timezoneRecommendations = this.calculateTimezoneRecommendations(
      optimalTimes,
      target_timezone,
      audience_type
    );

    // Generate timing insights
    const insights = this.generateTimingInsights(currentDate, currentMultiplier, optimalTimes);

    return {
      currentMultiplier: Math.round(currentMultiplier * 100) / 100,
      isOptimalTime: currentMultiplier >= 1.5,
      optimalTimes: optimalTimes.slice(0, 5), // Top 5 optimal times
      timezoneRecommendations,
      nextOptimalTime: optimalTimes[0],
      insights,
      analysis: {
        currentHour: currentDate.getUTCHours(),
        currentDay: currentDate.getUTCDay(),
        currentDayName: this.getDayName(currentDate.getUTCDay()),
        isPeakHour: this.isPeakHour(currentDate.getUTCHours()),
        isPeakDay: this.isPeakDay(currentDate.getUTCDay()),
        isWeekend: this.isWeekend(currentDate.getUTCDay())
      },
      metadata: {
        calculatedAt: new Date().toISOString(),
        planningHorizon: planning_horizon_hours,
        audienceType: audience_type,
        timezone: target_timezone
      }
    };
  }

  /**
   * Calculate engagement multiplier for current time
   */
  calculateCurrentMultiplier(date) {
    const hour = date.getUTCHours();
    const day = date.getUTCDay();
    
    let multiplier = 1.0;

    // Hour-based multipliers
    if (this.isPeakHour(hour)) {
      multiplier *= this.ENGAGEMENT_MULTIPLIERS.PEAK_HOUR_MULTIPLIER;
    } else if (hour >= 0 && hour < 6) {
      multiplier *= this.ENGAGEMENT_MULTIPLIERS.LATE_NIGHT_PENALTY;
    } else if (hour >= 6 && hour < 9) {
      multiplier *= this.ENGAGEMENT_MULTIPLIERS.EARLY_MORNING_PENALTY;
    }

    // Day-based multipliers
    if (this.isPeakDay(day)) {
      multiplier *= this.ENGAGEMENT_MULTIPLIERS.PEAK_DAY_MULTIPLIER;
    } else if (this.isWeekend(day)) {
      multiplier *= this.ENGAGEMENT_MULTIPLIERS.WEEKEND_PENALTY;
    }

    return multiplier;
  }

  /**
   * Find optimal posting times within planning horizon
   */
  findOptimalTimes(currentDate, horizonHours) {
    const optimalTimes = [];
    const startTime = new Date(currentDate);
    
    // Generate time slots for next horizonHours
    for (let i = 1; i <= horizonHours; i++) {
      const checkTime = new Date(startTime.getTime() + (i * 60 * 60 * 1000));
      const multiplier = this.calculateCurrentMultiplier(checkTime);
      
      if (multiplier >= 1.5) { // Only include good times
        optimalTimes.push({
          datetime: checkTime.toISOString(),
          multiplier: Math.round(multiplier * 100) / 100,
          hour: checkTime.getUTCHours(),
          day: this.getDayName(checkTime.getUTCDay()),
          hoursFromNow: i,
          score: this.calculateTimeScore(checkTime)
        });
      }
    }

    // Sort by score (best first)
    return optimalTimes.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate time score for ranking
   */
  calculateTimeScore(date) {
    const hour = date.getUTCHours();
    const day = date.getUTCDay();
    
    let score = 0;
    
    // Peak hour bonus
    if (this.isPeakHour(hour)) {
      score += 50;
      // Extra bonus for perfect peak (2-3 PM UTC)
      if (hour >= 14 && hour <= 15) {
        score += 20;
      }
    }
    
    // Peak day bonus
    if (this.isPeakDay(day)) {
      score += 30;
      // Extra bonus for Tuesday-Wednesday
      if (day === 2 || day === 3) {
        score += 10;
      }
    }
    
    // Penalty for weekends
    if (this.isWeekend(day)) {
      score -= 20;
    }
    
    return score;
  }

  /**
   * Calculate timezone-specific recommendations
   */
  calculateTimezoneRecommendations(optimalTimes, targetTimezone, audienceType) {
    const recommendations = {};
    
    // Get audience pattern
    const audiencePattern = this.AUDIENCE_PATTERNS[audienceType] || this.AUDIENCE_PATTERNS.GENERAL_CRYPTO;
    
    // Calculate recommendations for major crypto timezones
    Object.entries(this.OPTIMAL_TIMES.CRYPTO_TIMEZONES).forEach(([timezone, offset]) => {
      const localOptimalTimes = optimalTimes.slice(0, 3).map(time => {
        const utcDate = new Date(time.datetime);
        const localDate = new Date(utcDate.getTime() + (offset * 60 * 60 * 1000));
        
        return {
          utc: time.datetime,
          local: localDate.toISOString(),
          localHour: localDate.getHours(),
          localDay: this.getDayName(localDate.getDay()),
          multiplier: time.multiplier,
          hoursFromNow: time.hoursFromNow
        };
      });
      
      recommendations[timezone] = localOptimalTimes;
    });
    
    return recommendations;
  }

  /**
   * Generate timing insights and recommendations
   */
  generateTimingInsights(currentDate, currentMultiplier, optimalTimes) {
    const insights = [];
    const hour = currentDate.getUTCHours();
    const day = currentDate.getUTCDay();
    
    // Current time analysis
    if (currentMultiplier >= 2.0) {
      insights.push('🔥 Perfect timing! Peak engagement window');
    } else if (currentMultiplier >= 1.5) {
      insights.push('✅ Good timing for posting');
    } else if (currentMultiplier >= 1.0) {
      insights.push('📈 Moderate timing - consider waiting');
    } else {
      insights.push('⏰ Poor timing - wait for better window');
    }

    // Specific recommendations
    if (this.isWeekend(day)) {
      insights.push('📅 Weekend posting gets 40% less engagement');
    }
    
    if (hour >= 0 && hour < 6) {
      insights.push('🌙 Late night posting reduces engagement by 60%');
    }
    
    if (this.isPeakDay(day) && !this.isPeakHour(hour)) {
      insights.push('🎯 Peak day! Wait for 12-16 UTC for 2x boost');
    }

    // Next optimal time
    if (optimalTimes.length > 0) {
      const nextOptimal = optimalTimes[0];
      insights.push(`⏰ Next optimal: ${nextOptimal.hoursFromNow}h (${nextOptimal.multiplier}x boost)`);
    }

    return insights;
  }

  /**
   * Get best posting time for specific content type
   */
  getBestTimeForContent(contentType) {
    const recommendations = {
      'breaking_news': {
        immediatePost: true,
        note: 'Breaking news should be posted immediately'
      },
      'analysis': {
        optimalHours: [13, 14, 15], // Peak analysis consumption
        optimalDays: [2, 3, 4],     // Tuesday-Thursday
        note: 'Analysis performs best during market hours'
      },
      'educational': {
        optimalHours: [14, 15, 16], // When people have time to read
        optimalDays: [2, 3, 4],     // Weekdays
        note: 'Educational content needs focused attention'
      },
      'personal_story': {
        optimalHours: [12, 13, 14, 15, 16], // Broader window
        optimalDays: [2, 3, 4, 5],          // Tuesday-Friday
        note: 'Personal stories work well throughout peak hours'
      }
    };

    return recommendations[contentType] || recommendations['analysis'];
  }

  /**
   * Utility functions
   */
  isPeakHour(hour) {
    return hour >= this.OPTIMAL_TIMES.PEAK_HOURS.START && 
           hour < this.OPTIMAL_TIMES.PEAK_HOURS.END;
  }

  isPeakDay(day) {
    return this.OPTIMAL_TIMES.PEAK_DAYS.includes(day);
  }

  isWeekend(day) {
    return day === 0 || day === 6; // Sunday or Saturday
  }

  getDayName(day) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }

  /**
   * Calculate engagement prediction for specific time
   */
  predictEngagement(baseEngagement, postingTime) {
    const multiplier = this.calculateCurrentMultiplier(new Date(postingTime));
    return Math.round(baseEngagement * multiplier);
  }
}

module.exports = TimingOptimizer;

// Example usage and testing
if (require.main === module) {
  const optimizer = new TimingOptimizer();
  
  // Test current time analysis
  console.log('⏰ CURRENT TIME ANALYSIS:');
  const currentAnalysis = optimizer.calculateOptimalTiming({
    current_time: new Date(),
    target_timezone: 'America/New_York',
    audience_type: 'GENERAL_CRYPTO',
    planning_horizon_hours: 48
  });
  
  console.log(JSON.stringify(currentAnalysis, null, 2));
  
  // Test specific time (Tuesday 2 PM UTC - should be optimal)
  console.log('\n🎯 PEAK TIME ANALYSIS (Tuesday 2 PM UTC):');
  const peakTime = new Date('2025-07-08T14:00:00Z'); // Tuesday 2 PM UTC
  const peakAnalysis = optimizer.calculateOptimalTiming({
    current_time: peakTime,
    target_timezone: 'UTC',
    audience_type: 'CRYPTO_TRADERS',
    planning_horizon_hours: 24
  });
  
  console.log(JSON.stringify(peakAnalysis, null, 2));
}
