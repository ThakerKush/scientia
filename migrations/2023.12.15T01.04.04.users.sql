CREATE TABLE IF NOT EXISTS users
(
    id         BIGSERIAL    NOT NULL PRIMARY KEY,
    uuid      UUID         NOT NULL UNIQUE,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(50)  NOT NULL UNIQUE,
    password   VARCHAR(200) NOT NULL,
    created_at DATE DEFAULT NOW(),
    updated_at DATE DEFAULT NOW()

);
