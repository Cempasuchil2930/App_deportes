-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 27-11-2026 a las 23:05:04
-- Versión del servidor: 8.4.7
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `liga_mujeres_diversas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

DROP TABLE IF EXISTS `equipos`;
CREATE TABLE IF NOT EXISTS `equipos` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abreviatura` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_distintivo` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estatus` enum('APROBADO','PENDIENTE','RECHAZADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'APROBADO',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_equipo_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id`, `nombre`, `abreviatura`, `color_distintivo`, `estatus`, `created_at`) VALUES
(1, 'QUEER GOALS', 'QGL', 'Rosa / Blanco', 'APROBADO', '2026-11-27 22:59:40'),
(2, 'VALQUIRIAS', 'VLQ', 'Naranja / Negro', 'APROBADO', '2026-11-27 22:59:40'),
(3, 'GOOD VIBES', 'GDV', 'Magenta / Azul', 'APROBADO', '2026-11-27 22:59:40'),
(4, 'ALL STARS GV', 'ASV', 'Naranja / Dorado', 'APROBADO', '2026-11-27 22:59:40'),
(5, 'TBD UNITED', 'TBD', 'Amarillo / Negro', 'APROBADO', '2026-11-27 22:59:40'),
(6, 'UNKNOWN', 'UNK', 'Morado / Cian', 'APROBADO', '2026-11-27 22:59:40'),
(7, 'F.C. LIONESSES', 'FCL', 'Verde Neón / Negro', 'APROBADO', '2026-11-27 22:59:40'),
(8, 'BANDIDAS F.C.', 'BND', 'Verde / Blanco', 'APROBADO', '2026-11-27 22:59:40'),
(9, 'REAL MADRID', 'RMD', 'Morado / Blanco', 'APROBADO', '2026-11-27 22:59:40'),
(10, 'FÉNIX F.C.', 'FNX', 'Fucsia / Negro', 'APROBADO', '2026-11-27 22:59:40'),
(11, 'LOBAS MÉXICO', 'LBS', 'Azul Cian / Negro', 'APROBADO', '2026-11-27 22:59:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticas_partido`
--

DROP TABLE IF EXISTS `estadisticas_partido`;
CREATE TABLE IF NOT EXISTS `estadisticas_partido` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `partido_id` int UNSIGNED NOT NULL,
  `jugadora_id` int UNSIGNED NOT NULL,
  `goles` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `tarjetas_amarillas` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `tarjetas_rojas` tinyint UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_stats_partido` (`partido_id`),
  KEY `fk_stats_jugadora` (`jugadora_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadoras`
--

DROP TABLE IF EXISTS `jugadoras`;
CREATE TABLE IF NOT EXISTS `jugadoras` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `equipo_id` int UNSIGNED NOT NULL,
  `numero_lista` tinyint UNSIGNED NOT NULL,
  `nombre_completo` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `edad` tinyint UNSIGNED NOT NULL,
  `posicion` enum('Portera','Defensa','Medio','Delantera') COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_playera` tinyint UNSIGNED NOT NULL,
  `pronombres` enum('Ella','Elle','Él') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ella',
  `foto_autorizada` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_jugadoras_equipo` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `jugadoras`
--

INSERT INTO `jugadoras` (`id`, `equipo_id`, `numero_lista`, `nombre_completo`, `edad`, `posicion`, `numero_playera`, `pronombres`, `foto_autorizada`, `created_at`) VALUES
(1, 1, 1, 'Mariana López Hernández', 26, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(2, 1, 2, 'Daniela Ramírez Cruz', 24, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(3, 1, 3, 'Fernanda Castillo Morales', 29, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(4, 1, 4, 'Andrea Sánchez Flores', 22, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(5, 1, 5, 'Paola Jiménez Torres', 31, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(6, 1, 6, 'Valeria Mendoza Ruiz', 25, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(7, 1, 7, 'Karla Pérez García', 28, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(8, 1, 8, 'Alejandra Reyes Luna', 23, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(9, 1, 9, 'Gabriela Ortiz Vega', 30, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(10, 1, 10, 'Sofía Navarro Díaz', 21, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(11, 1, 11, 'Natalia Romero Silva', 27, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(12, 1, 12, 'Brenda Aguilar Ríos', 32, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(13, 1, 13, 'Ximena Flores Castro', 20, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(14, 1, 14, 'Melissa Vargas León', 34, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(15, 1, 15, 'Regina Torres Méndez', 26, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(16, 2, 1, 'Laura Martínez Silva', 28, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(17, 2, 2, 'Mónica Herrera López', 32, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(18, 2, 3, 'Itzel García Romero', 24, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(19, 2, 4, 'Claudia Sánchez Rivas', 35, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(20, 2, 5, 'Jimena Morales Cruz', 22, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(21, 2, 6, 'Diana Flores Mendoza', 27, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(22, 2, 7, 'Renata Pérez Castillo', 21, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(23, 2, 8, 'Araceli Torres Jiménez', 30, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(24, 2, 9, 'Lucía Ramírez Vega', 25, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(25, 2, 10, 'Evelyn Reyes Navarro', 29, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(26, 2, 11, 'Abril Castro Díaz', 23, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(27, 2, 12, 'Karina León Aguilar', 33, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(28, 2, 13, 'Fátima Ríos Hernández', 20, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(29, 2, 14, 'Verónica Luna Ortiz', 37, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(30, 2, 15, 'Natalia Méndez Ruiz', 26, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(31, 3, 1, 'Alejandra Sánchez López', 27, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(32, 3, 2, 'Blanca Andrade Pérez', 31, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(33, 3, 3, 'Carolina Jiménez Ríos', 24, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(34, 3, 4, 'Jessica Morales Vega', 29, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(35, 3, 5, 'Paulina Castro Ruiz', 22, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(36, 3, 6, 'Mariana Torres Flores', 26, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(37, 3, 7, 'Andrea Navarro Cruz', 30, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(38, 3, 8, 'Leslie Ramírez García', 23, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(39, 3, 9, 'Gabriela Mendoza Silva', 34, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(40, 3, 10, 'Valentina Romero Díaz', 21, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(41, 3, 11, 'Michelle Reyes Hernández', 28, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(42, 3, 12, 'Brenda Ortiz Luna', 32, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(43, 3, 13, 'Fernanda Aguilar León', 25, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(44, 3, 14, 'Sofía Herrera Méndez', 20, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(45, 3, 15, 'Natalia Castillo Rivas', 27, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(46, 4, 1, 'Daniela Flores Martínez', 25, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(47, 4, 2, 'Paola Ramírez López', 29, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(48, 4, 3, 'Karla Mendoza Cruz', 33, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(49, 4, 4, 'Ingrid Santana Moya', 27, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(50, 4, 5, 'Ximena Torres García', 22, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(51, 4, 6, 'Melissa Jiménez Ríos', 30, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(52, 4, 7, 'Mariana Reyes Silva', 24, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(53, 4, 8, 'Regina Navarro Pérez', 21, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(54, 4, 9, 'Andrea Castillo Vega', 28, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(55, 4, 10, 'Valeria Ortiz Hernández', 26, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(56, 4, 11, 'Sofía León Morales', 23, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(57, 4, 12, 'Fernanda Aguilar Ruiz', 32, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(58, 4, 13, 'Lucía Herrera Díaz', 20, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(59, 4, 14, 'Diana Romero Flores', 35, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(60, 4, 15, 'Natalia Sánchez Luna', 27, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(61, 5, 1, 'Gabriela Martínez Cruz', 30, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(62, 5, 2, 'Fernanda López Ríos', 24, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(63, 5, 3, 'Alejandra Torres Silva', 28, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(64, 5, 4, 'Daniela Pérez Mendoza', 22, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(65, 5, 5, 'Karina Romero Vega', 34, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(66, 5, 6, 'Valeria Sánchez Ruiz', 26, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(67, 5, 7, 'Mónica Castillo Flores', 31, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(68, 5, 8, 'Itzel Navarro Hernández', 23, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(69, 5, 9, 'Paola Aguilar Díaz', 29, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(70, 5, 10, 'Regina Morales León', 21, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(71, 5, 11, 'Jimena Reyes Ortiz', 25, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(72, 5, 12, 'Andrea García Luna', 33, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(73, 5, 13, 'Laura Méndez Castro', 27, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(74, 5, 14, 'Evelyn Ríos Jiménez', 36, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(75, 5, 15, 'Ximena Herrera Ramírez', 20, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(76, 6, 1, 'Claudia Ramírez Flores', 32, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(77, 6, 2, 'Natalia Pérez López', 24, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(78, 6, 3, 'Melissa Torres Cruz', 27, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(79, 6, 4, 'Diana Sánchez Vega', 35, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(80, 6, 5, 'Abril Mendoza Ruiz', 22, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(81, 6, 6, 'Valentina García Ríos', 26, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(82, 6, 7, 'Jessica Navarro Silva', 29, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(83, 6, 8, 'Fátima Romero Díaz', 21, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(84, 6, 9, 'Mariana Ortiz Hernández', 30, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(85, 6, 10, 'Karla Castillo Morales', 25, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(86, 6, 11, 'Paola Herrera León', 28, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(87, 6, 12, 'Renata Aguilar Méndez', 23, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(88, 6, 13, 'Sofía Jiménez Luna', 20, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(89, 6, 14, 'Andrea Flores Castro', 34, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(90, 6, 15, 'Verónica Reyes Martínez', 37, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(91, 7, 1, 'Jessica Aguilar Torres', 29, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(92, 7, 2, 'Fernanda López García', 25, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(93, 7, 3, 'Mariana Castillo Ruiz', 31, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(94, 7, 4, 'Daniela Romero Cruz', 22, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(95, 7, 5, 'Karla Sánchez Vega', 27, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(96, 7, 6, 'Valeria Martínez Flores', 24, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(97, 7, 7, 'Alejandra Mendoza Díaz', 33, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(98, 7, 8, 'Ximena Ramírez Ortiz', 21, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(99, 7, 9, 'Natalia Herrera Silva', 28, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(100, 7, 10, 'Paola Reyes Luna', 26, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(101, 7, 11, 'Regina Jiménez Ríos', 23, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(102, 7, 12, 'Gabriela Navarro León', 35, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(103, 7, 13, 'Lucía Pérez Morales', 20, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(104, 7, 14, 'Evelyn Torres Hernández', 30, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(105, 7, 15, 'Mónica Flores Castro', 32, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(106, 8, 1, 'Andrea Morales Ríos', 28, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(107, 8, 2, 'Esmeralda Sosa Martínez', 30, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(108, 8, 3, 'Paulina García López', 24, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(109, 8, 4, 'Diana Reyes Cruz', 33, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(110, 8, 5, 'Jimena Navarro Vega', 21, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(111, 8, 6, 'Karina Torres Silva', 27, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(112, 8, 7, 'Fernanda Castillo Ruiz', 25, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(113, 8, 8, 'Valeria Mendoza Flores', 29, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(114, 8, 9, 'Brenda Ramírez Díaz', 34, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(115, 8, 10, 'Sofía Aguilar Hernández', 22, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(116, 8, 11, 'Mariana Pérez León', 26, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(117, 8, 12, 'Regina Herrera Ortiz', 23, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(118, 8, 13, 'Melissa Jiménez Luna', 31, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(119, 8, 14, 'Claudia Romero Castro', 36, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(120, 8, 15, 'Natalia Sánchez Méndez', 20, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(121, 9, 1, 'Sofía Gallegos Hernández', 27, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(122, 9, 2, 'Debora Gallegos Ruiz', 29, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(123, 9, 3, 'Valeria Martínez Cruz', 24, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(124, 9, 4, 'Mariana López Vega', 32, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(125, 9, 5, 'Fernanda Torres Silva', 25, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(126, 9, 6, 'Daniela Castillo Ríos', 23, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(127, 9, 7, 'Andrea Reyes Flores', 28, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(128, 9, 8, 'Paola Navarro Díaz', 30, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(129, 9, 9, 'Karla Jiménez Morales', 26, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(130, 9, 10, 'Ximena Mendoza León', 21, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(131, 9, 11, 'Regina Sánchez Ortiz', 22, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(132, 9, 12, 'Gabriela Herrera Luna', 34, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(133, 9, 13, 'Melissa Ramírez Castro', 31, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(134, 9, 14, 'Lucía Aguilar Pérez', 20, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(135, 9, 15, 'Natalia Romero García', 27, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(136, 10, 1, 'Renata Flores Martínez', 24, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(137, 10, 2, 'Alejandra Cruz López', 28, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(138, 10, 3, 'Karina Ríos Hernández', 33, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(139, 10, 4, 'Daniela Vega Torres', 22, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(140, 10, 5, 'Fernanda Silva Morales', 27, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(141, 10, 6, 'Valeria Ortiz Ramírez', 25, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(142, 10, 7, 'Mariana León García', 30, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(143, 10, 8, 'Andrea Luna Pérez', 23, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(144, 10, 9, 'Melissa Castro Jiménez', 29, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(145, 10, 10, 'Paola Díaz Romero', 26, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(146, 10, 11, 'Natalia Flores Sánchez', 21, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(147, 10, 12, 'Jimena Herrera Mendoza', 32, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(148, 10, 13, 'Claudia Reyes Navarro', 35, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(149, 10, 14, 'Sofía Torres Aguilar', 20, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(150, 10, 15, 'Evelyn Martínez Ruiz', 31, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41'),
(151, 11, 1, 'Thalia Aguilera González', 28, 'Portera', 1, 'Ella', 1, '2026-11-27 22:59:41'),
(152, 11, 2, 'Olivia Pineda Martínez', 25, 'Defensa', 2, 'Ella', 1, '2026-11-27 22:59:41'),
(153, 11, 3, 'Britani García López', 27, 'Defensa', 3, 'Ella', 1, '2026-11-27 22:59:41'),
(154, 11, 4, 'Mariana Sánchez Cruz', 23, 'Defensa', 4, 'Ella', 1, '2026-11-27 22:59:41'),
(155, 11, 5, 'Fernanda Reyes Flores', 31, 'Defensa', 5, 'Ella', 1, '2026-11-27 22:59:41'),
(156, 11, 6, 'Valeria Torres Mendoza', 24, 'Medio', 6, 'Ella', 1, '2026-11-27 22:59:41'),
(157, 11, 7, 'Karla Jiménez Ruiz', 29, 'Medio', 7, 'Ella', 1, '2026-11-27 22:59:41'),
(158, 11, 8, 'Andrea Ramírez Silva', 22, 'Medio', 8, 'Ella', 1, '2026-11-27 22:59:41'),
(159, 11, 9, 'Daniela Navarro Ortiz', 26, 'Medio', 10, 'Ella', 1, '2026-11-27 22:59:41'),
(160, 11, 10, 'Regina Castillo Vega', 21, 'Delantera', 9, 'Ella', 1, '2026-11-27 22:59:41'),
(161, 11, 11, 'Paola Herrera Díaz', 30, 'Delantera', 11, 'Ella', 1, '2026-11-27 22:59:41'),
(162, 11, 12, 'Ximena Morales León', 20, 'Delantera', 12, 'Ella', 1, '2026-11-27 22:59:41'),
(163, 11, 13, 'Gabriela Flores Ríos', 33, 'Medio', 13, 'Ella', 1, '2026-11-27 22:59:41'),
(164, 11, 14, 'Lucía Pérez Castro', 35, 'Defensa', 14, 'Ella', 1, '2026-11-27 22:59:41'),
(165, 11, 15, 'Natalia Romero Luna', 27, 'Delantera', 15, 'Ella', 1, '2026-11-27 22:59:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidos`
--

DROP TABLE IF EXISTS `partidos`;
CREATE TABLE IF NOT EXISTS `partidos` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `jornada` tinyint UNSIGNED NOT NULL,
  `equipo_local_id` int UNSIGNED NOT NULL,
  `equipo_visitante_id` int UNSIGNED NOT NULL,
  `goles_local` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `goles_visitante` tinyint UNSIGNED NOT NULL DEFAULT '0',
  `fecha_partido` datetime DEFAULT NULL,
  `estatus` enum('PROGRAMADO','FINALIZADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PROGRAMADO',
  PRIMARY KEY (`id`),
  KEY `fk_partido_local` (`equipo_local_id`),
  KEY `fk_partido_visitante` (`equipo_visitante_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `equipo_id` int UNSIGNED DEFAULT NULL,
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('ADMIN','CAPTAIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CAPTAIN',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_correo` (`correo`),
  KEY `fk_usuarios_equipo` (`equipo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `equipo_id`, `nombre`, `correo`, `password_hash`, `rol`, `activo`, `created_at`) VALUES
(1, NULL, 'Coach Nayeli', 'nayeli.coach@mujeresdiversas.mx', '12345678', 'ADMIN', 1, '2026-11-27 22:59:41');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estadisticas_partido`
--
ALTER TABLE `estadisticas_partido`
  ADD CONSTRAINT `fk_stats_jugadora` FOREIGN KEY (`jugadora_id`) REFERENCES `jugadoras` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_stats_partido` FOREIGN KEY (`partido_id`) REFERENCES `partidos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `jugadoras`
--
ALTER TABLE `jugadoras`
  ADD CONSTRAINT `fk_jugadoras_equipo` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD CONSTRAINT `fk_partido_local` FOREIGN KEY (`equipo_local_id`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `fk_partido_visitante` FOREIGN KEY (`equipo_visitante_id`) REFERENCES `equipos` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_equipo` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
