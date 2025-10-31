import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { Nombre, Contraseña } = req.body;

    if (!Nombre || !Contraseña) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Buscar en la colección 'jefes' en lugar de 'users'
    const jefesCollection = db.collection('jefes');

    // Buscar usuario por el campo 'usuario'
    const user = await jefesCollection.findOne({ usuario: Nombre });

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Verificar contraseña (comparación directa ya que parece texto plano)
    // Si quieres mayor seguridad, puedes implementar bcrypt después
    const isPasswordValid = Contraseña === user.contrasena;

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Si es válido, devolver éxito (sin contraseña)
    const { contrasena, ...userWithoutPassword } = user;
    
    res.status(200).json({ 
      message: 'Login exitoso', 
      user: userWithoutPassword,
      role: user.rol // Incluir el rol para permisos
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}