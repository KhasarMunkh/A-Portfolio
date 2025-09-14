const skills = [
    { name: "JavaScript" },
    { name: "React" },
    { name: "Node.js" },
    { name: "CSS" },
    { name: "HTML" },

    // Tools
    { name: "Git" },
    { name: "Webpack" },
    { name: "Babel" },
    { name: "Neovim btw" },
];
export default function SkillsSection() {
    return (
        <section id="skills" className="py-24 px-4 relative bg-secondary/30">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    My <span className="text-primary">Skills</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill, key) => (
                        <div
                            key={key}
                            className="bg-card p-6 rounded-lg shadow-xs card-hover"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">{skill.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
