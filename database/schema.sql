

CREATE DATABASE IF NOT EXISTS hacker_sim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hacker_sim;

CREATE TABLE IF NOT EXISTS users (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(64)  NOT NULL UNIQUE,
  email      VARCHAR(255) NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  handle     VARCHAR(64)  NOT NULL DEFAULT 'Ghost',
  level      INT          NOT NULL DEFAULT 1,
  xp         INT          NOT NULL DEFAULT 0,
  rep        INT          NOT NULL DEFAULT 0,
  theme      VARCHAR(32)  NOT NULL DEFAULT 'green',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP    NULL
);

SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email'
);
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL UNIQUE AFTER username',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS settings (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id            INT UNSIGNED NOT NULL,
  sound_enabled      TINYINT(1)   NOT NULL DEFAULT 1,
  crt_effect         TINYINT(1)   NOT NULL DEFAULT 1,
  scanlines          TINYINT(1)   NOT NULL DEFAULT 1,
  animation_intensity VARCHAR(16) NOT NULL DEFAULT 'high',
  terminal_font_size INT          NOT NULL DEFAULT 14,
  theme_color        VARCHAR(32)  NOT NULL DEFAULT 'green',
  ambient_volume     TINYINT      NOT NULL DEFAULT 40,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS missions (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(128) NOT NULL UNIQUE,
  title       VARCHAR(255) NOT NULL,
  description TEXT         NOT NULL,
  difficulty  ENUM('EASY','MEDIUM','HARD','EXTREME') NOT NULL DEFAULT 'MEDIUM',
  category    VARCHAR(64)  NOT NULL DEFAULT 'infiltration',
  xp_reward   INT          NOT NULL DEFAULT 100,
  rep_reward  INT          NOT NULL DEFAULT 10,
  lore        TEXT,
  is_locked   TINYINT(1)   NOT NULL DEFAULT 0,
  unlock_level INT         NOT NULL DEFAULT 1,
  sort_order  INT          NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mission_stages (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  mission_id   INT UNSIGNED NOT NULL,
  stage_number INT          NOT NULL,
  title        VARCHAR(255) NOT NULL,
  objective    TEXT         NOT NULL,
  hint         TEXT,
  trigger_cmd  VARCHAR(128),
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_missions (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL,
  mission_id    INT UNSIGNED NOT NULL,
  status        ENUM('locked','available','in_progress','completed') NOT NULL DEFAULT 'locked',
  current_stage INT          NOT NULL DEFAULT 0,
  started_at    TIMESTAMP    NULL,
  completed_at  TIMESTAMP    NULL,
  UNIQUE KEY uq_user_mission (user_id, mission_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS terminal_logs (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  command    VARCHAR(512) NOT NULL,
  output     TEXT,
  session_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS filesystem_nodes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  path        VARCHAR(512) NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  type        ENUM('dir','file') NOT NULL DEFAULT 'file',
  content     LONGTEXT,
  permissions VARCHAR(16)  NOT NULL DEFAULT '-rw-r
  owner       VARCHAR(64)  NOT NULL DEFAULT 'root',
  size_bytes  INT          NOT NULL DEFAULT 0,
  is_hidden   TINYINT(1)   NOT NULL DEFAULT 0,
  is_locked   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  role       ENUM('user','ai') NOT NULL,
  message    TEXT         NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS darknet_listings (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  price_btc   DECIMAL(10,4) NOT NULL DEFAULT 0.0,
  vendor      VARCHAR(64),
  category    VARCHAR(64),
  is_active   TINYINT(1)   NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS crypto_wallets (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  currency   VARCHAR(16)  NOT NULL DEFAULT 'BTC',
  address    VARCHAR(128) NOT NULL,
  balance    DECIMAL(18,8) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_events (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED,
  event_type VARCHAR(64)  NOT NULL,
  message    TEXT,
  severity   ENUM('info','warning','critical') NOT NULL DEFAULT 'info',
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
