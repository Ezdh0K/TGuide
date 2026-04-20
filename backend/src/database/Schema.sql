CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    role DEFAULT 'user'
),

CREATE TABLE places (
    place_id SERIAL PRIMARY KEY,
    place_name VARCHAR(255) NOT NULL,
    place_address TEXT,
    place_image TEXT,
    business_email VARCHAR(255),
    business_phone VARCHAR(255),
    short_description TEXT,
    place_description TEXT,
    place_rating DECIMAL(2, 1),
    place_price INTEGER,
    place_category VARCHAR(100),
),

CREATE TABLE favorites (
    user_id INTEGER REFERENCES users(user_id) on DELETE CASCADE,
    place_id INTEGER REFERENCES places(place_id) on DELETE CASCADE,
    added_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, place_id)
),

CREATE TABLE confirmTokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) on DELETE CASCADE,
    new_email VARCHAR(100) UNIQUE NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
),

CREATE TABLE history (
    user_id INTEGER REFERENCES users(user_id) on DELETE CASCADE,
    place_id INTEGER REFERENCES places(place_id) on DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, place_id, viewed_at)
),