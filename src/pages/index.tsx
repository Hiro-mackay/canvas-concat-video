import dynamic from 'next/dynamic';

const PixiComponant = dynamic(() => import('../components/index'), {
  ssr: false
});

export default function Home() {
  return <PixiComponant />;
}
