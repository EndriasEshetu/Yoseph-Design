import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Eye,
  Database,
  Lock,
  Users,
  Clock3,
} from "lucide-react";

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content:
      "We collect information you voluntarily share with us, such as your name, email address, and message when you contact us or subscribe to our newsletter. We may also collect basic device and usage information to improve site performance.",
  },
  {
    icon: Database,
    title: "How We Use Information",
    content:
      "We use the information we collect to respond to inquiries, send newsletter updates if you subscribe, improve our website, and maintain the security and reliability of our services.",
  },
  {
    icon: Users,
    title: "Sharing Information",
    content:
      "We do not sell your personal information. We may share limited information with trusted service providers who help us operate the website, send email communications, or analyze performance, subject to confidentiality obligations.",
  },
  {
    icon: Lock,
    title: "Data Security",
    content:
      "We take reasonable administrative and technical measures to protect your information. However, no online transmission or storage system can be guaranteed to be completely secure.",
  },
  {
    icon: Clock3,
    title: "Data Retention",
    content:
      "We keep personal information only as long as needed for the purposes described in this policy, unless a longer retention period is required by law or necessary to resolve disputes and enforce agreements.",
  },
  {
    icon: Mail,
    title: "Your Choices",
    content:
      "You may unsubscribe from marketing emails at any time by using the unsubscribe link in the message or by contacting us directly. You may also request access, correction, or deletion of your personal data where applicable.",
  },
];

export const PrivacyPolicyPage = () => {
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
              <ShieldCheck size={14} />
              Privacy Policy
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-light text-neutral-900 leading-tight font-playfair">
              How we handle your information.
            </h1>
            <p className="mt-5 text-[15px] md:text-base leading-8 text-neutral-600 max-w-2xl">
              This policy explains what we collect, how we use it, and the
              choices you have when using the Yoseph Design website and related
              services.
            </p>
            <p className="mt-3 text-sm text-neutral-500">
              Last updated: April 15, 2026
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6">
            {sections.map((section, index) => (
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
            <h2 className="text-lg md:text-xl font-semibold">Contact Us</h2>
            <p className="mt-3 text-sm md:text-[15px] leading-7 text-neutral-300 max-w-3xl">
              If you have questions about this policy or want to exercise your
              privacy rights, contact us at{" "}
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
