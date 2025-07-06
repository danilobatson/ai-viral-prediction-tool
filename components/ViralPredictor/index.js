import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Textarea,
  Input,
  Select,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Progress,
  Badge,
  Spinner,
  Card,
  CardBody,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  FormHelperText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { contentTypes, niches } from './enhanced-options';

const ViralPredictor = () => {
  const [contentType, setContentType] = useState('text');
  const [platform] = useState('twitter');
  const [niche, setNiche] = useState('crypto');
  const [username, setUsername] = useState('');

  // Text content fields
  const [textContent, setTextContent] = useState('');

  // Image content fields
  const [imageCaption, setImageCaption] = useState('');
  const [imageHashtags, setImageHashtags] = useState('');

  // Video content fields
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoHashtags, setVideoHashtags] = useState('');

  // Story content fields
  const [storyText, setStoryText] = useState('');
  const [storyHashtags, setStoryHashtags] = useState('');

  // Poll content fields
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState('');
  const [pollContext, setPollContext] = useState('');

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Content types optimized for Twitter
  const contentTypes = [
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

  // Crypto-focused niches (Twitter's strength)
  const niches = [
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

  const analyzeViralProbability = async () => {
    // Combine all content based on type
    let combinedContent = '';

    switch (contentType) {
      case 'text':
        combinedContent = textContent;
        break;
      case 'image':
        combinedContent = `${imageCaption} ${imageHashtags}`.trim();
        break;
      case 'video':
        combinedContent = `${videoTitle}\n\n${videoDescription}\n\n${videoHashtags}`.trim();
        break;
      case 'thread':
        combinedContent = textContent; // For threads, use the main text area
        break;
      case 'poll':
        combinedContent = `${pollQuestion}\n\nOptions:\n${pollOptions}\n\nContext: ${pollContext}`.trim();
        break;
      case 'quote':
        combinedContent = `${textContent}\n\n(Quote tweet with commentary)`;
        break;
      case 'reply':
        combinedContent = `${textContent}\n\n(Reply tweet)`;
        break;
      default:
        combinedContent = textContent;
    }

    if (!combinedContent.trim()) {
      setError('Please enter content to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const postData = {
        text: combinedContent,
        platform: 'twitter', // Always Twitter
        niche,
        contentType,
        username: username || null,
        created_time: new Date().toISOString(),
        hashtags: [], // Could extract from content
        mentions: [], // Could extract from content
        media_count: contentType === 'image' || contentType === 'video' ? 1 : 0,
      };

      const response = await fetch('/api/predict-viral-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postData }),
      });

      const data = await response.json();

      if (data.success) {
        setPrediction(data.prediction);
      } else {
        setError(data.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'green';
    if (confidence >= 60) return 'orange';
    return 'red';
  };

  const getViralLabel = (confidence) => {
    if (confidence >= 90) return 'High Viral Probability';
    if (confidence >= 80) return 'Moderate-High Probability';
    if (confidence >= 60) return 'Moderate Probability';
    if (confidence >= 40) return 'Low-Moderate Probability';
    return 'Low Viral Probability';
  };

  const renderContentFields = () => {
    const selectedType = contentTypes.find(ct => ct.value === contentType);

    switch (contentType) {
      case 'text':
      case 'thread':
      case 'quote':
      case 'reply':
        return (
          <FormControl>
            <FormLabel fontWeight="bold">
              {contentType === 'thread' ? 'Thread Content' :
               contentType === 'quote' ? 'Quote Tweet Content' :
               contentType === 'reply' ? 'Reply Content' : 'Tweet Content'} *
            </FormLabel>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder={
                contentType === 'thread' ?
                  "Enter your thread content...\n\n1/ First tweet in thread\n2/ Second tweet content\n3/ Final tweet with CTA..." :
                contentType === 'quote' ?
                  "Your commentary on the quoted tweet...\n\nExample: 'This is exactly why we need better crypto education! The fundamentals are..'" :
                contentType === 'reply' ?
                  "Your reply to another tweet...\n\nExample: 'Great point! I'd add that...'" :
                  "What's your tweet about? Enter your full content here..."
              }
              rows={6}
              resize="vertical"
            />
            <FormHelperText>
              {selectedType?.description}
            </FormHelperText>
          </FormControl>
        );

      case 'image':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold">Image Tweet Caption *</FormLabel>
              <Textarea
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="What caption will you write for this image tweet?"
                rows={4}
                resize="vertical"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Hashtags (Optional)</FormLabel>
              <Input
                value={imageHashtags}
                onChange={(e) => setImageHashtags(e.target.value)}
                placeholder="#crypto #bitcoin #analysis"
              />
            </FormControl>
          </VStack>
        );

      case 'video':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold">Video Title/Hook *</FormLabel>
              <Input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Attention-grabbing title for your video tweet"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Video Description *</FormLabel>
              <Textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Describe what your video is about..."
                rows={4}
                resize="vertical"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Hashtags (Optional)</FormLabel>
              <Input
                value={videoHashtags}
                onChange={(e) => setVideoHashtags(e.target.value)}
                placeholder="#crypto #video #analysis"
              />
            </FormControl>
          </VStack>
        );

      case 'poll':
        return (
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold">Poll Question *</FormLabel>
              <Input
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="What's your poll question?"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Poll Options *</FormLabel>
              <Textarea
                value={pollOptions}
                onChange={(e) => setPollOptions(e.target.value)}
                placeholder="Option 1: Yes&#10;Option 2: No&#10;Option 3: Maybe&#10;Option 4: Not sure"
                rows={4}
                resize="vertical"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold">Additional Context (Optional)</FormLabel>
              <Textarea
                value={pollContext}
                onChange={(e) => setPollContext(e.target.value)}
                placeholder="Any additional context or explanation for your poll..."
                rows={3}
                resize="vertical"
              />
            </FormControl>
          </VStack>
        );

      default:
        return (
          <FormControl>
            <FormLabel fontWeight="bold">Tweet Content *</FormLabel>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter your tweet content..."
              rows={6}
              resize="vertical"
            />
          </FormControl>
        );
    }
  };

  // Group niches by category for better UX
  const groupedNiches = niches.reduce((acc, niche) => {
    if (!acc[niche.category]) acc[niche.category] = [];
    acc[niche.category].push(niche);
    return acc;
  }, {});

  return (
		<Box maxW='4xl' mx='auto' p={6}>
			<VStack spacing={8} align='stretch'>
				{/* Header */}
				<Box textAlign='center'>
					<Badge colorScheme='blue' fontSize='sm' mb={2}>
						🐦 Twitter/X Optimized
					</Badge>
					<Heading size='lg' mb={2}>
						Twitter Viral Probability Analyzer
					</Heading>
					<Text color='gray.600' fontSize='md'>
						Powered by LunarCrush MCP + Google Gemini AI for real-time Twitter
						analysis
					</Text>
					<Badge colorScheme='green' mt={2}>
						✅ Full MCP Data Integration
					</Badge>
				</Box>

				{/* Platform Info */}
				<Alert status='info' borderRadius='lg'>
					<AlertIcon />
					<Box>
						<Text fontWeight='bold'>Twitter/X Platform Focus</Text>
						<Text fontSize='sm'>
							Optimized for Twitter&apos;s viral mechanics using real-time
							LunarCrush social data and crypto sentiment analysis.
						</Text>
					</Box>
				</Alert>

				{/* Content Type Selection */}
				<Card bg={cardBg} borderRadius='lg'>
					<CardBody>
						<VStack spacing={4} align='stretch'>
							<Heading size='md'>Tweet Type & Details</Heading>

							<FormControl>
								<FormLabel fontWeight='bold'>Content Type</FormLabel>
								<Select
									value={contentType}
									onChange={(e) => setContentType(e.target.value)}
									bg={cardBg}>
									{contentTypes.map((type) => (
										<option key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</Select>
								<FormHelperText>
									Different tweet types have different viral patterns on Twitter
								</FormHelperText>
							</FormControl>

							<FormControl>
								<FormLabel fontWeight='bold'>Content Niche</FormLabel>
								<Select
									value={niche}
									onChange={(e) => setNiche(e.target.value)}
									bg={cardBg}>
									{Object.entries(groupedNiches).map(([category, items]) => (
										<optgroup key={category} label={category}>
											{items.map((item) => (
												<option key={item.value} value={item.value}>
													{item.label}
												</option>
											))}
										</optgroup>
									))}
								</Select>
								<FormHelperText>
									Choose the category that best matches your content for more
									accurate analysis
								</FormHelperText>
							</FormControl>

							<FormControl>
								<FormLabel fontWeight='bold'>
									Your Twitter Handle (Optional)
								</FormLabel>
								<Input
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder='@yourusername'
									bg={cardBg}
								/>
								<FormHelperText>
									Optional: Include your handle for personalized creator
									analysis
								</FormHelperText>
							</FormControl>
						</VStack>
					</CardBody>
				</Card>

				{/* Content Input */}
				<Card bg={cardBg} borderRadius='lg'>
					<CardBody>
						<VStack spacing={4} align='stretch'>
							<Heading size='md'>
								{contentTypes.find((ct) => ct.value === contentType)?.label}{' '}
								Content
							</Heading>

							{renderContentFields()}

							<Button
								colorScheme='purple'
								size='lg'
								onClick={analyzeViralProbability}
								isLoading={loading}
								loadingText='Analyzing with LunarCrush MCP + AI...'
								mt={4}>
								🚀 Analyze Viral Probability
							</Button>
						</VStack>
					</CardBody>
				</Card>

				{/* Error Display */}
				{error && (
					<Alert status='error' borderRadius='lg'>
						<AlertIcon />
						<Text>{error}</Text>
					</Alert>
				)}

				{/* Loading State */}
				{loading && (
					<Card
						bg={cardBg}
						borderRadius='lg'
						borderWidth='2px'
						borderColor='purple.200'>
						<CardBody>
							<VStack spacing={4}>
								<Spinner size='lg' color='purple.500' />
								<VStack spacing={2}>
									<Text fontWeight='bold' color='purple.600'>
										🧠 AI Analysis in Progress
									</Text>
									<Text fontSize='sm' color='gray.600' textAlign='center'>
										• Fetching real-time Twitter data via LunarCrush MCP
										<br />
										• Running Google Gemini 2.0 Flash Lite analysis
										<br />• Calculating viral probability for{' '}
										{niches.find((n) => n.value === niche)?.label}
									</Text>
								</VStack>
								<Progress
									size='lg'
									colorScheme='purple'
									isIndeterminate
									w='100%'
								/>
							</VStack>
						</CardBody>
					</Card>
				)}

				{/* Prediction Results */}
				{prediction && (
					<Card
						bg={cardBg}
						borderRadius='lg'
						borderWidth='2px'
						borderColor={borderColor}>
						<CardBody>
							<VStack spacing={6} align='stretch'>
								{/* Main Prediction Score */}
								<Box textAlign='center'>
									<Badge
										fontSize='lg'
										p={3}
										borderRadius='full'
										colorScheme={getConfidenceColor(prediction.confidence)}>
										{getViralLabel(prediction.confidence)}
									</Badge>
									<Heading
										size='2xl'
										mt={2}
										color={`${getConfidenceColor(prediction.confidence)}.500`}>
										{prediction.confidence}%
									</Heading>
									<Text color='gray.600' mt={2}>
										Estimated Viral Probability
									</Text>
									<Progress
										value={prediction.confidence}
										size='lg'
										colorScheme={getConfidenceColor(prediction.confidence)}
										mt={4}
										borderRadius='full'
									/>
								</Box>

								<Divider />

								{/* Twitter-Specific Metrics */}
								<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
									<Stat textAlign='center'>
										<StatLabel>Twitter Optimization</StatLabel>
										<StatNumber fontSize='2xl'>
											{prediction.platformFit ||
												Math.floor(prediction.confidence * 0.9)}
											%
										</StatNumber>
										<StatHelpText>Platform Fit</StatHelpText>
									</Stat>

									<Stat textAlign='center'>
										<StatLabel>Engagement Potential</StatLabel>
										<StatNumber fontSize='2xl'>
											{prediction.expectedEngagement ||
												Math.floor(prediction.confidence * 12)}
										</StatNumber>
										<StatHelpText>Expected Interactions</StatHelpText>
									</Stat>

									<Stat textAlign='center'>
										<StatLabel>Timing Score</StatLabel>
										<StatNumber fontSize='2xl'>
											{prediction.timingScore ||
												Math.floor(prediction.confidence * 0.8)}
											%
										</StatNumber>
										<StatHelpText>Optimal Timing</StatHelpText>
									</Stat>

									<Stat textAlign='center'>
										<StatLabel>Crypto Relevance</StatLabel>
										<StatNumber fontSize='2xl'>
											{prediction.nicheScore ||
												Math.floor(prediction.confidence * 0.95)}
											%
										</StatNumber>
										<StatHelpText>Niche Alignment</StatHelpText>
									</Stat>
								</SimpleGrid>

								{/* AI Recommendations */}
								{prediction.recommendations && (
									<>
										<Divider />
										<Box>
											<Heading size='md' mb={3}>
												🤖 AI Recommendations
											</Heading>
											<VStack align='start' spacing={2}>
												{prediction.recommendations
													.slice(0, 3)
													.map((rec, index) => (
														<Text key={index} fontSize='sm' color='gray.700'>
															• {rec}
														</Text>
													))}
											</VStack>
										</Box>
									</>
								)}

								{/* Twitter-Specific Tips */}
								<Alert status='info' borderRadius='lg'>
									<AlertIcon />
									<Box>
										<Text fontWeight='bold'>Twitter Optimization Tips</Text>
										<Text fontSize='sm'>
											• Tweet during peak crypto hours (9-11 AM & 7-9 PM EST) •
											Use 1-3 relevant hashtags maximum • Include engaging
											visuals for higher engagement • Ask questions to drive
											replies and engagement
										</Text>
									</Box>
								</Alert>
							</VStack>
						</CardBody>
					</Card>
				)}
			</VStack>
		</Box>
	);
};

export default ViralPredictor;
