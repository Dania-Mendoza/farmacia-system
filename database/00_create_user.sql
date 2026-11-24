-- ============================================================
-- SCRIPT 00: CREACIÓN SEGURA DE USUARIO Y PERMISOS EN ORACLE XE
-- Ejecutar conectado como SYS o SYSTEM en SQL*Plus
-- ============================================================

-- Conectarse a la Pluggable Database (PDB) de Oracle XE 21c
ALTER SESSION SET CONTAINER = XEPDB1;

-- Verificar si el usuario ya existe y resetearlo de forma segura
DECLARE
    v_user_exists NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_user_exists FROM all_users WHERE username = 'FARMACIA_USER';
    IF v_user_exists > 0 THEN
        EXECUTE IMMEDIATE 'DROP USER FARMACIA_USER CASCADE';
        DBMS_OUTPUT.PUT_LINE('Usuario anterior FARMACIA_USER eliminado para recreación limpia.');
    END IF;
END;
/

-- Crear el usuario para el sistema de farmacias
CREATE USER FARMACIA_USER IDENTIFIED BY farmacia2024
DEFAULT TABLESPACE USERS
TEMPORARY TABLESPACE TEMP
QUOTA UNLIMITED ON USERS;

-- Otorgar privilegios requeridos
GRANT CONNECT, RESOURCE, DBA TO FARMACIA_USER;
GRANT CREATE SESSION TO FARMACIA_USER;
GRANT CREATE TABLE TO FARMACIA_USER;
GRANT CREATE VIEW TO FARMACIA_USER;
GRANT CREATE SEQUENCE TO FARMACIA_USER;
GRANT CREATE PROCEDURE TO FARMACIA_USER;
GRANT CREATE TRIGGER TO FARMACIA_USER;
GRANT UNLIMITED TABLESPACE TO FARMACIA_USER;

COMMIT;

PROMPT ========================================================
PROMPT Usuario FARMACIA_USER configurado exitosamente en XEPDB1.
PROMPT Credenciales:
PROMPT   Usuario:   FARMACIA_USER
PROMPT   Password:  farmacia2024
PROMPT   Servicio:  localhost:1521/XEPDB1
PROMPT Proceda a ejecutar:
PROMPT   CONNECT FARMACIA_USER/farmacia2024@localhost:1521/XEPDB1
PROMPT   @01_schema.sql
PROMPT   @02_seed_data.sql
PROMPT ========================================================
