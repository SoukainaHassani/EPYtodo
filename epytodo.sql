CREATE DATABASE IF NOT EXISTS epytodo;

USE epytodo;

DROP TABLE IF EXISTS `todo`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `todo`
(
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `due_time` datetime NOT NULL,
  `status` enum('not started','todo','in progress','done') NOT NULL DEFAULT 'not started',
  `user_id` int unsigned NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);