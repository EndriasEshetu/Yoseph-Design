import { motion } from "framer-motion";
import {
  ScrollText,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Mail,
} from "lucide-react";

const termsSections = [
  {
    icon: FileText,
    title: "Use of the Website",
    content:
      "You may browse the website and use its features for personal, non-commercial purposes. You agree not to misuse the site, attempt unauthorized access, or interfere with its operation.",
  },
  {
    icon: Sparkles,
    title: "Content and Intellectual Property",
    content:
      "All content on this website, including text, images, branding, and design elements, is owned by Yoseph Design or used with permission. You may not copy, reproduce, or redistribute content without prior written consent.",
  },
  {
    icon: ShieldCheck,
    title: "Services and Estimates",
    content:
      "Any project descriptions, service details, or estimates shown on the site are for informational purposes only and may change based on project scope, availability, and final agreement.",
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content:
      "We make reasonable efforts to keep the site accurate and available, but we do not guarantee uninterrupted access or error-free content. To the fullest extent permitted by law, we are not liable for indirect or consequential damages arising from use of the site.",
  },
  {
    icon: ScrollText,
    title: "Changes to These Terms",
    content:
      "We may update these terms from time to time. When we do, the updated version will be posted on this page with a revised date.",
  },
  {
    icon: Mail,
    title: "Contact",
    content:
      "If you have questions about these terms, contact us at yosephdesign@gmail.com.",
  },
];

export const TermsOfServicePage = () => {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(17,24,39,0.05),transparent_28%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700 mb-6">
              <ScrollText size={14} />
              Terms of Service
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-light text-neutral-900 leading-tight font-playfair">
              Terms that govern use of this website.
            </h1>
            <p className="mt-5 text-[15px] md:text-base leading-8 text-neutral-600 max-w-2xl">
              These terms explain how you may use the Yoseph Design website and
              the expectations that apply when accessing our content or
              contacting us through the site.
            </p>
            <p className="mt-3 text-sm text-neutral-500">
              Last updated: April 15, 2026
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6">
            {termsSections.map((section, index) => (
              <motion.article
                key={section.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="rounded-2xl border border-neutral-200 bg-white/90 p-6 md:p-7 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-100">
                    <section.icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-neutral-900">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm md:text-[15px] leading-7 text-neutral-600">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-8 rounded-2xl bg-neutral-900 px-6 py-7 md:px-8 md:py-8 text-white"
          >
            <h2 className="text-lg md:text-xl font-semibold">Questions</h2>
            <p className="mt-3 text-sm md:text-[15px] leading-7 text-neutral-300 max-w-3xl">
              For questions about these terms, reach out at{" "}
              <a
                className="text-amber-400 hover:text-amber-300 transition-colors"
                href="https://mail.google.com/mail/?view=cm&to=yosephdesign@gmail.com"
              >
                yosephdesign@gmail.com
              </a>
              .
            </p>
          </motion.section>
        </div>
      </section>
    </main>
  );
};
