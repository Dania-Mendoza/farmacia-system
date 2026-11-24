-- ============================================================
-- SCRIPT COMPLETO PARA ORACLE CLOUD (DATABASE ACTIONS / SQL)
-- Seminario de Programación - Universidad Mariano Gálvez
-- ============================================================

-- Desactivar variables de sustitución para evitar la ventana de diálogo
SET DEFINE OFF;

-- ============================================================
-- 1. LIMPIEZA PREVIA (Por si se vuelve a ejecutar)
-- ============================================================
BEGIN
    FOR t IN (SELECT table_name FROM user_tables WHERE table_name IN (
        'DETALLE_ORDENES', 'ORDENES', 'ENTREGAS', 'DETALLE_VENTAS', 'VENTAS',
        'FLUJO_EFECTIVO', 'ACTIVOS_FIJOS', 'CATEGORIAS_ACTIVO', 'DETALLE_PLANILLA',
        'PLANILLA', 'EMPLEADOS', 'PUESTOS', 'CLIENTES', 'DETALLE_COMPRAS',
        'COMPRAS', 'PROVEEDORES', 'MOVIMIENTOS_INVENTARIO', 'INVENTARIO',
        'MEDICAMENTOS', 'CATEGORIAS_MEDICAMENTO', 'SUCURSALES', 'TIPOS_UBICACION',
        'MUNICIPIOS', 'DEPARTAMENTOS', 'USUARIOS', 'ROLES'
    )) LOOP
        EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS';
    END LOOP;
END;
/

-- ============================================================
-- 2. TABLAS DE CATÁLOGOS Y UBICACIONES
-- ============================================================

CREATE TABLE departamentos (
    id_departamento   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL UNIQUE,
    codigo            VARCHAR2(10) NOT NULL UNIQUE,
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I')),
    fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE municipios (
    id_municipio      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL,
    id_departamento   NUMBER NOT NULL,
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I')),
    CONSTRAINT fk_mun_depto FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento)
);

CREATE TABLE tipos_ubicacion (
    id_tipo_ubicacion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(50) NOT NULL UNIQUE,
    descripcion       VARCHAR2(200)
);

-- ============================================================
-- 3. SUCURSALES (CENTROS COMERCIALES Y STANDS EN GASOLINERAS)
-- ============================================================

CREATE TABLE sucursales (
    id_sucursal       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(150) NOT NULL,
    direccion         VARCHAR2(300) NOT NULL,
    id_municipio      NUMBER NOT NULL,
    id_tipo_ubicacion NUMBER NOT NULL,
    telefono          VARCHAR2(20),
    email             VARCHAR2(100),
    nombre_contacto   VARCHAR2(100),
    horario_apertura  VARCHAR2(10) DEFAULT '08:00',
    horario_cierre    VARCHAR2(10) DEFAULT '20:00',
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I')),
    fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_suc_mun FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio),
    CONSTRAINT fk_suc_tipo FOREIGN KEY (id_tipo_ubicacion) REFERENCES tipos_ubicacion(id_tipo_ubicacion)
);

-- ============================================================
-- 4. MEDICAMENTOS E INVENTARIO
-- ============================================================

CREATE TABLE categorias_medicamento (
    id_categoria      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL UNIQUE,
    descripcion       VARCHAR2(300),
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I'))
);

CREATE TABLE medicamentos (
    id_medicamento    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(200) NOT NULL,
    descripcion       VARCHAR2(500),
    codigo_barras     VARCHAR2(50) UNIQUE,
    principio_activo  VARCHAR2(200),
    presentacion      VARCHAR2(100),
    precio_compra     NUMBER(10,2) NOT NULL CHECK (precio_compra >= 0),
    precio_venta      NUMBER(10,2) NOT NULL CHECK (precio_venta >= 0),
    id_categoria      NUMBER NOT NULL,
    requiere_receta   CHAR(1) DEFAULT 'N' CHECK (requiere_receta IN ('S','N')),
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I')),
    fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_med_cat FOREIGN KEY (id_categoria) REFERENCES categorias_medicamento(id_categoria)
);

CREATE TABLE inventario (
    id_inventario     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sucursal       NUMBER NOT NULL,
    id_medicamento    NUMBER NOT NULL,
    cantidad          NUMBER DEFAULT 0 CHECK (cantidad >= 0),
    stock_minimo      NUMBER DEFAULT 10,
    stock_maximo      NUMBER DEFAULT 500,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_suc FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    CONSTRAINT fk_inv_med FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento),
    CONSTRAINT uk_inv_suc_med UNIQUE (id_sucursal, id_medicamento)
);

CREATE TABLE movimientos_inventario (
    id_movimiento     NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_medicamento    NUMBER NOT NULL,
    id_sucursal_origen  NUMBER NOT NULL,
    id_sucursal_destino NUMBER NOT NULL,
    cantidad          NUMBER NOT NULL CHECK (cantidad > 0),
    fecha_solicitud   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_envio       TIMESTAMP,
    fecha_recepcion   TIMESTAMP,
    estado            VARCHAR2(20) DEFAULT 'PENDIENTE' 
                      CHECK (estado IN ('PENDIENTE','EN_TRANSITO','RECIBIDO','CANCELADO')),
    id_usuario        NUMBER,
    observaciones     VARCHAR2(500),
    CONSTRAINT fk_mov_med FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento),
    CONSTRAINT fk_mov_origen FOREIGN KEY (id_sucursal_origen) REFERENCES sucursales(id_sucursal),
    CONSTRAINT fk_mov_destino FOREIGN KEY (id_sucursal_destino) REFERENCES sucursales(id_sucursal)
);

-- ============================================================
-- 5. CLIENTES Y VENTAS
-- ============================================================

CREATE TABLE clientes (
    id_cliente        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL,
    apellido          VARCHAR2(100) NOT NULL,
    nit               VARCHAR2(20) DEFAULT 'C/F',
    dpi               VARCHAR2(20),
    direccion         VARCHAR2(300),
    telefono          VARCHAR2(20),
    email             VARCHAR2(100),
    fecha_registro    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I'))
);

CREATE TABLE puestos (
    id_puesto         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL UNIQUE,
    descripcion       VARCHAR2(300),
    salario_base      NUMBER(10,2) NOT NULL CHECK (salario_base > 0),
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I'))
);

CREATE TABLE empleados (
    id_empleado       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL,
    apellido          VARCHAR2(100) NOT NULL,
    dpi               VARCHAR2(20) NOT NULL UNIQUE,
    fecha_nacimiento  DATE,
    direccion         VARCHAR2(300),
    telefono          VARCHAR2(20),
    email             VARCHAR2(100),
    id_puesto         NUMBER NOT NULL,
    id_sucursal       NUMBER NOT NULL,
    fecha_contratacion DATE DEFAULT SYSDATE,
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I')),
    CONSTRAINT fk_emp_puesto FOREIGN KEY (id_puesto) REFERENCES puestos(id_puesto),
    CONSTRAINT fk_emp_suc FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

CREATE TABLE ventas (
    id_venta          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sucursal       NUMBER NOT NULL,
    id_cliente        NUMBER,
    id_empleado       NUMBER NOT NULL,
    fecha             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal          NUMBER(12,2) DEFAULT 0,
    impuesto          NUMBER(12,2) DEFAULT 0,
    descuento         NUMBER(12,2) DEFAULT 0,
    total             NUMBER(12,2) DEFAULT 0,
    tipo_pago         VARCHAR2(20) DEFAULT 'EFECTIVO' 
                      CHECK (tipo_pago IN ('EFECTIVO','TARJETA','TRANSFERENCIA','MIXTO')),
    numero_factura    VARCHAR2(30),
    estado            VARCHAR2(20) DEFAULT 'COMPLETADA' 
                      CHECK (estado IN ('PENDIENTE','COMPLETADA','CANCELADA','DEVOLUCION')),
    CONSTRAINT fk_ven_suc FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    CONSTRAINT fk_ven_cli FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_ven_emp FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

CREATE TABLE detalle_ventas (
    id_detalle        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_venta          NUMBER NOT NULL,
    id_medicamento    NUMBER NOT NULL,
    cantidad          NUMBER NOT NULL CHECK (cantidad > 0),
    precio_unitario   NUMBER(10,2) NOT NULL,
    descuento         NUMBER(10,2) DEFAULT 0,
    subtotal          NUMBER(12,2) NOT NULL,
    CONSTRAINT fk_dven_ven FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    CONSTRAINT fk_dven_med FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento)
);

-- ============================================================
-- 6. FLUJO DE EFECTIVO (AUDITORÍA EN TIEMPO REAL)
-- ============================================================

CREATE TABLE flujo_efectivo (
    id_flujo          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sucursal       NUMBER NOT NULL,
    tipo              VARCHAR2(10) NOT NULL CHECK (tipo IN ('INGRESO','EGRESO')),
    concepto          VARCHAR2(200) NOT NULL,
    monto             NUMBER(12,2) NOT NULL,
    fecha             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referencia_tipo   VARCHAR2(30),
    referencia_id     NUMBER,
    id_usuario        NUMBER,
    observaciones     VARCHAR2(500),
    CONSTRAINT fk_flu_suc FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- ============================================================
-- 7. ACTIVOS FIJOS Y DEPRECIACIÓN
-- ============================================================

CREATE TABLE categorias_activo (
    id_categoria      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL UNIQUE,
    vida_util_anios   NUMBER DEFAULT 5,
    porcentaje_depreciacion NUMBER(5,2) DEFAULT 20.00
);

CREATE TABLE activos_fijos (
    id_activo         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(200) NOT NULL,
    descripcion       VARCHAR2(500),
    codigo_activo     VARCHAR2(50) UNIQUE,
    id_categoria      NUMBER NOT NULL,
    valor_adquisicion NUMBER(12,2) NOT NULL CHECK (valor_adquisicion > 0),
    fecha_adquisicion DATE NOT NULL,
    depreciacion_acumulada NUMBER(12,2) DEFAULT 0,
    valor_actual      NUMBER(12,2),
    id_sucursal       NUMBER NOT NULL,
    estado            VARCHAR2(20) DEFAULT 'ACTIVO' 
                      CHECK (estado IN ('ACTIVO','DADO_DE_BAJA','EN_REPARACION','VENDIDO')),
    fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_act_cat FOREIGN KEY (id_categoria) REFERENCES categorias_activo(id_categoria),
    CONSTRAINT fk_act_suc FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- ============================================================
-- 8. PLANILLA Y SUELDOS (IGSS / BONIFICACIÓN)
-- ============================================================

CREATE TABLE planilla (
    id_planilla       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    periodo           VARCHAR2(20) NOT NULL,
    fecha_inicio      DATE NOT NULL,
    fecha_fin         DATE NOT NULL,
    fecha_pago        DATE,
    total             NUMBER(14,2) DEFAULT 0,
    estado            VARCHAR2(20) DEFAULT 'PENDIENTE' 
                      CHECK (estado IN ('PENDIENTE','PROCESADA','PAGADA','CANCELADA')),
    id_usuario        NUMBER,
    fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_planilla (
    id_detalle        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_planilla       NUMBER NOT NULL,
    id_empleado       NUMBER NOT NULL,
    salario_base      NUMBER(10,2) NOT NULL,
    bonificacion      NUMBER(10,2) DEFAULT 250.00,
    horas_extra       NUMBER(10,2) DEFAULT 0,
    comisiones        NUMBER(10,2) DEFAULT 0,
    deduccion_igss    NUMBER(10,2) DEFAULT 0,
    deduccion_isr     NUMBER(10,2) DEFAULT 0,
    otras_deducciones NUMBER(10,2) DEFAULT 0,
    salario_neto      NUMBER(10,2) NOT NULL,
    CONSTRAINT fk_dplan_plan FOREIGN KEY (id_planilla) REFERENCES planilla(id_planilla),
    CONSTRAINT fk_dplan_emp FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado),
    CONSTRAINT uk_dplan UNIQUE (id_planilla, id_empleado)
);

-- ============================================================
-- 9. ENTREGAS Y CALL CENTER
-- ============================================================

CREATE TABLE entregas (
    id_entrega        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_venta          NUMBER NOT NULL,
    id_sucursal_origen NUMBER NOT NULL,
    id_cliente        NUMBER NOT NULL,
    direccion_entrega VARCHAR2(300) NOT NULL,
    telefono_contacto VARCHAR2(20),
    fecha_solicitud   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_estimada    TIMESTAMP,
    fecha_entrega     TIMESTAMP,
    estado            VARCHAR2(20) DEFAULT 'PENDIENTE' 
                      CHECK (estado IN ('PENDIENTE','EN_CAMINO','ENTREGADO','CANCELADO','FALLIDO')),
    id_repartidor     NUMBER,
    costo_envio       NUMBER(10,2) DEFAULT 0,
    observaciones     VARCHAR2(500),
    CONSTRAINT fk_ent_ven FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    CONSTRAINT fk_ent_suc FOREIGN KEY (id_sucursal_origen) REFERENCES sucursales(id_sucursal),
    CONSTRAINT fk_ent_cli FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_ent_rep FOREIGN KEY (id_repartidor) REFERENCES empleados(id_empleado)
);

-- ============================================================
-- 10. VISTAS PARA AUDITORÍA
-- ============================================================

CREATE OR REPLACE VIEW v_flujo_efectivo_consolidado AS
SELECT 
    s.id_sucursal,
    s.nombre AS sucursal,
    TRUNC(f.fecha) AS fecha,
    SUM(CASE WHEN f.tipo = 'INGRESO' THEN f.monto ELSE 0 END) AS total_ingresos,
    SUM(CASE WHEN f.tipo = 'EGRESO' THEN f.monto ELSE 0 END) AS total_egresos,
    SUM(CASE WHEN f.tipo = 'INGRESO' THEN f.monto ELSE -f.monto END) AS balance
FROM flujo_efectivo f
JOIN sucursales s ON f.id_sucursal = s.id_sucursal
GROUP BY s.id_sucursal, s.nombre, TRUNC(f.fecha);

CREATE OR REPLACE VIEW v_inventario_sucursal AS
SELECT 
    s.id_sucursal,
    s.nombre AS sucursal,
    m.id_medicamento,
    m.nombre AS medicamento,
    m.precio_venta,
    i.cantidad,
    i.stock_minimo,
    i.stock_maximo,
    CASE 
        WHEN i.cantidad <= i.stock_minimo THEN 'BAJO'
        WHEN i.cantidad >= i.stock_maximo THEN 'EXCESO'
        ELSE 'NORMAL'
    END AS nivel_stock,
    (i.cantidad * m.precio_venta) AS valor_inventario
FROM inventario i
JOIN sucursales s ON i.id_sucursal = s.id_sucursal
JOIN medicamentos m ON i.id_medicamento = m.id_medicamento;

-- ============================================================
-- 11. INSERCIÓN DE DATOS INICIALES (SEED DATA)
-- ============================================================

-- Departamentos
INSERT INTO departamentos (nombre, codigo) VALUES ('Guatemala', 'GUA');
INSERT INTO departamentos (nombre, codigo) VALUES ('Sacatepéquez', 'SAC');
INSERT INTO departamentos (nombre, codigo) VALUES ('Quetzaltenango', 'QUE');
INSERT INTO departamentos (nombre, codigo) VALUES ('Escuintla', 'ESC');

-- Municipios
INSERT INTO municipios (nombre, id_departamento) VALUES ('Guatemala', 1);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Mixco', 1);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Villa Nueva', 1);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Antigua Guatemala', 2);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Quetzaltenango', 3);

-- Tipos de ubicación
INSERT INTO tipos_ubicacion (nombre, descripcion) VALUES ('Centro Comercial', 'Farmacia en centro comercial ancla');
INSERT INTO tipos_ubicacion (nombre, descripcion) VALUES ('Stand en Gasolinera', 'Stand rápido en tienda de gasolinera');
INSERT INTO tipos_ubicacion (nombre, descripcion) VALUES ('Local Independiente', 'Farmacia en local propio');

-- Sucursales
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia CC Miraflores', 'CC Miraflores, Zona 11', 1, 1, '2222-0001', 'miraflores@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Oakland Mall', 'CC Oakland Mall, Zona 10', 1, 1, '2222-0002', 'oakland@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Shell Mixco (Stand)', 'Gasolinera Shell, Calzada San Juan', 2, 2, '2222-0003', 'shellmixco@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Pradera Concepción', 'CC Pradera Concepción, Villa Nueva', 3, 1, '2222-0004', 'pradera@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Antigua', '5a Avenida Norte #22, Antigua', 4, 3, '2222-0005', 'antigua@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Pradera Xela', 'CC Pradera Xela, Quetzaltenango', 5, 1, '2222-0006', 'xela@farmacia.gt');

-- Categorías
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Analgésicos', 'Alivio del dolor');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Antibióticos', 'Infecciones bacterianas');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Antiinflamatorios', 'Reducción de inflamación');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Antigripales', 'Síntomas de gripe');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Vitaminas', 'Suplementos nutricionales');

-- Medicamentos
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria)
VALUES ('Acetaminofén 500mg', 'Dolor y fiebre', 'MED001', 'Acetaminofén', 'Caja 20 tabletas', 8.50, 15.00, 1);
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria)
VALUES ('Ibuprofeno 400mg', 'Antiinflamatorio', 'MED002', 'Ibuprofeno', 'Caja 20 tabletas', 12.00, 22.50, 3);
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Amoxicilina 500mg', 'Antibiótico', 'MED003', 'Amoxicilina', 'Caja 21 cápsulas', 25.00, 45.00, 2, 'S');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria)
VALUES ('Tabcin Antigripal', 'Antigripal efervescente', 'MED004', 'Paracetamol/Fenilefrina', 'Caja 12 tabletas', 9.00, 16.50, 4);
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria)
VALUES ('Vitamina C 1000mg', 'Refuerzo inmunológico', 'MED005', 'Ácido ascórbico', 'Frasco 30 tabletas', 18.00, 35.00, 5);

-- Inventario inicial
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (1, 1, 150, 20, 300);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (1, 2, 80, 15, 200);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (2, 3, 40, 10, 100);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (3, 4, 8, 15, 100);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (5, 5, 60, 10, 150);

-- Puestos y Empleados
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Gerente General', 'Dirección General', 25000.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Gerente de Sucursal', 'Administración de Sede', 12000.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Farmacéutico Encargado', 'Despacho Profesional', 8000.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Repartidor Delivery', 'Entregas a Domicilio', 4000.00);

INSERT INTO empleados (nombre, apellido, dpi, id_puesto, id_sucursal) VALUES ('Carlos', 'Mendoza', '1234567890101', 1, 1);
INSERT INTO empleados (nombre, apellido, dpi, id_puesto, id_sucursal) VALUES ('María', 'González', '2345678901202', 2, 1);
INSERT INTO empleados (nombre, apellido, dpi, id_puesto, id_sucursal) VALUES ('Juan', 'Pérez', '3456789012303', 3, 1);
INSERT INTO empleados (nombre, apellido, dpi, id_puesto, id_sucursal) VALUES ('Pedro', 'Ramírez', '4567890123404', 4, 1);

-- Clientes
INSERT INTO clientes (nombre, apellido, nit, direccion, telefono) VALUES ('José', 'Castillo', '11223344-5', 'Zona 15, Guatemala', '4444-0001');
INSERT INTO clientes (nombre, apellido, nit, direccion, telefono) VALUES ('Carmen', 'Flores', '22334455-6', 'Zona 10, Guatemala', '4444-0002');

-- Flujo de Efectivo inicial
INSERT INTO flujo_efectivo (id_sucursal, tipo, concepto, monto) VALUES (1, 'INGRESO', 'Venta de Medicamentos POS', 1450.00);
INSERT INTO flujo_efectivo (id_sucursal, tipo, concepto, monto) VALUES (2, 'INGRESO', 'Venta de Medicamentos POS', 980.50);
INSERT INTO flujo_efectivo (id_sucursal, tipo, concepto, monto) VALUES (3, 'EGRESO', 'Servicios Basicos y Mantenimiento', 350.00);
INSERT INTO flujo_efectivo (id_sucursal, tipo, concepto, monto) VALUES (4, 'INGRESO', 'Venta Call Center Despacho', 620.00);
INSERT INTO flujo_efectivo (id_sucursal, tipo, concepto, monto) VALUES (1, 'EGRESO', 'Anticipo Planilla Quincenal', 12500.00);

-- Activos Fijos
INSERT INTO categorias_activo (nombre, vida_util_anios, porcentaje_depreciacion) VALUES ('Mobiliario y Equipo', 5, 20.00);
INSERT INTO categorias_activo (nombre, vida_util_anios, porcentaje_depreciacion) VALUES ('Equipo de Cómputo', 3, 33.33);
INSERT INTO categorias_activo (nombre, vida_util_anios, porcentaje_depreciacion) VALUES ('Equipo Refrigeración', 10, 10.00);

INSERT INTO activos_fijos (nombre, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, depreciacion_acumulada, valor_actual, id_sucursal)
VALUES ('Mostrador Principal', 'ACT-001', 1, 5000.00, TO_DATE('2024-01-15','YYYY-MM-DD'), 1666.67, 3333.33, 1);
INSERT INTO activos_fijos (nombre, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, depreciacion_acumulada, valor_actual, id_sucursal)
VALUES ('Computadora POS', 'ACT-002', 2, 8000.00, TO_DATE('2024-03-01','YYYY-MM-DD'), 4444.44, 3555.56, 1);
INSERT INTO activos_fijos (nombre, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, depreciacion_acumulada, valor_actual, id_sucursal)
VALUES ('Refrigerador Medicamentos', 'ACT-004', 3, 12000.00, TO_DATE('2024-01-15','YYYY-MM-DD'), 2000.00, 10000.00, 1);

COMMIT;
