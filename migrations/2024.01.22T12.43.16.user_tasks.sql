CREATE TABLE user_tasks
(
    user_id     BIGINT REFERENCES users (id),
    task_id   BIGSERIAL REFERENCES tasks (id),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    is_forked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATE DEFAULT NOW(),
    updated_at DATE DEFAULT NOW()

);
