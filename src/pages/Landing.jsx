import { Link } from "react-router-dom";
import {
  Mail, MessageSquare, Smartphone, GitBranch, BarChart3, LinkIcon,
  ArrowRight, CheckCircle2, Star, ChevronDown, Zap, Shield, Clock, Users, Menu, X
} from "lucide-react";
import { useState } from "react";

const features = [
  { icon: Mail, title: "Multi-Channel Reminders", desc: "Send automated reminders via Email, SMS, and WhatsApp from a single platform." },
  { icon: GitBranch, title: "Smart Sequences", desc: "Build intelligent follow-up sequences that escalate based on payment behavior." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track recovery rates, channel performance, and aging summaries in real-time." },
  { icon: LinkIcon, title: "Payment Links", desc: "Generate secure one-click payment links for faster collections." },
  { icon: Shield, title: "Compliance Built-In", desc: "Stay compliant with automated scheduling and respectful communication templates." },
  { icon: Users, title: "Customer Portal", desc: "Give debtors a branded portal to view invoices and make payments easily." },
];

const steps = [
  { num: "01", title: "Import Your Invoices", desc: "Upload your outstanding invoices or connect your accounting software." },
  { num: "02", title: "Set Up Sequences", desc: "Create automated reminder flows with custom timing and channels." },
  { num: "03", title: "Watch Payments Roll In", desc: "Sit back as Collectly handles follow-ups and collects payments." },
];

const plans = [
  { name: "Starter", price: 19, desc: "For freelancers and small teams", features: ["Up to 50 customers", "500 reminders/mo", "Email channel", "Basic templates", "Payment links"], popular: false },
  { name: "Pro", price: 49, desc: "For growing businesses", features: ["Unlimited customers", "5,000 reminders/mo", "Email + SMS + WhatsApp", "Custom sequences", "Analytics dashboard", "Team collaboration", "Priority support"], popular: true },
  { name: "Enterprise", price: 149, desc: "For large organizations", features: ["Everything in Pro", "Unlimited reminders", "API access", "Custom integrations", "Dedicated account manager", "SLA guarantee", "White-label option"], popular: false },
];

const testimonials = [
  { name: "Sarah Chen", role: "CFO, TechFlow Inc.", quote: "Collectly reduced our DSO by 40% in just two months. The automated sequences are a game-changer.", rating: 5 },
  { name: "Marcus Johnson", role: "Owner, MJ Consulting", quote: "I used to spend hours chasing payments. Now Collectly handles it all while I focus on growing my business.", rating: 5 },
  { name: "Emma Williams", role: "AR Manager, Bright Solutions", quote: "The multi-channel approach is brilliant. Our customers respond much faster to SMS reminders.", rating: 5 },
];

const faqs = [
  { q: "How do I get started?", a: "Simply sign up for an account, import your invoices, and you can start automating your collection process immediately." },
  { q: "Can I integrate with my accounting software?", a: "Yes! We integrate with QuickBooks, Xero, FreshBooks, and more. You can also import invoices via CSV." },
  { q: "Is customer data secure?", a: "Absolutely. We use bank-level encryption, are SOC 2 compliant, and never share your data with third parties." },
  { q: "What channels can I use for reminders?", a: "Email, SMS, and WhatsApp. You can mix channels within a single sequence for maximum effectiveness." },
  { q: "Can customers pay directly from the reminder?", a: "Yes! Every reminder includes a secure payment link. Customers can pay via credit card, ACH, or PayPal." },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen bg-card">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">C</div>
            <span className="text-xl font-bold text-foreground">Collectly</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{link.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="hidden sm:inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
              Get Started
            </Link>
            <button 
              className="inline-flex md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40  md:hidden" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <div className="absolute inset-x-0 top-16 z-50 md:hidden border-b border-border bg-card p-6 shadow-2xl animate-in slide-in-from-top duration-300">
              <div className="flex flex-col gap-4">
                {navLinks.map(link => (
                  <a 
                    key={link.label} 
                    href={link.href} 
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <hr className="border-border my-2" />
                <Link to="/login" className="text-lg font-medium hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                <Link to="/signup" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-4 text-base font-bold text-primary-foreground shadow-lg hover:opacity-95 active:scale-95 transition-all" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-card to-card" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Zap className="h-4 w-4" />
              Trusted by 2,000+ businesses
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Smart Payment Reminders &{" "}
              <span className="text-primary">Debt Collection</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Automate follow-ups, improve cash flow, and reduce overdue payments. Multi-channel reminders that get you paid faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
                Get Started <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold text-foreground hover:bg-muted transition-colors">
                Watch Demo
              </button>
            </div>
            {/* <div className="mt-8 flex md:items-center gap-6 text-sm text-muted-foreground flex-col   md:flex-row">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Instant access</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Cancel anytime</span>
            </div> */}
          </div>
 
          {/* Dashboard Preview */}
          {/* <div className="mt-12 md:mt-16 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-muted/50">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
            </div>
            <div className="p-6 bg-background">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Overdue", value: "$24,500", color: "text-destructive" },
                  { label: "Recovery Rate", value: "78%", color: "text-success" },
                  { label: "Reminders Sent", value: "1,234", color: "text-primary" },
                  { label: "Open Invoices", value: "45", color: "text-warning" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-xl md:text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="h-40 rounded-lg bg-muted/50 flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-border" />
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to get paid faster</h2>
            <p className="mt-4 text-lg text-muted-foreground">Powerful tools to automate your collection process from first reminder to final payment.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <div key={f.title} className="group rounded-2xl border border-border bg-card p-8 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="rounded-xl bg-primary/10 p-3 w-fit text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Get started in minutes, not days.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(step => (
              <div key={step.num} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold">{step.num}</div>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">No hidden fees. No surprises. Choose the plan that fits your business.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map(plan => (
              <div key={plan.name} className={`relative rounded-2xl border bg-card p-8 ${plan.popular ? "border-primary shadow-xl scale-105" : "border-border"}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">Most Popular</span>
                )}
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Link
                  to="/signup"
                  className={`mt-6 flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${plan.popular ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border hover:bg-muted"}`}
                >
                  Get Started
                </Link>
                <ul className="mt-8 space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Loved by businesses everywhere</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map(t => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Ready to get paid faster?</h2>
          <p className="mt-4 text-lg opacity-80">Join 2,000+ businesses using Collectly to automate their collections.</p>
          <Link to="/signup" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">C</div>
                <span className="text-lg font-bold">Collectly</span>
              </div>
              <p className="text-sm text-muted-foreground">Smart payment reminders and debt collection for modern businesses.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Integrations", "API Docs"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2024 Collectly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
