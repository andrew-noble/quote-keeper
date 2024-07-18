--table creation

CREATE TABLE quotes (
	id SERIAL PRIMARY KEY NOT NULL,
	text varchar(350),
	already_sent BOOLEAN DEFAULT false
)

CREATE TABLE tags (
	id SERIAL PRIMARY KEY,
	tag_name varchar(25),
	description text
)

CREATE TABLE quote_tag_association (
	quote_id int,
	tag_id int,
	FOREIGN KEY (quote_id) REFERENCES quotes(id),
	FOREIGN KEY (tag_id) REFERENCES tags(id),
	PRIMARY KEY (quote_id, tag_id)
)

--get a list of quotes with a certain tag

SELECT text, tags.tag_name FROM quotes
INNER JOIN quote_tag_association on quotes.id = quote_tag_association.quote_id
INNER JOIN tags ON quote_tag_association.tag_id = tags.id
WHERE tags.tag_name = 'Funny';

--get a list of quotes that are tagged by two specified tags: 
--you basically just double up, creating a ton of records then cutting them down with the AND

SELECT q.text
FROM quotes q
JOIN quote_tag_association qa1 ON q.id = qa1.quote_id
JOIN quote_tag_association qa2 ON q.id = qa2.quote_id
JOIN tags t1 ON qa1.tag_id = t1.id
JOIN tags t2 ON qa2.tag_id = t2.id
WHERE t1.tag_name = 'Practical' 
  AND t2.tag_name = 'Funny';

--get two random quotes that have two tags

SELECT q.text
FROM quotes q
JOIN quote_tag_association qa1 ON q.id = qa1.quote_id
JOIN quote_tag_association qa2 ON q.id = qa2.quote_id
JOIN tags t1 ON qa1.tag_id = t1.id
JOIN tags t2 ON qa2.tag_id = t2.id
WHERE t1.tag_name = 'Practical' 
  AND t2.tag_name = 'Funny';
ORDER BY RANDOM() 
LIMIT 2;

--COOL ONE: Query for all quotes and also return a list of the tags they're associated with
--the json_agg() SQL function creates a list of records associated with each quote.
--the json_agg and GROUP BY clauses work together here. Worth recalling this

SELECT q.id, q.text, COALESCE(json_agg(t.tag_name), '[]') AS tags
FROM quotes q
JOIN quote_tag_association qt_a on (q.id = qt_a.quote_id)
JOIN tags t on (qt_a.tag_id = t.id)
GROUP BY q.id
ORDER BY q.id

--update a quote's text
UPDATE quotes
SET text = 'Well, color me surprised.'
WHERE id = 3

--get a id-specified quote's id, text, and list of associated tags.
SELECT q.id, q.text, COALESCE(json_agg(t.tag_name), '[]') AS tags
FROM quotes q
JOIN quote_tag_association qt_a on (q.id = qt_a.quote_id)
JOIN tags t on (qt_a.tag_id = t.id)
WHERE q.id = 3
GROUP BY q.id

--BEEFCAKE: this updates a quote's text, then returns its id, updated text, and tagList
WITH updated AS (
  UPDATE quotes
  SET text = 'test'
  WHERE id = 3
  RETURNING id, text
)
SELECT u.id, u.text, COALESCE(json_agg(t.tag_name), '[]') AS tags
FROM updated u
LEFT JOIN quote_tag_association qt_a ON u.id = qt_a.quote_id
LEFT JOIN tags t ON qt_a.tag_id = t.id
GROUP BY u.id, u.text;

-- This basically attaches specified tags to a specified quote via the assoc table. It
-- does this given the quote_id and the list of tags you want to attach to it
INSERT INTO quote_tag_association (quote_id, tag_id)
SELECT 1, tags.id
FROM tags
WHERE tags.tag_name = ANY(<passed list of tags>)

--Gets a specified quotes id, text, and tags
SELECT q.id, q.text, json_agg(t.tag_name) AS tags
FROM quotes q
LEFT JOIN quote_tag_association qt_a ON q.id = qt_a.quote_id
LEFT JOIN tags t ON qt_a.tag_id = t.id
WHERE q.id = 7
GROUP BY q.id

--delete a quote
--first: delete its tag associations:
DELETE FROM quote_tag_association WHERE quote_id = 3
--second, delete it
DELETE FROM quotes WHERE id = 3

