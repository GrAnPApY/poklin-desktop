import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    const validatedData = registerSchema.parse(body);
    
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        age: validatedData.age,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        age: true,
        email: true,
        createdAt: true,
      }
    });
    
    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}