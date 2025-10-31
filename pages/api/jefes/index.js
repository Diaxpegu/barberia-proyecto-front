import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const jefesCollection = db.collection('jefes');

    // Obtener todos los jefes (sin contraseñas)
    const jefes = await jefesCollection.find({}, {
      projection: { contrasena: 0 } 
    }).toArray();

    res.status(200).json({ jefes });

  } catch (error) {
    console.error('Error obteniendo jefes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}