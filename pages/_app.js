import { PrivyProvider } from '@privy-io/react-auth';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        loginMethods: ['twitter', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#00ff00',
          logo: 'https://thestrainlab.com/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'off',
        },
        supportedChains: [
          {
            id: 1,
            name: 'Solana Mainnet',
          },
        ],
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}

export default MyApp;
