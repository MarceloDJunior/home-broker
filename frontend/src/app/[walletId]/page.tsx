import { MyWallet } from '../components/my-wallet';

type PageProps = {
  params: {
    walletId: string;
  };
};

const HomePage = async ({ params }: PageProps) => {
  return (
    <main className="container mx-auto px-2 py-5">
      <article className="format format-invert py-3 mb-2">
        <h1>Meus investimentos</h1>
      </article>

      {/* @ts-expect-error */}
      <MyWallet walletId={params.walletId} />
    </main>
  );
};

export default HomePage;
