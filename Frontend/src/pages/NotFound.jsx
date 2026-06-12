import { Link } from 'react-router-dom';
import Seo from '../components/ui/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you are looking for does not exist." />
      <section className="flex min-h-[60vh] flex-col items-center justify-center bg-ink-900 px-6 text-center">
        <p className="font-display text-8xl text-ember">404</p>
        <h1 className="mt-4 font-display text-3xl uppercase tracking-wide text-sand">
          Off the trail
        </h1>
        <p className="mt-3 max-w-md text-haze">
          This page does not exist. Let us get you back on common ground.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back Home
        </Link>
      </section>
    </>
  );
}
