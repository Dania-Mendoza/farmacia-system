-- ============================================================
-- SISTEMA DE FARMACIAS - ESQUEMA DE BASE DE DATOS
-- Oracle Database XE 21c
-- Seminario de Programación - Universidad Mariano Gálvez
-- ============================================================

-- ============================================================
-- 1. TABLAS DE CATÁLOGOS Y UBICACIONES
-- ============================================================

-- Departamentos del país
CREATE TABLE departamentos (
    id_departamento   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL UNIQUE,
    codigo            VARCHAR2(10) NOT NULL UNIQUE,
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I')),
    fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Municipios por departamento
CREATE TABLE municipios (
    id_municipio      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL,
    id_departamento   NUMBER NOT NULL,
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I')),
    CONSTRAINT fk_mun_depto FOREIGN KEY (id_departamento) REFERENCES departamentos(id_departamento)
);

-- Tipos de ubicación (Centro Comercial, Gasolinera, Standalone)
CREATE TABLE tipos_ubicacion (
    id_tipo_ubicacion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(50) NOT NULL UNIQUE,
    descripcion       VARCHAR2(200)
);

-- ============================================================
-- 2. SUCURSALES (FARMACIAS)
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
-- 3. MEDICAMENTOS E INVENTARIO
-- ============================================================

-- Categorías de medicamentos
CREATE TABLE categorias_medicamento (
    id_categoria      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(100) NOT NULL UNIQUE,
    descripcion       VARCHAR2(300),
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I'))
);

-- Medicamentos
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

-- Inventario por sucursal
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

-- Movimientos de inventario entre sucursales
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
-- 4. PROVEEDORES Y COMPRAS
-- ============================================================

CREATE TABLE proveedores (
    id_proveedor      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(200) NOT NULL,
    nit               VARCHAR2(20) UNIQUE,
    direccion         VARCHAR2(300),
    telefono          VARCHAR2(20),
    email             VARCHAR2(100),
    nombre_contacto   VARCHAR2(100),
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I')),
    fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compras (
    id_compra         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_proveedor      NUMBER NOT NULL,
    id_sucursal       NUMBER NOT NULL,
    fecha             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal          NUMBER(12,2) DEFAULT 0,
    impuesto          NUMBER(12,2) DEFAULT 0,
    total             NUMBER(12,2) DEFAULT 0,
    estado            VARCHAR2(20) DEFAULT 'COMPLETADA' 
                      CHECK (estado IN ('PENDIENTE','COMPLETADA','CANCELADA')),
    id_usuario        NUMBER,
    observaciones     VARCHAR2(500),
    CONSTRAINT fk_com_prov FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor),
    CONSTRAINT fk_com_suc FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

CREATE TABLE detalle_compras (
    id_detalle        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_compra         NUMBER NOT NULL,
    id_medicamento    NUMBER NOT NULL,
    cantidad          NUMBER NOT NULL CHECK (cantidad > 0),
    precio_unitario   NUMBER(10,2) NOT NULL,
    subtotal          NUMBER(12,2) NOT NULL,
    CONSTRAINT fk_dcom_com FOREIGN KEY (id_compra) REFERENCES compras(id_compra),
    CONSTRAINT fk_dcom_med FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento)
);

-- ============================================================
-- 5. CLIENTES
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

-- ============================================================
-- 6. EMPLEADOS Y PLANILLA
-- ============================================================

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
-- 7. ACTIVOS FIJOS
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
-- 8. VENTAS
-- ============================================================

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
-- 9. FLUJO DE EFECTIVO (AUDITORÍA)
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
-- 10. ENTREGAS
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
-- 11. USUARIOS Y ROLES (SISTEMA)
-- ============================================================

CREATE TABLE roles (
    id_rol            NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            VARCHAR2(50) NOT NULL UNIQUE,
    descripcion       VARCHAR2(200),
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I'))
);

CREATE TABLE usuarios (
    id_usuario        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username          VARCHAR2(50) NOT NULL UNIQUE,
    password_hash     VARCHAR2(255) NOT NULL,
    email             VARCHAR2(100) NOT NULL UNIQUE,
    id_empleado       NUMBER,
    id_rol            NUMBER NOT NULL,
    estado            CHAR(1) DEFAULT 'A' CHECK (estado IN ('A','I')),
    ultimo_acceso     TIMESTAMP,
    fecha_creacion    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usr_emp FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado),
    CONSTRAINT fk_usr_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- ============================================================
-- 12. ÓRDENES (Preparación futura para Call Center)
-- ============================================================

CREATE TABLE ordenes (
    id_orden          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cliente        NUMBER NOT NULL,
    id_sucursal_asignada NUMBER,
    canal             VARCHAR2(20) DEFAULT 'WEB' 
                      CHECK (canal IN ('WEB','TELEFONO','APP')),
    direccion_entrega VARCHAR2(300),
    telefono_contacto VARCHAR2(20),
    fecha_orden       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_estimada_entrega TIMESTAMP,
    subtotal          NUMBER(12,2) DEFAULT 0,
    costo_envio       NUMBER(10,2) DEFAULT 0,
    total             NUMBER(12,2) DEFAULT 0,
    tipo_pago         VARCHAR2(20) DEFAULT 'EFECTIVO',
    estado            VARCHAR2(20) DEFAULT 'RECIBIDA' 
                      CHECK (estado IN ('RECIBIDA','PROCESANDO','PREPARADA','EN_CAMINO','ENTREGADA','CANCELADA')),
    id_operador       NUMBER,
    observaciones     VARCHAR2(500),
    CONSTRAINT fk_ord_cli FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_ord_suc FOREIGN KEY (id_sucursal_asignada) REFERENCES sucursales(id_sucursal)
);

CREATE TABLE detalle_ordenes (
    id_detalle        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_orden          NUMBER NOT NULL,
    id_medicamento    NUMBER NOT NULL,
    cantidad          NUMBER NOT NULL CHECK (cantidad > 0),
    precio_unitario   NUMBER(10,2) NOT NULL,
    subtotal          NUMBER(12,2) NOT NULL,
    disponible        CHAR(1) DEFAULT 'S' CHECK (disponible IN ('S','N')),
    CONSTRAINT fk_dord_ord FOREIGN KEY (id_orden) REFERENCES ordenes(id_orden),
    CONSTRAINT fk_dord_med FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento)
);

-- ============================================================
-- 13. ÍNDICES PARA RENDIMIENTO
-- ============================================================

CREATE INDEX idx_inv_sucursal ON inventario(id_sucursal);
CREATE INDEX idx_inv_medicamento ON inventario(id_medicamento);
CREATE INDEX idx_mov_fecha ON movimientos_inventario(fecha_solicitud);
CREATE INDEX idx_mov_estado ON movimientos_inventario(estado);
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_sucursal ON ventas(id_sucursal);
CREATE INDEX idx_flujo_fecha ON flujo_efectivo(fecha);
CREATE INDEX idx_flujo_sucursal ON flujo_efectivo(id_sucursal);
CREATE INDEX idx_flujo_tipo ON flujo_efectivo(tipo);
CREATE INDEX idx_entregas_estado ON entregas(estado);
CREATE INDEX idx_ordenes_estado ON ordenes(estado);
CREATE INDEX idx_emp_sucursal ON empleados(id_sucursal);
CREATE INDEX idx_activos_sucursal ON activos_fijos(id_sucursal);

-- ============================================================
-- 14. VISTAS PARA AUDITORÍA Y REPORTES
-- ============================================================

-- Vista: Resumen de inventario por sucursal
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

-- Vista: Flujo de efectivo consolidado
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

-- Vista: Resumen de planilla
CREATE OR REPLACE VIEW v_resumen_planilla AS
SELECT 
    p.id_planilla,
    p.periodo,
    p.estado,
    COUNT(dp.id_empleado) AS total_empleados,
    SUM(dp.salario_base) AS total_salarios_base,
    SUM(dp.bonificacion) AS total_bonificaciones,
    SUM(dp.deduccion_igss + dp.deduccion_isr + dp.otras_deducciones) AS total_deducciones,
    SUM(dp.salario_neto) AS total_neto
FROM planilla p
LEFT JOIN detalle_planilla dp ON p.id_planilla = dp.id_planilla
GROUP BY p.id_planilla, p.periodo, p.estado;

-- Vista: Valor total de activos fijos por sucursal
CREATE OR REPLACE VIEW v_activos_por_sucursal AS
SELECT 
    s.id_sucursal,
    s.nombre AS sucursal,
    COUNT(a.id_activo) AS total_activos,
    SUM(a.valor_adquisicion) AS valor_total_adquisicion,
    SUM(a.depreciacion_acumulada) AS depreciacion_total,
    SUM(a.valor_actual) AS valor_actual_total
FROM sucursales s
LEFT JOIN activos_fijos a ON s.id_sucursal = a.id_sucursal AND a.estado = 'ACTIVO'
GROUP BY s.id_sucursal, s.nombre;

-- Vista: Dashboard de entregas
CREATE OR REPLACE VIEW v_entregas_dashboard AS
SELECT 
    e.id_entrega,
    s.nombre AS sucursal_origen,
    c.nombre || ' ' || c.apellido AS cliente,
    e.direccion_entrega,
    e.fecha_solicitud,
    e.fecha_estimada,
    e.fecha_entrega,
    e.estado,
    emp.nombre || ' ' || emp.apellido AS repartidor
FROM entregas e
JOIN sucursales s ON e.id_sucursal_origen = s.id_sucursal
JOIN clientes c ON e.id_cliente = c.id_cliente
LEFT JOIN empleados emp ON e.id_repartidor = emp.id_empleado;

COMMIT;
