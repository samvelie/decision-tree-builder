CREATE TABLE users (
  	id SERIAL PRIMARY KEY,
  	email VARCHAR(200) UNIQUE NOT NULL
);

CREATE TABLE trees (
	id	SERIAL PRIMARY KEY,
	tree_name VARCHAR(25) NOT NULL,
	creator_id INTEGER REFERENCES users,
	public BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE nodes (
	id SERIAL PRIMARY KEY,
	"content" TEXT,
	tree_end BOOLEAN DEFAULT false,
	tree_id INTEGER REFERENCES trees
);

CREATE TABLE options (
	id SERIAL PRIMARY KEY,
	response_text VARCHAR(40),
	from_node_id INTEGER REFERENCES nodes,
	to_node_id INTEGER REFERENCES nodes
);
