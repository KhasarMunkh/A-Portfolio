import { Briefcase, Code, User } from "lucide-react";
export default function AboutSection() {
    return (
        <section id="about" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    About <span className="text-primary text-glow">me</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">
                            Starving Computer Science Student
                        </h3>
                        <p className="text-muted-foreground">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            Aspernatur maiores quis inventore totam, in perspiciatis eligendi
                            voluptas fugit voluptatibus cumque sed magnam quia, corrupti iusto
                            fugiat. Unde sapiente debitis facere!
                        </p>
                        <p className="text-muted-foreground">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                            Aspernatur maiores quis inventore totam, in perspiciatis eligendi
                            voluptas fugit voluptatibus cumque sed magnam quia, corrupti iusto
                            fugiat. Unde sapiente debitis facere!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                            <a href="#contact" className="cosmic-button">
                                Contact me
                            </a>
                            <a
                                href=""
                                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
                            >
                                Download CV
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Code className="h-6 w-6 text-cyan-400 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">Mogging Since 2002</h4>
                                    <p className="text-muted-background">
                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <User className="h-6 w-6 text-lime-400 [filter:drop-shadow(0_0_6px_currentColor)]" />
                                </div>

                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">UI/UX</h4>
                                    <p className="text-muted-background">
                                        Mogging intuitive user interfaces and seamless mogging
                                        experiences.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Briefcase className="h-6 w-6 text-pink-400 [filter:drop-shadow(0_0_6px_currentColor)]" />
                                </div>

                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">Making money moves</h4>
                                    <p className="text-muted-background">
                                        Climing the corporate ladder since 2002.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
