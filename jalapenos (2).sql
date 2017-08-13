-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-08-2017 a las 16:58:21
-- Versión del servidor: 5.6.26
-- Versión de PHP: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `jalapenos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_egresos`
--

CREATE TABLE IF NOT EXISTS `catalogo_egresos` (
  `id_egreso` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `catalogo_egresos`
--

INSERT INTO `catalogo_egresos` (`id_egreso`, `descripcion`, `estado`) VALUES
(1, 'Servicios', 1),
(2, 'Renta', 1),
(3, 'Insumos', 1),
(4, 'Gasolina', 1),
(5, 'Insumos Moto', 1),
(6, 'Pepsi', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_ingresos`
--

CREATE TABLE IF NOT EXISTS `catalogo_ingresos` (
  `id_ingreso` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `costo` varchar(50) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `catalogo_ingresos`
--

INSERT INTO `catalogo_ingresos` (`id_ingreso`, `descripcion`, `costo`, `estado`) VALUES
(1, 'Pizza CH', '55', 1),
(2, 'Pizza M 2x1', '160', 1),
(3, 'Pizza G 2x1', '185', 1),
(4, 'Pizza F 2x1', '210', 1),
(5, 'Pizza + Refresco 2lt', '120', 1),
(6, 'Refresco Lata', '20', 1),
(7, 'Refresco 2lt', '35', 1),
(8, 'Papas S/QUESO', '40', 1),
(9, 'Papas C/Queso', '45', 1),
(10, 'Papas + Refresco', '60', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `egreso`
--

CREATE TABLE IF NOT EXISTS `egreso` (
  `id_egreso` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `total_egreso` varchar(50) NOT NULL,
  `empleado` varchar(50) NOT NULL,
  `user` varchar(50) NOT NULL,
  `fecha_operacion` datetime NOT NULL,
  `sucursal` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `egreso`
--

INSERT INTO `egreso` (`id_egreso`, `descripcion`, `total_egreso`, `empleado`, `user`, `fecha_operacion`, `sucursal`) VALUES
(1, 'Servicios - Luz', '200', 'Daniel Alexis Martinez Sosa', 'dsosa', '2017-08-12 20:34:51', 'J1'),
(2, 'Gasolina', '150', 'Daniel Alexis Martinez Sosa', 'dsosa', '2017-08-12 20:35:53', 'J1'),
(3, 'Gasolina - Cajas', '400', 'Daniel Alexis Martinez Sosa', 'dsosa', '2017-08-12 23:35:56', 'J1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingreso`
--

CREATE TABLE IF NOT EXISTS `ingreso` (
  `id_ingreso` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `total_ingreso` varchar(50) NOT NULL,
  `empleado` varchar(50) NOT NULL,
  `user` varchar(50) NOT NULL,
  `fecha_operacion` datetime NOT NULL,
  `sucursal` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `ingreso`
--

INSERT INTO `ingreso` (`id_ingreso`, `descripcion`, `total_ingreso`, `empleado`, `user`, `fecha_operacion`, `sucursal`) VALUES
(1, 'Pizza CH + Refresco Lata', '75', 'Daniel Alexis Martinez Sosa', 'dsosa', '2017-08-12 19:20:23', 'J1'),
(2, 'Pizza M 2x1', '160', 'Daniel Alexis Martinez Sosa', 'dsosa', '2017-08-12 19:22:34', 'J1'),
(3, 'Pizza M 2x1 + Papas S/QUESO', '200', 'Daniel Alexis Martinez Sosa', 'dsosa', '2017-08-12 20:44:06', 'J1'),
(4, 'Pizza M 2x1 + Papas + Refresco', '220', 'Daniel Alexis Martinez Sosa', 'dsosa', '2017-08-12 23:36:27', 'J1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nomina`
--

CREATE TABLE IF NOT EXISTS `nomina` (
  `id_nomina` int(11) NOT NULL,
  `empleado` varchar(100) NOT NULL,
  `user` varchar(50) NOT NULL,
  `fecha_ini` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `dias_trabajados` varchar(50) NOT NULL,
  `descuentos` varchar(50) NOT NULL,
  `total_sueldo` varchar(100) NOT NULL,
  `sucursal` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `nomina`
--

INSERT INTO `nomina` (`id_nomina`, `empleado`, `user`, `fecha_ini`, `fecha_fin`, `dias_trabajados`, `descuentos`, `total_sueldo`, `sucursal`) VALUES
(1, 'Rodolfo Martinez Hernandez', 'rmartinez', '2017-08-07', '2017-08-13', '7', '0', '1050', 'J2'),
(2, 'Miguel Torres Torres', 'mtorres', '2017-08-07', '2017-08-13', '7', '200', '850', 'J1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones_activas`
--

CREATE TABLE IF NOT EXISTS `sesiones_activas` (
  `id_sesion` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `rol` varchar(100) NOT NULL,
  `hora_ini_sesion` datetime NOT NULL,
  `hora_fin_sesion` datetime NOT NULL,
  `origen` varchar(100) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sesiones_activas`
--

INSERT INTO `sesiones_activas` (`id_sesion`, `username`, `rol`, `hora_ini_sesion`, `hora_fin_sesion`, `origen`, `estado`) VALUES
(1, 'dsosa', 'SU', '2017-08-08 23:12:10', '2017-08-08 23:21:38', 'WEB', 0),
(2, 'dsosa', 'SU', '2017-08-12 12:23:10', '2017-08-12 12:35:52', 'WEB', 0),
(3, 'rmartinez', 'A', '2017-08-12 12:35:59', '2017-08-12 12:36:51', 'WEB', 0),
(4, 'mzarazua', 'E', '2017-08-12 12:37:09', '2017-08-12 12:38:48', 'WEB', 0),
(5, 'dsosa', 'SU', '2017-08-12 12:39:02', '2017-08-12 14:57:09', 'WEB', 0),
(6, 'dsosa', 'SU', '2017-08-12 15:04:56', '2017-08-12 04:12:11', 'WEB', 0),
(7, 'dsosa', 'SU', '2017-08-12 16:12:28', '2017-08-12 16:12:34', 'WEB', 0),
(8, 'dsosa', 'SU', '2017-08-12 17:55:25', '2017-08-12 19:12:27', 'WEB', 0),
(9, 'dsosa', 'SU', '2017-08-12 19:12:33', '2017-08-12 19:20:08', 'WEB', 0),
(10, 'dsosa', 'SU', '2017-08-12 19:20:16', '2017-08-12 20:05:03', 'WEB', 0),
(11, 'dsosa', 'SU', '2017-08-12 20:04:42', '2017-08-12 20:42:24', 'WEB', 0),
(12, 'dsosa', 'SU', '2017-08-12 20:43:42', '2017-08-12 20:44:42', 'WEB', 0),
(13, 'dsosa', 'SU', '2017-08-12 23:29:12', '2017-08-12 23:39:14', 'WEB', 0),
(14, 'mzarazua', 'E', '2017-08-12 23:39:27', '2017-08-12 23:39:42', 'WEB', 0),
(15, 'rmartinez', 'A', '2017-08-12 23:39:49', '2017-08-12 23:42:52', 'WEB', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_user` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apaterno` varchar(50) NOT NULL,
  `amaterno` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `sucursal` varchar(50) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_user`, `nombre`, `apaterno`, `amaterno`, `username`, `password`, `sucursal`, `rol`, `estado`) VALUES
(1, 'Daniel Alexis', 'Martinez', 'Sosa', 'dsosa', 'tekiero12', 'J1', 'SU', 1),
(2, 'Rodolfo', 'Martinez', 'Hernandez', 'rmartinez', '123456', 'J2', 'A', 1),
(3, 'Oscar', 'Martinez ', 'Hernandez', 'omartinez', '123456', 'J1', 'A', 1),
(4, 'Miguel', 'Torres', 'Torres', 'mtorres', '123456', 'J1', 'E', 1),
(5, 'Mayan Irais', 'Zarazua', 'Morales', 'mzarazua', '123456', 'J2', 'E', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `catalogo_egresos`
--
ALTER TABLE `catalogo_egresos`
  ADD PRIMARY KEY (`id_egreso`);

--
-- Indices de la tabla `catalogo_ingresos`
--
ALTER TABLE `catalogo_ingresos`
  ADD PRIMARY KEY (`id_ingreso`);

--
-- Indices de la tabla `egreso`
--
ALTER TABLE `egreso`
  ADD PRIMARY KEY (`id_egreso`);

--
-- Indices de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD PRIMARY KEY (`id_ingreso`);

--
-- Indices de la tabla `nomina`
--
ALTER TABLE `nomina`
  ADD PRIMARY KEY (`id_nomina`);

--
-- Indices de la tabla `sesiones_activas`
--
ALTER TABLE `sesiones_activas`
  ADD PRIMARY KEY (`id_sesion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `catalogo_egresos`
--
ALTER TABLE `catalogo_egresos`
  MODIFY `id_egreso` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `catalogo_ingresos`
--
ALTER TABLE `catalogo_ingresos`
  MODIFY `id_ingreso` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `egreso`
--
ALTER TABLE `egreso`
  MODIFY `id_egreso` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  MODIFY `id_ingreso` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `nomina`
--
ALTER TABLE `nomina`
  MODIFY `id_nomina` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de la tabla `sesiones_activas`
--
ALTER TABLE `sesiones_activas`
  MODIFY `id_sesion` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
