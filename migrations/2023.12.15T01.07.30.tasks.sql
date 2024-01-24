CREATE TYPE task_type AS ENUM ('THEORY', 'MATH');
CREATE TABLE tasks
(
    id         BIGSERIAL    NOT NULL PRIMARY KEY,
    uuid        UUID         NOT NULL UNIQUE,
    title     VARCHAR(255) NOT NULL,
    type       task_type    NOT NULL,
    is_public BOOLEAN      NOT NULL,
    content    TEXT NOT NULL,
    status     BOOLEAN      NOT NULL,
    created_at DATE DEFAULT NOW(),
    updated_at DATE DEFAULT NOW()
    

);
