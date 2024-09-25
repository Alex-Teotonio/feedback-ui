import { title, subtitle } from "@/components/primitives";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Compartilhe&nbsp;</span>
          <span className={title({ color: "violet" })}>
            {" "}
            experiências&nbsp;
          </span>
          <br />
          <span className={title()}>Deixe seu feedback!</span>
          <div className={subtitle({ class: "mt-4" })}>
            Avalie e compartilhe seu feedback sobre produtos de múltiplas
            empresas!
          </div>
        </div>
      </section>
    </div>
  );
}
