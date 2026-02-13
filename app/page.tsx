import ProjectCard from "@/components/ProjectCard";
import ThemePicker from "@/components/ThemePicker";
import ContactCard from "@/components/ContactCard";
import { goAscii, termfolio } from "@/lib/projects";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";

export default function Home() {
    return (
        <div className="mx-auto max-w-6xl space-y-12 px-0 py-8 md:space-y-16 md:px-4 md:py-12">
            {/* Section 1: Intro/hero */}
            <section className="space-y-5 px-4 md:px-0 flex gap-6">
                <div className="relative size-64">
                    <Image
                        src="/flopped.png"
                        alt="Khasar"
                        fill
                        className="object-cover rounded-full"
                    />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-left text-text">
                        Hi, I&apos;m <span className="text-accent">Khasar</span>
                    </h1>
                    <p className="text-subtext0 max-w-prose text-lg leading-relaxed">
                        A computer science student based in{" "}
                        <span className="text-text font-bold">Denver, CO </span>
                        at{" "}
                        <span className="font-bold text-text">CU Denver </span>
                        and{" "}
                        <span className="font-bold text-text">full-stack </span>
                        developer who enjoys clean architecture, performant
                        systems, and finely tuned dev environments. I’m a{" "}
                        <span className="font-bold text-text">Neovim </span>
                        power user and
                        <span className="font-bold text-text">
                            {" "}
                            Arch Linux{" "}
                        </span>
                        enjoyer, and when I’m not building side projects, you’ll
                        usually find me competing in{" "}
                        <span className="font-bold text-text">
                            {" "}
                            League of Legends{" "}
                        </span>
                        at a Master’s level.
                    </p>
                    <div className="flex gap-3">
                        <Link
                            href="https://github.com/KhasarMunkh"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open Github profile in new tab"
                        >
                            <FaGithub className="w-6 h-6" />
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/khasarmunkh/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open linkedin profile in new tab"
                        >
                            <FaLinkedin className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Section 2: Featured Projects */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-3xl text-text flex items-center gap-2"> 
                        <FaRegStar className="text-accent"/>
                        Featured Projects 
                    </h2>
                    <Link href="/projects" className="text-accent hover:bg-accent hover:text-mantle decoration-dashed underline-offset-4 duration-200 not-hover:underline">View All...</Link>
                </div>
                {/* Project 1: Go-Ascii */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <ProjectCard {...goAscii} />
                    <ProjectCard {...termfolio} />
                </div>
            </section>

            {/* Section 3: Knick Knacks */}
            <section className="px-4 md:px-0">
                <div className="grid grid-cols-1 justify-center gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
                    <ThemePicker />
                    <ContactCard />
                    <ContactCard />
                </div>
            </section>
        </div>
    );
}
