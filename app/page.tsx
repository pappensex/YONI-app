"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import AgeVerification from "./components/AgeVerification";
import BlueprintView from "./components/BlueprintView";
import GoddessMode from "./components/GoddessMode";
import {
  blueprint as fallbackBlueprint,
  Blueprint,
} from "./data/chibot-blueprint";

interface FeedItem {
  id: number;
  agent: string;
  text: string;
  isFusion?: boolean;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState("Consensus");
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [envMessage, setEnvMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [blueprintData, setBlueprintData] = useState<Blueprint | null>(null);
  const [blueprintGeneratedAt, setBlueprintGeneratedAt] = useState<
    string | null
  >(null);
  const [blueprintNotice, setBlueprintNotice] = useState<string | null>(null);

  const handleAgeVerified = useCallback(() => {
    setAgeVerified(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setEnvMessage(
      window.location.protocol === "https:"
        ? "HTTPS aktiv – Service Worker & Install verfügbar."
        : 'Hinweis: Für Offline & „Zum Home‑Bildschirm" bitte HTTPS nutzen.',
    );
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadBlueprint = async () => {
      try {
        const response = await fetch("/api/blueprint", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Blueprint API nicht erreichbar");
        }

        const payload = await response.json();
        if (!isMounted) return;

        setBlueprintData(payload.blueprint);
        setBlueprintGeneratedAt(payload.meta?.generatedAt ?? null);
        setBlueprintNotice(null);
      } catch (error: any) {
        if (!isMounted || error?.name === "AbortError") return;

        setBlueprintNotice(
          "Live Blueprint nicht erreichbar – zeige lokalen Snapshot.",
        );
        setBlueprintData(fallbackBlueprint);
        setBlueprintGeneratedAt(new Date().toISOString());
      }
    };

    loadBlueprint();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleInstall = async () => {
    if (typeof window === "undefined") return;

    if (window.location.protocol !== "https:") {
      alert("Service Worker benötigt HTTPS.");
      return;
    }

    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/sw.js");
      alert("Offline aktiviert.");
    }
  };

  const handleA2HS = () => {
    alert('iPhone: Safari → Teilen → „Zum Home‑Bildschirm".');
  };

  const handleAsk = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          mode: mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }

      const translatedLabel = autoTranslate ? "→ Deutsch" : "";
      const agentLabel = translatedLabel ? `${mode} ${translatedLabel}` : mode;
      const newItem: FeedItem = {
        id: Date.now(),
        agent: `ChatGPT (${agentLabel})`,
        text: data.response,
      };

      setFeed((prev) => [newItem, ...prev]);
      setQuestion("");
    } catch (error: any) {
      const errorItem: FeedItem = {
        id: Date.now(),
        agent: "Error",
        text: `Fehler: ${error.message}. Bitte stelle sicher, dass der OPENAI_API_KEY konfiguriert ist.`,
      };
      setFeed((prev) => [errorItem, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const activeBlueprint = blueprintData ?? fallbackBlueprint;

  const blueprintStats = useMemo(
    () => ({
      pages: activeBlueprint.pages.length,
      dataLayers: activeBlueprint.dataLayers.length,
      profiles: activeBlueprint.profiles.length,
      bots: activeBlueprint.bots.length,
    }),
    [activeBlueprint],
  );

  return (
    <>
      {!ageVerified && <AgeVerification onVerified={handleAgeVerified} />}
      {ageVerified && <GoddessMode />}
      <main className="wrap">
        <header className="card hero">
          <div>
            <p className="eyebrow">CHIBot Stewardship</p>
            <h1>YONI • System Blueprint</h1>
            <p className="muted">{activeBlueprint.mission}</p>
            <div className="pill-row">
              <span className="pill">Pages: {blueprintStats.pages}</span>
              <span className="pill">Data: {blueprintStats.dataLayers}</span>
              <span className="pill">Profiles: {blueprintStats.profiles}</span>
              <span className="pill">Bots: {blueprintStats.bots}</span>
            </div>
            {blueprintNotice && (
              <p className="muted small">{blueprintNotice}</p>
            )}
          </div>
          <div className="hero-actions">
            <button onClick={handleInstall}>Offline aktivieren</button>
            <button onClick={handleA2HS}>Zum Home‑Bildschirm</button>
            <p className="muted small">{envMessage}</p>
          </div>
        </header>

        <section className="card flow">
          <div className="section-header">
            <div>
              <p className="eyebrow">Transzendenz</p>
              <h2>Fragen & Antworten</h2>
            </div>
            <div className="controls">
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Consensus</option>
                <option>Contrast</option>
                <option>Chain</option>
              </select>
              <label className="muted checkbox">
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                />
                Auto‑Translate → Deutsch
              </label>
            </div>
          </div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Frag dein Multi‑Kollektiv …"
          />
          <div className="row">
            <button
              onClick={handleAsk}
              disabled={isLoading}
              className="primary"
            >
              {isLoading ? "ChatGPT denkt nach..." : "Frage an ChatGPT"}
            </button>
          </div>
          <div className="feed">
            {feed.length === 0 && (
              <p className="muted">Keine Einträge – stell die erste Frage.</p>
            )}
            {feed.map((item) => (
              <div key={item.id} className="item">
                <b>{item.agent}</b>: {item.text}
              </div>
            ))}
          </div>
        </section>

        <BlueprintView
          blueprint={activeBlueprint}
          generatedAt={blueprintGeneratedAt}
          fallbackNotice={blueprintNotice}
        />
      </main>
    </>
  );
}
