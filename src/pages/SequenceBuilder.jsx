import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { ArrowLeft, Plus, GripVertical, Mail, Smartphone, MessageSquare, Clock, Save } from "lucide-react";
import { Link } from "react-router-dom";

const phases = [
  { id: 1, name: "Friendly Reminder", delay: "3 days before due", channel: "email", template: "Friendly First Reminder" },
  { id: 2, name: "Payment Due", delay: "On due date", channel: "email", template: "Payment Due Notice" },
  { id: 3, name: "First Follow-up", delay: "3 days after due", channel: "sms", template: "SMS Quick Reminder" },
  { id: 4, name: "Second Follow-up", delay: "7 days after due", channel: "email", template: "Payment Overdue Notice" },
  { id: 5, name: "Final Notice", delay: "14 days after due", channel: "email", template: "Final Notice" },
];

const channelIcon = (ch) => {
  switch (ch) {
    case "email": return <Mail className="h-4 w-4" />;
    case "sms": return <Smartphone className="h-4 w-4" />;
    case "whatsapp": return <MessageSquare className="h-4 w-4" />;
    default: return <Mail className="h-4 w-4" />;
  }
};

export default function SequenceBuilder() {
  return (
    <AppLayout>
      <Header title="">
        <Link to="/sequences" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mr-auto">
          <ArrowLeft className="h-4 w-4" /> Back to Sequences
        </Link>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-sm">
          <Save className="h-4 w-4" /> Save Sequence
        </button>
      </Header>
      <main className="p-6 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <input defaultValue="Standard Collection" className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full mb-8 placeholder:text-muted-foreground" placeholder="Sequence name..." />

          {/* Timeline */}
          <div className="space-y-0">
            {phases.map((phase, i) => (
              <div key={phase.id}>
                {/* Connector */}
                {i > 0 && (
                  <div className="flex items-center gap-3 ml-6 py-2">
                    <div className="w-0.5 h-8 bg-border" />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Wait {phase.delay}
                    </div>
                  </div>
                )}

                {/* Phase Card */}
                <div className="group flex items-start gap-3">
                  <div className="mt-4 cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1 rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">{channelIcon(phase.channel)}</div>
                        <div>
                          <p className="font-semibold text-sm">{phase.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{phase.channel} · {phase.delay}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Phase {i + 1}</span>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground mb-1">Template</p>
                      <p className="text-sm font-medium">{phase.template}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Phase */}
          <div className="flex items-center gap-3 ml-6 py-2">
            <div className="w-0.5 h-8 bg-border" />
          </div>
          <button className="ml-9 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-4 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors w-[calc(100%-36px)]">
            <Plus className="h-4 w-4" /> Add Phase
          </button>
        </div>
      </main>
    </AppLayout>
  );
}
