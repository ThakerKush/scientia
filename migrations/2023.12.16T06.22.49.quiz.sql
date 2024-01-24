CREATE TABLE IF NOT EXISTS quizs
(
    id         BIGSERIAL    NOT NULL PRIMARY KEY,
    uuid        UUID         NOT NULL UNIQUE,
    task_id    BIGSERIAL REFERENCES tasks (id) ON DELETE CASCADE,
    created_at DATE DEFAULT NOW(),
    updated_at DATE DEFAULT NOW()


);