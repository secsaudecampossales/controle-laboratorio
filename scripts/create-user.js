const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser() {
  try {
    // Verificar se já existe um usuário
    const existingUser = await prisma.usuario.findFirst();
    
    if (existingUser) {
      console.log('Usuário já existe no banco de dados');
      return;
    }

    // Criar usuário inicial
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const usuario = await prisma.usuario.create({
      data: {
        nome: 'Administrador',
        email: 'admin@laboratorio.com',
        senha: hashedPassword
      }
    });

    console.log('Usuário criado com sucesso:');
    console.log('Email: admin@laboratorio.com');
    console.log('Senha: admin123');
    console.log('ID:', usuario.id);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
