-- docker/db/init.sql
-- NOTE: POSTGRES_DB from docker-compose decides which DB is created.
-- This script must ONLY create tables inside that DB.

CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  parent_name        VARCHAR(255) NOT NULL,
  phone              VARCHAR(50)  NOT NULL,
  email              VARCHAR(255),
  child_name         VARCHAR(255),
  child_age          INTEGER,
  class_applied_for  VARCHAR(100),
  message            TEXT,
  source             VARCHAR(50)  NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  child_name          VARCHAR(255) NOT NULL,
  class_name          VARCHAR(100) NOT NULL,
  age                 NUMERIC(4,1),
  parent_name         VARCHAR(255),
  phone               VARCHAR(50) NOT NULL,
  address             TEXT,
  created_by_role     VARCHAR(50),
  created_by_username VARCHAR(255),
  created_at          TIMESTAMPTZ DEFAULT NOW()
);