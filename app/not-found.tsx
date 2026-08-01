import Link from "next/link";
import Image from "next/image";
import Footer from "components/layout/footer";

export default function NotFound() {
  return (
    <>
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center md:py-32">
        <Image
          src="/brand/mascot.png"
          alt="Aqualux mascot"
          width={160}
          height={160}
          className="mb-6"
        />
        <h1 className="text-4xl font-semibold md:text-5xl">Bailed that one.</h1>
        <p className="mt-3 text-neutral-400">
          That page rolled away. Let&apos;s get you back on board.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#f2a93b] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Back home
          </Link>
          <Link
            href="/search"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:border-[#f2a93b] hover:text-[#f2a93b]"
          >
            Shop the catalog
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
