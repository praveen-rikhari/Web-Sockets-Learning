CREATE DATABASE chat_db;

USE chat_db;

CREATE TABLE IF NOT EXISTS chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  message TEXT NULL
);

set SQL_SAFE_UPDATES = 0;
ALTER TABLE chat MODIFY COLUMN message TEXT NULL;

DROP TABLE chat;

select * from chat;