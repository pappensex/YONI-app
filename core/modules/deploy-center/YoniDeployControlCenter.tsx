import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

interface StatusItem {
  id: string;
  task: string;
  status: string;
  comment: string;
}

export default function YoniDeployControlCenter() {
  const [statusData, setStatusData] = useState<StatusItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://raw.githubusercontent.com/pihoch2/Transzendenz/main/Reports/Deploy-Status.md");
      const text = await res.text();
      const parsed = parseStatusMarkdown(text);
      setStatusData(parsed);
      const done = parsed.filter((i: StatusItem) => i.status === "✅").length;
      const total = parsed.length;
      setProgress(Math.round((done / total) * 100));
    } catch (err) {
      console.error("Status-Load-Error", err);
    }
    setLoading(false);
  };

  const parseStatusMarkdown = (text: string): StatusItem[] => {
    const lines = text.split("\n").filter((l) => l.match(/^\|/));
    return lines.slice(2).map((line) => {
      const cols = line.split("|").map((c) => c.trim());
      return {
        id: cols[1],
        task: cols[2],
        status: cols[3],
        comment: cols[4],
      };
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-center">
        🚀 YONI Deploy-Control-Center
      </h1>
      <div className="flex flex-col items-center space-y-2">
        <Progress value={progress} className="w-full h-3" />
        <p className="text-sm text-muted-foreground">
          Gesamtfortschritt: {progress}% abgeschlossen
        </p>
        <Button onClick={fetchStatus} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> {loading ? "Aktualisiere…" : "Sync jetzt"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statusData.map((item) => (
          <Card
            key={item.id}
            className={`border-2 rounded-2xl shadow-md ${
              item.status === "✅"
                ? "border-green-500"
                : item.status === "⚙️"
                ? "border-yellow-400"
                : "border-red-500"
            }`}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{item.task}</h2>
                {item.status === "✅" && <CheckCircle className="text-green-500" />}
                {item.status === "⚙️" && <AlertTriangle className="text-yellow-500" />}
                {item.status === "❌" && <XCircle className="text-red-500" />}
              </div>
              <p className="text-sm text-muted-foreground">{item.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
