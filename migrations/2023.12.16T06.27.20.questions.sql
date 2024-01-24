CREATE TABLE questions
(
    id         BIGSERIAL     NOT NULL PRIMARY KEY,
    quiz_id    BIGSERIAL REFERENCES quizs (id) ON DELETE CASCADE,
    uuid        UUID         NOT NULL UNIQUE,
    question    TEXT          NOT NULL,
    options     JSONB         NOT NULL,
    correct_answer     INT          NOT NULL,
    created_at DATE DEFAULT NOW(),
    updated_at DATE DEFAULT NOW()
);