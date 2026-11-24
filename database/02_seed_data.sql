-- ============================================================
-- DATOS INICIALES (SEED DATA)
-- Sistema de Farmacias
-- ============================================================

-- Departamentos de Guatemala
INSERT INTO departamentos (nombre, codigo) VALUES ('Guatemala', 'GUA');
INSERT INTO departamentos (nombre, codigo) VALUES ('Sacatepéquez', 'SAC');
INSERT INTO departamentos (nombre, codigo) VALUES ('Quetzaltenango', 'QUE');
INSERT INTO departamentos (nombre, codigo) VALUES ('Escuintla', 'ESC');
INSERT INTO departamentos (nombre, codigo) VALUES ('Alta Verapaz', 'AV');
INSERT INTO departamentos (nombre, codigo) VALUES ('Petén', 'PET');
INSERT INTO departamentos (nombre, codigo) VALUES ('Huehuetenango', 'HUE');
INSERT INTO departamentos (nombre, codigo) VALUES ('San Marcos', 'SM');

-- Municipios
INSERT INTO municipios (nombre, id_departamento) VALUES ('Guatemala', 1);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Mixco', 1);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Villa Nueva', 1);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Antigua Guatemala', 2);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Quetzaltenango', 3);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Escuintla', 4);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Cobán', 5);
INSERT INTO municipios (nombre, id_departamento) VALUES ('Flores', 6);

-- Tipos de ubicación
INSERT INTO tipos_ubicacion (nombre, descripcion) VALUES ('Centro Comercial', 'Farmacia ubicada dentro de un centro comercial');
INSERT INTO tipos_ubicacion (nombre, descripcion) VALUES ('Gasolinera', 'Stand de farmacia en estación de gasolinera');
INSERT INTO tipos_ubicacion (nombre, descripcion) VALUES ('Local Independiente', 'Farmacia con local propio');

-- Sucursales
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Central CC Miraflores', 'CC Miraflores, Zona 11', 1, 1, '2222-0001', 'miraflores@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Oakland Mall', 'CC Oakland Mall, Zona 10', 1, 1, '2222-0002', 'oakland@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Shell Mixco', 'Gasolinera Shell, Calzada San Juan', 2, 2, '2222-0003', 'shellmixco@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Pradera Concepción', 'CC Pradera Concepción, Villa Nueva', 3, 1, '2222-0004', 'pradera@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Antigua', '5a Avenida Norte #22, Antigua', 4, 3, '2222-0005', 'antigua@farmacia.gt');
INSERT INTO sucursales (nombre, direccion, id_municipio, id_tipo_ubicacion, telefono, email)
VALUES ('Farmacia Pradera Xela', 'CC Pradera Xela, Quetzaltenango', 5, 1, '2222-0006', 'xela@farmacia.gt');

-- Categorías de medicamentos
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Analgésicos', 'Medicamentos para aliviar el dolor');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Antibióticos', 'Medicamentos para combatir infecciones bacterianas');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Antiinflamatorios', 'Medicamentos para reducir la inflamación');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Antigripales', 'Medicamentos para síntomas de gripe y resfriado');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Vitaminas', 'Suplementos vitamínicos y minerales');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Antialérgicos', 'Medicamentos para tratar alergias');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Gastrointestinales', 'Medicamentos para el sistema digestivo');
INSERT INTO categorias_medicamento (nombre, descripcion) VALUES ('Dermatológicos', 'Medicamentos para la piel');

-- Medicamentos
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Acetaminofén 500mg', 'Tabletas para dolor y fiebre', 'MED001', 'Acetaminofén', 'Caja 20 tabletas', 8.50, 15.00, 1, 'N');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Ibuprofeno 400mg', 'Antiinflamatorio y analgésico', 'MED002', 'Ibuprofeno', 'Caja 20 tabletas', 12.00, 22.50, 3, 'N');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 'MED003', 'Amoxicilina', 'Caja 21 cápsulas', 25.00, 45.00, 2, 'S');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Loratadina 10mg', 'Antialérgico no sedante', 'MED004', 'Loratadina', 'Caja 10 tabletas', 6.00, 12.00, 6, 'N');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Omeprazol 20mg', 'Protector gástrico', 'MED005', 'Omeprazol', 'Caja 14 cápsulas', 15.00, 28.00, 7, 'N');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Vitamina C 1000mg', 'Suplemento de vitamina C', 'MED006', 'Ácido ascórbico', 'Frasco 30 tabletas', 18.00, 35.00, 5, 'N');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Azitromicina 500mg', 'Antibiótico macrólido', 'MED007', 'Azitromicina', 'Caja 3 tabletas', 30.00, 55.00, 2, 'S');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Diclofenaco 50mg', 'Antiinflamatorio potente', 'MED008', 'Diclofenaco sódico', 'Caja 20 tabletas', 10.00, 18.50, 3, 'N');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Tabcin Antigripal', 'Alivio de síntomas de gripe', 'MED009', 'Paracetamol/Fenilefrina', 'Caja 12 tabletas', 9.00, 16.50, 4, 'N');
INSERT INTO medicamentos (nombre, descripcion, codigo_barras, principio_activo, presentacion, precio_compra, precio_venta, id_categoria, requiere_receta)
VALUES ('Clotrimazol Crema 1%', 'Antimicótico tópico', 'MED010', 'Clotrimazol', 'Tubo 20g', 14.00, 25.00, 8, 'N');

-- Puestos
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Gerente General', 'Dirección general de la empresa', 25000.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Gerente de Sucursal', 'Administración de sucursal', 12000.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Farmacéutico', 'Despacho y asesoría de medicamentos', 8000.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Auxiliar de Farmacia', 'Apoyo en despacho y atención', 4500.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Cajero', 'Manejo de caja y cobros', 4000.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Repartidor', 'Entrega de medicamentos a domicilio', 4000.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Bodeguero', 'Control de inventario y bodega', 4000.00);
INSERT INTO puestos (nombre, descripcion, salario_base) VALUES ('Contador', 'Gestión contable y financiera', 10000.00);

-- Empleados
INSERT INTO empleados (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal)
VALUES ('Carlos', 'Mendoza', '1234567890101', TO_DATE('1985-03-15','YYYY-MM-DD'), 'Zona 10, Guatemala', '5555-0001', 'carlos.mendoza@farmacia.gt', 1, 1);
INSERT INTO empleados (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal)
VALUES ('María', 'González', '2345678901202', TO_DATE('1990-07-20','YYYY-MM-DD'), 'Zona 11, Guatemala', '5555-0002', 'maria.gonzalez@farmacia.gt', 2, 1);
INSERT INTO empleados (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal)
VALUES ('Juan', 'Pérez', '3456789012303', TO_DATE('1992-01-10','YYYY-MM-DD'), 'Zona 7, Mixco', '5555-0003', 'juan.perez@farmacia.gt', 3, 1);
INSERT INTO empleados (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal)
VALUES ('Ana', 'López', '4567890123404', TO_DATE('1995-05-25','YYYY-MM-DD'), 'Zona 12, Guatemala', '5555-0004', 'ana.lopez@farmacia.gt', 4, 1);
INSERT INTO empleados (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal)
VALUES ('Roberto', 'García', '5678901234505', TO_DATE('1988-11-08','YYYY-MM-DD'), 'Villa Nueva', '5555-0005', 'roberto.garcia@farmacia.gt', 2, 2);
INSERT INTO empleados (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal)
VALUES ('Sandra', 'Martínez', '6789012345606', TO_DATE('1993-09-12','YYYY-MM-DD'), 'Mixco', '5555-0006', 'sandra.martinez@farmacia.gt', 3, 3);
INSERT INTO empleados (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal)
VALUES ('Pedro', 'Ramírez', '7890123456707', TO_DATE('1996-04-30','YYYY-MM-DD'), 'Zona 1, Guatemala', '5555-0007', 'pedro.ramirez@farmacia.gt', 6, 1);
INSERT INTO empleados (nombre, apellido, dpi, fecha_nacimiento, direccion, telefono, email, id_puesto, id_sucursal)
VALUES ('Lucia', 'Hernández', '8901234567808', TO_DATE('1991-12-18','YYYY-MM-DD'), 'Antigua Guatemala', '5555-0008', 'lucia.hernandez@farmacia.gt', 5, 5);

-- Roles del sistema
INSERT INTO roles (nombre, descripcion) VALUES ('ADMIN', 'Administrador del sistema con acceso total');
INSERT INTO roles (nombre, descripcion) VALUES ('GERENTE', 'Gerente con acceso a reportes y gestión');
INSERT INTO roles (nombre, descripcion) VALUES ('FARMACEUTICO', 'Acceso a inventario y ventas');
INSERT INTO roles (nombre, descripcion) VALUES ('CAJERO', 'Acceso solo a ventas');
INSERT INTO roles (nombre, descripcion) VALUES ('AUDITOR', 'Acceso de solo lectura a reportes y auditoría');

-- Usuario administrador (password: admin123)
INSERT INTO usuarios (username, password_hash, email, id_empleado, id_rol)
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@farmacia.gt', 1, 1);

-- Proveedores
INSERT INTO proveedores (nombre, nit, direccion, telefono, email, nombre_contacto)
VALUES ('Distribuidora Farmacéutica Nacional', '12345678-9', 'Zona 13, Guatemala', '2300-0001', 'ventas@dfn.gt', 'Mario Estrada');
INSERT INTO proveedores (nombre, nit, direccion, telefono, email, nombre_contacto)
VALUES ('MediLab Guatemala', '98765432-1', 'Zona 10, Guatemala', '2300-0002', 'pedidos@medilab.gt', 'Laura Vásquez');
INSERT INTO proveedores (nombre, nit, direccion, telefono, email, nombre_contacto)
VALUES ('Farma Import S.A.', '56789012-3', 'Zona 4, Guatemala', '2300-0003', 'ventas@farmaimport.gt', 'Diego Morales');

-- Clientes
INSERT INTO clientes (nombre, apellido, nit, direccion, telefono, email)
VALUES ('José', 'Castillo', '11223344-5', 'Zona 15, Guatemala', '4444-0001', 'jose.castillo@email.com');
INSERT INTO clientes (nombre, apellido, nit, direccion, telefono, email)
VALUES ('Carmen', 'Flores', '22334455-6', 'Zona 10, Guatemala', '4444-0002', 'carmen.flores@email.com');
INSERT INTO clientes (nombre, apellido, nit, direccion, telefono, email)
VALUES ('Miguel', 'Torres', 'C/F', 'Mixco', '4444-0003', 'miguel.torres@email.com');

-- Inventario inicial
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (1, 1, 150, 20, 300);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (1, 2, 80, 15, 200);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (1, 3, 50, 10, 100);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (1, 4, 100, 20, 250);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (1, 5, 60, 10, 150);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (2, 1, 120, 20, 300);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (2, 2, 90, 15, 200);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (2, 3, 40, 10, 100);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (3, 1, 50, 10, 100);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (3, 4, 30, 5, 80);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (4, 1, 100, 15, 200);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (4, 5, 45, 10, 120);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (5, 1, 80, 15, 200);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (5, 6, 60, 10, 150);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (6, 1, 70, 10, 150);
INSERT INTO inventario (id_sucursal, id_medicamento, cantidad, stock_minimo, stock_maximo) VALUES (6, 7, 25, 5, 60);

-- Categorías de activos fijos
INSERT INTO categorias_activo (nombre, vida_util_anios, porcentaje_depreciacion) VALUES ('Mobiliario y Equipo', 5, 20.00);
INSERT INTO categorias_activo (nombre, vida_util_anios, porcentaje_depreciacion) VALUES ('Equipo de Cómputo', 3, 33.33);
INSERT INTO categorias_activo (nombre, vida_util_anios, porcentaje_depreciacion) VALUES ('Vehículos', 5, 20.00);
INSERT INTO categorias_activo (nombre, vida_util_anios, porcentaje_depreciacion) VALUES ('Equipo de Refrigeración', 10, 10.00);

-- Activos fijos
INSERT INTO activos_fijos (nombre, descripcion, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, depreciacion_acumulada, valor_actual, id_sucursal)
VALUES ('Mostrador Principal', 'Mostrador de madera para despacho', 'ACT-001', 1, 5000.00, TO_DATE('2024-01-15','YYYY-MM-DD'), 1666.67, 3333.33, 1);
INSERT INTO activos_fijos (nombre, descripcion, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, depreciacion_acumulada, valor_actual, id_sucursal)
VALUES ('Computadora POS', 'Computadora punto de venta', 'ACT-002', 2, 8000.00, TO_DATE('2024-03-01','YYYY-MM-DD'), 4444.44, 3555.56, 1);
INSERT INTO activos_fijos (nombre, descripcion, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, depreciacion_acumulada, valor_actual, id_sucursal)
VALUES ('Motocicleta Delivery', 'Moto para entregas a domicilio', 'ACT-003', 3, 15000.00, TO_DATE('2024-06-01','YYYY-MM-DD'), 4500.00, 10500.00, 1);
INSERT INTO activos_fijos (nombre, descripcion, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, depreciacion_acumulada, valor_actual, id_sucursal)
VALUES ('Refrigerador Medicamentos', 'Refrigerador para cadena de frío', 'ACT-004', 4, 12000.00, TO_DATE('2024-01-15','YYYY-MM-DD'), 2000.00, 10000.00, 1);
INSERT INTO activos_fijos (nombre, descripcion, codigo_activo, id_categoria, valor_adquisicion, fecha_adquisicion, depreciacion_acumulada, valor_actual, id_sucursal)
VALUES ('Computadora POS Oakland', 'Computadora punto de venta', 'ACT-005', 2, 8000.00, TO_DATE('2024-05-01','YYYY-MM-DD'), 3555.56, 4444.44, 2);

COMMIT;
