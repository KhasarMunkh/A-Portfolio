import Navbar from "../components/Navbar";
import StarBackground from "../components/StarBackground";
import ThemeToggle from "../components/ThemeToggle";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection"



export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <ThemeToggle />
            <StarBackground />
            <Navbar />
            <main>
                <HeroSection />
                <AboutSection />
            </main>
        </div>
    )
}
