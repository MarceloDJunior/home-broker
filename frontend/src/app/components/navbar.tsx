'use client';

import { Navbar } from 'flowbite-react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function DefaultNavbar() {
  const pathname = usePathname();
  const params = useParams();

  const walletId = params.walletId ?? 'wallet1';

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <Image
          className="mr-3 h-6 sm:h-9"
          alt="Full Cycle Invest"
          src="/logo.png"
          width={37}
          height={40}
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          FullCycle Invest
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          active={pathname === `/${walletId}`}
          as={Link}
          href={`/${walletId}`}
        >
          Home
        </Navbar.Link>
        <Navbar.Link href="#">Assets</Navbar.Link>
      </Navbar.Collapse>
      <div className="flex md:order-2 text-white">Hi, {walletId}</div>
    </Navbar>
  );
}
