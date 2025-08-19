/*
  # Content Command Center Seed Data
  
  Populates the content management system with:
  - 30+ content pieces across different platforms and statuses
  - Content tags for categorization
  - 20+ content ideas with varying priorities
  - Realistic dates and thumbnails for demo purposes
*/

-- Insert content tags
INSERT INTO content_tags (name) VALUES
  ('Fashion'),
  ('Streetwear'),
  ('Luxury'),
  ('Minimalism'),
  ('Avant-garde'),
  ('Sustainability'),
  ('Behind-the-scenes'),
  ('Product Launch'),
  ('Styling Tips'),
  ('Brand Story'),
  ('Collaboration'),
  ('Seasonal'),
  ('Editorial'),
  ('Campaign'),
  ('Community')
ON CONFLICT (name) DO NOTHING;

-- Insert content pieces with varied statuses and dates
INSERT INTO content_pieces (title, slug, platform, status, planned_at, published_at, thumbnail_url, brief, cta) VALUES
  -- Published content (past dates)
  ('Obsidian Dreams: AW24 Campaign', 'obsidian-dreams-aw24', 'YouTube', 'Published', '2024-01-15 10:00:00+00', '2024-01-15 10:00:00+00', 'https://picsum.photos/1200/675?random=1', 'Cinematic reveal of our darkest collection yet. Moody visuals meet avant-garde silhouettes.', 'Shop the Collection'),
  ('Midnight Rebellion Styling Guide', 'midnight-rebellion-styling', 'Instagram', 'Published', '2024-01-20 14:30:00+00', '2024-01-20 14:30:00+00', 'https://picsum.photos/800/600?random=2', '5 ways to style our signature leather pieces for maximum impact.', 'Get the Look'),
  ('The Art of Controlled Chaos', 'art-controlled-chaos', 'Blog', 'Published', '2024-01-25 09:00:00+00', '2024-01-25 09:00:00+00', 'https://picsum.photos/1200/675?random=3', 'Deep dive into our design philosophy and the beauty of imperfection.', 'Read More'),
  ('Neon Nights: Behind the Shoot', 'neon-nights-behind-shoot', 'LinkedIn', 'Published', '2024-02-01 11:00:00+00', '2024-02-01 11:00:00+00', 'https://picsum.photos/800/600?random=4', 'Exclusive behind-the-scenes from our electric campaign shoot.', 'View Gallery'),
  ('Electric Pulse Collection Drop', 'electric-pulse-drop', 'Email', 'Published', '2024-02-05 08:00:00+00', '2024-02-05 08:00:00+00', 'https://picsum.photos/1200/675?random=5', 'First access to our most anticipated pieces of the season.', 'Shop Now'),
  
  -- Scheduled content (future dates)
  ('Vanity Fair: Editorial Spread', 'vanity-fair-editorial', 'Instagram', 'Scheduled', '2024-03-15 16:00:00+00', NULL, 'https://picsum.photos/800/600?random=6', 'Exclusive editorial featuring our avant-garde pieces in Vanity Fair.', 'See Editorial'),
  ('Sustainable Luxury Manifesto', 'sustainable-luxury-manifesto', 'Blog', 'Scheduled', '2024-03-20 10:00:00+00', NULL, 'https://picsum.photos/1200/675?random=7', 'Our commitment to ethical fashion without compromising on edge.', 'Learn More'),
  ('Spring Awakening Campaign', 'spring-awakening-campaign', 'YouTube', 'Scheduled', '2024-03-25 12:00:00+00', NULL, 'https://picsum.photos/1200/675?random=8', 'Rebirth and renewal through radical fashion choices.', 'Watch Now'),
  ('Influencer Collaboration Reveal', 'influencer-collab-reveal', 'Instagram', 'Scheduled', '2024-03-30 15:00:00+00', NULL, 'https://picsum.photos/800/600?random=9', 'Major collaboration announcement with underground fashion icon.', 'Follow Journey'),
  ('VIP Early Access Newsletter', 'vip-early-access', 'Email', 'Scheduled', '2024-04-01 07:00:00+00', NULL, 'https://picsum.photos/1200/675?random=10', 'Exclusive preview of SS24 collection for our inner circle.', 'Get Access'),
  
  -- Review status
  ('Deconstructed Elegance Tutorial', 'deconstructed-elegance-tutorial', 'YouTube', 'Review', NULL, NULL, 'https://picsum.photos/1200/675?random=11', 'Step-by-step guide to achieving our signature deconstructed look.', 'Try the Look'),
  ('Street Style Spotlight', 'street-style-spotlight', 'Instagram', 'Review', NULL, NULL, 'https://picsum.photos/800/600?random=12', 'Featuring our community wearing MANIC VANITY in the wild.', 'Tag Us'),
  ('The Philosophy of Anti-Fashion', 'philosophy-anti-fashion', 'Blog', 'Review', NULL, NULL, 'https://picsum.photos/1200/675?random=13', 'Exploring the contradiction between fashion and anti-fashion.', 'Read Essay'),
  ('Industry Insider Interview', 'industry-insider-interview', 'LinkedIn', 'Review', NULL, NULL, 'https://picsum.photos/800/600?random=14', 'Candid conversation about disrupting traditional fashion norms.', 'Watch Interview'),
  
  -- Draft status
  ('Monochrome Madness Lookbook', 'monochrome-madness-lookbook', 'Instagram', 'Draft', NULL, NULL, 'https://picsum.photos/800/600?random=15', 'Black, white, and every shade of rebellion in between.', 'Explore Looks'),
  ('Fabric Innovation Deep Dive', 'fabric-innovation-deep-dive', 'Blog', 'Draft', NULL, NULL, 'https://picsum.photos/1200/675?random=16', 'The cutting-edge materials shaping our next collection.', 'Discover More'),
  ('Customer Spotlight Series', 'customer-spotlight-series', 'YouTube', 'Draft', NULL, NULL, 'https://picsum.photos/1200/675?random=17', 'Real stories from our most devoted fashion rebels.', 'Share Story'),
  ('Seasonal Transition Guide', 'seasonal-transition-guide', 'Email', 'Draft', NULL, NULL, 'https://picsum.photos/1200/675?random=18', 'How to evolve your wardrobe as seasons change.', 'Get Guide'),
  
  -- Backlog status
  ('Underground Fashion Week Recap', 'underground-fashion-week', 'LinkedIn', 'Backlog', NULL, NULL, 'https://picsum.photos/800/600?random=19', 'Highlights from alternative fashion week events worldwide.', 'View Recap'),
  ('DIY Customization Workshop', 'diy-customization-workshop', 'YouTube', 'Backlog', NULL, NULL, 'https://picsum.photos/1200/675?random=20', 'Transform basic pieces into statement garments.', 'Start Creating'),
  ('Minimalist Maximalism Trend', 'minimalist-maximalism-trend', 'Blog', 'Backlog', NULL, NULL, 'https://picsum.photos/1200/675?random=21', 'The paradox of doing more with less in fashion.', 'Explore Trend'),
  ('Flash Sale Announcement', 'flash-sale-announcement', 'Email', 'Backlog', NULL, NULL, 'https://picsum.photos/1200/675?random=22', '48-hour exclusive access to select archive pieces.', 'Shop Sale'),
  ('Texture Play Editorial', 'texture-play-editorial', 'Instagram', 'Backlog', NULL, NULL, 'https://picsum.photos/800/600?random=23', 'Exploring tactile contrasts in our latest designs.', 'Feel the Difference'),
  ('Brand Evolution Timeline', 'brand-evolution-timeline', 'LinkedIn', 'Backlog', NULL, NULL, 'https://picsum.photos/800/600?random=24', 'Journey from underground label to fashion disruptor.', 'See Timeline'),
  ('Styling Challenge Series', 'styling-challenge-series', 'Instagram', 'Backlog', NULL, NULL, 'https://picsum.photos/800/600?random=25', 'Weekly challenges to push creative boundaries.', 'Join Challenge'),
  ('Sustainable Materials Guide', 'sustainable-materials-guide', 'Blog', 'Backlog', NULL, NULL, 'https://picsum.photos/1200/675?random=26', 'Understanding eco-friendly fabrics without compromise.', 'Learn More'),
  ('Founder Interview Podcast', 'founder-interview-podcast', 'YouTube', 'Backlog', NULL, NULL, 'https://picsum.photos/1200/675?random=27', 'Raw conversation about building an anti-establishment brand.', 'Listen Now'),
  ('Holiday Gift Guide', 'holiday-gift-guide', 'Email', 'Backlog', NULL, NULL, 'https://picsum.photos/1200/675?random=28', 'Curated selection for the fashion-forward gift giver.', 'Shop Gifts'),
  ('Color Psychology in Fashion', 'color-psychology-fashion', 'Blog', 'Backlog', NULL, NULL, 'https://picsum.photos/1200/675?random=29', 'How our dark palette influences mood and perception.', 'Explore Psychology'),
  ('Community Spotlight Reel', 'community-spotlight-reel', 'Instagram', 'Backlog', NULL, NULL, 'https://picsum.photos/800/600?random=30', 'Celebrating our global community of fashion rebels.', 'Join Community')
ON CONFLICT (slug) DO NOTHING;

-- Insert content ideas
INSERT INTO content_ideas (title, notes, priority) VALUES
  ('Shadows and Light Photography Series', 'Dramatic black and white photography showcasing texture contrasts in our pieces. Focus on architectural backgrounds.', 3),
  ('Anti-Trend Trend Report', 'Quarterly report on why following trends is the ultimate anti-trend. Position MANIC VANITY as trend-resistant.', 2),
  ('Deconstructed Garment Time-lapse', 'Show the creation process of a deconstructed jacket from concept to completion. Behind-the-scenes manufacturing.', 3),
  ('Fashion Rebellion Manifesto', 'Written piece about rejecting fast fashion and embracing individual style. Could be multi-part series.', 2),
  ('Midnight Market Pop-up', 'Document a guerrilla-style pop-up shop in an unconventional location. Urban exploration meets retail.', 3),
  ('Texture Library Showcase', 'ASMR-style video featuring different fabric textures and materials. Sensory marketing approach.', 1),
  ('Customer Transformation Stories', 'Before/after styling sessions showing how MANIC VANITY pieces transform personal style.', 2),
  ('Underground Fashion History', 'Educational series on punk, goth, and alternative fashion movements that inspire our aesthetic.', 2),
  ('Sustainable Luxury Paradox', 'Deep dive into how luxury and sustainability can coexist in modern fashion.', 2),
  ('Street Casting Documentary', 'Follow the process of finding models who embody the MANIC VANITY spirit in urban environments.', 3),
  ('Monochrome Challenge', 'Social media challenge encouraging followers to create all-black or all-white outfits.', 1),
  ('Fashion Week Outsider Perspective', 'Commentary on mainstream fashion week from an alternative brand viewpoint.', 2),
  ('Wardrobe Detox Guide', 'Help customers identify and eliminate pieces that don''t align with their authentic style.', 1),
  ('Collaborative Design Process', 'Show how customer feedback influences new designs. Community-driven creation.', 2),
  ('Night Photography Editorial', 'Fashion shoot in urban nighttime settings. Neon lights, empty streets, dramatic shadows.', 3),
  ('Fabric Sourcing Journey', 'Document the process of finding ethical, unique materials for upcoming collections.', 2),
  ('Style Psychology Workshop', 'Interactive content about how clothing choices reflect and influence personality.', 1),
  ('Vintage Meets Modern Mashup', 'Styling vintage pieces with MANIC VANITY items to create unique hybrid looks.', 2),
  ('Fashion Activism Discussion', 'Panel discussion on how fashion can be a form of social and political expression.', 2),
  ('Minimalist Wardrobe Capsule', 'Curate a 10-piece wardrobe that maximizes style impact with minimal items.', 1)
ON CONFLICT DO NOTHING;

-- Link some content pieces with tags
DO $$
DECLARE
    fashion_tag_id uuid;
    streetwear_tag_id uuid;
    luxury_tag_id uuid;
    campaign_tag_id uuid;
    editorial_tag_id uuid;
BEGIN
    -- Get tag IDs
    SELECT id INTO fashion_tag_id FROM content_tags WHERE name = 'Fashion';
    SELECT id INTO streetwear_tag_id FROM content_tags WHERE name = 'Streetwear';
    SELECT id INTO luxury_tag_id FROM content_tags WHERE name = 'Luxury';
    SELECT id INTO campaign_tag_id FROM content_tags WHERE name = 'Campaign';
    SELECT id INTO editorial_tag_id FROM content_tags WHERE name = 'Editorial';
    
    -- Tag some content pieces
    INSERT INTO content_piece_tags (piece_id, tag_id)
    SELECT cp.id, fashion_tag_id
    FROM content_pieces cp
    WHERE cp.slug IN ('obsidian-dreams-aw24', 'midnight-rebellion-styling', 'art-controlled-chaos')
    ON CONFLICT DO NOTHING;
    
    INSERT INTO content_piece_tags (piece_id, tag_id)
    SELECT cp.id, campaign_tag_id
    FROM content_pieces cp
    WHERE cp.slug IN ('obsidian-dreams-aw24', 'spring-awakening-campaign', 'electric-pulse-drop')
    ON CONFLICT DO NOTHING;
    
    INSERT INTO content_piece_tags (piece_id, tag_id)
    SELECT cp.id, editorial_tag_id
    FROM content_pieces cp
    WHERE cp.slug IN ('vanity-fair-editorial', 'texture-play-editorial')
    ON CONFLICT DO NOTHING;
END $$;