import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { nombre, usuario, contrasena, rol = "Jefe de barberos" } = req.body;

    if (!nombre || !usuario || !contrasena) {
      return res.status(400).json({ message: 'Nombre, usuario y contraseña son requeridos' });
    }

    const client = await clientPromise;
    const db = client.db();
    const jefesCollection = db.collection('jefes');

    // Verificar si el usuario ya existe
    const existingUser = await jefesCollection.findOne({ usuario });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo jefe
    const newJefe = {
      nombre,
      usuario,
      contrasena, 
      rol,
      fechaCreacion: new Date(),
      activo: true
    };

    const result = await jefesCollection.insertOne(newJefe);

    res.status(201).json({ 
      message: 'Jefe creado exitosamente',
      jefeId: result.insertedId 
    });

  } catch (error) {
    console.error('Error creando jefe:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}