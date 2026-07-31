import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { Benefits } from "@/components/sections/benefits";
import { Quality } from "@/components/sections/quality";
import { Showcase } from "@/components/sections/showcase";
import { Trust } from "@/components/sections/trust";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Quality />
        <Showcase />
        <Trust />
      </main>
      <Footer />
    </>
  );
}
