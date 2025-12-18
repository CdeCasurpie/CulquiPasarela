import { CulqiToken } from '@/types';

declare global {
  interface Window {
    Culqi: any;
  }
}

class CulqiService {
  private static instance: CulqiService;
  private culqiLoaded = false;

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

  // Abrir Checkout de Culqi (MOCK para desarrollo)
  async openCheckout(
    amount: number,
    description: string,
    email: string
  ): Promise<CulqiToken> {
    // MOCK: Simular el flujo de Culqi sin script real
    return new Promise((resolve, reject) => {
      // Simular ventana modal
      const shouldSucceed = window.confirm(
        `🔒 MOCK: Culqi Checkout\n\n` +
        `Producto: ${description}\n` +
        `Monto: S/ ${amount.toFixed(2)}\n` +
        `Email: ${email}\n\n` +
        `Haz clic en OK para simular pago exitoso`
      );
    

      if (shouldSucceed) {
        // Simular token de Culqi
        setTimeout(() => {
          resolve({
            id: `tkn_mock_${Date.now()}`,
            object: 'token',
            email: email,
            card_number: '411111******1111',
            creation_date: Date.now()
          });
        }, 1000);
      } else {
        reject(new Error('Pago cancelado por el usuario'));
      }
    });
  }

  // Configurar Culqi real (cuando tengas las credenciales)
  configureRealCulqi(publicKey: string, amount: number, description: string, email: string) {
    if (typeof window === 'undefined' || !window.Culqi) {
      console.warn('Culqi no está cargado');
      return;
    }

    window.Culqi.publicKey = publicKey;
    window.Culqi.settings({
      title: 'CulqiPay',
      currency: 'PEN',
      amount: amount * 100, // Culqi usa centavos
      order: `order-${Date.now()}`,
    });

    window.Culqi.options({
      lang: 'es',
      installments: false,
      paymentMethods: {
        tarjeta: true,
        yape: false,
      },
    });
  }

  // Función que se llamará cuando estés listo para usar Culqi real
  openRealCheckout(): Promise<CulqiToken> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.Culqi) {
        reject(new Error('Culqi no está configurado'));
        return;
      }

      // Handler de éxito
      window.culqiSuccessHandler = () => {
        if (window.Culqi.token) {
          resolve(window.Culqi.token);
        }
      };

      // Handler de error
      window.culqiErrorHandler = () => {
        reject(new Error(window.Culqi.error.user_message));
      };

      // Abrir checkout
      window.Culqi.open();
    });
  }
}

export default CulqiService.getInstance();
