import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  UploadCloud,
  PlayCircle,
  Activity,
  Scale,
  FileSpreadsheet,
  BotMessageSquare,
  Sparkles,
  Shield,
  ChevronRight,
  Settings2,
  FileBarChart2,
  BookOpenText,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function ConsolePage() {
  // RBAC
  const [role, setRole] = useState<string>(
    localStorage.getItem("pc_role") || "admin",
  );
  useEffect(() => localStorage.setItem("pc_role", role), [role]);

  // Upload state
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = useCallback((file: File) => {
    setFileName(file.name);
    toast({ title: "File ready", description: `${file.name} selected` });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile],
  );

  const openPicker = () => inputRef.current?.click();

  // EDA mock
  const [edaReady, setEdaReady] = useState(false);
  const histData = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        bin: `${i * 10}-${i * 10 + 10}`,
        count: Math.round(5 + Math.random() * 20),
      })),
    [edaReady],
  );

  const classBalance = useMemo(
    () => [
      { name: "Negative", value: 780 },
      { name: "Positive", value: 220 },
    ],
    [edaReady],
  );

  const COLORS = ["hsl(var(--primary))", "hsl(174 62% 45%)"]; // brand + teal

  // Training
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelType, setModelType] = useState("xgboost");
  const [lr, setLr] = useState("0.1");
  const [estimators, setEstimators] = useState("200");
  const [depth, setDepth] = useState("6");

  useEffect(() => {
    if (!training) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const v = Math.min(100, p + Math.random() * 12);
        if (v >= 100) {
          clearInterval(id);
          setTraining(false);
          toast({
            title: "Training completed",
            description: `${modelType} metrics available`,
          });
        }
        return v;
      });
    }, 600);
    return () => clearInterval(id);
  }, [training, modelType]);

  // Dialog toggles
  const [openNewJob, setOpenNewJob] = useState(false);
  const [openParams, setOpenParams] = useState(false);
  const [openMetrics, setOpenMetrics] = useState(false);
  const [openExplain, setOpenExplain] = useState(false);
  const [openLogs, setOpenLogs] = useState(false);
  const [openRBAC, setOpenRBAC] = useState(false);

  // Actions
  const runEDA = () => {
    if (!fileName) {
      toast({
        title: "No file selected",
        description: "Choose a dataset first",
      });
      return;
    }
    setEdaReady((s) => !s);
    toast({ title: "EDA complete", description: "Summary charts updated" });
  };

  const validateSchema = () => {
    toast({
      title: "Schema valid",
      description: "Columns and target look good",
    });
  };

  const startTraining = () => {
    setOpenNewJob(false);
    setOpenParams(false);
    setProgress(0);
    setTraining(true);
    toast({
      title: "Training started",
      description: `${modelType} • depth=${depth}, lr=${lr}, n=${estimators}`,
    });
  };

  const exportAudit = () => {
    const data = {
      role,
      fileName,
      edaReady,
      modelType,
      params: { learning_rate: lr, n_estimators: estimators, max_depth: depth },
      completed: !training && progress === 100,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "predictacare_audit_export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Audit data downloaded" });
  };

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            PredictaCare Console
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Upload datasets, explore EDA, launch training, compare models, and
            run secure, explainable predictions. This console showcases the
            end-to-end flow.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>Explainability first</Badge>
            <Badge variant="secondary">Security & privacy</Badge>
            <Badge variant="outline">Audit logging</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={openRBAC} onOpenChange={setOpenRBAC}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Shield className="mr-2 size-4" />
                RBAC: {role}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Switch role</DialogTitle>
                <DialogDescription>
                  Demo-only, applies to UI visibility.
                </DialogDescription>
              </DialogHeader>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="clinician">clinician</SelectItem>
                  <SelectItem value="data_scientist">data_scientist</SelectItem>
                  <SelectItem value="viewer">viewer</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setOpenRBAC(false);
                    toast({ title: "Role updated", description: role });
                  }}
                >
                  Apply
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openNewJob} onOpenChange={setOpenNewJob}>
            <DialogTrigger asChild>
              <Button className="group">
                <Sparkles className="mr-2 size-4" />
                New Job
                <PlayCircle className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start new training job</DialogTitle>
                <DialogDescription>
                  Choose model type and basic parameters.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <Label>Model</Label>
                <Select value={modelType} onValueChange={setModelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xgboost">XGBoost</SelectItem>
                    <SelectItem value="lightgbm">LightGBM</SelectItem>
                    <SelectItem value="catboost">CatBoost</SelectItem>
                    <SelectItem value="random_forest">RandomForest</SelectItem>
                    <SelectItem value="mlp">MLP</SelectItem>
                    <SelectItem value="tabnet">TabNet</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="text-sm">
                    <Label>Learning rate</Label>
                    <Input value={lr} onChange={(e) => setLr(e.target.value)} />
                  </div>
                  <div className="text-sm">
                    <Label>Estimators</Label>
                    <Input
                      value={estimators}
                      onChange={(e) => setEstimators(e.target.value)}
                    />
                  </div>
                  <div className="text-sm">
                    <Label>Max depth</Label>
                    <Input
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={startTraining}>Start training</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="size-5" />
              Dataset Upload
            </CardTitle>
            <CardDescription>
              Drag & drop CSV/Parquet. Metadata captured for audit and schema
              validation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 grid place-items-center text-center",
                fileName ? "border-teal-500/60 bg-teal-500/5" : "border-muted",
              )}
            >
              <input
                ref={inputRef}
                className="hidden"
                type="file"
                accept=".csv,.parquet"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                }}
              />
              <div>
                <FileSpreadsheet className="mx-auto size-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drop your dataset here, or
                </p>
                <Button variant="outline" className="mt-2" onClick={openPicker}>
                  Browse files
                </Button>
                {fileName && (
                  <p className="mt-2 text-sm">
                    Selected: <span className="font-medium">{fileName}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="text-sm">
                <Label>Target column</Label>
                <Input
                  placeholder="disease_label"
                  defaultValue="disease_label"
                />
              </div>
              <div className="text-sm md:col-span-2">
                <Label>Feature columns</Label>
                <Input placeholder="comma,separated,features" />
              </div>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <Button className="group" onClick={runEDA}>
                <Activity className="mr-2 size-4" />
                Run EDA
                <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button variant="outline" onClick={validateSchema}>
                <BotMessageSquare className="mr-2 size-4" />
                Validate schema
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="size-5" />
              Class Balance
            </CardTitle>
            <CardDescription>
              Quick glance at class distribution and a sample feature histogram.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted-foreground)/0.2)"
                  />
                  <XAxis dataKey="bin" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={classBalance}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {classBalance.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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
            <CardDescription>
              XGBoost, LightGBM, CatBoost, RF, MLP, TabNet with stratified CV.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {training ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Training…</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={startTraining}>
                  <PlayCircle className="size-4 mr-1" />
                  Start training
                </Button>
                <Dialog open={openParams} onOpenChange={setOpenParams}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Settings2 className="mr-1 size-4" />
                      Configure params
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Training parameters</DialogTitle>
                      <DialogDescription>
                        Adjust hyperparameters.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="text-sm">
                        <Label>Learning rate</Label>
                        <Input
                          value={lr}
                          onChange={(e) => setLr(e.target.value)}
                        />
                      </div>
                      <div className="text-sm">
                        <Label>Estimators</Label>
                        <Input
                          value={estimators}
                          onChange={(e) => setEstimators(e.target.value)}
                        />
                      </div>
                      <div className="text-sm">
                        <Label>Max depth</Label>
                        <Input
                          value={depth}
                          onChange={(e) => setDepth(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={startTraining}>Run</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compare & Explain</CardTitle>
            <CardDescription>
              Metrics explorer, SHAP/LIME, calibration & fairness.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Dialog open={openMetrics} onOpenChange={setOpenMetrics}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <FileBarChart2 className="mr-1 size-4" />
                    Open metrics
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Model metrics</DialogTitle>
                  </DialogHeader>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={Array.from({ length: 10 }).map((_, i) => ({
                          t: i,
                          auc: 0.7 + Math.sin(i / 2) / 10,
                        }))}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--muted-foreground)/0.2)"
                        />
                        <XAxis dataKey="t" />
                        <YAxis domain={[0.5, 1]} />
                        <Tooltip />
                        <Line
                          dataKey="auc"
                          stroke="hsl(var(--primary))"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={openExplain} onOpenChange={setOpenExplain}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <BookOpenText className="mr-1 size-4" />
                    Global explainability
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>SHAP feature importance</DialogTitle>
                  </DialogHeader>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { f: "age", v: 0.28 },
                          { f: "blood_pressure", v: 0.22 },
                          { f: "cholesterol", v: 0.17 },
                          { f: "bmi", v: 0.12 },
                          { f: "smoker", v: 0.08 },
                        ]}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--muted-foreground)/0.2)"
                        />
                        <XAxis dataKey="f" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="v"
                          fill="hsl(174 62% 45%)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              Every upload, training and prediction is recorded.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Dialog open={openLogs} onOpenChange={setOpenLogs}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    View logs
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Audit log</DialogTitle>
                  </DialogHeader>
                  <ul className="text-sm space-y-2 max-h-64 overflow-auto">
                    {[
                      "dataset.upload",
                      "eda.run",
                      "train.start",
                      "train.complete",
                      "metrics.view",
                    ].map((e, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between border rounded-md px-3 py-2"
                      >
                        <span>{e}</span>
                        <span className="text-muted-foreground">
                          {new Date(Date.now() - i * 3600_000).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </DialogContent>
              </Dialog>
              <Button size="sm" onClick={exportAudit}>
                <Download className="mr-1 size-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
