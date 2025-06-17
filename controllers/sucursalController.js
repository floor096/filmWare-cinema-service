const db = require('../config/db');

exports.crearSucursal = async (req, res) => {
    const { nombre, numero_de_salas, capacidad, calle, numero, localidad, ciudad, provincia } = req.body;
    const adminId = req.user.id;

    if (!nombre || !numero_de_salas || !capacidad || !calle || !numero || !localidad || !ciudad || !provincia) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const [direccionResult] = await db.promise().query(
            'INSERT INTO direccion (calle, numero, localidad, ciudad, provincia) VALUES (?, ?, ?, ?, ?)',
            [calle, numero, localidad, ciudad, provincia]
        );

        const direccionId = direccionResult.insertId;

        await db.promise().query(
            'INSERT INTO sucursales (nombre, numero_de_salas, capacidad, direccion, admin_id) VALUES (?, ?, ?, ?, ?)',
            [nombre, numero_de_salas, capacidad, direccionId, adminId]
        );

        res.status(201).json({ message: 'Sucursal registrada correctamente' });
    } catch (err) {
        console.error('Error al registrar sucursal:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.obtenerSucursales = async (req, res) => {
    const adminId = req.user.id;

    try {
        const [rows] = await db.promise().query(
            `SELECT s.id, s.nombre, s.numero_de_salas, s.capacidad,
              d.calle, d.numero, d.localidad, d.ciudad, d.provincia
       FROM sucursales s
       JOIN direccion d ON s.direccion = d.id
       WHERE s.admin_id = ?`,
            [adminId]
        );

        res.json(rows);
    } catch (err) {
        console.error('Error al obtener sucursales:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


exports.actualizarSucursal = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;
    const { nombre, numero_de_salas, capacidad, calle, numero, localidad, ciudad, provincia } = req.body;

    try {
        // Buscar ID de dirección actual de esa sucursal
        const [[sucursal]] = await db.promise().query(
            'SELECT direccion FROM sucursales WHERE id = ? AND admin_id = ?',
            [id, adminId]
        );

        if (!sucursal) return res.status(404).json({ message: 'Sucursal no encontrada' });

        // Actualizar dirección
        await db.promise().query(
            `UPDATE direccion SET calle = ?, numero = ?, localidad = ?, ciudad = ?, provincia = ? WHERE id = ?`,
            [calle, numero, localidad, ciudad, provincia, sucursal.direccion]
        );

        // Actualizar sucursal
        await db.promise().query(
            `UPDATE sucursales SET nombre = ?, numero_de_salas = ?, capacidad = ? WHERE id = ? AND admin_id = ?`,
            [nombre, numero_de_salas, capacidad, id, adminId]
        );

        res.json({ message: 'Sucursal actualizada correctamente' });
    } catch (err) {
        console.error('Error al actualizar sucursal:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.eliminarSucursal = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id;

    try {
        // Obtener ID de dirección para eliminarla luego
        const [[sucursal]] = await db.promise().query(
            'SELECT direccion FROM sucursales WHERE id = ? AND admin_id = ?',
            [id, adminId]
        );

        if (!sucursal) return res.status(404).json({ message: 'Sucursal no encontrada' });

        await db.promise().query('DELETE FROM sucursales WHERE id = ? AND admin_id = ?', [id, adminId]);
        await db.promise().query('DELETE FROM direccion WHERE id = ?', [sucursal.direccion]);

        res.json({ message: 'Sucursal eliminada correctamente' });
    } catch (err) {
        console.error('Error al eliminar sucursal:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
  