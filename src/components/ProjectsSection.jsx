import tetris from "../assets/tetris.png";
import ascii from "../assets/go-ascii.png";
const projects = [
  {
    id: 1,
    title: "A project title",
    description: "a project descriotn goes here!",
    image: tetris,
    tags: ["React", "Tailwind", "Next.js"],
    gitUrl: "#",
  },
  {
    id: 2,
    title: "A project title",
    description: "a project descriotn goes here!",
    image: tetris,
    tags: ["React", "Tailwind", "Next.js"],
    gitUrl: "#",
  },
  {
    id: 3,
    title: "A project title",
    description: "a project descriotn goes here!",
    image: ascii,
    tags: ["React", "Tailwind", "Next.js"],
    gitUrl: "#",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-4 relative ">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Featured <span className="text-primary">Projects</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
          nam quas est quia error. Quibusdam odio sunt dolor deleniti tempora
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, key) => (
            <div
              key={key}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-hover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, key) => (
                    <span
                      key={key}
                      className="border px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
