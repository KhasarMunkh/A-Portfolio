import { FaFileAlt, FaDownload } from "react-icons/fa";

const RESUME_FILE = "/Munkh-Erdene, Khasar Resume.pdf";

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-0 py-8 md:space-y-16 md:px-4 md:py-12">
      <section className="space-y-6 px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FaFileAlt className="text-accent text-4xl" />
            <h1 className="text-4xl font-bold text-text">Resume</h1>
          </div>
          <a
            href={RESUME_FILE}
            download
            className="inline-flex items-center gap-2 rounded-md bg-surface0 px-4 py-2 text-sm text-text transition-colors duration-200 hover:bg-surface1"
          >
            <FaDownload className="size-4" />
            Download PDF
          </a>
        </div>

        <div className="overflow-hidden rounded-xl border border-surface1 bg-mantle">
          <iframe
            src={RESUME_FILE}
            title="Resume"
            className="h-[80vh] w-full"
          />
        </div>
      </section>
    </div>
  );
}
