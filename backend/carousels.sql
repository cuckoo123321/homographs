-- MySQL dump 10.13  Distrib 8.2.0, for macos14.0 (x86_64)
--
-- Host: localhost    Database: homographs
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `admin_password` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `admin_full_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `admin_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `admin_permission_level` enum('Super','Basic') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `admin_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `admin_disabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_name_UNIQUE` (`admin_name`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (2,'0','$2b$10$bxWkrB/VuQvhhBdN4orl.OZxJjHc1YWlHMS.pn01FNumT0gWsMiZa','test1','0','Basic','2020-11-08 13:36:37','2022-01-09 21:29:20',0),(7,'1','$2b$10$ZzkZ8VsieWgv4MzUNw.F..XuvoSuv/JBf0i.GN9XoGLD9MCbojo7y','1','1','Super','2023-03-09 09:31:13','2023-04-09 09:31:13',0),(8,'3','$2b$10$2W1OVwy0CDzJJz4H0JtBxO7.c2ph.PB7TlN6nFE2Vcdjcf6RQe/BW','3','3','Super','2016-07-09 09:33:01','2016-11-09 09:33:01',0),(9,'4','$2b$10$aeUhMfqajw3NwFTUvGY/V.X/f3ZJhXUYatMIZEWxlOEbVMStD40/y','4','4','Super','2019-11-09 09:48:01','2020-11-09 09:48:01',1),(10,'5','$2b$10$/PSiqVNcAgYwYI5twjqNB.anIe/OEVyqOBDmV.ui//zT/MbFcIKpi','5','5','Super','2023-11-01 09:50:15','2023-11-09 09:50:15',0),(12,'6','$2b$10$1ES66uQcuKVBfOELAd.LmuN1HnFUhoh/mrxgGXbRmOjHlj71UrPEy','6','6','Super','2023-11-09 09:53:49','2023-11-09 09:53:49',0),(24,'7','$2b$10$Aasvr6CmR5to0sjqg.1yqu6T77PK5JBM1GuI1szvZWywk/BOBcV2e','7','7','Super','2023-10-31 10:28:06','2023-11-06 10:28:06',0),(28,'8','$2b$10$4cpQImsjnJBYPaUBqSis3OUQNF3mPyOYRXoYi/pbNu73eDn459Qdy','8','8@g','Basic','2023-11-10 11:48:26','2023-11-10 11:48:26',1),(29,'9','$2b$10$EtDuq12O81DZr2lNfoWb7.AGPC77ywO.HVAk28u9drAwvF78iZEF6','9','9@1','Basic','2023-11-10 18:09:21','2023-11-10 18:09:21',1),(30,'10','$2b$10$x7EsBTikrP6uZXrl8tfqUeGNW8dpNtTjWmkpJKHTamJOjmcMEw4Ly','10','10@1','Basic','2023-11-10 18:09:47','2023-11-10 18:09:47',1),(31,'11','$2b$10$UpAbWQLPefafxt3iDRJ7he0srh3YoaBzMRtAXlgDT1BYi7cQr.QRG','11','11@1','Basic','2023-11-10 18:10:00','2023-11-10 18:10:00',0),(32,'12','$2b$10$w8tfQAWDepyM5VNCcCwbS.8edDX1ec9S3hK/2JAjXAQ3Y6nQPPVk6','12','12@12','Super','2023-11-10 18:13:28','2023-11-10 18:13:28',0),(33,'13','$2b$10$om3xKL8jt0L2rGKCidCC4ept5YZHY.t0N.G9oq1z.rm9jUq2WQcae','13','13@13','Super','2023-11-10 18:13:43','2023-11-10 18:13:43',1),(34,'14','$2b$10$naUB3s0HQqUFN1BVAOqniu4KDNLC.CjofK/s5Yr.oXA0ej5i5LtXe','14','14@13','Super','2023-11-10 18:13:59','2023-11-10 18:13:59',0),(35,'15','$2b$10$TVrVPEXo1YzU4icya2S3l.omh9Hjew//S2/M3F510nraPOoDSpst6','15','15@15','Super','2023-11-10 18:14:29','2023-11-10 18:14:29',0),(36,'16','$2b$10$6CnY.OCdR6.IiMOA3LXD3eYKQJnNL//tDCLYTemAkH48oBMX/wkKK','16','16@16','Super','2023-11-10 18:14:51','2023-11-10 18:14:51',0),(37,'17','$2b$10$W.DFyO0.oJyE6mb.uuTs1eZNaov0g1GB6irFtqhfpP6XiycM8tvn2','17','17@17','Basic','2023-11-10 18:15:46','2023-11-15 18:08:57',0);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carousels`
--

DROP TABLE IF EXISTS `carousels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carousels` (
  `carousel_id` int NOT NULL AUTO_INCREMENT,
  `carousel_title` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `carousel_path` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `carousel_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `carousel_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `carousel_publish` enum('publish','unpublish') COLLATE utf8mb4_unicode_ci DEFAULT 'publish',
  PRIMARY KEY (`carousel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carousels`
--

LOCK TABLES `carousels` WRITE;
/*!40000 ALTER TABLE `carousels` DISABLE KEYS */;
INSERT INTO `carousels` VALUES (2,'同形詞第一冊2','1700011482485-1687315712135@2x.jpg','2023-11-15 09:24:42','2023-11-15 09:24:42','publish'),(7,'4','1701134039460-2020.6.8_200623_0001.jpg','2023-11-15 11:12:28','2023-11-28 09:13:59','publish'),(8,'5','1701185808065-2020.6.8_200623_0007.jpg','2023-11-15 11:18:33','2023-12-21 14:57:18','publish'),(12,'7','1701185826703-2020.6.8_200623_0010.jpg','2023-11-15 13:55:32','2023-11-28 23:37:07','publish'),(16,'test','1701134078201-2020.6.8_200623_0005.jpg','2023-11-15 14:11:54','2023-11-28 09:14:38','unpublish'),(17,'10:43','1701185854213-2020.6.8_200623_0003.jpg','2023-11-15 14:16:25','2023-11-28 23:37:34','publish');
/*!40000 ALTER TABLE `carousels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `cart_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `product_id_UNIQUE` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `event_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_organizer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_description` text COLLATE utf8mb4_unicode_ci,
  `event_website` text COLLATE utf8mb4_unicode_ci,
  `event_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `event_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `event_publish` enum('publish','unpublish') COLLATE utf8mb4_unicode_ci DEFAULT 'publish',
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (2,'第22屆台灣華語文教學學會年會暨國際學術研討會','2023-12-15','國立高雄師範大學','台灣華語文教學學會','會議形式：專題演講、論文發表、工作坊、座談會、書籍教材展示\r\n會議主題：重構與融合:多元發展下的全球華語教學','http://atcsl.org/atcsl_2023/','2023-11-14 12:52:16','2023-11-28 18:30:51','publish'),(3,'2023華語文語料庫與能力基準應用參考指引工作坊','2023-05-05','線上（google meet）','語文教育及編譯研究中心','國家教育研究（以下簡稱本院）自2014年起，在教育部華語文計畫支持下，逐年建置擴充臺灣華語文語料庫（COCT）及臺灣華語文能力基準（TBCL），並研發各類整合應用系統。\r\n\r\n為了分享計畫成果的應用，本院每年都舉辦工作坊。2023年持續分享語料庫應用及華語文能力基準應用參考指引的研發成果，因此規劃與國立臺灣師範大學華語文教學系辦理三場工作坊，除了分享最新研發成果，並且進行華語教學、教材編輯、測驗評量、學術研究等不同面向的實作，以提升華語文教學的效能。','https://www.naer.edu.tw/PageDoc/Detail?fid=15&id=4093','2023-11-14 12:54:56','2023-11-28 23:27:29','publish'),(4,'華語教學理論與實踐研習工作坊','2023-11-25','國立臺灣大學圖書館國際會議廳(B1)','臺大語文中心與臺大華語教學碩士學位學程','本工作坊以華語師資和學習者為跨文化中介者，推廣華語語言行為和語用實踐的認識、辨析、理論與實作。藉由探討華語教學理論與實踐，落實華語教學與學習，建立本校華語教學在國際上結合理論與實務的學術定位，同時培育符合現代所須的華語教學人才。','http://ntulcoffice.liberal.ntu.edu.tw/Teaching-and-Learning.html','2023-11-14 12:59:02','2023-11-28 22:54:43','publish'),(5,'New Directions in Chinese Language Education in the 21st Century','2023-06-09','Swarthmore College','Swarthmore College','The Eighth International Conference on Teaching Chinese as a Second Language aims to promote theoretical research and development of international Chinese language teaching as well as to foster cross-cultural exchange. In order to deepen educational cooperation between international institutions, participating in the conference will be institutions from Hong Kong, South Korea, Taiwan, CLTA-Taoli, and an additional five colleges and universities located in the United States.','https://tcsl8th.swarthmore.edu/','2023-11-28 23:31:20','2023-11-28 23:31:20','publish');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `favorite_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `favorite_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `product_id_UNIQUE` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (5,6,16,'2023-12-12 11:58:59'),(11,2,16,'2023-12-20 21:44:47'),(12,1,16,'2023-12-22 11:08:49');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `order_products` text COLLATE utf8mb4_unicode_ci,
  `order_shipping_fee` decimal(6,2) DEFAULT NULL,
  `order_price` decimal(10,2) DEFAULT NULL,
  `order_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_number_UNIQUE` (`order_number`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (13,'20231219143241019inj',16,'實用中日同形詞攻略法2',100.00,508.00,'2023-12-19 14:38:57'),(14,'20231219171633604x20',16,'實用中日同形詞攻略法1-1 X 1, 實用中日同形詞攻略法2 X 1',100.00,916.00,'2023-12-19 17:16:34'),(17,'20231220230309847urz',16,'實用中日同形詞攻略法1 X 1',100.00,508.00,'2023-12-20 23:03:11'),(18,'202312211339044325e5',16,'實用中日同形詞攻略法1 X 2',100.00,916.00,'2023-12-21 13:39:07'),(26,'202312221107171371y6',16,'實用中日同形詞攻略法1 X 2',100.00,916.00,'2023-12-22 11:07:18');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `is_paid` tinyint DEFAULT '0',
  `is_success` tinyint DEFAULT '0',
  `is_delivered` enum('未出貨','已出貨','已送達') COLLATE utf8mb4_unicode_ci DEFAULT '未出貨',
  `payment_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (2,16,13,1,1,'已出貨','2023-12-20 16:28:56'),(6,16,14,0,0,'未出貨','2023-12-20 17:36:33'),(7,16,15,0,0,'未出貨','2023-12-20 21:48:05'),(8,16,17,1,1,'未出貨','2023-12-20 23:07:08'),(9,16,18,1,1,'已送達','2023-12-21 14:24:18'),(10,16,19,1,1,'未出貨','2023-12-21 17:22:41'),(11,16,21,0,0,'未出貨','2023-12-22 10:04:13'),(12,16,22,0,0,'未出貨','2023-12-22 10:18:55'),(13,16,23,0,0,'未出貨','2023-12-22 10:29:45'),(14,16,24,0,0,'未出貨','2023-12-22 10:36:10'),(15,16,25,0,0,'未出貨','2023-12-22 11:03:38'),(16,16,27,0,0,'未出貨','2023-12-22 11:09:23');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `product_review_id` int NOT NULL AUTO_INCREMENT,
  `product_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_review_rating` enum('1','2','3','4','5') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_review_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `product_review_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `product_review_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `product_review_publish` enum('publish','unpublish') COLLATE utf8mb4_unicode_ci DEFAULT 'publish',
  PRIMARY KEY (`product_review_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
INSERT INTO `product_reviews` VALUES (1,'A','1','5','good','2023-11-24 14:59:42','2023-11-24 14:59:42','publish');
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_number` int DEFAULT NULL,
  `product_path` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `product_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `product_price` decimal(5,2) DEFAULT NULL,
  `product_discount` decimal(5,2) DEFAULT NULL,
  `product_description` text COLLATE utf8mb4_unicode_ci,
  `product_category` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_stock` int DEFAULT NULL,
  `product_publish` enum('publish','unpublish') COLLATE utf8mb4_unicode_ci DEFAULT 'unpublish',
  `product_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `product_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,110,'1701146233013-ç¬¬ä¸åå°é¢ç¸®å.jpg','實用中日同形詞攻略法1',480.00,408.00,'學華語時，許多熟悉的漢字，用法卻跟日語不同，是否讓你感到困擾？  這是一套補充華語詞彙知識的自學式教材，幫助你了解  「同形同義」、「同形異義」、「同形近義」  三類中日同形詞，讓華語學習更容易！','同形詞',100,'publish','2023-11-16 14:48:50','2023-12-05 15:20:26'),(2,2,'1701186035379-æä¹ç¹ªæ¼¢å­2(æ­£ç°¡éç¨ç)ç«é«æ¸å°.jpg','我也繪漢字2（正簡通用版）',280.00,240.00,'當學習者見到漢字鍵接圖像時，就如同關鍵字記憶法一般，可同時聯想到漢字的字形及字義。這套「漢字鍵接圖像」已經獲得實驗支持，對於漢字初學者維持記憶的效果與學習興趣的提升，都優於傳統反覆記憶的學習方法。','漢字',0,'publish','2023-11-16 14:56:56','2023-12-08 21:59:53'),(4,3,'1701146360760-ç¬¬ä¸åå°é¢ç¸®å2.jpeg','實用中日同形詞攻略法1-1',480.00,408.00,'學華語時，許多熟悉的漢字，用法卻跟日語不同，是否讓你感到困擾？  這是一套補充華語詞彙知識的自學式教材，幫助你了解  「同形同義」、「同形異義」、「同形近義」  三類中日同形詞，讓華語學習更容易！','同形詞',27,'publish','2023-11-28 12:39:20','2023-12-05 15:18:54'),(5,4,'1701146464994-ç¬¬äºåå°é¢ç¸®å.jpeg','實用中日同形詞攻略法2',450.00,408.00,'學華語時，許多熟悉的漢字，用法卻跟日語不同，是否讓你感到困擾？  這是一套補充華語詞彙知識的自學式教材，幫助你了解  「同形同義」、「同形異義」、「同形近義」  三類中日同形詞，讓華語學習更容易！','同形詞',42,'publish','2023-11-28 12:41:04','2023-12-05 15:19:20'),(6,5,'1701146853321-æ¼¢å­ç©æ¨1å¹³é¢æ¸å°.jpg','漢字積木：字本位學習法 I',360.00,324.00,'漢字與西方的拼音文字有所不同，是由圖像演變而來的文字，而漢字教學一直是華語教學上重要的課題。目前大多數的華語教材是以「詞本位教學法」編寫，採用「分散識字」模式，以詞彙為識字基本單位，因此學習基礎的漢字量需較長的時間。而「字本位教學法」強調「漢字」是華語的基本單位，透過「集中識字」模式，集中學習部件相同的詞彙，可強化華語學習者對漢字形音義的理解，以增進學習效率。','漢字積木',7,'publish','2023-11-28 12:46:11','2023-12-05 15:20:07'),(7,6,'1701151122202-æ¼¢å­ç©æ¨2ç«é«æ¸å°.jpg','漢字積木：字本位學習法 II',365.00,324.00,'漢字與西方的拼音文字有所不同，是由圖像演變而來的文字，而漢字教學一直是華語教學上重要的課題。目前大多數的華語教材是以「詞本位教學法」編寫，採用「分散識字」模式，以詞彙為識字基本單位，因此學習基礎的漢字量需較長的時間。而「字本位教學法」強調「漢字」是華語的基本單位，透過「集中識字」模式，集中學習部件相同的詞彙，可強化華語學習者對漢字形音義的理解，以增進學習效率。','漢字積木',100,'publish','2023-11-28 13:58:42','2023-12-22 11:45:50'),(8,7,'1701151749006-æä¹ç¹ªæ¼¢å­1(æ­£ç°¡éç¨ç)ç«é«æ¸å°.jpg','我也繪漢字1（正簡通用版）',280.00,240.00,'「漢字鍵接圖像」（Chinese Character Key-image Pictures）是介於漢字字形和字義之間的一種圖像，讓學習者一看到圖像就能和漢字產生連結，幫助學習者快速記憶漢字。','漢字',3,'publish','2023-11-28 14:09:09','2023-12-05 15:20:18'),(9,8,'1701768515785-æªå 2023-12-05 ä¸å5.23.37.png','實用中日同形詞攻略法3',500.00,480.00,'學華語時，許多熟悉的漢字，用法卻跟日語不同，是否讓你感到困擾？  這是一套補充華語詞彙知識的自學式教材，幫助你了解  「同形同義」、「同形異義」、「同形近義」  三類中日同形詞，讓華語學習更容易！','同形詞',18,'publish','2023-12-05 17:28:35','2023-12-05 17:28:35'),(10,9,'1701768605692-å°è¯æ_å¯¦ç¨ä¸­æ¥åå½¢è©æ»ç¥æ³.jpeg','實用中日同形詞攻略法海報 款式１',100.00,99.00,'學華語時，許多熟悉的漢字，用法卻跟日語不同，是否讓你感到困擾？  這是一套補充華語詞彙知識的自學式教材，幫助你了解  「同形同義」、「同形異義」、「同形近義」  三類中日同形詞，讓華語學習更容易！','海報',89,'publish','2023-12-05 17:30:05','2023-12-05 17:30:05'),(11,10,'1701768722517-æªå 2023-12-05 ä¸å5.30.55.png','實用中日同形詞攻略法海報 款式２',100.00,99.00,'學華語時，許多熟悉的漢字，用法卻跟日語不同，是否讓你感到困擾？  這是一套補充華語詞彙知識的自學式教材，幫助你了解  「同形同義」、「同形異義」、「同形近義」  三類中日同形詞，讓華語學習更容易！','海報',3,'publish','2023-12-05 17:32:02','2023-12-05 17:32:02'),(12,11,'1701768761933-æªå 2023-12-05 ä¸å5.31.08.png','實用中日同形詞攻略法海報 款式３',100.00,99.00,'學華語時，許多熟悉的漢字，用法卻跟日語不同，是否讓你感到困擾？  這是一套補充華語詞彙知識的自學式教材，幫助你了解  「同形同義」、「同形異義」、「同形近義」  三類中日同形詞，讓華語學習更容易！','海報',11,'publish','2023-12-05 17:32:41','2023-12-05 17:32:41'),(13,12,'1701768902770-card_red.png','實用中日同形詞攻略法明信片（紅）',45.00,40.00,'學華語時，許多熟悉的漢字，用法卻跟日語不同，是否讓你感到困擾？  這是一套補充華語詞彙知識的自學式教材，幫助你了解  「同形同義」、「同形異義」、「同形近義」  三類中日同形詞，讓華語學習更容易！','明信片',59,'publish','2023-12-05 17:35:02','2023-12-05 17:35:02');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipients`
--

DROP TABLE IF EXISTS `recipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipients` (
  `recipient_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_phone` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_residence` enum('Taipei','New Taipei','Kaohsiung','Taichung','Tainan','Taoyuan','Hsinchu','Miaoli','Keelung','Yilan','Chiayi','Changhua','Nantou','Yunlin','Pingtung','Penghu','Taitung','Hualien','Kinmen','Lienchiang','Other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recipient_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `recipient_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipients`
--

LOCK TABLES `recipients` WRITE;
/*!40000 ALTER TABLE `recipients` DISABLE KEYS */;
INSERT INTO `recipients` VALUES (2,16,'A123456',NULL,'王小明','0978-777-777','New Taipei','東區123街12號之2 ','2023-12-14 16:10:46','2023-12-14 16:10:46'),(3,16,'A123456','20231214161426449','王小明','0978-777-777','New Taipei','東區123街12號之2','2023-12-14 16:18:40','2023-12-14 16:18:40'),(4,16,'A123456','2023121511350612700g3s6qx','王小明','0978-777-777','Keelung','東區123街12號之1','2023-12-15 11:35:19','2023-12-15 11:35:19'),(5,16,'A123456','2023121511350612700g3s6qx','王小明','0978-777-777','Keelung','東區123街12號之1','2023-12-15 11:48:34','2023-12-15 11:48:34'),(6,16,'A123456','2023121511350612700g3s6qx','王小明','0978-777-777','New Taipei','東區123街12號之1','2023-12-15 11:53:24','2023-12-15 11:53:24'),(7,16,'A123456','20231215144222755mfx','王小明','0978-777-777','Keelung','東區123街12號之1','2023-12-15 14:42:31','2023-12-15 14:42:31'),(8,16,'A123456','20231215172729191vn4','王小明','0978-777-777','Keelung','東區123街12號之1','2023-12-15 17:27:43','2023-12-15 17:27:43'),(9,16,'A123456','20231219143241019inj','王小明','0978-777-777','Nantou','東區123街12號之2 ','2023-12-19 15:26:27','2023-12-19 15:26:27'),(10,16,'A123456','20231219171633604x20','王小明','0978-777-777','Yilan','東區123街12號之2 ','2023-12-19 17:18:07','2023-12-19 17:18:07'),(11,16,'A123456','20231220214610105i5p','王小立','0911111111','Taichung','地球村','2023-12-20 21:47:11','2023-12-20 21:47:11'),(12,16,'A123456','20231220215031911e66','王小明','0977-777-777','Keelung','東區123街12號之1','2023-12-20 21:50:41','2023-12-20 21:50:41'),(13,16,'A123456','20231220230309847urz','王小立','0978-777-777','Keelung','北區','2023-12-20 23:03:31','2023-12-20 23:03:31'),(14,16,'A123456','202312211339044325e5','王小明','0977-777-777','Kaohsiung','東區123街12號之2 ','2023-12-21 13:51:28','2023-12-21 13:51:28'),(15,16,'A123456','20231221172034855lzs','王小明','0978-777-777','New Taipei','東區123街12號之1','2023-12-21 17:21:46','2023-12-21 17:21:46'),(16,16,'A123456','20231221172725599b6d','王小立','0978-777-777','Keelung','東區123街12號之2 ','2023-12-21 17:27:36','2023-12-21 17:27:36'),(17,16,'A123456','20231222100345897b30','王小明','0978-777-777','Taoyuan','北區','2023-12-22 10:03:56','2023-12-22 10:03:56'),(18,16,'A123456','20231222101833015yj0','王小明','0977-777-777','Keelung','東區123街12號之1','2023-12-22 10:18:42','2023-12-22 10:18:42'),(19,16,'A123456','20231222102922100y1r','王小立','0978-777-777','Keelung','東區123街12號之1','2023-12-22 10:29:31','2023-12-22 10:29:31'),(20,16,'A123456','20231222103550160rto','王小立','0978-777-777','New Taipei','東區123街12號之2 ','2023-12-22 10:35:59','2023-12-22 10:35:59'),(21,16,'A123456','202312221103018977uj','王小立','0978-777-777','Keelung','東區123街12號之2 ','2023-12-22 11:03:21','2023-12-22 11:03:21'),(22,16,'A123456','20231222110900711fm9','王小立','0977-777-777','New Taipei','東區123街12號之2 ','2023-12-22 11:09:10','2023-12-22 11:09:10');
/*!40000 ALTER TABLE `recipients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_password` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT 'other',
  `user_birthdate` date DEFAULT '1900-01-01',
  `user_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_last_login` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_disabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'1','$2b$10$wvMP3rfc0CPQAHZUWwAgnue0e/iGKPVVYOh9ozdjm/S/2QwADbN7G','1@1','female','2023-10-02','2023-11-13 15:23:06','2023-11-15 18:08:45','2023-11-13 15:23:06',0),(3,'2','$2b$10$thXp42ZjsaARPvGGepk.euy3V.Img.3B.B4fo6wUUDIB3Q.RTysYy','2@2','male','2023-11-01','2023-11-14 09:43:05','2023-11-14 09:43:05','2023-11-14 09:43:05',0),(4,'3','$2b$10$T/IBDlJqNP87ONMh09Sw2usRyMmMCb4agzOaZ3n0Fh1aHJr92qGua','3@33','other','2023-10-25','2023-12-01 14:42:05','2023-12-05 14:45:35','2023-12-01 14:42:05',0),(5,'4','$2b$10$3n6VGwgUA3fE2uYzCsTWretZ7qkNJpbdjpxSj9dWBBIDc5UT6FEXO','4@4','male','2023-11-28','2023-12-01 20:08:33','2023-12-01 20:13:27','2023-12-01 20:08:33',0),(6,'5','$2b$10$BRqQdnWrQpT8gu8q3qwcbeYClvxnXlSirm5aBKjWhtkY1u8l6g2xK','5@5','female','2023-12-06','2023-12-01 20:14:05','2023-12-01 20:14:05','2023-12-01 20:14:05',0),(7,'6','$2b$10$2dAPFGSkIFa/sk.YAGuaz.TdJhrjPTIJR50MAgp9T4XlDI3jJDVkK','6@6','female','2023-11-28','2023-12-01 20:36:03','2023-12-01 20:36:03','2023-12-01 20:36:03',0),(8,'a111111','$2b$10$pqC63kZVrZP3bsHbSjE6Xen.mnvls9MqV1HYF81mXAgGjjLzTbMJ.','132@gmail.com','other','2023-10-27','2023-12-01 21:32:07','2023-12-06 09:52:02','2023-12-01 21:32:07',0),(9,'a111112','$2b$10$uXx/z2SKQGAay4mmbEkbQ.OMHvmfUXRWjqDzF5dOn54cFQrg7NQO2','1@yahoo.com','female','2023-11-27','2023-12-01 22:41:00','2023-12-01 22:41:00','2023-12-01 22:41:00',0),(12,'a11112','$2b$10$9OKwDESIz5yzHvo79da5V.iH8bBhyw6BjMEJdEYGx3.nFU.iLb4Me','1@gmail.com','female','2023-11-27','2023-12-01 23:18:46','2023-12-01 23:18:46','2023-12-01 23:18:46',0),(13,'a1111122','$2b$10$TeuHANNN9DKAk.rZYEqupOIrDT/gMdLo4vH3XpxdHth/dtBSxze3C','1@gmail.com','female','2023-11-29','2023-12-01 23:36:27','2023-12-01 23:36:27','2023-12-01 23:36:27',0),(14,'aA111111','$2b$10$ZWegoar8MjVanmlm/RtR0OCOEYCh2AIjgf6LU8ISpqFjZxpvjnYjq','1@gmail.com','female','2023-11-30','2023-12-04 13:29:41','2023-12-04 13:29:41','2023-12-04 13:29:41',0),(15,'a11111223','$2b$10$YJzpDe.HJ9fj215X8EIU8ex/NXCnhDYYMl2n6VNXfLiOvfr6c03We','3@gmail.com','other','2023-11-28','2023-12-04 14:26:20','2023-12-04 14:26:20','2023-12-04 14:26:20',0),(16,'A123456','$2b$10$eZb1FONstOu/FYLShebKtubh1BNQbyZRLqdHpQJBUnNndJ47dw22q','Aa123456@gmail.com','other','2023-12-05','2023-12-06 09:59:55','2023-12-06 09:59:55','2023-12-06 09:59:55',0);
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

-- Dump completed on 2023-12-26 16:11:16
