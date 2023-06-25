import MyWallet from '../components/my-wallet';

type PageProps = {
  params: {
    walletId: string;
  };
};

const HomePage = async ({ params }: PageProps) => {
  return (
    <div>
      <h1>Meus investimentos</h1>
      {/* @ts-expect-error */}
      <MyWallet walletId={params.walletId} />
    </div>
  );
};

export default HomePage;
