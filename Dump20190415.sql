-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: CaterersHere
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Admin` (
  `Email` varchar(40) NOT NULL,
  `Password` varchar(45) NOT NULL,
  PRIMARY KEY (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
INSERT INTO `Admin` VALUES ('admin@mail.com','12345');
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CatererCities`
--

DROP TABLE IF EXISTS `CatererCities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CatererCities` (
  `CatererCityId` int(11) NOT NULL AUTO_INCREMENT,
  `CityId` int(11) NOT NULL,
  `CaterersId` int(11) NOT NULL,
  PRIMARY KEY (`CatererCityId`),
  UNIQUE KEY `CatererCityId_UNIQUE` (`CatererCityId`),
  KEY `city_caterercity_key_idx` (`CityId`),
  KEY `city_caterer_key_idx` (`CaterersId`),
  CONSTRAINT `city_caterer_key` FOREIGN KEY (`CaterersId`) REFERENCES `Caterers` (`CatererId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `city_caterercity_key` FOREIGN KEY (`CityId`) REFERENCES `Cities` (`CityId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CatererCities`
--

LOCK TABLES `CatererCities` WRITE;
/*!40000 ALTER TABLE `CatererCities` DISABLE KEYS */;
INSERT INTO `CatererCities` VALUES (11,1,37),(12,3,37),(13,5,37),(14,1,38),(15,3,38),(16,5,38),(34,1,41),(35,2,41),(39,1,43),(40,2,43),(41,3,43),(42,1,44),(43,2,44),(44,3,44),(45,1,45),(46,2,45),(47,3,45),(48,1,46),(49,2,46),(50,3,46),(63,1,42),(64,2,42),(65,3,42),(108,1,40),(109,2,40),(110,4,40),(113,1,36),(114,3,36),(115,5,36),(116,1,39),(117,3,39);
/*!40000 ALTER TABLE `CatererCities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CatererCuisines`
--

DROP TABLE IF EXISTS `CatererCuisines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CatererCuisines` (
  `CatererCuisinesId` int(11) NOT NULL AUTO_INCREMENT,
  `CuisineId` int(11) NOT NULL,
  `CatererId` int(11) NOT NULL,
  PRIMARY KEY (`CatererCuisinesId`),
  UNIQUE KEY `CatererCuisines_UNIQUE` (`CatererCuisinesId`),
  KEY `caterers_catererCuisines_key_idx` (`CatererId`),
  KEY `cuisine_CatererCuisines_key_idx` (`CuisineId`),
  CONSTRAINT `caterer_CatererCuisines_key2` FOREIGN KEY (`CatererId`) REFERENCES `Caterers` (`CatererId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cuisine_CatererCuisines_key` FOREIGN KEY (`CuisineId`) REFERENCES `Cuisines` (`CuisinesId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CatererCuisines`
--

LOCK TABLES `CatererCuisines` WRITE;
/*!40000 ALTER TABLE `CatererCuisines` DISABLE KEYS */;
INSERT INTO `CatererCuisines` VALUES (1,1,38),(2,2,38),(3,3,38),(18,1,41),(19,2,41),(22,1,43),(23,4,43),(24,1,44),(25,3,44),(26,4,44),(27,1,45),(28,2,45),(29,1,46),(30,2,46),(31,4,46),(41,1,42),(42,4,42),(90,1,40),(91,2,40),(92,4,40),(93,5,40),(97,1,36),(98,2,36),(99,1,39),(100,2,39),(101,4,39);
/*!40000 ALTER TABLE `CatererCuisines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CatererPackages`
--

DROP TABLE IF EXISTS `CatererPackages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `CatererPackages` (
  `CatererPackagesId` int(11) NOT NULL AUTO_INCREMENT,
  `CatererId` int(11) NOT NULL,
  `PackageId` int(11) NOT NULL,
  `Price` int(11) NOT NULL,
  PRIMARY KEY (`CatererPackagesId`),
  UNIQUE KEY `CatererPackagesId_UNIQUE` (`CatererPackagesId`),
  KEY `caterer_CatererPackages_key_idx` (`CatererId`),
  KEY `package_CatererPackages_key_idx` (`PackageId`),
  CONSTRAINT `caterer_CatererPackages_key` FOREIGN KEY (`CatererId`) REFERENCES `Caterers` (`CatererId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `package_CatererPackages_key` FOREIGN KEY (`PackageId`) REFERENCES `Packages` (`PackageId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CatererPackages`
--

LOCK TABLES `CatererPackages` WRITE;
/*!40000 ALTER TABLE `CatererPackages` DISABLE KEYS */;
INSERT INTO `CatererPackages` VALUES (1,38,1,100),(5,38,2,200),(6,38,3,300),(10,37,1,1000),(11,37,2,2000),(12,37,3,3000),(15,36,1,200),(16,36,2,300),(17,36,3,500),(21,39,1,200),(22,39,2,333),(23,39,3,425),(24,41,1,200),(25,41,2,500),(26,41,3,1000),(27,42,1,250),(28,42,2,800),(29,42,3,1500),(30,43,1,250),(31,43,2,800),(32,43,3,1500),(33,44,1,200),(34,44,2,340),(35,44,3,700),(36,45,1,200),(37,45,2,400),(38,45,3,1000),(39,46,1,300),(40,46,2,700),(41,46,3,1500);
/*!40000 ALTER TABLE `CatererPackages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Caterers`
--

DROP TABLE IF EXISTS `Caterers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Caterers` (
  `CatererId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `ConfirmPassword` varchar(45) NOT NULL,
  `Address` varchar(300) NOT NULL,
  `Phone1` int(15) NOT NULL,
  `Phone2` int(15) DEFAULT NULL,
  `Email` varchar(50) NOT NULL,
  `lessThan100` varchar(10) DEFAULT NULL,
  `lessThan1000` varchar(10) DEFAULT NULL,
  `moreThan1000` varchar(10) DEFAULT NULL,
  `Description` varchar(50) NOT NULL,
  `Min_Persons` int(11) DEFAULT NULL,
  PRIMARY KEY (`CatererId`),
  UNIQUE KEY `CatererId_UNIQUE` (`CatererId`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Caterers`
--

LOCK TABLES `Caterers` WRITE;
/*!40000 ALTER TABLE `Caterers` DISABLE KEYS */;
INSERT INTO `Caterers` VALUES (36,'Geeta','ekrgrekj','wrjgwn','leroghejrgnlerng',14344,234243,'ljfjken@lkengkne','ON','','','lekrnglengrjn',NULL),(37,'Jalram','heorgho','ogeogn','neognoeng',14141,21434,'fowrh@hrwngo','undefined','undefined','undefined','kngng',NULL),(38,'Ram','9823479','hfiw','iwifwriirgh',121341,24331,'lkgkj@lfofgineoi','undefined','undefined','undefined','kjnfkngf',NULL),(39,'Neha','1234','1234','jefhjh',1243,124234,'neha@gmail.com','ON','','','sldkfhldfh',NULL),(40,'Narayan','1234','1234','sanand',1234,12334,'narayan@mail.com','ON','ON','ON','dfsdf;als\'lklelnkrfe;lrm',NULL),(41,'Om','abcde','abcde','mehsanan',1342,234234,'om@mail.com','on','on','undefined','243tyjhgfddfghjmk,jhhfdgfhhmg',NULL),(42,'Nanavati','1234','1234','bhuj',134,2342,'nana@mail.com','ON','','','243tyjhgfddfghjmk,jhhfdgfhhmg',NULL),(43,'Nanavati','1234','1234','bhuj',134,2342,'nana1@mail.com','on','on','undefined','243tyjhgfddfghjmk,jhhfdgfhhmg',NULL),(44,'Mayavati','1234','1234','kknagar',13213,2344,'mayavati@mail.com','on','on','undefined','243tyjhgfddfghjmk,jhhfdgfhhmg',NULL),(45,'julian','1234','1234','us',1234,1234,'julian@abc','on','on','undefined','dfsdf;als\'lklelnkrfe;lrm',NULL),(46,'TGB','1234','1234','ahmedabad',1234234,34234,'tgb@mail.com','on','on','on','dfsdf;als\'lklelnkrfe;lrm',NULL);
/*!40000 ALTER TABLE `Caterers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cities`
--

DROP TABLE IF EXISTS `Cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cities` (
  `CityId` int(11) NOT NULL AUTO_INCREMENT,
  `CityName` varchar(50) NOT NULL,
  PRIMARY KEY (`CityId`),
  UNIQUE KEY `CityId_UNIQUE` (`CityId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cities`
--

LOCK TABLES `Cities` WRITE;
/*!40000 ALTER TABLE `Cities` DISABLE KEYS */;
INSERT INTO `Cities` VALUES (1,'Ahmedabad'),(2,'Baroda'),(3,'Anand'),(4,'Nadiad'),(5,'Himmatnagar');
/*!40000 ALTER TABLE `Cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cuisines`
--

DROP TABLE IF EXISTS `Cuisines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cuisines` (
  `CuisinesId` int(10) NOT NULL AUTO_INCREMENT,
  `CusineName` varchar(100) NOT NULL,
  PRIMARY KEY (`CuisinesId`),
  UNIQUE KEY `CuisinesId_UNIQUE` (`CuisinesId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cuisines`
--

LOCK TABLES `Cuisines` WRITE;
/*!40000 ALTER TABLE `Cuisines` DISABLE KEYS */;
INSERT INTO `Cuisines` VALUES (1,'Chinese'),(2,'Italian'),(3,'Mexican'),(4,'Continental'),(5,'Punjabi');
/*!40000 ALTER TABLE `Cuisines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Events` (
  `EventId` int(10) NOT NULL AUTO_INCREMENT,
  `EventName` varchar(50) NOT NULL,
  PRIMARY KEY (`EventId`),
  UNIQUE KEY `EventId_UNIQUE` (`EventId`)
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Events`
--

LOCK TABLES `Events` WRITE;
/*!40000 ALTER TABLE `Events` DISABLE KEYS */;
/*!40000 ALTER TABLE `Events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Orders` (
  `OrderId` int(11) NOT NULL AUTO_INCREMENT,
  `EventDate` date NOT NULL,
  `Package` varchar(45) NOT NULL,
  `Inquiry` varchar(200) DEFAULT NULL,
  `Peoples` varchar(30) NOT NULL,
  `Event` varchar(50) NOT NULL,
  `CatererId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Address` varchar(200) NOT NULL,
  `CreatedDateTime` datetime DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`OrderId`),
  UNIQUE KEY `OrderId_UNIQUE` (`OrderId`),
  KEY `catererId_idx` (`CatererId`),
  KEY `userId_idx` (`UserId`),
  CONSTRAINT `catererId` FOREIGN KEY (`CatererId`) REFERENCES `Caterers` (`CatererId`) ON UPDATE CASCADE,
  CONSTRAINT `userId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,'2019-02-16','1',' asd','on','aaf',37,10,' adad',NULL,NULL),(2,'2019-02-16','3',' qwdq','on','qewq',37,10,' qweq',NULL,NULL),(3,'2019-02-16','1',' sad','on','asd',36,10,' ad',NULL,NULL),(4,'2019-02-23','1',' test','on','test',36,10,' test',NULL,NULL),(5,'2019-02-08','1',' lkelekjrwlkj','on','wedding',38,10,'ljrlgwl ',NULL,NULL),(6,'2019-02-09','3','fsfwr','on','geg',38,11,'fdbe',NULL,NULL),(7,'2019-02-09','1','fgfg','on','cvbcv',38,13,'cv',NULL,NULL),(9,'2019-03-30','2','asda','moreThan100','test',41,10,'qdwq',NULL,NULL),(10,'2019-03-30','2','asda','moreThan100','test',41,10,'qdwq',NULL,NULL),(11,'2019-03-30','2','asda','moreThan100','test',41,10,'qdwq',NULL,NULL),(12,'2019-03-30','2','asda','moreThan100','test',41,10,'qdwq',NULL,NULL),(13,'2019-03-29','1','fwf','lessThan1000','wedding',41,10,'weer',NULL,NULL),(14,'2019-03-30','1','dff','moreThan100','asd',43,10,'sfw',NULL,NULL),(15,'2019-04-04','1','edfwefwf','lessThan1000','wedding',39,11,'egegevv',NULL,NULL),(16,'2019-04-26','2','afc','lessThan1000','wedding',39,13,'dfda',NULL,NULL),(17,'2019-04-20','2','zsf','lessThan100','wrfgfwsf',39,16,'ada',NULL,NULL);
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Packages`
--

DROP TABLE IF EXISTS `Packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Packages` (
  `PackageId` int(10) NOT NULL AUTO_INCREMENT,
  `PackageName` varchar(50) NOT NULL,
  PRIMARY KEY (`PackageId`),
  UNIQUE KEY `PackageId_UNIQUE` (`PackageId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Packages`
--

LOCK TABLES `Packages` WRITE;
/*!40000 ALTER TABLE `Packages` DISABLE KEYS */;
INSERT INTO `Packages` VALUES (1,'Silver'),(2,'Gold'),(3,'Platinum');
/*!40000 ALTER TABLE `Packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reviews`
--

DROP TABLE IF EXISTS `Reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Reviews` (
  `ReviewId` int(11) NOT NULL AUTO_INCREMENT,
  `OrderId` int(11) NOT NULL,
  `UsersId` int(11) NOT NULL,
  `CaterersId` int(11) NOT NULL,
  `Stars` int(11) NOT NULL,
  `Feedback` varchar(100) NOT NULL,
  `DateTime` datetime NOT NULL,
  PRIMARY KEY (`ReviewId`),
  UNIQUE KEY `ReviewId_UNIQUE` (`ReviewId`),
  KEY `userId_idx` (`UsersId`),
  KEY `catererId_idx` (`CaterersId`),
  KEY `orderId_idx` (`OrderId`),
  CONSTRAINT `caterersId` FOREIGN KEY (`CaterersId`) REFERENCES `Caterers` (`CatererId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `orderId` FOREIGN KEY (`OrderId`) REFERENCES `Orders` (`OrderId`) ON UPDATE CASCADE,
  CONSTRAINT `usersId` FOREIGN KEY (`UsersId`) REFERENCES `Users` (`UserID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reviews`
--

LOCK TABLES `Reviews` WRITE;
/*!40000 ALTER TABLE `Reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SecurityQuestions`
--

DROP TABLE IF EXISTS `SecurityQuestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SecurityQuestions` (
  `QuesId` int(11) NOT NULL AUTO_INCREMENT,
  `Question` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`QuesId`),
  UNIQUE KEY `QuesId_UNIQUE` (`QuesId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SecurityQuestions`
--

LOCK TABLES `SecurityQuestions` WRITE;
/*!40000 ALTER TABLE `SecurityQuestions` DISABLE KEYS */;
INSERT INTO `SecurityQuestions` VALUES (1,'What is your Favourite Animal?'),(2,'What is your Favourtie Food?'),(3,'What is the name of the fBook you like to read?'),(4,'What is your Favourite Color?');
/*!40000 ALTER TABLE `SecurityQuestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Uploads`
--

DROP TABLE IF EXISTS `Uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Uploads` (
  `UploadId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `CatererId` int(11) NOT NULL,
  PRIMARY KEY (`UploadId`),
  UNIQUE KEY `idUploads_UNIQUE` (`UploadId`),
  KEY `caterer_Upload_key_idx` (`CatererId`),
  CONSTRAINT `caterer_Upload_key` FOREIGN KEY (`CatererId`) REFERENCES `Caterers` (`CatererId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Uploads`
--

LOCK TABLES `Uploads` WRITE;
/*!40000 ALTER TABLE `Uploads` DISABLE KEYS */;
INSERT INTO `Uploads` VALUES (14,'photos-1553690794239',39),(15,'photos-1553690794240',39),(16,'photos-1553690794241',39),(17,'photos-1553690794241',39),(18,'photos-1553691082950',39);
/*!40000 ALTER TABLE `Uploads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserQuestions`
--

DROP TABLE IF EXISTS `UserQuestions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserQuestions` (
  `UserQuesId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) DEFAULT NULL,
  `QuestionId` int(11) DEFAULT NULL,
  `Answer` varchar(105) DEFAULT NULL,
  PRIMARY KEY (`UserQuesId`),
  UNIQUE KEY `UserQuesId_UNIQUE` (`UserQuesId`),
  KEY `User_Ques_idx` (`UserId`),
  KEY `Question_Ques_idx` (`QuestionId`),
  CONSTRAINT `Question_Ques` FOREIGN KEY (`QuestionId`) REFERENCES `SecurityQuestions` (`QuesId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User_Ques` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserQuestions`
--

LOCK TABLES `UserQuestions` WRITE;
/*!40000 ALTER TABLE `UserQuestions` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserQuestions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `CreatedDate` datetime NOT NULL,
  `ModifiedDate` datetime DEFAULT NULL,
  `ModifiedBy` int(11) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (10,'caterersHere@gmail.com','1234','neha','basera','2019-02-09 17:33:58','2019-02-09 17:33:58',NULL,NULL),(11,'purva@gmail.com','abc','Purva','Mistry','2019-02-10 10:23:29','2019-02-10 10:23:29',NULL,NULL),(13,'sustu@gmail.com ','1234','sustu','agrawali','2019-02-10 11:09:02','2019-02-10 11:09:02',NULL,NULL),(14,'john@gmail.com ','1234','John','Samuel','2019-02-12 10:37:58','2019-02-12 10:37:58',NULL,NULL),(15,'kde@jkdf ','1234','neha','hsdg','2019-02-22 11:21:22','2019-02-22 11:21:22',NULL,NULL),(16,'mili@mail ','1234','mili','s','2019-03-22 08:43:39','2019-03-22 08:43:39',NULL,NULL),(22,'afdasf@wdfw ','s','sd','sdfsdf','2019-03-29 18:17:03','2019-03-29 18:17:03',NULL,NULL),(23,'afdasf@wdfw ','s','sd','sdfsdf','2019-03-29 18:20:38','2019-03-29 18:20:38',NULL,NULL),(24,'ewr@ef ','ss','qwe','wq','2019-03-29 18:21:13','2019-03-29 18:21:13',NULL,NULL),(25,'ewr@ef ','ss','qwe','wq','2019-03-29 18:21:50','2019-03-29 18:21:50',NULL,NULL),(26,'nehampb@gmail.com ','123456','neha','prajapati','2019-04-05 14:51:45','2019-04-05 14:51:45',NULL,NULL),(27,'ajay@gmail.com ','ajayde','ajay','devgan','2019-04-14 14:23:06','2019-04-14 14:23:06',NULL,NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-15 15:49:42
