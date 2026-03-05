import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContact } from "@/hooks/useQueries";
import { CheckCircle, Clock, Loader2, Mail, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { toast } from "sonner";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "navneet@example.com" },
  { icon: MapPin, label: "Location", value: "Remote / Global" },
  { icon: Clock, label: "Availability", value: "Mon–Fri, 9am–6pm IST" },
];

const SOCIALS = [
  { icon: SiGithub, label: "GitHub", href: "#" },
  { icon: SiLinkedin, label: "LinkedIn", href: "#" },
  { icon: SiX, label: "X / Twitter", href: "#" },
];

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ContactSection() {
  const submitContact = useSubmitContact();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    await submitContact.mutateAsync(
      {
        id: generateId(),
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        timestamp: BigInt(Date.now()),
      },
      {
        onSuccess: () => {
          setSent(true);
          setForm({ name: "", email: "", subject: "", message: "" });
          toast.success("Message sent! I'll get back to you soon.");
        },
        onError: () => {
          toast.error("Failed to send. Please try again.");
        },
      },
    );
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none opacity-40" />
      <div className="absolute left-1/4 top-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="section-hidden mb-16 text-center">
          <span className="font-mono text-sm text-primary tracking-widest uppercase">
            05 / Contact
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl mt-3 gradient-text-cyber">
            Let's Build Together
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Have a project in mind or want to discuss AI, blockchain, or
            cutting-edge tech?
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 section-hidden">
          {/* Left — info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="glass rounded-xl p-4 flex items-center gap-3 border-gradient hover:border-primary/30 transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wide">
                      {label}
                    </p>
                    <p className="text-sm text-foreground/90 font-medium">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wide mb-3">
                Connect
              </p>
              <div className="flex gap-3">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 border border-transparent transition-all hover:-translate-y-0.5"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Status indicator */}
            <div className="glass rounded-xl p-4 border-gradient">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-foreground">
                  Open to opportunities
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Currently available for freelance projects, consulting, and
                full-time roles in AI/ML.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                data-ocid="contact.success_state"
                className="glass rounded-2xl p-10 text-center border-gradient h-full flex flex-col items-center justify-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center glow-cyan">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Thanks for reaching out. I'll get back to you within 24-48
                  hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-primary/30 hover:bg-primary/5"
                  onClick={() => setSent(false)}
                >
                  Send another message
                </Button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass rounded-2xl p-6 sm:p-8 border-gradient space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contact-name"
                      className="text-xs font-mono text-muted-foreground uppercase tracking-wide"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="contact-name"
                      data-ocid="contact.name_input"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="bg-muted/30 border-border/50 focus:border-primary/50 h-10 text-sm"
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contact-email"
                      className="text-xs font-mono text-muted-foreground uppercase tracking-wide"
                    >
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      data-ocid="contact.email_input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="bg-muted/30 border-border/50 focus:border-primary/50 h-10 text-sm"
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-subject"
                    className="text-xs font-mono text-muted-foreground uppercase tracking-wide"
                  >
                    Subject
                  </Label>
                  <Input
                    id="contact-subject"
                    data-ocid="contact.subject_input"
                    placeholder="Project collaboration / Consulting / Job opportunity"
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="bg-muted/30 border-border/50 focus:border-primary/50 h-10 text-sm"
                  />
                  {errors.subject && (
                    <p className="text-destructive text-xs">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-message"
                    className="text-xs font-mono text-muted-foreground uppercase tracking-wide"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    data-ocid="contact.message_textarea"
                    placeholder="Tell me about your project, idea, or opportunity..."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="bg-muted/30 border-border/50 focus:border-primary/50 resize-none text-sm"
                  />
                  {errors.message && (
                    <p className="text-destructive text-xs">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  data-ocid="contact.submit_button"
                  disabled={submitContact.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-5 shadow-glow-cyan hover:shadow-glow-cyan transition-all"
                >
                  {submitContact.isPending ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
