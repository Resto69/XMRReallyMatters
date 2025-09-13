-- Offers table
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(4) NOT NULL CHECK (type IN ('BUY', 'SELL')),
    amount NUMERIC(16,8) NOT NULL CHECK (amount > 0),
    price_usd NUMERIC(10,2) NOT NULL CHECK (price_usd > 0),
    min_limit NUMERIC(10,2),
    max_limit NUMERIC(10,2),
    payment_method TEXT[] NOT NULL,
    terms TEXT,
    status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'CLOSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trades table
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES offers(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    amount NUMERIC(16,8) NOT NULL CHECK (amount > 0),
    price_usd NUMERIC(10,2) NOT NULL CHECK (price_usd > 0),
    escrow_address TEXT,
    escrow_key TEXT,
    payment_method TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'INITIATED' 
        CHECK (status IN ('INITIATED', 'FUNDED', 'PAYMENT_SENT', 'PAYMENT_CONFIRMED', 'RELEASED', 'DISPUTED', 'CANCELLED', 'COMPLETED')),
    dispute_reason TEXT,
    dispute_winner UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages table for trade communication
CREATE TABLE trade_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feedback table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewed_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_offers_creator_id ON offers(creator_id);
CREATE INDEX idx_offers_type ON offers(type);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_trades_offer_id ON trades(offer_id);
CREATE INDEX idx_trades_buyer_id ON trades(buyer_id);
CREATE INDEX idx_trades_seller_id ON trades(seller_id);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trade_messages_trade_id ON trade_messages(trade_id);
CREATE INDEX idx_feedback_trade_id ON feedback(trade_id);
CREATE INDEX idx_feedback_reviewed_id ON feedback(reviewed_id);

-- Add triggers for updated_at
CREATE TRIGGER update_offers_updated_at
    BEFORE UPDATE ON offers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
    BEFORE UPDATE ON trades
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update user statistics after feedback
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_trades and success_rate
    WITH user_stats AS (
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE rating >= 4) as successful
        FROM feedback
        WHERE reviewed_id = NEW.reviewed_id
    )
    UPDATE users
    SET 
        total_trades = user_stats.total,
        success_rate = CASE 
            WHEN user_stats.total > 0 
            THEN (user_stats.successful::NUMERIC / user_stats.total::NUMERIC) * 100 
            ELSE 0 
        END
    FROM user_stats
    WHERE id = NEW.reviewed_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for feedback
CREATE TRIGGER update_user_stats_after_feedback
    AFTER INSERT ON feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();