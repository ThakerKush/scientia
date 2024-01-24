CREATE TABLE attempts
(
    id            BIGSERIAL NOT NULL PRIMARY KEY,
    quiz_id       BIGSERIAL REFERENCES quizs (id),
    user_id       BIGSERIAL REFERENCES users (id),
    correct_questions TEXT[] NOT NULL,
    incorrect_questions TEXT[] NOT NULL,
    score         BIGINT    NOT NULL,
    compleated_at DATE,
    created_at    DATE DEFAULT NOW(),
    updated_at    DATE DEFAULT NOW()
);