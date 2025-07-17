
CREATE TABLE IF NOT EXISTS tt_tasks (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    details TEXT,
    cid TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tt_tags (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tag_name VARCHAR(255) NOT NULL,
    tag_details TEXT,
    cid TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tt_tag_links (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    task_id INT REFERENCES tt_tasks(id) NOT NULL,
    tag_id INT REFERENCES tt_tags(id) NOT NULL,
    cid TEXT NOT NULL
);


-- added rank column and an index to tt_tags

ALTER TABLE tt_tags
ADD COLUMN rank INTEGER DEFAULT 0;

CREATE INDEX idx_tt_tags_cid_rank_id ON tt_tags (cid, rank DESC, id ASC);