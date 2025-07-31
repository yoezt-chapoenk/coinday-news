-- Create the news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_title TEXT NOT NULL,
  rewritten_title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  published_date TIMESTAMP WITH TIME ZONE NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  categories TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the approved column for faster queries
CREATE INDEX IF NOT EXISTS idx_news_articles_approved ON news_articles(approved);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at ON news_articles(created_at);

-- Create an index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_news_articles_updated_at ON news_articles(updated_at);

-- Add categories column if it doesn't exist (for existing tables)
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';

-- Create an index on categories for faster filtering
CREATE INDEX IF NOT EXISTS idx_news_articles_categories ON news_articles USING GIN(categories);

-- Enable Row Level Security (RLS)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to read all articles
CREATE POLICY "Allow authenticated users to read articles" ON news_articles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a policy that allows authenticated users to update articles
CREATE POLICY "Allow authenticated users to update articles" ON news_articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a policy that allows authenticated users to delete articles
CREATE POLICY "Allow authenticated users to delete articles" ON news_articles
  FOR DELETE
  TO authenticated
  USING (true);

-- Create a policy that allows authenticated users to insert articles
CREATE POLICY "Allow authenticated users to insert articles" ON news_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert some sample data for testing
INSERT INTO news_articles (
  original_title,
  rewritten_title,
  summary,
  content,
  source,
  published_date,
  approved
) VALUES 
(
  'Bitcoin Reaches New All-Time High',
  'Bitcoin Soars to Record-Breaking Heights',
  'Bitcoin has reached a new all-time high, surpassing previous records and showing strong market momentum.',
  'Bitcoin, the world''s largest cryptocurrency by market capitalization, has reached a new all-time high today, breaking through previous resistance levels and demonstrating remarkable resilience in the current market environment. The surge comes amid increased institutional adoption and growing mainstream acceptance of digital assets.',
  'CryptoNews',
  '2024-01-15 10:30:00+00',
  false
),
(
  'Ethereum 2.0 Staking Rewards Increase',
  'Ethereum Staking Yields Rise Significantly',
  'Ethereum 2.0 staking rewards have increased, providing better returns for validators and stakers.',
  'The Ethereum network has seen a significant increase in staking rewards following recent network upgrades. Validators are now earning higher yields, making staking more attractive for long-term holders. This development is expected to further strengthen the network''s security and decentralization.',
  'EthereumDaily',
  '2024-01-14 14:20:00+00',
  false
),
(
  'DeFi Protocol Launches New Features',
  'Revolutionary DeFi Platform Unveils Game-Changing Features',
  'A major DeFi protocol has launched innovative new features that could reshape the decentralized finance landscape.',
  'A leading decentralized finance (DeFi) protocol has announced the launch of groundbreaking new features that promise to revolutionize how users interact with decentralized financial services. The new features include advanced yield farming strategies, cross-chain compatibility, and enhanced security measures.',
  'DeFiTimes',
  '2024-01-13 09:15:00+00',
  true
),
(
  'NFT Market Shows Signs of Recovery',
  'NFT Market Rebounds with Strong Trading Volume',
  'The NFT market is showing positive signs of recovery with increased trading volume and renewed interest.',
  'After months of declining activity, the non-fungible token (NFT) market is showing clear signs of recovery. Trading volumes have increased significantly over the past week, with several high-profile collections seeing renewed interest from collectors and investors.',
  'NFTInsider',
  '2024-01-12 16:45:00+00',
  true
);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_news_articles_updated_at
  BEFORE UPDATE ON news_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();