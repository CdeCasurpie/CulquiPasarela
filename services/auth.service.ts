import { User, Session } from '@/types';

// Mock de usuarios para desarrollo
const MOCK_USERS = [
  { id: '1', email: 'demo@culqi.com', password: 'demo123' },
  { id: '2', email: 'test@test.com', password: 'test123' }
];

class AuthService {
  private static instance: AuthService;
  private currentSession: Session | null = null;

  private constructor() {
    // Restaurar sesión del localStorage
    if (typeof window !== 'undefined') {
      const savedSession = localStorage.getItem('mock_session');
      if (savedSession) {
        this.currentSession = JSON.parse(savedSession);
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login mock
  async login(email: string, password: string): Promise<Session> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const session: Session = {
      user: { id: user.id, email: user.email },
      access_token: `mock_token_${user.id}_${Date.now()}`
    };

    this.currentSession = session;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_session', JSON.stringify(session));
    }

    return session;
  }

  // Registro mock
  async register(email: string, password: string): Promise<Session> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validar que el email no exista
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('El email ya está registrado');
    }

    // Crear nuevo usuario mock
    const newUser = {
      id: `${Date.now()}`,
      email,
      password
    };

    MOCK_USERS.push(newUser);

    const session: Session = {
      user: { id: newUser.id, email: newUser.email },
      access_token: `mock_token_${newUser.id}_${Date.now()}`
    };

    this.currentSession = session;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_session', JSON.stringify(session));
    }

    return session;
  }

  // Logout
  async logout(): Promise<void> {
    this.currentSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_session');
    }
  }

  // Obtener sesión actual
  getSession(): Session | null {
    return this.currentSession;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.currentSession !== null;
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentSession?.user || null;
  }
}

export default AuthService.getInstance();
