-- Configuración para asegurar la compatibilidad con las inserciones de texto
SET standard_conforming_strings = on;

-- Opcional: Eliminar tablas en orden de dependencia inversa para limpiar la base de datos si ya existen
DROP TABLE IF EXISTS partes_usadas;
DROP TABLE IF EXISTS intervencion;
DROP TABLE IF EXISTS evento_orden;
DROP TABLE IF EXISTS orden_trabajo;
DROP TABLE IF EXISTS mantenimiento_pm;
DROP TABLE IF EXISTS calibracion_qc;
DROP TABLE IF EXISTS equipo;
DROP TABLE IF EXISTS contrato;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS tecnico;
DROP TABLE IF EXISTS fabricante;
DROP TABLE IF EXISTS modalidad;
DROP TABLE IF EXISTS parte;

--
-- TABLA modalidad
--
CREATE TABLE modalidad (
  modalidad_id INTEGER PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  descripcion TEXT
);

INSERT INTO "modalidad" VALUES(1,'XR','Rayos X / DR');
INSERT INTO "modalidad" VALUES(2,'CT','Tomografía (CT)');
INSERT INTO "modalidad" VALUES(3,'MR','Resonancia Magnética (MRI)');
INSERT INTO "modalidad" VALUES(4,'US','Ultrasonido');
INSERT INTO "modalidad" VALUES(5,'MG','Mastografía');
INSERT INTO "modalidad" VALUES(6,'PETCT','PET/CT');
INSERT INTO "modalidad" VALUES(7,'DEXA','Densitometría ósea');
INSERT INTO "modalidad" VALUES(8,'RF','Fluoroscopía');
INSERT INTO "modalidad" VALUES(9,'CATH','Hemodinamia');

--
-- TABLA fabricante
--
CREATE TABLE fabricante (
  fabricante_id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  pais TEXT,
  soporte_tel TEXT,
  web TEXT
);

INSERT INTO "fabricante" VALUES(1,'GE Healthcare','EE.UU.','+1 800-437-1171','gehealthcare.com');
INSERT INTO "fabricante" VALUES(2,'Siemens Healthineers','Alemania','+49 9131 84-0','siemens-healthineers.com');
INSERT INTO "fabricante" VALUES(3,'Philips','Países Bajos','+31 20 597 7777','philips.com/healthcare');
INSERT INTO "fabricante" VALUES(4,'Canon Medical','Japón','+81 3-3817-7600','global.medical.canon');
INSERT INTO "fabricante" VALUES(5,'Fujifilm','Japón','+81 3-6271-3111','fujifilm.com');
INSERT INTO "fabricante" VALUES(6,'Carestream','EE.UU.','+1 888-777-2072','carestream.com');
INSERT INTO "fabricante" VALUES(7,'Hologic','EE.UU.','+1 877-371-4372','hologic.com');
INSERT INTO "fabricante" VALUES(8,'Mindray','China','+86 755 8188 8998','mindray.com');
INSERT INTO "fabricante" VALUES(9,'Esaote','Italia','+39 010 6547 1','esaote.com');

--
-- TABLA cliente
--
CREATE TABLE cliente (
  cliente_id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT,
  direccion TEXT,
  ciudad TEXT,
  estado TEXT,
  pais TEXT,
  contacto TEXT,
  telefono TEXT,
  email TEXT
);

INSERT INTO "cliente" VALUES(1,'Hospital/Clínica Mérida','Hospital','Calle 10 #101','Mérida','Yucatán','México','Ing. BioMed 1','+52 999-400001','biomed1@cliente.mx');
INSERT INTO "cliente" VALUES(2,'Hospital/Clínica Progreso','Hospital','Calle 20 #102','Progreso','Yucatán','México','Ing. BioMed 2','+52 999-400002','biomed2@cliente.mx');
INSERT INTO "cliente" VALUES(3,'Hospital/Clínica Valladolid','Hospital','Calle 30 #103','Valladolid','Yucatán','México','Ing. BioMed 3','+52 999-400003','biomed3@cliente.mx');
INSERT INTO "cliente" VALUES(4,'Hospital/Clínica Campeche','Hospital','Calle 40 #104','Campeche','Campeche','México','Ing. BioMed 4','+52 999-400004','biomed4@cliente.mx');
INSERT INTO "cliente" VALUES(5,'Hospital/Clínica Cancún','Hospital','Calle 50 #105','Cancún','Quintana Roo','México','Ing. BioMed 5','+52 999-400005','biomed5@cliente.mx');
INSERT INTO "cliente" VALUES(6,'Hospital/Clínica Chetumal','Hospital','Calle 60 #106','Chetumal','Quintana Roo','México','Ing. BioMed 6','+52 999-400006','biomed6@cliente.mx');
INSERT INTO "cliente" VALUES(7,'Hospital/Clínica CDMX','Hospital','Calle 70 #107','CDMX','CDMX','México','Ing. BioMed 7','+52 999-400007','biomed7@cliente.mx');
INSERT INTO "cliente" VALUES(8,'Hospital/Clínica Puebla','Hospital','Calle 80 #108','Puebla','Puebla','México','Ing. BioMed 8','+52 999-400008','biomed8@cliente.mx');
INSERT INTO "cliente" VALUES(9,'Hospital/Clínica Veracruz','Hospital','Calle 90 #109','Veracruz','Veracruz','México','Ing. BioMed 9','+52 999-400009','biomed9@cliente.mx');
INSERT INTO "cliente" VALUES(10,'Hospital/Clínica Tuxtla','Hospital','Calle 100 #110','Tuxtla','Chiapas','México','Ing. BioMed 10','+52 999-400010','biomed10@cliente.mx');
INSERT INTO "cliente" VALUES(11,'Hospital/Clínica Monterrey','Hospital','Calle 110 #111','Monterrey','Nuevo León','México','Ing. BioMed 11','+52 999-400011','biomed11@cliente.mx');
INSERT INTO "cliente" VALUES(12,'Hospital/Clínica Guadalajara','Hospital','Calle 120 #112','Guadalajara','Jalisco','México','Ing. BioMed 12','+52 999-400012','biomed12@cliente.mx');

--
-- TABLA contrato
--
CREATE TABLE contrato (
  contrato_id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  tipo TEXT,
  fecha_inicio DATE,
  fecha_fin DATE,
  sla_horas_respuesta INTEGER,
  visitas_pm_anuales INTEGER,
  cobertura TEXT,
  FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id)
);

INSERT INTO "contrato" VALUES(1,11,'T&M','2024-12-18','2026-02-19',24,1,'Piezas+Mano_Obra');
INSERT INTO "contrato" VALUES(2,2,'Full','2024-04-08','2026-09-20',4,1,'Solo_PM');
INSERT INTO "contrato" VALUES(3,1,'T&M','2024-12-18','2026-07-08',24,2,'Piezas+Mano_Obra');
INSERT INTO "contrato" VALUES(4,5,'Full','2024-12-14','2026-06-09',8,1,'Mano_Obra');
INSERT INTO "contrato" VALUES(5,4,'Full','2024-02-13','2026-02-12',12,2,'Piezas+Mano_Obra');
INSERT INTO "contrato" VALUES(6,12,'T&M','2024-08-18','2026-02-13',4,2,'Solo_PM');
INSERT INTO "contrato" VALUES(7,7,'T&M','2024-06-19','2026-04-23',4,1,'Solo_PM');
INSERT INTO "contrato" VALUES(8,10,'Full','2024-05-03','2026-04-28',4,2,'Mano_Obra');

--
-- TABLA equipo
--
CREATE TABLE equipo (
  equipo_id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  modalidad_id INTEGER NOT NULL,
  fabricante_id INTEGER NOT NULL,
  contrato_id INTEGER,
  modelo TEXT,
  numero_serie TEXT UNIQUE,
  asset_tag TEXT,
  fecha_instalacion DATE,
  estado_equipo TEXT,
  ubicacion TEXT,
  software_version TEXT,
  horas_uso INTEGER,
  garantia_hasta DATE,
  FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id),
  FOREIGN KEY (modalidad_id) REFERENCES modalidad(modalidad_id),
  FOREIGN KEY (fabricante_id) REFERENCES fabricante(fabricante_id),
  FOREIGN KEY (contrato_id) REFERENCES contrato(contrato_id)
);

INSERT INTO "equipo" VALUES(1,1,1,4,3,'Radrex','CM-XR-2024-45093','AST-2084','2019-10-23','En_Mantenimiento','Tórax','3.7.6',15535,'2020-10-22');
INSERT INTO "equipo" VALUES(2,5,2,3,4,'Ingenuity CT','P-CT-2024-86484','AST-7543','2020-04-05','Fuera_Servicio','US 3','1.0.1',5508,'2023-04-05');
INSERT INTO "equipo" VALUES(3,3,5,7,NULL,'Selenia Dimensions','H-MG-2024-88104','AST-8668','2022-05-18','Operativo','Sala B','3.8.4',11646,'2023-05-18');
INSERT INTO "equipo" VALUES(4,5,5,7,4,'Selenia Dimensions','H-MG-2018-44522','AST-9201','2024-03-17','Operativo','Trauma','3.8.9',7017,'2025-03-17');
INSERT INTO "equipo" VALUES(5,6,5,3,NULL,'MicroDose','P-MG-2023-74042','AST-1319','2018-06-27','En_Mantenimiento','Tórax','1.3.9',3080,'2019-06-27');
INSERT INTO "equipo" VALUES(6,12,4,8,6,'DC-80 Exp','M-US-2020-96474','AST-8787','2022-03-09','Fuera_Servicio','RM 1','2.3.8',7091,'2025-03-08');
INSERT INTO "equipo" VALUES(7,5,5,7,4,'Selenia Dimensions','H-MG-2025-25860','AST-5061','2019-02-11','Operativo','RM 1','3.3.9',7716,'2020-02-11');
INSERT INTO "equipo" VALUES(8,2,2,1,2,'Revolution ACT','GH-CT-2018-53309','AST-2160','2022-04-09','Fuera_Servicio','US 3','1.8.2',19211,'2025-04-08');
INSERT INTO "equipo" VALUES(9,8,4,4,NULL,'Aplio i700','CM-US-2021-22363','AST-2588','2023-07-12','En_Mantenimiento','Masto 2','2.0.1',2486,'2025-07-11');
INSERT INTO "equipo" VALUES(10,12,1,6,6,'DRX-Evolution Plus','C-XR-2021-34931','AST-9786','2021-03-14','Operativo','Trauma','2.3.1',15020,'2024-03-13');
INSERT INTO "equipo" VALUES(11,2,5,1,2,'Senographe Pristina','GH-MG-2019-40982','AST-3724','2021-08-16','Operativo','Masto 2','1.2.6',570,'2023-08-16');
INSERT INTO "equipo" VALUES(12,5,1,8,4,'MobiEye 700','M-XR-2025-30289','AST-4111','2020-04-02','Fuera_Servicio','CT 1','1.5.0',2143,'2023-04-02');
INSERT INTO "equipo" VALUES(13,8,4,9,NULL,'MyLab X8','E-US-2019-34356','AST-2122','2022-02-22','Operativo','Masto 2','1.9.3',19470,'2025-02-21');
INSERT INTO "equipo" VALUES(14,1,4,2,3,'Acuson S2000','SH-US-2022-36772','AST-6147','2019-05-13','Operativo','Trauma','2.5.1',805,'2021-05-12');
INSERT INTO "equipo" VALUES(15,10,1,2,8,'Ysio Max','SH-XR-2022-27361','AST-6718','2018-04-12','En_Mantenimiento','Urgencias','2.8.4',17832,'2019-04-12');
INSERT INTO "equipo" VALUES(16,11,4,9,1,'MyLab X8','E-US-2020-44664','AST-2891','2018-12-18','Operativo','Trauma','2.9.3',11735,'2019-12-18');
INSERT INTO "equipo" VALUES(17,11,4,5,1,'Arietta 850','F-US-2018-22097','AST-7939','2024-05-02','Operativo','Masto 1','1.4.2',14978,'2027-05-02');
INSERT INTO "equipo" VALUES(18,12,5,7,6,'Selenia Dimensions','H-MG-2019-29536','AST-9938','2018-06-19','Fuera_Servicio','Urgencias','2.2.0',10601,'2020-06-18');
INSERT INTO "equipo" VALUES(19,1,1,6,3,'DRX-Evolution Plus','C-XR-2019-56357','AST-7658','2022-12-05','Operativo','Urgencias','1.6.0',6377,'2025-12-04');
INSERT INTO "equipo" VALUES(20,6,5,7,NULL,'Selenia Dimensions','H-MG-2020-24168','AST-7267','2024-01-28','En_Mantenimiento','Tórax','1.7.5',10500,'2025-01-27');
INSERT INTO "equipo" VALUES(21,4,2,1,5,'Optima CT520','GH-CT-2023-46517','AST-2137','2024-05-12','Fuera_Servicio','CT 1','2.8.5',1404,'2025-05-12');
INSERT INTO "equipo" VALUES(22,5,5,3,4,'MicroDose','P-MG-2018-24208','AST-8119','2020-12-26','En_Mantenimiento','Masto 2','3.8.1',13122,'2023-12-26');
INSERT INTO "equipo" VALUES(23,4,1,5,5,'FDR Smart','F-XR-2018-78146','AST-9821','2023-12-24','Fuera_Servicio','Tórax','2.6.1',11319,'2026-12-23');
INSERT INTO "equipo" VALUES(24,6,3,2,NULL,'Magnetom Sola 1.5T','SH-MR-2024-52753','AST-7592','2023-05-18','Operativo','Tórax','2.6.2',19148,'2025-05-17');
INSERT INTO "equipo" VALUES(25,7,4,9,7,'MyLab X8','E-US-2022-37549','AST-8043','2024-10-20','Fuera_Servicio','Masto 1','2.7.7',7502,'2027-10-20');
INSERT INTO "equipo" VALUES(26,8,1,3,NULL,'DigitalDiagnost','P-XR-2023-22240','AST-4848','2023-05-08','Operativo','Urgencias','1.0.3',16069,'2026-05-07');
INSERT INTO "equipo" VALUES(27,2,1,8,2,'MobiEye 700','M-XR-2024-74799','AST-7547','2019-03-21','Fuera_Servicio','Sala A','1.6.3',6263,'2022-03-20');
INSERT INTO "equipo" VALUES(28,9,4,8,NULL,'DC-80 Exp','M-US-2019-69829','AST-3184','2024-08-22','Fuera_Servicio','CT 1','3.5.7',17040,'2026-08-22');
INSERT INTO "equipo" VALUES(29,9,4,8,NULL,'DC-80 Exp','M-US-2025-43972','AST-5050','2024-11-09','Fuera_Servicio','US 3','3.3.4',14913,'2025-11-09');
INSERT INTO "equipo" VALUES(30,12,1,5,6,'FDR Smart','F-XR-2023-51904','AST-9849','2018-03-05','Operativo','Masto 2','3.2.3',2604,'2020-03-04');
INSERT INTO "equipo" VALUES(31,7,1,6,7,'DRX-Evolution Plus','C-XR-2018-37110','AST-7883','2021-10-23','Operativo','RM 1','2.7.0',12026,'2023-10-23');
INSERT INTO "equipo" VALUES(32,7,5,7,7,'Selenia Dimensions','H-MG-2021-45774','AST-8140','2021-01-13','En_Mantenimiento','Masto 2','3.2.7',4682,'2024-01-13');
INSERT INTO "equipo" VALUES(33,9,4,1,NULL,'Logiq E9','GH-US-2019-94246','AST-8022','2019-08-06','Operativo','Trauma','2.5.3',15399,'2021-08-05');
INSERT INTO "equipo" VALUES(34,6,5,7,NULL,'Selenia Dimensions','H-MG-2022-20735','AST-8705','2018-12-18','Operativo','Masto 1','1.1.0',1516,'2019-12-18');
INSERT INTO "equipo" VALUES(35,4,5,1,5,'Senographe Pristina','GH-MG-2021-26544','AST-8758','2023-02-19','Operativo','US 3','3.4.5',5998,'2026-02-18');
INSERT INTO "equipo" VALUES(36,10,2,2,8,'Somatom Go.Up','SH-CT-2019-85849','AST-1420','2020-10-22','En_Mantenimiento','Masto 2','3.3.1',19901,'2023-10-22');
INSERT INTO "equipo" VALUES(37,11,1,4,1,'Radrex','CM-XR-2019-84177','AST-1672','2020-09-14','Fuera_Servicio','Masto 1','1.8.5',914,'2022-09-14');
INSERT INTO "equipo" VALUES(38,8,4,2,NULL,'Acuson S2000','SH-US-2025-30052','AST-8135','2019-12-17','Fuera_Servicio','Trauma','3.8.7',15732,'2021-12-16');
INSERT INTO "equipo" VALUES(39,12,4,5,6,'Arietta 850','F-US-2019-46559','AST-8385','2019-08-19','Fuera_Servicio','Masto 2','2.0.7',11150,'2020-08-18');
INSERT INTO "equipo" VALUES(40,8,3,4,NULL,'Vantage Elan 1.5T','CM-MR-2023-46655','AST-5526','2022-01-17','Operativo','Sala B','1.6.7',18692,'2023-01-17');
INSERT INTO "equipo" VALUES(41,12,1,8,6,'MobiEye 700','M-XR-2018-22196','AST-5820','2019-07-23','Operativo','Trauma','3.9.5',16007,'2022-07-22');
INSERT INTO "equipo" VALUES(42,9,1,6,NULL,'DRX-Evolution Plus','C-XR-2023-69473','AST-5438','2020-05-08','Operativo','Tórax','2.1.8',6566,'2021-05-08');
INSERT INTO "equipo" VALUES(43,4,1,8,5,'MobiEye 700','M-XR-2019-35443','AST-5853','2019-06-06','En_Mantenimiento','Sala A','3.8.2',9488,'2020-06-05');
INSERT INTO "equipo" VALUES(44,1,4,9,3,'MyLab X8','E-US-2025-23446','AST-1200','2022-05-16','En_Mantenimiento','US 3','2.2.0',8773,'2024-05-15');
INSERT INTO "equipo" VALUES(45,2,4,2,2,'Acuson S2000','SH-US-2019-85631','AST-1878','2019-03-26','Fuera_Servicio','Trauma','1.3.1',18786,'2021-03-25');
INSERT INTO "equipo" VALUES(46,10,4,4,8,'Aplio i700','CM-US-2025-48974','AST-8025','2020-10-20','Operativo','RM 1','3.1.3',7414,'2022-10-20');
INSERT INTO "equipo" VALUES(47,11,2,2,1,'Somatom Go.Up','SH-CT-2020-82350','AST-2229','2019-01-14','En_Mantenimiento','RM 1','2.4.0',8085,'2021-01-13');
INSERT INTO "equipo" VALUES(48,12,4,5,6,'Arietta 850','F-US-2021-44675','AST-4241','2021-02-18','Operativo','Urgencias','2.2.1',2454,'2022-02-18');
INSERT INTO "equipo" VALUES(49,5,4,5,4,'Arietta 850','F-US-2025-49857','AST-7594','2020-09-18','En_Mantenimiento','US 3','1.9.0',14656,'2023-09-18');
INSERT INTO "equipo" VALUES(50,6,1,5,NULL,'FDR Smart','F-XR-2021-98381','AST-1339','2024-11-27','En_Mantenimiento','RM 1','1.2.7',17505,'2027-11-27');
INSERT INTO "equipo" VALUES(51,8,1,5,NULL,'FDR Smart','F-XR-2025-21959','AST-8700','2020-07-11','En_Mantenimiento','Sala B','1.5.6',16735,'2022-07-11');
INSERT INTO "equipo" VALUES(52,11,5,7,1,'Selenia Dimensions','H-MG-2019-51224','AST-5135','2020-02-25','En_Mantenimiento','CT 1','1.8.7',14041,'2021-02-24');
INSERT INTO "equipo" VALUES(53,4,4,9,5,'MyLab X8','E-US-2025-16764','AST-4335','2020-09-05','En_Mantenimiento','US 3','3.7.1',1445,'2023-09-05');
INSERT INTO "equipo" VALUES(54,10,2,4,8,'Aquilion Lightning','CM-CT-2018-82384','AST-7684','2018-04-27','Operativo','US 3','1.2.7',10063,'2021-04-26');
INSERT INTO "equipo" VALUES(55,12,4,5,6,'Arietta 850','F-US-2025-41946','AST-8483','2022-03-13','Operativo','RM 1','3.2.1',9552,'2024-03-12');
INSERT INTO "equipo" VALUES(56,6,4,9,NULL,'MyLab X8','E-US-2022-49132','AST-9022','2024-03-15','Fuera_Servicio','US 3','2.5.8',18307,'2026-03-15');

--
-- TABLA tecnico
--
CREATE TABLE tecnico (
  tecnico_id INTEGER PRIMARY KEY,
  nombre TEXT,
  especialidad TEXT,
  certificaciones TEXT,
  telefono TEXT,
  email TEXT,
  base_ciudad TEXT,
  activo INTEGER
);

INSERT INTO "tecnico" VALUES(1,'Luis Pérez','US','OEM US; Seguridad eléctrica','+52 999-410001','luis.pérez@empresa.mx','Monterrey',1);
INSERT INTO "tecnico" VALUES(2,'Ana Gómez','Multi-mod','OEM Multi-mod; Seguridad eléctrica','+52 999-410002','ana.gómez@empresa.mx','Chetumal',1);
INSERT INTO "tecnico" VALUES(3,'Carlos Ruiz','CT','OEM CT; Seguridad eléctrica','+52 999-410003','carlos.ruiz@empresa.mx','Chetumal',1);
INSERT INTO "tecnico" VALUES(4,'María López','MR','OEM MR; Seguridad eléctrica','+52 999-410004','maría.lópez@empresa.mx','Campeche',1);
INSERT INTO "tecnico" VALUES(5,'Jorge Herrera','PET/CT','OEM PET/CT; Seguridad eléctrica','+52 999-410005','jorge.herrera@empresa.mx','Cancún',1);
INSERT INTO "tecnico" VALUES(6,'Patricia Díaz','PET/CT','OEM PET/CT; Seguridad eléctrica','+52 999-410006','patricia.díaz@empresa.mx','Monterrey',1);
INSERT INTO "tecnico" VALUES(7,'Ricardo Torres','PET/CT','OEM PET/CT; Seguridad eléctrica','+52 999-410007','ricardo.torres@empresa.mx','Progreso',1);
INSERT INTO "tecnico" VALUES(8,'Fernanda Molina','MG','OEM MG; Seguridad eléctrica','+52 999-410008','fernanda.molina@empresa.mx','Monterrey',1);
INSERT INTO "tecnico" VALUES(9,'Héctor Salgado','CT','OEM CT; Seguridad eléctrica','+52 999-410009','héctor.salgado@empresa.mx','Veracruz',1);
INSERT INTO "tecnico" VALUES(10,'Daniela Ramos','PET/CT','OEM PET/CT; Seguridad eléctrica','+52 999-410010','daniela.ramos@empresa.mx','Campeche',1);
INSERT INTO "tecnico" VALUES(11,'Iván Vázquez','CT','OEM CT; Seguridad eléctrica','+52 999-410011','iván.vázquez@empresa.mx','Puebla',1);
INSERT INTO "tecnico" VALUES(12,'Lucía Sánchez','US','OEM US; Seguridad eléctrica','+52 999-410012','lucía.sánchez@empresa.mx','Cancún',1);
INSERT INTO "tecnico" VALUES(13,'Miguel Aguilar','PET/CT','OEM PET/CT; Seguridad eléctrica','+52 999-410013','miguel.aguilar@empresa.mx','Guadalajara',1);
INSERT INTO "tecnico" VALUES(14,'Paola Medina','MG','OEM MG; Seguridad eléctrica','+52 999-410014','paola.medina@empresa.mx','Campeche',1);
INSERT INTO "tecnico" VALUES(15,'Sergio Arias','PET/CT','OEM PET/CT; Seguridad eléctrica','+52 999-410015','sergio.arias@empresa.mx','Chetumal',1);

--
-- TABLA calibracion_qc
--
CREATE TABLE calibracion_qc (
  qc_id INTEGER PRIMARY KEY,
  equipo_id INTEGER NOT NULL,
  fecha DATE,
  tecnico_id INTEGER,
  prueba TEXT,
  valor REAL,
  unidad TEXT,
  resultado TEXT,
  observaciones TEXT,
  FOREIGN KEY (equipo_id) REFERENCES equipo(equipo_id),
  FOREIGN KEY (tecnico_id) REFERENCES tecnico(tecnico_id)
);

INSERT INTO "calibracion_qc" VALUES(1,1,'2025-03-25',9,'kVp salida',66.38,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(2,1,'2025-03-25',9,'Linealidad mAs',0.99,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(3,2,'2025-05-14',3,'CTDIvol fantoma',10.4,'mGy','FUERA_RANGO','Autorizado');
INSERT INTO "calibracion_qc" VALUES(4,2,'2025-05-14',3,'Uniformidad HU',3.64,'HU','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(5,3,'2025-07-07',14,'DQE estimada',0.79,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(6,4,'2025-12-10',13,'DQE estimada',0.7,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(7,5,'2025-09-16',15,'DQE estimada',0.7,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(8,6,'2025-02-15',8,'Resolución axial',0.72,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(9,6,'2025-02-15',8,'Uniformidad',93.53,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(10,7,'2025-01-11',10,'DQE estimada',0.66,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(11,8,'2025-01-26',7,'CTDIvol fantoma',17.06,'mGy','FUERA_RANGO','Autorizado');
INSERT INTO "calibracion_qc" VALUES(12,8,'2025-01-26',7,'Uniformidad HU',2.64,'HU','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(13,9,'2025-06-03',1,'Resolución axial',0.86,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(14,9,'2025-06-03',1,'Uniformidad',92.89,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(15,10,'2025-07-18',13,'kVp salida',76.51,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(16,10,'2025-07-18',13,'Linealidad mAs',1.02,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(17,11,'2025-10-03',2,'DQE estimada',0.67,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(18,12,'2025-06-18',13,'kVp salida',63.98,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(19,12,'2025-06-18',13,'Linealidad mAs',1.0,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(20,13,'2025-08-31',1,'Resolución axial',1.21,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(21,13,'2025-08-31',1,'Uniformidad',98.04,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(22,14,'2025-09-14',10,'Resolución axial',0.83,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(23,14,'2025-09-14',10,'Uniformidad',96.13,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(24,15,'2025-03-15',12,'kVp salida',71.87,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(25,15,'2025-03-15',12,'Linealidad mAs',1.0,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(26,16,'2025-09-19',12,'Resolución axial',0.97,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(27,16,'2025-09-19',12,'Uniformidad',90.17,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(28,17,'2025-06-20',7,'Resolución axial',1.3,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(29,17,'2025-06-20',7,'Uniformidad',97.25,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(30,18,'2025-12-19',10,'DQE estimada',0.65,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(31,19,'2025-11-28',10,'kVp salida',74.43,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(32,19,'2025-11-28',10,'Linealidad mAs',1.02,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(33,20,'2025-03-22',12,'DQE estimada',0.63,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(34,21,'2025-11-06',10,'CTDIvol fantoma',11.53,'mGy','FUERA_RANGO','Autorizado');
INSERT INTO "calibracion_qc" VALUES(35,21,'2025-11-06',10,'Uniformidad HU',-1.86,'HU','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(36,22,'2025-03-19',4,'DQE estimada',0.7,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(37,23,'2025-10-21',12,'kVp salida',74.12,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(38,23,'2025-10-21',12,'Linealidad mAs',1.0,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(39,24,'2025-09-16',8,'SNR fantoma',31.28,'dB','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(40,25,'2025-03-17',6,'Resolución axial',1.18,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(41,25,'2025-03-17',6,'Uniformidad',98.68,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(42,26,'2025-11-26',5,'kVp salida',63.85,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(43,26,'2025-11-26',5,'Linealidad mAs',0.95,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(44,27,'2025-09-09',5,'kVp salida',74.1,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(45,27,'2025-09-09',5,'Linealidad mAs',1.04,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(46,28,'2025-08-12',6,'Resolución axial',0.79,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(47,28,'2025-08-12',6,'Uniformidad',95.73,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(48,29,'2025-09-14',14,'Resolución axial',1.45,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(49,29,'2025-09-14',14,'Uniformidad',98.05,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(50,30,'2025-05-02',12,'kVp salida',66.93,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(51,30,'2025-05-02',12,'Linealidad mAs',0.99,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(52,31,'2025-05-25',4,'kVp salida',76.56,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(53,31,'2025-05-25',4,'Linealidad mAs',0.95,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(54,32,'2025-09-23',3,'DQE estimada',0.72,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(55,33,'2025-10-07',1,'Resolución axial',1.14,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(56,33,'2025-10-07',1,'Uniformidad',90.52,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(57,34,'2025-07-16',8,'DQE estimada',0.74,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(58,35,'2025-03-03',15,'DQE estimada',0.68,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(59,36,'2025-08-21',4,'CTDIvol fantoma',12.57,'mGy','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(60,36,'2025-08-21',4,'Uniformidad HU',4.08,'HU','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(61,37,'2025-02-23',4,'kVp salida',78.26,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(62,37,'2025-02-23',4,'Linealidad mAs',0.94,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(63,38,'2025-03-03',13,'Resolución axial',0.69,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(64,38,'2025-03-03',13,'Uniformidad',97.49,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(65,39,'2025-04-30',5,'Resolución axial',1.43,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(66,39,'2025-04-30',5,'Uniformidad',93.35,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(67,40,'2025-08-23',9,'SNR fantoma',42.79,'dB','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(68,41,'2025-03-30',8,'kVp salida',63.86,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(69,41,'2025-03-30',8,'Linealidad mAs',0.92,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(70,42,'2025-03-25',11,'kVp salida',74.37,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(71,42,'2025-03-25',11,'Linealidad mAs',0.9,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(72,43,'2025-06-26',10,'kVp salida',63.51,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(73,43,'2025-06-26',10,'Linealidad mAs',1.07,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(74,44,'2025-07-28',9,'Resolución axial',0.59,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(75,44,'2025-07-28',9,'Uniformidad',96.69,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(76,45,'2025-03-06',6,'Resolución axial',0.51,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(77,45,'2025-03-06',6,'Uniformidad',93.84,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(78,46,'2025-08-25',6,'Resolución axial',1.08,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(79,46,'2025-08-25',6,'Uniformidad',95.73,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(80,47,'2025-05-21',12,'CTDIvol fantoma',10.5,'mGy','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(81,47,'2025-05-21',12,'Uniformidad HU',-0.35,'HU','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(82,48,'2025-03-18',9,'Resolución axial',1.19,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(83,48,'2025-03-18',9,'Uniformidad',96.39,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(84,49,'2025-05-14',4,'Resolución axial',1.46,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(85,49,'2025-05-14',4,'Uniformidad',94.78,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(86,50,'2025-08-26',6,'kVp salida',74.04,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(87,50,'2025-08-26',6,'Linealidad mAs',1.08,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(88,51,'2025-10-01',14,'kVp salida',75.24,'kVp','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(89,51,'2025-10-01',14,'Linealidad mAs',1.04,'ratio','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(90,52,'2025-10-26',9,'DQE estimada',0.71,'','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(91,53,'2025-06-05',2,'Resolución axial',1.33,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(92,53,'2025-06-05',2,'Uniformidad',99.03,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(93,54,'2025-04-21',3,'CTDIvol fantoma',12.62,'mGy','FUERA_RANGO','Autorizado');
INSERT INTO "calibracion_qc" VALUES(94,54,'2025-04-21',3,'Uniformidad HU',-3.84,'HU','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(95,55,'2025-04-25',8,'Resolución axial',1.4,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(96,55,'2025-04-25',8,'Uniformidad',94.45,'%','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(97,56,'2025-01-14',9,'Resolución axial',0.96,'mm','OK','Autorizado');
INSERT INTO "calibracion_qc" VALUES(98,56,'2025-01-14',9,'Uniformidad',90.58,'%','OK','Autorizado');

--
-- TABLA orden_trabajo
--
CREATE TABLE orden_trabajo (
  orden_id INTEGER PRIMARY KEY,
  equipo_id INTEGER NOT NULL,
  cliente_id INTEGER NOT NULL,
  contrato_id INTEGER,
  fecha_apertura TIMESTAMP WITH TIME ZONE, -- Se usa TIMESTAMP WITH TIME ZONE para PostgreSQL
  prioridad TEXT,
  estado TEXT,
  falla_reportada TEXT,
  origen TEXT,
  FOREIGN KEY (equipo_id) REFERENCES equipo(equipo_id),
  FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id),
  FOREIGN KEY (contrato_id) REFERENCES contrato(contrato_id)
);

INSERT INTO "orden_trabajo" VALUES(1,30,12,6,'2024-06-28 10:15:00','Crítica','Abierta','Dosis fuera de rango','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(2,3,3,NULL,'2024-06-24 14:45:00','Crítica','Cerrada','Dosis fuera de rango','Portal');
INSERT INTO "orden_trabajo" VALUES(3,32,7,7,'2024-01-05 15:30:00','Baja','Cerrada','Falla en colimador','Llamada');
INSERT INTO "orden_trabajo" VALUES(4,34,6,NULL,'2024-08-01 18:15:00','Crítica','Cerrada','Ruido excesivo','Llamada');
INSERT INTO "orden_trabajo" VALUES(5,31,7,7,'2024-05-11 16:45:00','Baja','Cerrada','No detecta panel DR','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(6,21,4,5,'2024-11-23 14:00:00','Baja','Abierta','No detecta panel DR','PM');
INSERT INTO "orden_trabajo" VALUES(7,15,10,8,'2024-12-03 13:00:00','Baja','En Proceso','Autotest fallido','PM');
INSERT INTO "orden_trabajo" VALUES(8,2,5,4,'2024-01-11 07:30:00','Alta','En Proceso','Ruido excesivo','Portal');
INSERT INTO "orden_trabajo" VALUES(9,34,6,NULL,'2024-07-19 17:15:00','Media','Abierta','Transductor dañado','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(10,40,8,NULL,'2024-11-08 14:15:00','Media','En Proceso','Sobrecalentamiento','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(11,17,11,1,'2024-11-01 14:30:00','Media','Abierta','Tiempos de exposición erráticos','PM');
INSERT INTO "orden_trabajo" VALUES(12,41,12,6,'2024-07-23 11:45:00','Alta','Abierta','Baja resolución','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(13,7,5,4,'2024-04-13 16:30:00','Alta','Cerrada','Sobrecalentamiento','Llamada');
INSERT INTO "orden_trabajo" VALUES(14,54,10,8,'2024-11-13 11:00:00','Baja','Cerrada','Autotest fallido','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(15,54,10,8,'2024-05-25 10:30:00','Media','En Espera','Transductor dañado','PM');
INSERT INTO "orden_trabajo" VALUES(16,44,1,3,'2024-12-25 17:15:00','Baja','Cerrada','No detecta panel DR','Llamada');
INSERT INTO "orden_trabajo" VALUES(17,20,6,NULL,'2024-08-02 16:30:00','Media','Abierta','Sobrecalentamiento','PM');
INSERT INTO "orden_trabajo" VALUES(18,48,12,6,'2024-07-06 10:15:00','Alta','En Espera','Sobrecalentamiento','Portal');
INSERT INTO "orden_trabajo" VALUES(19,17,11,1,'2024-08-26 11:30:00','Baja','En Proceso','Imagen con artefactos','Portal');
INSERT INTO "orden_trabajo" VALUES(20,49,5,4,'2024-04-28 17:45:00','Alta','Abierta','Baja resolución','Llamada');
INSERT INTO "orden_trabajo" VALUES(21,17,11,1,'2024-09-04 14:30:00','Alta','En Espera','No detecta panel DR','PM');
INSERT INTO "orden_trabajo" VALUES(22,7,5,4,'2024-11-08 14:00:00','Alta','Cerrada','Error de comunicación','Llamada');
INSERT INTO "orden_trabajo" VALUES(23,41,12,6,'2024-08-23 11:45:00','Baja','Abierta','No enciende','PM');
INSERT INTO "orden_trabajo" VALUES(24,32,7,7,'2024-02-04 10:15:00','Crítica','En Proceso','No detecta panel DR','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(25,38,8,NULL,'2024-12-24 09:45:00','Baja','Cerrada','Transductor dañado','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(26,18,12,6,'2024-01-23 12:15:00','Crítica','En Proceso','Error de comunicación','PM');
INSERT INTO "orden_trabajo" VALUES(27,7,5,4,'2024-11-12 15:30:00','Baja','En Proceso','Error de comunicación','Llamada');
INSERT INTO "orden_trabajo" VALUES(28,55,12,6,'2024-08-03 17:15:00','Baja','Abierta','Tiempos de exposición erráticos','Portal');
INSERT INTO "orden_trabajo" VALUES(29,9,8,NULL,'2024-10-07 08:15:00','Media','Cerrada','Error de comunicación','PM');
INSERT INTO "orden_trabajo" VALUES(30,50,6,NULL,'2024-03-26 16:00:00','Alta','Cerrada','Ruido excesivo','Portal');
INSERT INTO "orden_trabajo" VALUES(31,35,4,5,'2024-05-26 09:00:00','Baja','Abierta','Tiempos de exposición erráticos','Portal');
INSERT INTO "orden_trabajo" VALUES(32,38,8,NULL,'2024-06-01 09:30:00','Baja','Abierta','Baja resolución','Llamada');
INSERT INTO "orden_trabajo" VALUES(33,48,12,6,'2024-02-16 14:30:00','Baja','En Proceso','Error de comunicación','Llamada');
INSERT INTO "orden_trabajo" VALUES(34,47,11,1,'2024-11-17 11:45:00','Baja','Abierta','Falla en colimador','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(35,28,9,NULL,'2024-11-04 14:45:00','Baja','Cerrada','Tiempos de exposición erráticos','Portal');
INSERT INTO "orden_trabajo" VALUES(36,5,6,NULL,'2024-03-09 16:30:00','Crítica','Cerrada','Error de bobina','PM');
INSERT INTO "orden_trabajo" VALUES(37,30,12,6,'2024-09-20 13:00:00','Baja','Cerrada','No detecta panel DR','Portal');
INSERT INTO "orden_trabajo" VALUES(38,28,9,NULL,'2024-08-08 13:30:00','Crítica','En Proceso','Autotest fallido','Llamada');
INSERT INTO "orden_trabajo" VALUES(39,21,4,5,'2024-07-11 17:30:00','Alta','Cerrada','No detecta panel DR','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(40,5,6,NULL,'2024-02-27 08:00:00','Crítica','Abierta','Autotest fallido','PM');
INSERT INTO "orden_trabajo" VALUES(41,52,11,1,'2024-03-18 07:30:00','Baja','En Proceso','No detecta panel DR','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(42,56,6,NULL,'2024-12-02 11:30:00','Alta','Abierta','Error de bobina','Portal');
INSERT INTO "orden_trabajo" VALUES(43,10,12,6,'2024-11-16 10:00:00','Alta','Cerrada','Tiempos de exposición erráticos','Llamada');
INSERT INTO "orden_trabajo" VALUES(44,49,5,4,'2024-05-19 10:45:00','Baja','En Espera','No detecta panel DR','PM');
INSERT INTO "orden_trabajo" VALUES(45,2,5,4,'2024-03-09 18:30:00','Alta','En Proceso','Ruido excesivo','Portal');
INSERT INTO "orden_trabajo" VALUES(46,37,11,1,'2024-11-13 08:15:00','Baja','Abierta','Error de bobina','Portal');
INSERT INTO "orden_trabajo" VALUES(47,25,7,7,'2024-07-15 12:15:00','Alta','En Proceso','Tiempos de exposición erráticos','Llamada');
INSERT INTO "orden_trabajo" VALUES(48,4,5,4,'2024-03-06 16:00:00','Baja','En Proceso','No detecta panel DR','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(49,32,7,7,'2024-10-15 13:30:00','Media','Cerrada','Imagen con artefactos','PM');
INSERT INTO "orden_trabajo" VALUES(50,28,9,NULL,'2024-02-10 17:45:00','Alta','Abierta','Baja resolución','Llamada');
INSERT INTO "orden_trabajo" VALUES(51,1,1,3,'2024-04-10 10:15:00','Alta','En Proceso','Imagen con artefactos','Llamada');
INSERT INTO "orden_trabajo" VALUES(52,32,7,7,'2024-12-14 09:15:00','Crítica','En Espera','Error de comunicación','PM');
INSERT INTO "orden_trabajo" VALUES(53,5,6,NULL,'2024-07-28 18:00:00','Crítica','Abierta','Imagen con artefactos','PM');
INSERT INTO "orden_trabajo" VALUES(54,37,11,1,'2024-07-19 13:45:00','Alta','Abierta','No enciende','PM');
INSERT INTO "orden_trabajo" VALUES(55,11,2,2,'2024-10-15 18:30:00','Baja','En Proceso','Imagen con artefactos','Portal');
INSERT INTO "orden_trabajo" VALUES(56,28,9,NULL,'2024-10-13 15:00:00','Crítica','Cerrada','Autotest fallido','PM');
INSERT INTO "orden_trabajo" VALUES(57,15,10,8,'2024-06-25 09:00:00','Baja','En Espera','Error de comunicación','PM');
INSERT INTO "orden_trabajo" VALUES(58,23,4,5,'2024-12-27 17:15:00','Media','Abierta','Sobrecalentamiento','Portal');
INSERT INTO "orden_trabajo" VALUES(59,12,5,4,'2024-10-05 17:00:00','Media','Cerrada','No detecta panel DR','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(60,30,12,6,'2024-10-25 16:45:00','Alta','Cerrada','No detecta panel DR','PM');
INSERT INTO "orden_trabajo" VALUES(61,10,12,6,'2024-08-03 14:45:00','Alta','Cerrada','Transductor dañado','Llamada');
INSERT INTO "orden_trabajo" VALUES(62,23,4,5,'2024-09-03 11:45:00','Crítica','Abierta','Tiempos de exposición erráticos','PM');
INSERT INTO "orden_trabajo" VALUES(63,5,6,NULL,'2024-11-28 08:45:00','Crítica','En Espera','Dosis fuera de rango','Llamada');
INSERT INTO "orden_trabajo" VALUES(64,29,9,NULL,'2024-10-21 10:30:00','Crítica','En Espera','No enciende','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(65,7,5,4,'2024-06-23 08:15:00','Baja','Abierta','Falla en colimador','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(66,34,6,NULL,'2024-09-20 09:30:00','Alta','Cerrada','Baja resolución','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(67,50,6,NULL,'2024-06-22 16:00:00','Alta','Abierta','Imagen con artefactos','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(68,19,1,3,'2024-05-24 17:15:00','Alta','Abierta','No detecta panel DR','Portal');
INSERT INTO "orden_trabajo" VALUES(69,23,4,5,'2024-05-21 18:45:00','Media','En Espera','Imagen con artefactos','PM');
INSERT INTO "orden_trabajo" VALUES(70,36,10,8,'2024-07-21 12:15:00','Baja','En Espera','Baja resolución','PM');
INSERT INTO "orden_trabajo" VALUES(71,2,5,4,'2024-06-10 09:15:00','Alta','Cerrada','Falla en colimador','Portal');
INSERT INTO "orden_trabajo" VALUES(72,15,10,8,'2024-03-05 08:30:00','Baja','En Espera','Error de bobina','Llamada');
INSERT INTO "orden_trabajo" VALUES(73,43,4,5,'2024-06-25 16:15:00','Crítica','Abierta','Ruido excesivo','Portal');
INSERT INTO "orden_trabajo" VALUES(74,47,11,1,'2024-08-02 13:30:00','Media','Cerrada','Transductor dañado','PM');
INSERT INTO "orden_trabajo" VALUES(75,49,5,4,'2024-12-26 14:15:00','Media','En Proceso','Dosis fuera de rango','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(76,54,10,8,'2024-04-12 17:45:00','Crítica','Cerrada','Dosis fuera de rango','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(77,33,9,NULL,'2024-09-14 09:15:00','Media','Cerrada','No enciende','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(78,56,6,NULL,'2024-06-18 08:00:00','Alta','Abierta','Ruido excesivo','PM');
INSERT INTO "orden_trabajo" VALUES(79,29,9,NULL,'2024-09-05 13:00:00','Media','Cerrada','Tiempos de exposición erráticos','Llamada');
INSERT INTO "orden_trabajo" VALUES(80,27,2,2,'2024-01-13 15:30:00','Media','En Proceso','Imagen con artefactos','PM');
INSERT INTO "orden_trabajo" VALUES(81,15,10,8,'2024-01-11 08:30:00','Media','Abierta','Sobrecalentamiento','Alarma Remota');
INSERT INTO "orden_trabajo" VALUES(82,45,2,2,'2024-03-25 18:45:00','Crítica','En Espera','Imagen con artefactos','Llamada');
INSERT INTO "orden_trabajo" VALUES(83,17,11,1,'2024-04-27 09:45:00','Baja','Cerrada','Error de comunicación','PM');
INSERT INTO "orden_trabajo" VALUES(84,8,2,2,'2024-01-08 13:45:00','Baja','Abierta','Falla en colimador','Llamada');
INSERT INTO "orden_trabajo" VALUES(85,41,12,6,'2024-09-19 10:15:00','Alta','En Proceso','Transductor dañado','PM');
INSERT INTO "orden_trabajo" VALUES(86,16,11,1,'2024-10-14 09:00:00','Alta','Abierta','Error de bobina','Llamada');
INSERT INTO "orden_trabajo" VALUES(87,25,7,7,'2024-08-02 17:45:00','Alta','En Proceso','No enciende','PM');
INSERT INTO "orden_trabajo" VALUES(88,51,8,NULL,'2024-02-12 10:00:00','Alta','Abierta','Tiempos de exposición erráticos','PM');
INSERT INTO "orden_trabajo" VALUES(89,53,4,5,'2024-11-06 17:45:00','Crítica','En Espera','Dosis fuera de rango','Portal');
INSERT INTO "orden_trabajo" VALUES(90,5,6,NULL,'2024-12-25 14:00:00','Alta','Abierta','Dosis fuera de rango','Portal');

--
-- TABLA evento_orden
--
CREATE TABLE evento_orden (
  evento_id INTEGER PRIMARY KEY,
  orden_id INTEGER NOT NULL,
  fecha_hora TIMESTAMP WITH TIME ZONE, -- Se usa TIMESTAMP WITH TIME ZONE para PostgreSQL
  estado TEXT,
  nota TEXT,
  FOREIGN KEY (orden_id) REFERENCES orden_trabajo(orden_id)
);

INSERT INTO "evento_orden" VALUES(1,1,'2024-06-28 10:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(2,1,'2024-06-28 12:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(3,1,'2024-06-28 16:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(4,2,'2024-06-24 14:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(5,2,'2024-06-24 16:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(6,2,'2024-06-24 20:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(7,2,'2024-06-25 00:45:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(8,3,'2024-01-05 15:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(9,3,'2024-01-05 17:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(10,3,'2024-01-05 21:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(11,3,'2024-01-06 01:30:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(12,4,'2024-08-01 18:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(13,4,'2024-08-01 20:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(14,4,'2024-08-02 00:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(15,4,'2024-08-02 04:15:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(16,5,'2024-05-11 16:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(17,5,'2024-05-11 18:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(18,5,'2024-05-11 22:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(19,5,'2024-05-12 02:45:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(20,6,'2024-11-23 14:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(21,6,'2024-11-23 16:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(22,6,'2024-11-23 20:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(23,7,'2024-12-03 13:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(24,7,'2024-12-03 15:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(25,7,'2024-12-03 19:00:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(26,8,'2024-01-11 07:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(27,8,'2024-01-11 09:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(28,8,'2024-01-11 13:30:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(29,9,'2024-07-19 17:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(30,9,'2024-07-19 19:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(31,9,'2024-07-19 23:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(32,10,'2024-11-08 14:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(33,10,'2024-11-08 16:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(34,10,'2024-11-08 20:15:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(35,11,'2024-11-01 14:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(36,11,'2024-11-01 16:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(37,11,'2024-11-01 20:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(38,12,'2024-07-23 11:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(39,12,'2024-07-23 13:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(40,12,'2024-07-23 17:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(41,13,'2024-04-13 16:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(42,13,'2024-04-13 18:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(43,13,'2024-04-13 22:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(44,13,'2024-04-14 02:30:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(45,14,'2024-11-13 11:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(46,14,'2024-11-13 13:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(47,14,'2024-11-13 17:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(48,14,'2024-11-13 21:00:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(49,15,'2024-05-25 10:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(50,15,'2024-05-25 12:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(51,15,'2024-05-25 16:30:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(52,16,'2024-12-25 17:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(53,16,'2024-12-25 19:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(54,16,'2024-12-25 23:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(55,16,'2024-12-26 03:15:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(56,17,'2024-08-02 16:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(57,17,'2024-08-02 18:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(58,17,'2024-08-02 22:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(59,18,'2024-07-06 10:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(60,18,'2024-07-06 12:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(61,18,'2024-07-06 16:15:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(62,19,'2024-08-26 11:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(63,19,'2024-08-26 13:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(64,19,'2024-08-26 17:30:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(65,20,'2024-04-28 17:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(66,20,'2024-04-28 19:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(67,20,'2024-04-28 23:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(68,21,'2024-09-04 14:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(69,21,'2024-09-04 16:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(70,21,'2024-09-04 20:30:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(71,22,'2024-11-08 14:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(72,22,'2024-11-08 16:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(73,22,'2024-11-08 20:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(74,22,'2024-11-09 00:00:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(75,23,'2024-08-23 11:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(76,23,'2024-08-23 13:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(77,23,'2024-08-23 17:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(78,24,'2024-02-04 10:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(79,24,'2024-02-04 12:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(80,24,'2024-02-04 16:15:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(81,25,'2024-12-24 09:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(82,25,'2024-12-24 11:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(83,25,'2024-12-24 15:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(84,25,'2024-12-24 19:45:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(85,26,'2024-01-23 12:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(86,26,'2024-01-23 14:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(87,26,'2024-01-23 18:15:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(88,27,'2024-11-12 15:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(89,27,'2024-11-12 17:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(90,27,'2024-11-12 21:30:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(91,28,'2024-08-03 17:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(92,28,'2024-08-03 19:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(93,28,'2024-08-03 23:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(94,29,'2024-10-07 08:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(95,29,'2024-10-07 10:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(96,29,'2024-10-07 14:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(97,29,'2024-10-07 18:15:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(98,30,'2024-03-26 16:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(99,30,'2024-03-26 18:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(100,30,'2024-03-26 22:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(101,30,'2024-03-27 02:00:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(102,31,'2024-05-26 09:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(103,31,'2024-05-26 11:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(104,31,'2024-05-26 15:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(105,32,'2024-06-01 09:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(106,32,'2024-06-01 11:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(107,32,'2024-06-01 15:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(108,33,'2024-02-16 14:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(109,33,'2024-02-16 16:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(110,33,'2024-02-16 20:30:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(111,34,'2024-11-17 11:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(112,34,'2024-11-17 13:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(113,34,'2024-11-17 17:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(114,35,'2024-11-04 14:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(115,35,'2024-11-04 16:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(116,35,'2024-11-04 20:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(117,35,'2024-11-05 00:45:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(118,36,'2024-03-09 16:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(119,36,'2024-03-09 18:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(120,36,'2024-03-09 22:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(121,36,'2024-03-10 02:30:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(122,37,'2024-09-20 13:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(123,37,'2024-09-20 15:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(124,37,'2024-09-20 19:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(125,37,'2024-09-20 23:00:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(126,38,'2024-08-08 13:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(127,38,'2024-08-08 15:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(128,38,'2024-08-08 19:30:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(129,39,'2024-07-11 17:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(130,39,'2024-07-11 19:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(131,39,'2024-07-11 23:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(132,39,'2024-07-12 03:30:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(133,40,'2024-02-27 08:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(134,40,'2024-02-27 10:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(135,40,'2024-02-27 14:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(136,41,'2024-03-18 07:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(137,41,'2024-03-18 09:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(138,41,'2024-03-18 13:30:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(139,42,'2024-12-02 11:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(140,42,'2024-12-02 13:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(141,42,'2024-12-02 17:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(142,43,'2024-11-16 10:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(143,43,'2024-11-16 12:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(144,43,'2024-11-16 16:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(145,43,'2024-11-16 20:00:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(146,44,'2024-05-19 10:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(147,44,'2024-05-19 12:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(148,44,'2024-05-19 16:45:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(149,45,'2024-03-09 18:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(150,45,'2024-03-09 20:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(151,45,'2024-03-10 00:30:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(152,46,'2024-11-13 08:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(153,46,'2024-11-13 10:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(154,46,'2024-11-13 14:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(155,47,'2024-07-15 12:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(156,47,'2024-07-15 14:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(157,47,'2024-07-15 18:15:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(158,48,'2024-03-06 16:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(159,48,'2024-03-06 18:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(160,48,'2024-03-06 22:00:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(161,49,'2024-10-15 13:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(162,49,'2024-10-15 15:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(163,49,'2024-10-15 19:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(164,49,'2024-10-15 23:30:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(165,50,'2024-02-10 17:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(166,50,'2024-02-10 19:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(167,50,'2024-02-10 23:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(168,51,'2024-04-10 10:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(169,51,'2024-04-10 12:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(170,51,'2024-04-10 16:15:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(171,52,'2024-12-14 09:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(172,52,'2024-12-14 11:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(173,52,'2024-12-14 15:15:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(174,53,'2024-07-28 18:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(175,53,'2024-07-28 20:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(176,53,'2024-07-29 00:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(177,54,'2024-07-19 13:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(178,54,'2024-07-19 15:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(179,54,'2024-07-19 19:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(180,55,'2024-10-15 18:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(181,55,'2024-10-15 20:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(182,55,'2024-10-16 00:30:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(183,56,'2024-10-13 15:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(184,56,'2024-10-13 17:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(185,56,'2024-10-13 21:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(186,56,'2024-10-14 01:00:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(187,57,'2024-06-25 09:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(188,57,'2024-06-25 11:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(189,57,'2024-06-25 15:00:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(190,58,'2024-12-27 17:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(191,58,'2024-12-27 19:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(192,58,'2024-12-27 23:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(193,59,'2024-10-05 17:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(194,59,'2024-10-05 19:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(195,59,'2024-10-05 23:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(196,59,'2024-10-06 03:00:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(197,60,'2024-10-25 16:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(198,60,'2024-10-25 18:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(199,60,'2024-10-25 22:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(200,60,'2024-10-26 02:45:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(201,61,'2024-08-03 14:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(202,61,'2024-08-03 16:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(203,61,'2024-08-03 20:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(204,61,'2024-08-04 00:45:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(205,62,'2024-09-03 11:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(206,62,'2024-09-03 13:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(207,62,'2024-09-03 17:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(208,63,'2024-11-28 08:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(209,63,'2024-11-28 10:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(210,63,'2024-11-28 14:45:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(211,64,'2024-10-21 10:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(212,64,'2024-10-21 12:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(213,64,'2024-10-21 16:30:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(214,65,'2024-06-23 08:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(215,65,'2024-06-23 10:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(216,65,'2024-06-23 14:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(217,66,'2024-09-20 09:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(218,66,'2024-09-20 11:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(219,66,'2024-09-20 15:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(220,66,'2024-09-20 19:30:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(221,67,'2024-06-22 16:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(222,67,'2024-06-22 18:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(223,67,'2024-06-22 22:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(224,68,'2024-05-24 17:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(225,68,'2024-05-24 19:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(226,68,'2024-05-24 23:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(227,69,'2024-05-21 18:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(228,69,'2024-05-21 20:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(229,69,'2024-05-22 00:45:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(230,70,'2024-07-21 12:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(231,70,'2024-07-21 14:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(232,70,'2024-07-21 18:15:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(233,71,'2024-06-10 09:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(234,71,'2024-06-10 11:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(235,71,'2024-06-10 15:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(236,71,'2024-06-10 19:15:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(237,72,'2024-03-05 08:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(238,72,'2024-03-05 10:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(239,72,'2024-03-05 14:30:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(240,73,'2024-06-25 16:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(241,73,'2024-06-25 18:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(242,73,'2024-06-25 22:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(243,74,'2024-08-02 13:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(244,74,'2024-08-02 15:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(245,74,'2024-08-02 19:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(246,74,'2024-08-02 23:30:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(247,75,'2024-12-26 14:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(248,75,'2024-12-26 16:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(249,75,'2024-12-26 20:15:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(250,76,'2024-04-12 17:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(251,76,'2024-04-12 19:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(252,76,'2024-04-12 23:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(253,76,'2024-04-13 03:45:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(254,77,'2024-09-14 09:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(255,77,'2024-09-14 11:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(256,77,'2024-09-14 15:15:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(257,77,'2024-09-14 19:15:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(258,78,'2024-06-18 08:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(259,78,'2024-06-18 10:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(260,78,'2024-06-18 14:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(261,79,'2024-09-05 13:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(262,79,'2024-09-05 15:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(263,79,'2024-09-05 19:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(264,79,'2024-09-05 23:00:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(265,80,'2024-01-13 15:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(266,80,'2024-01-13 17:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(267,80,'2024-01-13 21:30:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(268,81,'2024-01-11 08:30:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(269,81,'2024-01-11 10:30:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(270,81,'2024-01-11 14:30:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(271,82,'2024-03-25 18:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(272,82,'2024-03-25 20:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(273,82,'2024-03-26 00:45:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(274,83,'2024-04-27 09:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(275,83,'2024-04-27 11:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(276,83,'2024-04-27 15:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(277,83,'2024-04-27 19:45:00','Cerrada','Orden cerrada');
INSERT INTO "evento_orden" VALUES(278,84,'2024-01-08 13:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(279,84,'2024-01-08 15:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(280,84,'2024-01-08 19:45:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(281,85,'2024-09-19 10:15:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(282,85,'2024-09-19 12:15:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(283,85,'2024-09-19 16:15:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(284,86,'2024-10-14 09:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(285,86,'2024-10-14 11:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(286,86,'2024-10-14 15:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(287,87,'2024-08-02 17:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(288,87,'2024-08-02 19:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(289,87,'2024-08-02 23:45:00','En Proceso','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(290,88,'2024-02-12 10:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(291,88,'2024-02-12 12:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(292,88,'2024-02-12 16:00:00','En Proceso','Diagnóstico realizado');
INSERT INTO "evento_orden" VALUES(293,89,'2024-11-06 17:45:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(294,89,'2024-11-06 19:45:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(295,89,'2024-11-06 23:45:00','En Espera','En sitio / esperando refacción');
INSERT INTO "evento_orden" VALUES(296,90,'2024-12-25 14:00:00','Abierta','Ticket creado');
INSERT INTO "evento_orden" VALUES(297,90,'2024-12-25 16:00:00','Asignada','Técnico asignado');
INSERT INTO "evento_orden" VALUES(298,90,'2024-12-25 20:00:00','En Proceso','Diagnóstico realizado');

--
-- TABLA intervencion
--
CREATE TABLE intervencion (
  intervencion_id INTEGER PRIMARY KEY,
  orden_id INTEGER NOT NULL,
  tecnico_id INTEGER NOT NULL,
  fecha_inicio TIMESTAMP WITH TIME ZONE, -- Se usa TIMESTAMP WITH TIME ZONE para PostgreSQL
  fecha_fin TIMESTAMP WITH TIME ZONE,    -- Se usa TIMESTAMP WITH TIME ZONE para PostgreSQL
  horas_labor REAL,
  accion_realizada TEXT,
  causa_raiz TEXT,
  resultado TEXT,
  FOREIGN KEY (orden_id) REFERENCES orden_trabajo(orden_id),
  FOREIGN KEY (tecnico_id) REFERENCES tecnico(tecnico_id)
);

INSERT INTO "intervencion" VALUES(1,2,15,'2024-06-24 19:45:00','2024-06-24 21:45:00',2.0,'Limpieza y reapriete','Fallo eléctrico','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(2,3,14,'2024-01-05 20:30:00','2024-01-06 02:30:00',6.0,'Reemplazo de tubo X','Fallo eléctrico','Reparado');
INSERT INTO "intervencion" VALUES(3,4,13,'2024-08-01 23:15:00','2024-08-02 06:15:00',7.0,'Reseat de conectores','Fallo eléctrico','No_Falla');
INSERT INTO "intervencion" VALUES(4,5,14,'2024-05-11 21:45:00','2024-05-12 05:45:00',8.0,'Ajuste de parámetros','Uso inadecuado','No_Falla');
INSERT INTO "intervencion" VALUES(5,13,5,'2024-04-13 21:30:00','2024-04-13 23:30:00',2.0,'Limpieza y reapriete','Firmware desactualizado','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(6,14,12,'2024-11-13 16:00:00','2024-11-13 21:00:00',5.0,'Reemplazo de transductor','Fallo eléctrico','Temporal');
INSERT INTO "intervencion" VALUES(7,16,8,'2024-12-25 22:15:00','2024-12-26 05:15:00',7.0,'Reemplazo de tubo X','Fallo eléctrico','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(8,22,13,'2024-11-08 19:00:00','2024-11-08 21:00:00',2.0,'Reemplazo de transductor','Desgaste','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(9,25,10,'2024-12-24 14:45:00','2024-12-24 22:45:00',8.0,'Calibración de generador','Condensación','No_Falla');
INSERT INTO "intervencion" VALUES(10,29,6,'2024-10-07 13:15:00','2024-10-07 15:15:00',2.0,'Cambio de módulo','Fallo eléctrico','No_Falla');
INSERT INTO "intervencion" VALUES(11,30,5,'2024-03-26 21:00:00','2024-03-27 02:00:00',5.0,'Reemplazo de transductor','Conector suelto','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(12,35,6,'2024-11-04 19:45:00','2024-11-05 00:45:00',5.0,'Ajuste de parámetros','Uso inadecuado','No_Falla');
INSERT INTO "intervencion" VALUES(13,36,10,'2024-03-09 21:30:00','2024-03-10 02:30:00',5.0,'Actualización de software','Uso inadecuado','Reparado');
INSERT INTO "intervencion" VALUES(14,37,2,'2024-09-20 18:00:00','2024-09-21 01:00:00',7.0,'Reemplazo de transductor','Fallo eléctrico','Temporal');
INSERT INTO "intervencion" VALUES(15,39,1,'2024-07-11 22:30:00','2024-07-12 01:30:00',3.0,'Reemplazo de tubo X','Desgaste','Reparado');
INSERT INTO "intervencion" VALUES(16,43,2,'2024-11-16 15:00:00','2024-11-16 18:00:00',3.0,'Limpieza y reapriete','Fallo eléctrico','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(17,49,10,'2024-10-15 18:30:00','2024-10-15 20:30:00',2.0,'Calibración de generador','Uso inadecuado','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(18,56,6,'2024-10-13 20:00:00','2024-10-14 00:00:00',4.0,'Reemplazo de tubo X','Desgaste','Reparado');
INSERT INTO "intervencion" VALUES(19,59,9,'2024-10-05 22:00:00','2024-10-06 02:00:00',4.0,'Reemplazo de transductor','Fallo eléctrico','No_Falla');
INSERT INTO "intervencion" VALUES(20,60,4,'2024-10-25 21:45:00','2024-10-25 23:45:00',2.0,'Ajuste de parámetros','Uso inadecuado','Temporal');
INSERT INTO "intervencion" VALUES(21,61,8,'2024-08-03 19:45:00','2024-08-04 01:45:00',6.0,'Reemplazo de transductor','Condensación','Reparado');
INSERT INTO "intervencion" VALUES(22,66,5,'2024-09-20 14:30:00','2024-09-20 22:30:00',8.0,'Actualización de software','Uso inadecuado','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(23,71,4,'2024-06-10 14:15:00','2024-06-10 20:15:00',6.0,'Actualización de software','Uso inadecuado','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(24,74,4,'2024-08-02 18:30:00','2024-08-02 20:30:00',2.0,'Calibración de generador','Desgaste','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(25,76,3,'2024-04-12 22:45:00','2024-04-13 05:45:00',7.0,'Reemplazo de tubo X','Desgaste','Requiere_Seguimiento');
INSERT INTO "intervencion" VALUES(26,77,11,'2024-09-14 14:15:00','2024-09-14 18:15:00',4.0,'Cambio de módulo','Condensación','No_Falla');
INSERT INTO "intervencion" VALUES(27,79,15,'2024-09-05 18:00:00','2024-09-05 22:00:00',4.0,'Calibración de generador','Uso inadecuado','Temporal');
INSERT INTO "intervencion" VALUES(28,83,13,'2024-04-27 14:45:00','2024-04-27 18:45:00',4.0,'Reseat de conectores','Desgaste','Temporal');

--
-- TABLA mantenimiento_pm
--
CREATE TABLE mantenimiento_pm (
  pm_id INTEGER PRIMARY KEY,
  equipo_id INTEGER NOT NULL,
  fecha_programada DATE,
  fecha_ejecucion DATE,
  tecnico_id INTEGER,
  checklist_ok INTEGER,
  observaciones TEXT,
  FOREIGN KEY (equipo_id) REFERENCES equipo(equipo_id),
  FOREIGN KEY (tecnico_id) REFERENCES tecnico(tecnico_id)
);

INSERT INTO "mantenimiento_pm" VALUES(1,1,'2025-03-25','2025-03-25',9,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(2,2,'2025-05-15','2025-05-14',3,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(3,3,'2025-07-08','2025-07-07',14,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(4,4,'2025-12-11','2025-12-10',13,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(5,5,'2025-09-15','2025-09-16',15,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(6,6,'2025-02-13','2025-02-15',8,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(7,7,'2025-01-10','2025-01-11',10,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(8,8,'2025-01-28','2025-01-26',7,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(9,9,'2025-06-02','2025-06-03',1,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(10,10,'2025-07-17','2025-07-18',13,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(11,11,'2025-10-04','2025-10-03',2,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(12,12,'2025-06-18','2025-06-18',13,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(13,13,'2025-09-02','2025-08-31',1,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(14,14,'2025-09-15','2025-09-14',10,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(15,15,'2025-03-13','2025-03-15',12,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(16,16,'2025-09-18','2025-09-19',12,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(17,17,'2025-06-22','2025-06-20',7,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(18,18,'2025-12-21','2025-12-19',10,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(19,19,'2025-11-26','2025-11-28',10,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(20,20,'2025-03-17','2025-03-22',12,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(21,21,'2025-11-08','2025-11-06',10,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(22,22,'2025-03-14','2025-03-19',4,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(23,23,'2025-10-16','2025-10-21',12,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(24,24,'2025-09-11','2025-09-16',8,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(25,25,'2025-03-15','2025-03-17',6,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(26,26,'2025-11-21','2025-11-26',5,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(27,27,'2025-09-10','2025-09-09',5,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(28,28,'2025-08-11','2025-08-12',6,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(29,29,'2025-09-13','2025-09-14',14,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(30,30,'2025-05-02','2025-05-02',12,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(31,31,'2025-05-24','2025-05-25',4,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(32,32,'2025-09-23','2025-09-23',3,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(33,33,'2025-10-08','2025-10-07',1,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(34,34,'2025-07-11','2025-07-16',8,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(35,35,'2025-03-01','2025-03-03',15,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(36,36,'2025-08-16','2025-08-21',4,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(37,37,'2025-02-21','2025-02-23',4,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(38,38,'2025-03-02','2025-03-03',13,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(39,39,'2025-05-02','2025-04-30',5,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(40,40,'2025-08-21','2025-08-23',9,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(41,41,'2025-03-28','2025-03-30',8,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(42,42,'2025-03-24','2025-03-25',11,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(43,43,'2025-06-26','2025-06-26',10,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(44,44,'2025-07-27','2025-07-28',9,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(45,45,'2025-03-05','2025-03-06',6,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(46,46,'2025-08-25','2025-08-25',6,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(47,47,'2025-05-21','2025-05-21',12,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(48,48,'2025-03-13','2025-03-18',9,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(49,49,'2025-05-12','2025-05-14',4,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(50,50,'2025-08-24','2025-08-26',6,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(51,51,'2025-09-26','2025-10-01',14,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(52,52,'2025-10-28','2025-10-26',9,0,'Pendientes menores');
INSERT INTO "mantenimiento_pm" VALUES(53,53,'2025-06-03','2025-06-05',2,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(54,54,'2025-04-19','2025-04-21',3,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(55,55,'2025-04-23','2025-04-25',8,1,'PM anual realizada');
INSERT INTO "mantenimiento_pm" VALUES(56,56,'2025-01-15','2025-01-14',9,0,'Pendientes menores');

--
-- TABLA parte
--
CREATE TABLE parte (
  parte_id INTEGER PRIMARY KEY,
  fabricante TEXT,
  numero_parte TEXT,
  descripcion TEXT,
  costo_unitario REAL,
  stock INTEGER,
  ubicacion TEXT
);

INSERT INTO "parte" VALUES(1,'GE','XRT-1001','Tubo de rayos X 150kHU',5200.0,3,'ALM-A1');
INSERT INTO "parte" VALUES(2,'GE','DRP-2417','Panel DR 24x17',7800.0,2,'ALM-A2');
INSERT INTO "parte" VALUES(3,'Siemens','HV-CBL-90','Cable HV 90kV',650.0,10,'ALM-B3');
INSERT INTO "parte" VALUES(4,'Philips','PSU-24V-500W','Fuente 24V 500W',240.0,12,'ALM-A4');
INSERT INTO "parte" VALUES(5,'Canon','CT-FAN-120','Ventilador CT 120mm',85.0,20,'ALM-C1');
INSERT INTO "parte" VALUES(6,'Fujifilm','US-PROBE-C5-2','Transductor C5-2',4200.0,1,'ALM-D2');
INSERT INTO "parte" VALUES(7,'Hologic','MG-COLLIM','Colimador MG',980.0,4,'ALM-B1');
INSERT INTO "parte" VALUES(8,'Carestream','DR-BATT','Batería panel DR',120.0,8,'ALM-A5');
INSERT INTO "parte" VALUES(9,'Mindray','US-PSU','Fuente US 19V',160.0,7,'ALM-D1');
INSERT INTO "parte" VALUES(10,'Esaote','MR-COIL-8CH','Bobina RM 8ch',5600.0,2,'ALM-E2');
INSERT INTO "parte" VALUES(11,'Generic','CT-TUBE-6.3MHU','Tubo CT 6.3 MHU',14500.0,1,'ALM-E1');
INSERT INTO "parte" VALUES(12,'Generic','RF-BOARD-CTRL','Tarjeta control RF',900.0,5,'ALM-C2');
INSERT INTO "parte" VALUES(13,'Generic','US-GEL-5L','Gel conductor 5L',25.0,30,'ALM-G1');
INSERT INTO "parte" VALUES(14,'Generic','XR-GENERATOR','Generador RX 65kW',3900.0,1,'ALM-F1');
INSERT INTO "parte" VALUES(15,'Generic','UPS-2KVA','UPS 2 kVA',650.0,3,'ALM-F2');
INSERT INTO "parte" VALUES(16,'Generic','DEXA-DETECTOR','Detector DEXA',4300.0,1,'ALM-E3');
INSERT INTO "parte" VALUES(17,'Generic','CATH-PUMP','Bomba hemodinamia',1800.0,2,'ALM-H1');
INSERT INTO "parte" VALUES(18,'Generic','MG-PADDLE','Paletas compresión',110.0,10,'ALM-B2');
INSERT INTO "parte" VALUES(19,'Generic','MR-CHILLER','Chiller RM',7100.0,1,'ALM-E4');
INSERT INTO "parte" VALUES(20,'Generic','PET-DOSE-CAL','Calibrador de dosis',2900.0,1,'ALM-H2');

--
-- TABLA partes_usadas
--
CREATE TABLE partes_usadas (
  partes_usadas_id INTEGER PRIMARY KEY,
  intervencion_id INTEGER NOT NULL,
  parte_id INTEGER NOT NULL,
  cantidad INTEGER,
  costo_unitario REAL,
  FOREIGN KEY (intervencion_id) REFERENCES intervencion(intervencion_id),
  FOREIGN KEY (parte_id) REFERENCES parte(parte_id)
);

INSERT INTO "partes_usadas" VALUES(1,2,1,1,5200.0);
INSERT INTO "partes_usadas" VALUES(2,3,15,1,650.0);
INSERT INTO "partes_usadas" VALUES(3,4,3,1,650.0);
INSERT INTO "partes_usadas" VALUES(4,5,16,2,4300.0);
INSERT INTO "partes_usadas" VALUES(5,5,14,1,3900.0);
INSERT INTO "partes_usadas" VALUES(6,6,3,2,650.0);
INSERT INTO "partes_usadas" VALUES(7,7,12,1,900.0);
INSERT INTO "partes_usadas" VALUES(8,7,18,1,110.0);
INSERT INTO "partes_usadas" VALUES(9,9,2,1,7800.0);
INSERT INTO "partes_usadas" VALUES(10,9,17,1,1800.0);
INSERT INTO "partes_usadas" VALUES(11,10,11,1,14500.0);
INSERT INTO "partes_usadas" VALUES(12,11,10,1,5600.0);
INSERT INTO "partes_usadas" VALUES(13,11,9,1,160.0);
INSERT INTO "partes_usadas" VALUES(14,12,9,1,160.0);
INSERT INTO "partes_usadas" VALUES(15,12,10,1,5600.0);
INSERT INTO "partes_usadas" VALUES(16,13,19,1,7100.0);
INSERT INTO "partes_usadas" VALUES(17,14,20,1,2900.0);
INSERT INTO "partes_usadas" VALUES(18,14,19,1,7100.0);
INSERT INTO "partes_usadas" VALUES(19,16,19,1,7100.0);
INSERT INTO "partes_usadas" VALUES(20,19,1,2,5200.0);
INSERT INTO "partes_usadas" VALUES(21,19,18,1,110.0);
INSERT INTO "partes_usadas" VALUES(22,20,16,1,4300.0);
INSERT INTO "partes_usadas" VALUES(23,23,2,1,7800.0);
INSERT INTO "partes_usadas" VALUES(24,24,15,1,650.0);
INSERT INTO "partes_usadas" VALUES(25,25,11,1,14500.0);