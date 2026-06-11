import { logo } from '../../assets';

export default function Loader() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <img src={logo} alt="" className="h-14 w-auto animate-pulse opacity-90" />
        <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-marquee rounded-full bg-ember" />
        </div>
      </div>
    </div>
  );
}
