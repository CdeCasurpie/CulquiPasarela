import { CulqiToken } from '@/types';

declare global {
  interface Window {
    Culqi: any;
    culqiSuccessHandler: () => void;
    culqiErrorHandler: () => void;
  }
}

class CulqiService {
  private static instance: CulqiService;
  private culqiLoaded = false;
  private culqiPublicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

  private constructor() {}

  static getInstance(): CulqiService {
    if (!CulqiService.instance) {
      CulqiService.instance = new CulqiService();
    }
    return CulqiService.instance;
  }

  // Cargar script de Culqi
  loadCulqiScript(): Promise<void> {
    if (this.culqiLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.culqi.com/js/v4';
      script.async = true;
      script.onload = () => {
        this.culqiLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Error al cargar Culqi'));
      document.head.appendChild(script);
    });
  }

  // Configurar y abrir Culqi Checkout REAL
  async openCheckout(
    amount: number,
    description: string,
    email: string
  ): Promise<CulqiToken> {
    if (!this.culqiPublicKey) {
      throw new Error('Falta la llave pública de Culqi en las variables de entorno');
    }

    // Cargar script de Culqi si no está cargado
    await this.loadCulqiScript();

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.Culqi) {
        reject(new Error('Culqi no está disponible'));
        return;
      }

      // Configurar llave pública
      window.Culqi.publicKey = this.culqiPublicKey;
      
      // Configurar settings de Culqi v4
      window.Culqi.settings({
        title: 'CulqiPay',
        currency: 'PEN',
        amount: Math.round(amount * 100), // Culqi usa centavos
      });

      // Configurar opciones de Culqi v4
      window.Culqi.options({
        lang: 'auto',
        installments: false,
        paymentMethods: {
          tarjeta: true,
          yape: false,
          billetera: false,
          bancaMovil: false,
          agente: false,
          cuotealo: false,
        },
        style: {
          logo: '',
          maincolor: '#eab308',
          buttontext: '#000000',
          maintext: '#4a5568',
          desctext: '#4a5568',
        },
      });

      // Configurar handler global para Culqi
      (window as any).culqi = function() {
        if (window.Culqi.token) {
          const token: CulqiToken = {
            id: window.Culqi.token.id,
            object: window.Culqi.token.object,
            email: window.Culqi.token.email,
            card_number: window.Culqi.token.card_number,
            creation_date: window.Culqi.token.creation_date,
          };
          resolve(token);
        } else if (window.Culqi.error) {
          const errorMessage = window.Culqi.error.user_message || 'Error en el proceso de pago';
          reject(new Error(errorMessage));
        }
      };

      // Abrir checkout
      try {
        window.Culqi.open();
      } catch (error) {
        reject(new Error('Error al abrir Culqi Checkout'));
      }
    });
  }
}

export default CulqiService.getInstance();
