-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-05-2024 a las 06:17:37
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agiles`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carreras`
--

CREATE TABLE `carreras` (
  `id_carrera` int(11) NOT NULL,
  `nombre_carrera` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carreras`
--

INSERT INTO `carreras` (`id_carrera`, `nombre_carrera`) VALUES
(1, 'Software'),
(2, 'Tecnologías De La Información'),
(3, 'Ingeniería Industrial'),
(4, 'Telecomunicaciones'),
(5, 'Robótica y Automatización');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id_estudiante` int(11) NOT NULL,
  `nombre1` varchar(50) NOT NULL,
  `nombre2` varchar(50) DEFAULT NULL,
  `apellido1` varchar(50) NOT NULL,
  `apellido2` varchar(50) DEFAULT NULL,
  `id_carrera` int(11) NOT NULL,
  `fecha_asignacion_tutor` date NOT NULL,
  `tema_tesis` varchar(255) NOT NULL,
  `fecha_aprobacion_tema` date NOT NULL,
  `estado_estudiante` enum('Graduado','En progreso','Retirado') DEFAULT 'En progreso',
  `id_tutor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id_estudiante`, `nombre1`, `nombre2`, `apellido1`, `apellido2`, `id_carrera`, `fecha_asignacion_tutor`, `tema_tesis`, `fecha_aprobacion_tema`, `estado_estudiante`, `id_tutor`) VALUES
(1, 'Estebam', 'Ismael', 'Cifuentes', 'Salinas', 1, '2024-05-24', 'Implementación de Inteligencia Artificial en la Detección Temprana de Enfermedades', '2024-05-24', 'En progreso', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password`, `nombre`, `apellido`, `rol`) VALUES
(2, 'c.ristian-lp@hotmail.com', '$2b$10$a4YHxyaWaI4.5LZ5nMUke.ibj4EqGydgcUZC/Q9x/ifUc2mhhY1ki', 'Cristina', 'Lopez', 'administrador'),
(3, 'cl009189@gmail.com', '$2b$10$4w.dT/GSCaBgxe37wJd16eEZJcgqKKOkaqtOfXzaUXjSo.yZvmZ/2', 'Marthin', 'Pillajo', 'docente'),
(10, 'clopez6341@uta.edu,ec', '$2b$10$uUUQJOvuRNyUhYkTmFN.E.lI2atyFGaaksxz0Epfup9iUUM3quvyK', 'Marcos', 'Montalvo', 'administrador'),
(11, 'clopez6341@uta.edu,ec', '$2b$10$iV3y/mxgQ.U4CVttW0kck.bgfYUSgE2vDAJbwyuc72an5xeD7PJYi', 'Marcos', 'Montalvo', 'administrador');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carreras`
--
ALTER TABLE `carreras`
  ADD PRIMARY KEY (`id_carrera`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id_estudiante`),
  ADD KEY `id_carrera` (`id_carrera`),
  ADD KEY `id_tutor` (`id_tutor`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carreras`
--
ALTER TABLE `carreras`
  MODIFY `id_carrera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id_estudiante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id_carrera`),
  ADD CONSTRAINT `estudiantes_ibfk_2` FOREIGN KEY (`id_tutor`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
