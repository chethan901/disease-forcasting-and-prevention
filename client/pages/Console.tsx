import { useCallback, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { UploadCloud, PlayCircle, Activity, Scale, FileSpreadsheet, BotMessageSquare, Sparkles, Shield, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConsolePage() {
  // Upload state (client-only demo)
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = useCallback((file: File) => {
    setFileName(file.name);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }, [onFile]);

  const openPicker = () => inputRef.current?.click();

  // Mock EDA
  const histData = useMemo(() => (
    Array.from({ length: 10 }).map((_, i) => ({ bin: `${i*10}-${i*10+10}`, count: Math.round(5 + Math.random()*20) }))
  ), []);

  const classBalance = useMemo(() => ([
    { name: "Negative", value: 780 },
    { name: "Positive", value: 220 },
  ]), []);

  const COLORS = ["hsl(var(--primary))", "hsl(174 62% 45%)"]; // brand + teal

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">PredictaCare Console</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Upload datasets, explore EDA, launch training, compare models, and run secure, explainable predictions. This console showcases the end-to-end flow.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>Explainability first</Badge>
            <Badge variant="secondary">Security & privacy</Badge>
            <Badge variant="outline">Audit logging</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary"><Shield className="mr-2 size-4"/>RBAC: admin</Button>
          <Button className="group"><Sparkles className="mr-2 size-4"/>New Job<PlayCircle className="ml-1 size-4 transition-transform group-hover:translate-x-0.5"/></Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UploadCloud className="size-5"/>Dataset Upload</CardTitle>
            <CardDescription>Drag & drop CSV/Parquet. Metadata captured for audit and schema validation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={cn("border-2 border-dashed rounded-lg p-6 grid place-items-center text-center", fileName ? "border-teal-500/60 bg-teal-500/5" : "border-muted")}
            >
              <input ref={inputRef} className="hidden" type="file" accept=".csv,.parquet" onChange={(e)=>{const f=e.target.files?.[0]; if(f) onFile(f);}} />
              <div>
                <FileSpreadsheet className="mx-auto size-10 text-muted-foreground"/>
                <p className="mt-2 text-sm text-muted-foreground">Drop your dataset here, or</p>
                <Button variant="outline" className="mt-2" onClick={openPicker}>Browse files</Button>
                {fileName && <p className="mt-2 text-sm">Selected: <span className="font-medium">{fileName}</span></p>}
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="text-sm">
                <Label>Target column</Label>
                <Input placeholder="disease_label" defaultValue="disease_label" />
              </div>
              <div className="text-sm md:col-span-2">
                <Label>Feature columns</Label>
                <Input placeholder="comma,separated,features" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="group"><Activity className="mr-2 size-4"/>Run EDA<ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5"/></Button>
              <Button variant="outline"><BotMessageSquare className="mr-2 size-4"/>Validate schema</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Scale className="size-5"/>Class Balance</CardTitle>
            <CardDescription>Quick glance at class distribution and a sample feature histogram.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)"/>
                  <XAxis dataKey="bin" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie data={classBalance} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {classBalance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Train Models</CardTitle>
            <CardDescription>XGBoost, LightGBM, CatBoost, RF, MLP, TabNet with stratified CV.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm">Start training</Button>
              <Button size="sm" variant="outline">Configure params</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compare & Explain</CardTitle>
            <CardDescription>Metrics explorer, SHAP/LIME, calibration & fairness.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline">Open metrics</Button>
              <Button size="sm">Global explainability</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>Every upload, training and prediction is recorded.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline">View logs</Button>
              <Button size="sm">Export</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
