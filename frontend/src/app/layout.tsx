import './globals.css';
import DefaultNavbar from './components/navbar';
import FlowbiteContext from './components/flowbite-context';

export const metadata = {
  title: 'Home Broker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 h-screen flex flex-col">
        <DefaultNavbar />
        <FlowbiteContext>{children}</FlowbiteContext>
      </body>
    </html>
  );
}
