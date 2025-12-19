import { User, Session } from '@/types';
import { supabase } from '@/lib/supabase/client';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login con Supabase Auth
  async login(email: string, password: string): Promise<Session> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session || !data.user) {
      throw new Error('No se pudo iniciar sesión');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
      },
      access_token: data.session.access_token,
    };
  }

  // Registro con Supabase Auth
  async register(email: string, password: string): Promise<Session> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session || !data.user) {
      throw new Error('Usuario registrado. Por favor verifica tu email.');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
      },
      access_token: data.session.access_token,
    };
  }

  // Logout
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  // Obtener sesión actual
  async getSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email!,
        created_at: session.user.created_at,
      },
      access_token: session.access_token,
    };
  }

  // Verificar si está autenticado
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      created_at: user.created_at,
    };
  }

  // Escuchar cambios en la autenticación
  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        callback({
          user: {
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
          },
          access_token: session.access_token,
        });
      } else {
        callback(null);
      }
    });
  }
}

export default AuthService.getInstance();
