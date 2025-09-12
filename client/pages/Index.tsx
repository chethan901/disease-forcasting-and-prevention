import { useEffect, useState } from "react";
import { DemoResponse } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart3, BrainCircuit, Database, FileBarChart2, FileSpreadsheet, GitCompareArrows, KeyRound, Layers3, Lock, ShieldCheck, Shuffle, Zap } from "lucide-react";
import { ResponsiveContainer, Line, LineChart, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";

export default function Index() {
  const [serverMsg, setServerMsg] = useState("");
  useEffect(() => {
    fetch("/api/demo").then((r) => r.json()).then((d: DemoResponse) => setServerMsg(d.message)).catch(() => setServerMsg(""));
  }, []);

  const driftData = Array.from({ length: 12 }).map((_, i) => ({ m: `M${i+1}`, auc: 0.75 + Math.sin(i/2)/20 }));
  const latencyData = Array.from({ length: 10 }).map((_, i) => ({ t: i, ms: 120 + Math.round(Math.random()*30) }));

  return (
    <div className="">
      <section className="container py-16 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5"/> Secure • Explainable • Auditable
            </div>
            <h1 className="mt-4 text-4xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]">PredictaCare — AI-powered Disease Detection Platform</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">Develop a secure, explainable, full-stack ML system that detects diseases from datasets and patient records, enabling clinicians and researchers to gain reliable insights.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge>Explainability first</Badge>
              <Badge variant="secondary">Security & privacy by design</Badge>
              <Badge variant="outline">Scalable & modular</Badge>
              <Badge variant="outline">Auditability</Badge>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="group">
                <a href="/console">Open Console <Zap className="ml-2 size-4 transition-transform group-hover:translate-x-0.5"/></a>
              </Button>
              <Button asChild variant="outline">
                <a href="#architecture">View Architecture</a>
              </Button>
            </div>
            {serverMsg && <p className="sr-only">{serverMsg}</p>}
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/20 to-teal-500/20 blur-2xl"/>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="size-5"/> Real-time Monitoring</CardTitle>
                <CardDescription>API latency and AUC over time</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={latencyData}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)"/>
                      <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="ms" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#g1)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={driftData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)"/>
                      <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0.6,1]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="auc" stroke="hsl(174 62% 45%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="border-t bg-gradient-to-b from-background to-background/60">
        <div className="container py-16 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight">What you can do</h2>
          <p className="text-muted-foreground mt-2">A clinician-friendly console with data-science power.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <FileSpreadsheet className="size-5"/>, title: "Dataset upload", desc: "Drag & drop CSV/Parquet with schema validation" },
              { icon: <BarChart3 className="size-5"/>, title: "EDA visualizations", desc: "Missingness, distributions, imbalance" },
              { icon: <BrainCircuit className="size-5"/>, title: "Training orchestration", desc: "Stratified/Nested CV with MLflow logging" },
              { icon: <GitCompareArrows className="size-5"/>, title: "Model comparison", desc: "AUC, PR, precision/recall, calibration" },
              { icon: <FileBarChart2 className="size-5"/>, title: "Explainability", desc: "SHAP per-prediction + global, LIME, fairness" },
              { icon: <KeyRound className="size-5"/>, title: "RBAC & audit", desc: "OAuth2/JWT, role-based UI, full audit logs" },
            ].map((f, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">{f.icon}{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="border-t">
        <div className="container py-16 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight">Architecture</h2>
          <p className="text-muted-foreground mt-2">React + Tailwind front-end, FastAPI back-end, MLflow registry, S3-compatible object store, and PostgreSQL.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Layers3 className="size-5"/>, title: "Frontend", desc: "React (TS), role-based UI, charts and uploads" },
              { icon: <Database className="size-5"/>, title: "Backend", desc: "FastAPI for ingest, train, predict, explain, audit" },
              { icon: <Shuffle className="size-5"/>, title: "ML pipeline", desc: "Preprocess, engineer, validate; XGBoost, LGBM, CatBoost, RF, MLP, TabNet" },
              { icon: <Lock className="size-5"/>, title: "Security", desc: "TLS, JWT, RBAC, encryption at rest + in transit" },
            ].map((a, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">{a.icon}{a.title}</CardTitle>
                  <CardDescription>{a.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="border-t">
        <div className="container py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Security & Compliance</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>• TLS 1.2/1.3 everywhere, reverse proxy ready</li>
                <li>• Encryption at rest (AES-256), de-identification support</li>
                <li>• OAuth2 with JWT, RBAC, session expiry</li>
                <li>• HIPAA/GDPR readiness, data retention & deletion</li>
                <li>• Threat model covers SQLi, CSRF, rate-limiting</li>
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5"/> Observability</CardTitle>
                <CardDescription>Prometheus, Grafana, Sentry; retrain on drift</CardDescription>
              </CardHeader>
              <CardContent className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={driftData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)"/>
                    <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0.6,1]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="auc" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="monitoring" className="border-t bg-accent/30">
        <div className="container py-14 text-center">
          <h3 className="text-xl font-semibold">Ready to try PredictaCare?</h3>
          <p className="text-muted-foreground mt-2">Upload a dataset, train models, and get explainable predictions with full audit trails.</p>
          <div className="mt-4">
            <Button asChild size="lg"><a href="/console">Launch Console</a></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
