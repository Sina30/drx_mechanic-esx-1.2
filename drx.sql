CREATE TABLE IF NOT EXISTS `drx_mechanic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mechanic_id` varchar(255) DEFAULT NULL,
  `customer_id` varchar(255) DEFAULT NULL,
  `mechanic_name` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `plate` varchar(255) DEFAULT NULL,
  `upgrades` longtext DEFAULT NULL,
  `bill` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;