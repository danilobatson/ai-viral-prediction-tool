import { useState, useEffect } from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	Button,
	Textarea,
	Select,
	FormControl,
	FormLabel,
	Alert,
	AlertIcon,
	Badge,
	Card,
	CardBody,
	CardHeader,
	Heading,
	SimpleGrid,
	Progress,
	Spinner,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	useColorModeValue,
	Flex,
	Spacer,
	Switch,
	IconButton,
	Tooltip,
	Divider,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	List,
	ListItem,
	ListIcon,
} from '@chakra-ui/react';
import {
	Lightbulb,
	Copy,
	RefreshCw,
	Target,
	Zap,
	CheckCircle,
	AlertTriangle,
} from 'lucide-react';

const ContentOptimizer = () => {
	const [originalContent, setOriginalContent] = useState('');
	const [platform, setPlatform] = useState('x');
	const [goal, setGoal] = useState('engagement');
	const [tone, setTone] = useState('professional');
	const [audience, setAudience] = useState('general');
	const [includeEmojis, setIncludeEmojis] = useState(true);
	const [includeHashtags, setIncludeHashtags] = useState(true);
	const [analysis, setAnalysis] = useState(null);
	const [suggestions, setSuggestions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const cardBg = useColorModeValue('white', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	const platforms = [
		{ value: 'x', label: 'X (Twitter)', maxLength: 280, style: 'concise' },
		{
			value: 'instagram',
			label: 'Instagram',
			maxLength: 2200,
			style: 'visual',
		},
		{ value: 'tiktok', label: 'TikTok', maxLength: 150, style: 'trendy' },
		{
			value: 'linkedin',
			label: 'LinkedIn',
			maxLength: 3000,
			style: 'professional',
		},
		{
			value: 'youtube',
			label: 'YouTube',
			maxLength: 5000,
			style: 'descriptive',
		},
		{
			value: 'facebook',
			label: 'Facebook',
			maxLength: 63206,
			style: 'conversational',
		},
	];

	const goals = [
		{ value: 'engagement', label: 'Maximize Engagement' },
		{ value: 'reach', label: 'Increase Reach' },
		{ value: 'clicks', label: 'Drive Clicks' },
		{ value: 'shares', label: 'Encourage Shares' },
		{ value: 'comments', label: 'Spark Discussion' },
		{ value: 'conversions', label: 'Drive Conversions' },
	];

	const tones = [
		{ value: 'professional', label: 'Professional' },
		{ value: 'casual', label: 'Casual & Friendly' },
		{ value: 'humorous', label: 'Humorous' },
		{ value: 'urgent', label: 'Urgent' },
		{ value: 'inspirational', label: 'Inspirational' },
		{ value: 'educational', label: 'Educational' },
		{ value: 'trendy', label: 'Trendy & Hip' },
	];

	const audiences = [
		{ value: 'general', label: 'General Audience' },
		{ value: 'crypto', label: 'Crypto Enthusiasts' },
		{ value: 'tech', label: 'Tech Professionals' },
		{ value: 'business', label: 'Business Leaders' },
		{ value: 'young_adults', label: 'Young Adults (18-35)' },
		{ value: 'entrepreneurs', label: 'Entrepreneurs' },
		{ value: 'investors', label: 'Investors' },
	];

	const optimizeContent = async () => {
		if (!originalContent.trim()) {
			setError('Please enter some content to optimize');
			return;
		}

		setLoading(true);
		setError('');
		setAnalysis(null);
		setSuggestions([]);

		try {
			// Simulate AI analysis
			await new Promise((resolve) => setTimeout(resolve, 3000));

			const contentAnalysis = analyzeContent(originalContent);
			const improvementSuggestions = generateSuggestions(
				originalContent,
				contentAnalysis
			);

			setAnalysis(contentAnalysis);
			setSuggestions(improvementSuggestions);
		} catch (err) {
			setError('Failed to optimize content. Please try again.');
			console.error('Content optimization error:', err);
		} finally {
			setLoading(false);
		}
	};

	const analyzeContent = (content) => {
		const platformData = platforms.find((p) => p.value === platform);
		const wordCount = content.split(/\s+/).length;
		const charCount = content.length;
		const hasEmojis =
			/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(
				content
			);
		const hasHashtags = content.includes('#');
		const hasMentions = content.includes('@');
		const hasQuestions = content.includes('?');
		const hasCallToAction =
			/\b(click|visit|check|download|subscribe|follow|share|comment|like)\b/i.test(
				content
			);
		const hasNumbers = /\d/.test(content);
		const hasCapitalization = /[A-Z]/.test(content);

		// Calculate scores
		const lengthScore =
			charCount <= platformData.maxLength
				? 100
				: Math.max(
						0,
						100 -
							((charCount - platformData.maxLength) / platformData.maxLength) *
								100
				  );
		const structureScore = calculateStructureScore(
			content,
			hasQuestions,
			hasCallToAction,
			hasNumbers
		);
		const platformFitScore = calculatePlatformFitScore(content, platformData);
		const engagementScore = calculateEngagementScore(
			content,
			hasEmojis,
			hasHashtags,
			hasMentions
		);

		const overallScore = Math.round(
			(lengthScore + structureScore + platformFitScore + engagementScore) / 4
		);

		return {
			wordCount,
			charCount,
			maxLength: platformData.maxLength,
			hasEmojis,
			hasHashtags,
			hasMentions,
			hasQuestions,
			hasCallToAction,
			hasNumbers,
			scores: {
				overall: overallScore,
				length: Math.round(lengthScore),
				structure: Math.round(structureScore),
				platformFit: Math.round(platformFitScore),
				engagement: Math.round(engagementScore),
			},
			issues: identifyIssues(
				content,
				platformData,
				hasCallToAction,
				hasEmojis,
				hasHashtags
			),
			strengths: identifyStrengths(
				content,
				hasQuestions,
				hasCallToAction,
				hasNumbers,
				hasEmojis
			),
		};
	};

	const calculateStructureScore = (
		content,
		hasQuestions,
		hasCallToAction,
		hasNumbers
	) => {
		let score = 50;
		if (hasQuestions) score += 20;
		if (hasCallToAction) score += 20;
		if (hasNumbers) score += 10;
		return Math.min(100, score);
	};

	const calculatePlatformFitScore = (content, platformData) => {
		let score = 70;

		// Length optimization
		if (content.length <= platformData.maxLength * 0.8) score += 15;
		else if (content.length > platformData.maxLength) score -= 30;

		// Platform-specific optimization
		switch (platformData.value) {
			case 'x':
				if (content.length <= 200) score += 15; // Twitter favors concise content
				break;
			case 'linkedin':
				if (content.split('\n').length > 3) score += 10; // LinkedIn likes formatted content
				break;
			case 'instagram':
				if (content.includes('\n\n')) score += 10; // Instagram likes spaced content
				break;
		}

		return Math.min(100, score);
	};

	const calculateEngagementScore = (
		content,
		hasEmojis,
		hasHashtags,
		hasMentions
	) => {
		let score = 50;
		if (hasEmojis) score += 15;
		if (hasHashtags) score += 15;
		if (hasMentions) score += 10;
		if (content.includes('!')) score += 10;
		return Math.min(100, score);
	};

	const identifyIssues = (
		content,
		platformData,
		hasCallToAction,
		hasEmojis,
		hasHashtags
	) => {
		const issues = [];

		if (content.length > platformData.maxLength) {
			issues.push({
				type: 'length',
				severity: 'high',
				message: `Content exceeds ${platformData.label} limit by ${
					content.length - platformData.maxLength
				} characters`,
				fix: 'Reduce content length to fit platform requirements',
			});
		}

		if (!hasCallToAction) {
			issues.push({
				type: 'engagement',
				severity: 'medium',
				message: 'No clear call-to-action detected',
				fix: 'Add phrases like "What do you think?", "Share your thoughts", or "Check it out"',
			});
		}

		if (!hasEmojis && includeEmojis && platform !== 'linkedin') {
			issues.push({
				type: 'visual',
				severity: 'low',
				message: 'No emojis found',
				fix: 'Add relevant emojis to increase visual appeal and engagement',
			});
		}

		if (!hasHashtags && includeHashtags) {
			issues.push({
				type: 'discovery',
				severity: 'medium',
				message: 'No hashtags found',
				fix: 'Add relevant hashtags to improve discoverability',
			});
		}

		return issues;
	};

	const identifyStrengths = (
		content,
		hasQuestions,
		hasCallToAction,
		hasNumbers,
		hasEmojis
	) => {
		const strengths = [];

		if (hasQuestions) {
			strengths.push('Uses questions to engage audience');
		}

		if (hasCallToAction) {
			strengths.push('Includes clear call-to-action');
		}

		if (hasNumbers) {
			strengths.push('Contains specific numbers/statistics');
		}

		if (hasEmojis) {
			strengths.push('Uses emojis for visual appeal');
		}

		if (content.split(/[.!?]/).length > 2) {
			strengths.push('Good sentence variety and structure');
		}

		return strengths;
	};

	const generateSuggestions = (content, contentAnalysis) => {
		const suggestions = [];
		const platformData = platforms.find((p) => p.value === platform);

		// Generate improved versions
		suggestions.push({
			type: 'rewrite',
			title: 'AI-Optimized Version',
			content: generateOptimizedVersion(content, 'optimized'),
			improvements: [
				'Enhanced for ' + platformData.label,
				'Optimized length',
				'Better engagement triggers',
			],
			score: Math.min(100, contentAnalysis.scores.overall + 20),
		});

		suggestions.push({
			type: 'rewrite',
			title: 'Engagement-Focused Version',
			content: generateOptimizedVersion(content, 'engagement'),
			improvements: [
				'Added call-to-action',
				'Emotional triggers',
				'Question-based engagement',
			],
			score: Math.min(100, contentAnalysis.scores.overall + 15),
		});

		suggestions.push({
			type: 'rewrite',
			title: 'Platform-Specific Version',
			content: generateOptimizedVersion(content, 'platform'),
			improvements: [
				'Platform best practices',
				'Optimal formatting',
				'Style matching',
			],
			score: Math.min(100, contentAnalysis.scores.overall + 18),
		});

		// Add specific improvements
		const improvements = generateSpecificImprovements(content, contentAnalysis);
		suggestions.push(...improvements);

		return suggestions;
	};

	const generateOptimizedVersion = (content, type) => {
		const platformData = platforms.find((p) => p.value === platform);
		let optimized = content;

		// Simulate AI rewriting based on type
		switch (type) {
			case 'optimized':
				optimized = enhanceForOptimization(content, platformData);
				break;
			case 'engagement':
				optimized = enhanceForEngagement(content);
				break;
			case 'platform':
				optimized = enhanceForPlatform(content, platformData);
				break;
		}

		// Add emojis if requested
		if (includeEmojis && platform !== 'linkedin') {
			optimized = addRelevantEmojis(optimized);
		}

		// Add hashtags if requested
		if (includeHashtags && !optimized.includes('#')) {
			optimized = addRelevantHashtags(optimized);
		}

		return optimized;
	};

	const enhanceForOptimization = (content, platformData) => {
		// Simulate AI optimization
		let enhanced = content;

		// Add urgency/action words
		const actionWords = [
			'🚀 Breaking:',
			'⚡ Just in:',
			'🔥 Hot take:',
			'💡 Pro tip:',
		];
		if (!enhanced.match(/^(🚀|⚡|🔥|💡)/)) {
			enhanced =
				actionWords[Math.floor(Math.random() * actionWords.length)] +
				' ' +
				enhanced;
		}

		// Ensure it fits platform
		if (enhanced.length > platformData.maxLength) {
			enhanced =
				enhanced.substring(0, platformData.maxLength - 20) + '... (continued)';
		}

		return enhanced;
	};

	const enhanceForEngagement = (content) => {
		let enhanced = content;

		// Add question if none exists
		if (!enhanced.includes('?')) {
			const questions = [
				' What are your thoughts?',
				' Do you agree?',
				' Have you experienced this?',
				' What would you do?',
			];
			enhanced += questions[Math.floor(Math.random() * questions.length)];
		}

		// Add call to action
		if (
			!enhanced.toLowerCase().includes('share') &&
			!enhanced.toLowerCase().includes('comment')
		) {
			enhanced += ' Share if you found this helpful! 👇';
		}

		return enhanced;
	};

	const enhanceForPlatform = (content, platformData) => {
		let enhanced = content;

		switch (platformData.value) {
			case 'x':
				// Make it more concise and punchy
				enhanced = enhanced.replace(/\band\b/g, '&').replace(/\byou\b/g, 'u');
				break;
			case 'linkedin':
				// Make it more professional
				enhanced = 'Insight: ' + enhanced + '\n\n#Leadership #Growth';
				break;
			case 'instagram':
				// Add line breaks for readability
				enhanced = enhanced.replace(/\. /g, '.\n\n');
				break;
		}

		return enhanced;
	};

	const addRelevantEmojis = (content) => {
		const emojiMap = {
			crypto: '₿',
			bitcoin: '₿',
			money: '💰',
			success: '🚀',
			growth: '📈',
			tip: '💡',
			important: '⚠️',
			fire: '🔥',
			new: '✨',
		};

		let enhanced = content;
		Object.keys(emojiMap).forEach((keyword) => {
			const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
			if (enhanced.match(regex) && !enhanced.includes(emojiMap[keyword])) {
				enhanced = enhanced.replace(regex, `${keyword} ${emojiMap[keyword]}`);
			}
		});

		return enhanced;
	};

	const addRelevantHashtags = (content) => {
		const hashtagSuggestions = {
			crypto: ['#crypto', '#bitcoin', '#blockchain'],
			tech: ['#tech', '#ai', '#innovation'],
			business: ['#business', '#entrepreneurship', '#growth'],
			general: ['#content', '#social', '#engagement'],
		};

		const relevantTags =
			hashtagSuggestions[audience] || hashtagSuggestions.general;
		return content + '\n\n' + relevantTags.slice(0, 3).join(' ');
	};

	const generateSpecificImprovements = (content, analysis) => {
		const improvements = [];

		// Length optimization
		if (analysis.charCount > analysis.maxLength) {
			improvements.push({
				type: 'improvement',
				title: 'Length Optimization',
				content: content.substring(0, analysis.maxLength - 20) + '...',
				improvements: ['Fits platform requirements', 'Maintains key message'],
				score: 85,
			});
		}

		// Add CTA if missing
		if (!analysis.hasCallToAction) {
			improvements.push({
				type: 'improvement',
				title: 'With Call-to-Action',
				content: content + ' What do you think? Share your thoughts below! 👇',
				improvements: ['Encourages engagement', 'Drives comments'],
				score: Math.min(100, analysis.scores.overall + 12),
			});
		}

		return improvements;
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
	};

	const getScoreColor = (score) => {
		if (score >= 80) return 'green';
		if (score >= 60) return 'orange';
		return 'red';
	};

	const getSeverityColor = (severity) => {
		switch (severity) {
			case 'high':
				return 'red';
			case 'medium':
				return 'orange';
			case 'low':
				return 'yellow';
			default:
				return 'gray';
		}
	};

	return (
		<Box maxW='6xl' mx='auto'>
			<VStack spacing={6} align='stretch'>
				{/* Header */}
				<Box textAlign='center'>
					<Heading size='lg' mb={2} color='cyan.500'>
						✨ Content Improvement Suggestions
					</Heading>
					<Text color='gray.600'>
						AI-powered content optimization with Gemini-enhanced suggestions
					</Text>
				</Box>

				{/* Input Section */}
				<Card bg={cardBg} borderRadius='lg'>
					<CardBody>
						<VStack spacing={4} align='stretch'>
							<FormControl>
								<FormLabel fontWeight='bold'>Your Content</FormLabel>
								<Textarea
									value={originalContent}
									onChange={(e) => setOriginalContent(e.target.value)}
									placeholder='Enter your post content here for AI-powered optimization...'
									rows={5}
									resize='vertical'
								/>
								<HStack justify='space-between' mt={2}>
									<Text fontSize='sm' color='gray.500'>
										{originalContent.length} characters
									</Text>
									{platforms.find((p) => p.value === platform) && (
										<Text
											fontSize='sm'
											color={
												originalContent.length >
												platforms.find((p) => p.value === platform).maxLength
													? 'red.500'
													: 'gray.500'
											}>
											Limit:{' '}
											{platforms.find((p) => p.value === platform).maxLength}
										</Text>
									)}
								</HStack>
							</FormControl>

							<SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
								<FormControl>
									<FormLabel fontWeight='bold'>Platform</FormLabel>
									<Select
										value={platform}
										onChange={(e) => setPlatform(e.target.value)}>
										{platforms.map((p) => (
											<option key={p.value} value={p.value}>
												{p.label}
											</option>
										))}
									</Select>
								</FormControl>

								<FormControl>
									<FormLabel fontWeight='bold'>Goal</FormLabel>
									<Select
										value={goal}
										onChange={(e) => setGoal(e.target.value)}>
										{goals.map((g) => (
											<option key={g.value} value={g.value}>
												{g.label}
											</option>
										))}
									</Select>
								</FormControl>

								<FormControl>
									<FormLabel fontWeight='bold'>Tone</FormLabel>
									<Select
										value={tone}
										onChange={(e) => setTone(e.target.value)}>
										{tones.map((t) => (
											<option key={t.value} value={t.value}>
												{t.label}
											</option>
										))}
									</Select>
								</FormControl>
							</SimpleGrid>

							<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
								<FormControl>
									<FormLabel fontWeight='bold'>Target Audience</FormLabel>
									<Select
										value={audience}
										onChange={(e) => setAudience(e.target.value)}>
										{audiences.map((a) => (
											<option key={a.value} value={a.value}>
												{a.label}
											</option>
										))}
									</Select>
								</FormControl>

								<VStack align='stretch' spacing={2}>
									<FormControl display='flex' alignItems='center'>
										<FormLabel
											htmlFor='include-emojis'
											mb='0'
											fontWeight='bold'
											fontSize='sm'>
											Include emoji suggestions
										</FormLabel>
										<Switch
											id='include-emojis'
											isChecked={includeEmojis}
											onChange={(e) => setIncludeEmojis(e.target.checked)}
										/>
									</FormControl>
									<FormControl display='flex' alignItems='center'>
										<FormLabel
											htmlFor='include-hashtags'
											mb='0'
											fontWeight='bold'
											fontSize='sm'>
											Include hashtag suggestions
										</FormLabel>
										<Switch
											id='include-hashtags'
											isChecked={includeHashtags}
											onChange={(e) => setIncludeHashtags(e.target.checked)}
										/>
									</FormControl>
								</VStack>
							</SimpleGrid>

							<Button
								colorScheme='cyan'
								size='lg'
								onClick={optimizeContent}
								isLoading={loading}
								loadingText='Optimizing with AI...'
								leftIcon={<Lightbulb />}
								isDisabled={!originalContent.trim()}>
								🤖 Optimize Content with AI
							</Button>
						</VStack>
					</CardBody>
				</Card>

				{/* Error Alert */}
				{error && (
					<Alert status='error' borderRadius='lg'>
						<AlertIcon />
						{error}
					</Alert>
				)}

				{/* Loading State */}
				{loading && (
					<Card bg={cardBg} borderRadius='lg'>
						<CardBody>
							<VStack spacing={4}>
								<Spinner size='xl' color='cyan.500' />
								<VStack spacing={2}>
									<Text fontWeight='bold'>
										AI Content Optimization in Progress
									</Text>
									<Text fontSize='sm' color='gray.600'>
										Analyzing content structure, engagement potential, and
										platform fit...
									</Text>
								</VStack>
								<Progress
									size='lg'
									colorScheme='cyan'
									isIndeterminate
									w='100%'
								/>
							</VStack>
						</CardBody>
					</Card>
				)}

				{/* Results */}
				{analysis && suggestions.length > 0 && (
					<Tabs>
						<TabList>
							<Tab>Content Analysis</Tab>
							<Tab>AI Suggestions ({suggestions.length})</Tab>
							<Tab>Optimization Tips</Tab>
						</TabList>

						<TabPanels>
							{/* Analysis Tab */}
							<TabPanel>
								<VStack spacing={6} align='stretch'>
									{/* Overall Score */}
									<Card>
										<CardBody textAlign='center'>
											<Heading
												size='3xl'
												color={`${getScoreColor(analysis.scores.overall)}.500`}>
												{analysis.scores.overall}%
											</Heading>
											<Text color='gray.600' mt={2}>
												Overall Content Score
											</Text>
											<Progress
												value={analysis.scores.overall}
												size='lg'
												colorScheme={getScoreColor(analysis.scores.overall)}
												mt={4}
												borderRadius='full'
											/>
										</CardBody>
									</Card>

									{/* Detailed Scores */}
									<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
										<Card textAlign='center'>
											<CardBody>
												<Text
													fontSize='2xl'
													fontWeight='bold'
													color={`${getScoreColor(
														analysis.scores.length
													)}.500`}>
													{analysis.scores.length}%
												</Text>
												<Text fontSize='sm' color='gray.600'>
													Length Optimization
												</Text>
												<Text fontSize='xs' color='gray.500' mt={1}>
													{analysis.charCount}/{analysis.maxLength} chars
												</Text>
											</CardBody>
										</Card>

										<Card textAlign='center'>
											<CardBody>
												<Text
													fontSize='2xl'
													fontWeight='bold'
													color={`${getScoreColor(
														analysis.scores.structure
													)}.500`}>
													{analysis.scores.structure}%
												</Text>
												<Text fontSize='sm' color='gray.600'>
													Content Structure
												</Text>
												<Text fontSize='xs' color='gray.500' mt={1}>
													{analysis.wordCount} words
												</Text>
											</CardBody>
										</Card>

										<Card textAlign='center'>
											<CardBody>
												<Text
													fontSize='2xl'
													fontWeight='bold'
													color={`${getScoreColor(
														analysis.scores.platformFit
													)}.500`}>
													{analysis.scores.platformFit}%
												</Text>
												<Text fontSize='sm' color='gray.600'>
													Platform Fit
												</Text>
												<Text fontSize='xs' color='gray.500' mt={1}>
													{platforms.find((p) => p.value === platform)?.label}
												</Text>
											</CardBody>
										</Card>

										<Card textAlign='center'>
											<CardBody>
												<Text
													fontSize='2xl'
													fontWeight='bold'
													color={`${getScoreColor(
														analysis.scores.engagement
													)}.500`}>
													{analysis.scores.engagement}%
												</Text>
												<Text fontSize='sm' color='gray.600'>
													Engagement Potential
												</Text>
												<Text fontSize='xs' color='gray.500' mt={1}>
													Interaction triggers
												</Text>
											</CardBody>
										</Card>
									</SimpleGrid>

									{/* Issues and Strengths */}
									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
										{/* Issues */}
										<Card>
											<CardHeader>
												<Heading size='md' color='red.500'>
													⚠️ Issues to Address
												</Heading>
											</CardHeader>
											<CardBody>
												{analysis.issues.length === 0 ? (
													<Text color='green.600' fontSize='sm'>
														✅ No major issues detected!
													</Text>
												) : (
													<VStack align='stretch' spacing={3}>
														{analysis.issues.map((issue, index) => (
															<Box
																key={index}
																p={3}
																bg='red.50'
																borderRadius='md'
																borderLeft='4px'
																borderColor={`${getSeverityColor(
																	issue.severity
																)}.400`}>
																<HStack align='start'>
																	<Badge
																		colorScheme={getSeverityColor(
																			issue.severity
																		)}
																		size='sm'>
																		{issue.severity}
																	</Badge>
																	<VStack align='start' spacing={1} flex={1}>
																		<Text fontSize='sm' fontWeight='bold'>
																			{issue.message}
																		</Text>
																		<Text fontSize='xs' color='gray.600'>
																			{issue.fix}
																		</Text>
																	</VStack>
																</HStack>
															</Box>
														))}
													</VStack>
												)}
											</CardBody>
										</Card>

										{/* Strengths */}
										<Card>
											<CardHeader>
												<Heading size='md' color='green.500'>
													✅ Content Strengths
												</Heading>
											</CardHeader>
											<CardBody>
												{analysis.strengths.length === 0 ? (
													<Text color='gray.600' fontSize='sm'>
														Consider adding engagement elements
													</Text>
												) : (
													<List spacing={2}>
														{analysis.strengths.map((strength, index) => (
															<ListItem key={index} fontSize='sm'>
																<ListIcon as={CheckCircle} color='green.500' />
																{strength}
															</ListItem>
														))}
													</List>
												)}
											</CardBody>
										</Card>
									</SimpleGrid>
								</VStack>
							</TabPanel>

							{/* Suggestions Tab */}
							<TabPanel>
								<VStack spacing={4} align='stretch'>
									<Box>
										<Heading size='md' mb={2}>
											🤖 AI-Generated Improvements
										</Heading>
										<Text fontSize='sm' color='gray.600'>
											Multiple optimized versions based on your goals and
											platform
										</Text>
									</Box>

									{suggestions.map((suggestion, index) => (
										<Card
											key={index}
											borderWidth='2px'
											borderColor={borderColor}>
											<CardHeader>
												<Flex align='center'>
													<VStack align='start' spacing={1} flex={1}>
														<HStack>
															<Heading size='md'>{suggestion.title}</Heading>
															<Badge
																colorScheme={getScoreColor(suggestion.score)}>
																{suggestion.score}% Score
															</Badge>
														</HStack>
														<HStack spacing={2}>
															{suggestion.improvements.map((improvement, i) => (
																<Badge key={i} variant='outline' size='sm'>
																	{improvement}
																</Badge>
															))}
														</HStack>
													</VStack>
													<Tooltip label='Copy to clipboard'>
														<IconButton
															icon={<Copy />}
															size='sm'
															onClick={() =>
																copyToClipboard(suggestion.content)
															}
														/>
													</Tooltip>
												</Flex>
											</CardHeader>
											<CardBody>
												<Box
													p={4}
													bg='gray.50'
													borderRadius='md'
													border='1px'
													borderColor='gray.200'
													fontSize='sm'
													whiteSpace='pre-wrap'>
													{suggestion.content}
												</Box>
												<HStack mt={3} spacing={2}>
													<Text fontSize='xs' color='gray.500'>
														{suggestion.content.length} characters
													</Text>
													{suggestion.content.length <=
														platforms.find((p) => p.value === platform)
															?.maxLength && (
														<Badge colorScheme='green' size='sm'>
															✓ Fits platform
														</Badge>
													)}
												</HStack>
											</CardBody>
										</Card>
									))}
								</VStack>
							</TabPanel>

							{/* Tips Tab */}
							<TabPanel>
								<VStack spacing={6} align='stretch'>
									<Heading size='md'>💡 Advanced Optimization Tips</Heading>

									<Accordion allowMultiple>
										<AccordionItem>
											<h2>
												<AccordionButton>
													<Box flex='1' textAlign='left' fontWeight='bold'>
														🎯 Engagement Optimization
													</Box>
													<AccordionIcon />
												</AccordionButton>
											</h2>
											<AccordionPanel pb={4}>
												<VStack align='stretch' spacing={2}>
													<Text fontSize='sm'>
														• Ask questions to encourage comments
													</Text>
													<Text fontSize='sm'>
														• Use emotional triggers (excitement, curiosity,
														urgency)
													</Text>
													<Text fontSize='sm'>
														• Include clear call-to-actions
													</Text>
													<Text fontSize='sm'>
														• Add controversy or bold statements (when
														appropriate)
													</Text>
													<Text fontSize='sm'>• Use storytelling elements</Text>
												</VStack>
											</AccordionPanel>
										</AccordionItem>

										<AccordionItem>
											<h2>
												<AccordionButton>
													<Box flex='1' textAlign='left' fontWeight='bold'>
														📱 Platform-Specific Tips
													</Box>
													<AccordionIcon />
												</AccordionButton>
											</h2>
											<AccordionPanel pb={4}>
												<VStack align='stretch' spacing={2}>
													<Text fontSize='sm'>
														<strong>Twitter/X:</strong> Keep it concise, use
														threads for longer content
													</Text>
													<Text fontSize='sm'>
														<strong>Instagram:</strong> Use line breaks, emojis,
														and storytelling
													</Text>
													<Text fontSize='sm'>
														<strong>LinkedIn:</strong> Professional tone,
														industry insights, longer format
													</Text>
													<Text fontSize='sm'>
														<strong>TikTok:</strong> Trendy language, hooks in
														first 3 seconds
													</Text>
													<Text fontSize='sm'>
														<strong>YouTube:</strong> Descriptive, keyword-rich,
														detailed
													</Text>
												</VStack>
											</AccordionPanel>
										</AccordionItem>

										<AccordionItem>
											<h2>
												<AccordionButton>
													<Box flex='1' textAlign='left' fontWeight='bold'>
														🔥 Viral Content Elements
													</Box>
													<AccordionIcon />
												</AccordionButton>
											</h2>
											<AccordionPanel pb={4}>
												<VStack align='stretch' spacing={2}>
													<Text fontSize='sm'>
														• Timing: Post during peak hours for your audience
													</Text>
													<Text fontSize='sm'>
														• Trending topics: Reference current events or
														trends
													</Text>
													<Text fontSize='sm'>
														• Visual elements: Use emojis, formatting, or
														imagery
													</Text>
													<Text fontSize='sm'>
														• Personal stories: Share authentic experiences
													</Text>
													<Text fontSize='sm'>
														• Value proposition: Provide clear benefit to reader
													</Text>
												</VStack>
											</AccordionPanel>
										</AccordionItem>

										<AccordionItem>
											<h2>
												<AccordionButton>
													<Box flex='1' textAlign='left' fontWeight='bold'>
														📊 A/B Testing Ideas
													</Box>
													<AccordionIcon />
												</AccordionButton>
											</h2>
											<AccordionPanel pb={4}>
												<VStack align='stretch' spacing={2}>
													<Text fontSize='sm'>
														• Test different opening hooks
													</Text>
													<Text fontSize='sm'>
														• Try various call-to-actions
													</Text>
													<Text fontSize='sm'>
														• Experiment with emoji placement
													</Text>
													<Text fontSize='sm'>
														• Compare formal vs casual tone
													</Text>
													<Text fontSize='sm'>
														• Test posting times and days
													</Text>
												</VStack>
											</AccordionPanel>
										</AccordionItem>
									</Accordion>
								</VStack>
							</TabPanel>
						</TabPanels>
					</Tabs>
				)}
			</VStack>
		</Box>
	);
};

export default ContentOptimizer;
