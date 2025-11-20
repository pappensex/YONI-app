"use client";

import { useMemo } from "react";

import { Blueprint, Status } from "../data/chibot-blueprint";

interface BlueprintViewProps {
  blueprint: Blueprint;
  generatedAt?: string | null;
  fallbackNotice?: string | null;
}

function StatusPill({ status }: { status: Status }) {
  return <span className={`status-pill status-${status}`}>{status}</span>;
}

export default function BlueprintView({
  blueprint,
  generatedAt,
  fallbackNotice,
}: BlueprintViewProps) {
  const blueprintStats = useMemo(
    () => ({
      pages: blueprint.pages.length,
      dataLayers: blueprint.dataLayers.length,
      profiles: blueprint.profiles.length,
      bots: blueprint.bots.length,
    }),
    [blueprint],
  );

  return (
    <>
      <section className="card flow">
        <div className="section-header">
          <div>
            <p className="eyebrow">π⁷ Blueprint Kernel</p>
            <h2>{blueprint.kernel.codename}</h2>
            <p className="muted">{blueprint.mission}</p>
          </div>
          <div className="pill-row">
            <span className="pill">Version {blueprint.kernel.version}</span>
            <span className="pill">Autonomy: {blueprint.kernel.autonomy}</span>
            <StatusPill status={blueprint.kernel.state} />
          </div>
        </div>
        <div className="pill-row">
          <span className="pill">Pages: {blueprintStats.pages}</span>
          <span className="pill">Data: {blueprintStats.dataLayers}</span>
          <span className="pill">Profiles: {blueprintStats.profiles}</span>
          <span className="pill">Bots: {blueprintStats.bots}</span>
        </div>
        <p className="muted small">
          Steward: {blueprint.steward} • Heartbeat: {blueprint.kernel.heartbeat}
        </p>
        <p className="muted small">
          Safeguards: {blueprint.kernel.safeguards.join(" • ")}
          {generatedAt && ` • Snapshot: ${generatedAt}`}
          {fallbackNotice && ` • ${fallbackNotice}`}
        </p>
      </section>

      <div className="grid">
        <section className="card flow">
          <div className="section-header">
            <div>
              <p className="eyebrow">Setup</p>
              <h2>Pages, Daten, Profile</h2>
            </div>
            <p className="muted small">Steward: {blueprint.steward}</p>
          </div>

          <div className="blueprint-grid">
            <div className="blueprint-block">
              <h3>Pages</h3>
              <div className="list">
                {blueprint.pages.map((page) => (
                  <div key={page.name} className="list-row">
                    <div>
                      <div className="title-row">
                        <span>{page.name}</span>
                        <StatusPill status={page.status} />
                      </div>
                      <p className="muted small">{page.focus}</p>
                    </div>
                    <p className="muted small">Owner: {page.owner}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="blueprint-block">
              <h3>Daten</h3>
              <div className="list">
                {blueprint.dataLayers.map((layer) => (
                  <div key={layer.name} className="list-row">
                    <div>
                      <div className="title-row">
                        <span>{layer.name}</span>
                        <StatusPill status={layer.status} />
                      </div>
                      <p className="muted small">{layer.source}</p>
                    </div>
                    <p className="muted small">
                      {layer.cadence} • {layer.retention}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="blueprint-block">
              <h3>Profile</h3>
              <div className="list">
                {blueprint.profiles.map((profile) => (
                  <div key={profile.name} className="list-row">
                    <div>
                      <div className="title-row">
                        <span>{profile.name}</span>
                        <span className="pill subtle">{profile.archetype}</span>
                      </div>
                      <p className="muted small">{profile.focus}</p>
                    </div>
                    <p className="muted small">
                      Rituale: {profile.rituals.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid">
        <section className="card flow">
          <div className="section-header">
            <div>
              <p className="eyebrow">Bots</p>
              <h2>Aufträge & Versprechen</h2>
            </div>
          </div>
          <div className="list">
            {blueprint.bots.map((bot) => (
              <div key={bot.name} className="list-row">
                <div>
                  <div className="title-row">
                    <span>{bot.name}</span>
                    <span className="pill subtle">{bot.mode}</span>
                  </div>
                  <p className="muted small">{bot.promise}</p>
                </div>
                <p className="muted small">Links: {bot.links.join(" • ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card flow">
          <div className="section-header">
            <div>
              <p className="eyebrow">Rituale</p>
              <h2>Checks & Signals</h2>
            </div>
          </div>
          <div className="list">
            {blueprint.rituals.map((ritual) => (
              <div key={ritual.title} className="list-row">
                <div>
                  <div className="title-row">
                    <span>{ritual.title}</span>
                    <span className="pill subtle">{ritual.cadence}</span>
                  </div>
                  <p className="muted small">{ritual.description}</p>
                </div>
                <p className="muted small">
                  Signals: {ritual.signals.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card flow">
        <div className="section-header">
          <div>
            <p className="eyebrow">Aktionen</p>
            <h2>Nächste Schritte</h2>
          </div>
        </div>
        <div className="list">
          {blueprint.actions.map((action) => (
            <div key={action.title} className="list-row">
              <div>
                <span>{action.title}</span>
                <p className="muted small">Impact: {action.impact}</p>
              </div>
              <p className="muted small">Owner: {action.owner}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
