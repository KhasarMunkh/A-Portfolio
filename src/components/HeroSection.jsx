import { ArrowDown } from "lucide-react";

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex flex-col items-center justify-center px-4"
        >
            <div className="container max-w-4xl mx-auto text-center z-10">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        <span className="opacity-0 animate-fade-in"> Hey, I'm</span>
                        <span className="text-primary opacity-0 animate-fade-in-delay-1">
                            {" "}
                            Khasar
                        </span>
                        <span className="text-gradient opacity-0 animate-fade-in-delay-2">
                            {" "}
                            Munkh-Erdene
                        </span>
                    </h1>
                    <p className="animate-fade-in-delay-3 opacity-0 text-lg md:text-xl text-muted-foreground max-2xl mx-auto">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum,
                        facere. Nemo eos minima, officiis quasi sint provident possimus
                        quisquam odio, perferendis laboriosam quos vero ipsa sunt cupiditate
                        placeat hic. Architecto.
                    </p>
                    <div className="opacity-0 animate-fade-in-delay-4 pt-4">
                        <a href="#projects" className="cosmic-button">
                            View my work
                        </a>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
                <ArrowDown className="h-5 w-5 text-primary"/>
            </div>
        </section>
    );
}
