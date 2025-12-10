-- docker/db/init.sql

CREATE DATABASE playschool;

\connect playschool;

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
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
