import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { ArrowLeft, Save, Bold, Italic, Underline, List, LinkIcon, Mail, Smartphone, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const channels = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: Smartphone },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
];

const variables = ["{{customer_name}}", "{{invoice_number}}", "{{amount}}", "{{due_date}}", "{{payment_link}}", "{{company_name}}"];

export default function TemplateEditor() {
  const [activeChannel, setActiveChannel] = useState("email");

  return (
    <AppLayout>
      <Header title="">
        <Link to="/templates" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mr-auto">
          <ArrowLeft className="h-4 w-4" /> Back to Templates
        </Link>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
          <Save className="h-4 w-4" /> Save Template
        </button>
      </Header>
      <main className="p-6 animate-fade-in">
        <input defaultValue="Friendly First Reminder" className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full mb-6 placeholder:text-muted-foreground" placeholder="Template name..." />

        {/* Channel tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {channels.map(ch => (
            <button key={ch.id} onClick={() => setActiveChannel(ch.id)} className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeChannel === ch.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <ch.icon className="h-4 w-4" /> {ch.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor */}
          <div className="space-y-4">
            {activeChannel === "email" && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Subject Line</label>
                <input defaultValue="Reminder: Invoice {{invoice_number}} due {{due_date}}" className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            )}

            {/* Variables */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Insert Variable</label>
              <div className="flex gap-2 flex-wrap">
                {variables.map(v => (
                  <button key={v} className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">{v}</button>
                ))}
              </div>
            </div>

            {/* Toolbar (email only) */}
            {activeChannel === "email" && (
              <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1 w-fit">
                {[Bold, Italic, Underline, List, LinkIcon].map((Icon, i) => (
                  <button key={i} className="rounded-md p-2 hover:bg-card text-muted-foreground hover:text-foreground transition-colors"><Icon className="h-4 w-4" /></button>
                ))}
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Content</label>
              <textarea
                rows={activeChannel === "sms" ? 4 : 10}
                defaultValue={`Hi {{customer_name}},\n\nThis is a friendly reminder that invoice {{invoice_number}} for {{amount}} is due on {{due_date}}.\n\nYou can make a payment easily using the link below:\n{{payment_link}}\n\nIf you've already sent the payment, please disregard this message.\n\nBest regards,\n{{company_name}}`}
                className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono leading-relaxed"
              />
              {activeChannel === "sms" && (
                <p className="text-xs text-muted-foreground mt-1">120 / 160 characters</p>
              )}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-sm font-medium mb-3">Preview</h3>
            {activeChannel === "email" ? (
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b border-border">
                  <p className="text-xs text-muted-foreground">Subject:</p>
                  <p className="text-sm font-medium">Reminder: Invoice INV-001 due March 1, 2024</p>
                </div>
                <div className="p-6 text-sm leading-relaxed">
                  <p>Hi John,</p>
                  <br />
                  <p>This is a friendly reminder that invoice INV-001 for $500.00 is due on March 1, 2024.</p>
                  <br />
                  <p>You can make a payment easily using the link below:</p>
                  <p className="text-primary underline">https://pay.collectly.com/inv-001</p>
                  <br />
                  <p>If you've already sent the payment, please disregard this message.</p>
                  <br />
                  <p>Best regards,<br />Collectly Inc.</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-72 rounded-3xl border-4 border-secondary bg-card p-4 shadow-lg">
                  <div className="rounded-2xl bg-muted p-4 text-sm">
                    <p>Hi John, reminder: $500.00 due Mar 1 for inv #INV-001. Pay here: pay.collectly.com/inv-001</p>
                  </div>
                  <p className="text-xs text-muted-foreground text-right mt-2">2:30 PM</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
