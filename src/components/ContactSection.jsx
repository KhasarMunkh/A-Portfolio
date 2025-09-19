import { Mail, MapPin, Phone, Send } from "lucide-react";
import { cn } from "../lib/utils";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Contact <span className="text-primary">Me</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6"> Contact Info</h3>

            {/* Contact Info */}
            <div className="space-y-6 justify-center">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <a
                    href="mailto:khasar.munkherdene@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    khasar.munkherdene@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <a
                    href="tel:+17206168769"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (720) 616-8769
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Denver, CO
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-lg shadow-xs">
            <h3 className="text-2xl font-semibold mb-6">Say Hi</h3>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  {" "}
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 
                  rounded-md border border-input 
                  bg-background focus:outline-hidden 
                  focus:ring-2 focus:ring-primary"
                  placeholder="Name..."
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  {" "}
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 
                  rounded-md border border-input 
                  bg-background focus:outline-hidden 
                  focus:ring-2 focus:ring-primary"
                  placeholder="example@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="label"
                  className="block text-sm font-medium mb-2"
                >
                  {" "}
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full px-4 py-3 
                  rounded-md border border-input 
                  bg-background focus:outline-hidden 
                  focus:ring-2 focus:ring-primary"
                  placeholder="Say hello 👋"
                />
              </div>

              <button
                type="submit"
                className={cn(
                  "cosmic-button w-full flex items-center justify-center gap-2",
                )}
              >
                Send Message
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
