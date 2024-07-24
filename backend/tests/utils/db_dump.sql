-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: inzynierka
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `login` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `photoURL` varchar(100) DEFAULT NULL,
  `last_active` varchar(30) NOT NULL,
  `salt` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('3daf7676-ec0f-4548-85a7-67b4382166d4','login2','37b4a40ef177c39863a3fa75de835f4ab276c18f00ba4e909e54b039215143d0','Kylian','Mekambe','65ee3504-123f-4ccb-b6c9-97f8e302b40d.webp','2024-07-22T11:58:27.397Z','$2a$10$MeDYRqv3QH3jcggJCtiRoe'),('6ea69076-1ad8-4eb0-9bcf-695242f8a723','login1','c29a3756b95ba1bdb851220a5b75aa7d61331e9fae14732fa615c11b424bef84','John','Doe',NULL,'2024-07-20T13:11:42.225Z','$2a$10$GOmhle7RkvT7ZEZhGwHjru'),('c0f7aa4e-ab9c-4eac-80cd-cbf8d36de4cb','login3','6fdbb1fad4dc170d4fa87ac9513f3f221ef57fb48b2e2b5e870503f9dd847d36','Joe','Trump','78ab5b25-bcf5-488c-89f7-5268e22b1f91.webp','2024-07-20T21:18:56.281Z','$2a$10$VGX9kIUl/jeDhLJc7sQh4u'),('cc934726-2269-4d12-b590-97dbcfae9922','login4','38c98ce1d6ffda2ad31feb4a9aa50ffc57ea3ba62c797e08ac81072227d45030','Lamine','Mambeppe','f15bf195-091b-4828-8ee9-5a613d66d35a.webp','2024-07-20T13:10:56.027Z','$2a$10$.MO3nRiGfBFM3nRYokX4K.');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-22 14:03:10
