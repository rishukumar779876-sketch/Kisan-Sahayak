# Kisan Sahayak Database Schema

## Table Structure
Detailed project database schema with field names, data types, descriptions, constraints.

### 1. USER (Farmer Profile)
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | INT | Unique user ID | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(100) | Farmer name | NOT NULL |
| phone | VARCHAR(15) | Mobile number | UNIQUE, NOT NULL |
| location | VARCHAR(200) | Village/District (e.g., "Mithapur, Bihar") | NOT NULL |
| language | ENUM('hi', 'en') | Preferred language | DEFAULT 'en' |
| created_at | TIMESTAMP | Registration timestamp | DEFAULT CURRENT_TIMESTAMP |

### 2. CROP (Farmer Fields/Crops)
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | INT | Crop record ID | PRIMARY KEY |
| user_id | INT | Owner | FOREIGN KEY (USER.id), NOT NULL |
| name | VARCHAR(50) | Crop type (e.g., "गेहूं/Wheat") | NOT NULL |
| sowing_date | DATE | Sowing date | NOT NULL |
| area_acres | DECIMAL(5,2) | Field area in acres | NOT NULL, >=0 |
| growth_stage | VARCHAR(50) | Current stage (germination, flowering) | DEFAULT 'initial' |
| progress_pct | INT | Growth % (0-100) | DEFAULT 0, CHECK (0 <= progress_pct <= 100) |
| advice | TEXT | AI advice | NULL |
| updated_at | TIMESTAMP | Last update | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

### 3. SCHEME (Government Schemes)
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | INT | Scheme ID | PRIMARY KEY |
| title | VARCHAR(200) | Scheme name | NOT NULL |
| description | TEXT | Details | NOT NULL |
| category | VARCHAR(50) | Type (irrigation, subsidy) | NOT NULL |
| amount | DECIMAL(10,2) | Benefit amount | DEFAULT 0 |
| eligibility_criteria | TEXT | Requirements | NOT NULL |
| tag | VARCHAR(50) | Quick tag (bihar, all-india) | NULL |
| active | BOOLEAN | Currently available | DEFAULT TRUE |

### 4. ALERT (Notifications)
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | INT | Alert ID | PRIMARY KEY |
| user_id | INT | Recipient | FOREIGN KEY (USER.id) |
| type | ENUM('weather', 'pest', 'market') | Category | NOT NULL |
| title | VARCHAR(200) | Short title | NOT NULL |
| message | TEXT | Full message | NOT NULL |
| is_read | BOOLEAN | Read status | DEFAULT FALSE |
| created_at | TIMESTAMP | Issued time | DEFAULT CURRENT_TIMESTAMP |

### 5. MARKET_PRICE (Mandi Rates)
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | INT | Price record ID | PRIMARY KEY |
| crop_name | VARCHAR(50) | Crop | NOT NULL |
| price_per_quintal | DECIMAL(8,2) | ₹/quintal | NOT NULL |
| change | VARCHAR(20) | Change (▲ +₹40) | NULL |
| location | VARCHAR(100) | Mandi (Patna Mandi) | NOT NULL |
| updated_at | DATE | Data date | NOT NULL |

## Relationships
- USER 1:N CROP
- USER 1:N ALERT  
- USER 1:N SCHEME (eligibility)
- CROP 1:N MARKET_PRICE (price tracking)

## Indexes
- INDEX on CROP.user_id
- INDEX on ALERT.user_id, type
- INDEX on MARKET_PRICE.crop_name, updated_at

## Sample Queries
```sql
-- Farmer crops
SELECT * FROM CROP WHERE user_id = 1 ORDER BY sowing_date DESC;

-- Eligible schemes  
SELECT * FROM SCHEME WHERE active = TRUE;

-- Latest wheat prices
SELECT * FROM MARKET_PRICE WHERE crop_name = 'गेहूं/Wheat' 
ORDER BY updated_at DESC LIMIT 5;
```

Export/Import: MySQL/PostgreSQL ready. Matches ER/DFD diagrams.
