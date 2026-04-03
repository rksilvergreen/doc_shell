---
title: "Operations"
order: 6
---

<h1 id="sec-6">6. Operations</h1>
<p>This section describes day-to-day operational procedures, shift handover, communications windows, and emergency protocols. All flight controllers and crew must be familiar with these before assuming duty.</p>

<h2 id="sec-6-1">6.1 Daily Operations</h2>
<p>Mission control runs on a 24/7 schedule during active missions. Shifts are typically eight hours, with a one-hour overlap for handover.</p>

<h3 id="sec-6-1-1">6.1.1 Shift Structure</h3>
<p>Three shifts per day; handover occurs at shift change.</p>

<h4 id="sec-6-1-1-1">6.1.1.1 Handover</h4>
<p>The outgoing shift briefs the incoming shift on status, anomalies, and upcoming events.</p>

<h5 id="sec-6-1-1-1-1">6.1.1.1.1 Handover Checklist</h5>
<p>Required: mission status, open anomalies, next 24 h milestones (burns, comm windows, crew sleep), weather/range constraints. Optional: forward plan, deferred items.</p>

<h5 id="sec-6-1-1-1-2">6.1.1.1.2 Sign-Off</h5>
<p>Outgoing Flight Director signs off only after incoming FD acknowledges and accepts the handover. Log the handover time in the mission log.</p>

<h4 id="sec-6-1-1-2">6.1.1.2 Shift Length and Overlap</h4>
<p>Standard shift is eight hours; one-hour overlap allows joint monitoring during critical events and reduces handover errors.</p>

<h3 id="sec-6-1-2">6.1.2 Roles and Authority</h3>
<p>Each shift has defined roles with clear authority boundaries.</p>

<h4 id="sec-6-1-2-1">6.1.2.1 Flight Director</h4>
<p>The FD has final say on operational decisions within the mission rules.</p>

<h5 id="sec-6-1-2-1-1">6.1.2.1.1 FD Authority Scope</h5>
<p>FD authority covers: go/no-go for nominal operations, anomaly response within procedures, and escalation to program management when required. FD does not override safety-critical abort criteria.</p>

<h4 id="sec-6-1-2-2">6.1.2.2 CAPCOM and Ground Systems</h4>
<p>CAPCOM handles crew communication; Ground Systems handles tracking and comms. Both report to the FD.</p>

<h5 id="sec-6-1-2-2-1">6.1.2.2.1 Uncrewed Missions</h5>
<p>Uncrewed missions (cargo, probes) have no CAPCOM. Autonomy scripts handle routine ops; ground intervenes for trajectory corrections, payload deployment, and contingencies.</p>

<h2 id="sec-6-2">6.2 Emergency Protocols</h2>
<p>In case of a critical anomaly, the Flight Director may call an emergency hold or abort. Criteria for abort include: loss of redundancy in a critical system, crew injury or medical emergency, trajectory deviation outside safe limits, or loss of communications with a crewed vehicle beyond the allowed outage window.</p>
<p>Abort procedures are vehicle- and phase-specific. During ascent, abort options include Return to Launch Site (RTLS), Abort to Orbit (ATO), or Transatlantic Abort Landing (TAL), depending on time and trajectory. In orbit, the crew may execute an emergency deorbit to a predetermined landing site; mission control coordinates with recovery forces.</p>
<p>All emergency actions must be logged and reported to the program office within 24 hours. A formal mishap investigation is convened for any loss of vehicle, serious injury, or near-miss that could have led to either.</p>

<h3 id="sec-6-2-1">6.2.1 Abort Types</h3>
<p>Abort options depend on mission phase and vehicle.</p>

<h4 id="sec-6-2-1-1">6.2.1.1 Ascent Aborts</h4>
<p>During powered ascent, crewed vehicles may execute RTLS, ATO, or TAL.</p>

<h5 id="sec-6-2-1-1-1">6.2.1.1.1 RTLS</h5>
<p>Return to Launch Site. Used early in ascent when enough propellant remains to reverse and land at the pad.</p>

<h5 id="sec-6-2-1-1-2">6.2.1.1.2 ATO and TAL</h5>
<p>Abort to Orbit: reach a safe orbit, then assess. Transatlantic Abort Landing: land at a predetermined site across the ocean. Choice depends on time and trajectory.</p>

<h4 id="sec-6-2-1-2">6.2.1.2 On-Orbit Emergencies</h4>
<p>In orbit, crew may perform emergency deorbit to a designated landing site. Mission control coordinates with recovery forces.</p>

<h2 id="sec-6-3">6.3 Communications Windows</h2>
<p>Contact with spacecraft depends on ground-station visibility and orbital geometry. Low Earth orbit missions typically have multiple passes per day, each lasting from a few minutes to about fifteen minutes depending on altitude and station location. Deep-space missions have scheduled comm windows; the <a href="#row-horizon">Horizon</a> and <a href="#row-voyager-x">Voyager X</a> assets use the Deep Space Network (DSN) for long-range links.</p>
<p>During a pass, priority is given to telemetry ingestion, command uplink (if needed), and voice or data exchange with crew. Non-critical uploads (e.g. software patches, science plans) are queued and sent when bandwidth allows. Missed windows are reported; repeated misses trigger a review of antenna scheduling and vehicle health.</p>

<h2 id="sec-6-4">6.4 Logistics and Resupply</h2>
<p>Cargo missions to the station are planned on a regular cadence. The <a href="#row-atlas">Atlas IV</a> fleet handles the majority of resupply; each flight is manifested with consumables (water, oxygen, food, propellant), spare parts, and science payloads. Stowage is optimized for mass and center-of-gravity limits; loading is verified before closure of the cargo module.</p>
<p>Return cargo (samples, failed hardware, trash) is loaded for disposal or analysis on Earth. Mass and volume on return legs are often more constrained than on ascent, so prioritization is agreed between the station crew and ground.</p>

<h2 id="sec-6-5">6.5 Reporting and Metrics</h2>
<p>Daily mission summaries are distributed to program management and stakeholders. They include: status (per <a href="#sec-3-2-1">Mission Status Groups</a>), key events, anomalies, and forward plan. Weekly and monthly reports aggregate reliability metrics, propellant usage, and schedule performance.</p>
<p>All reports are stored in the program repository. Auditors and safety reviewers have read-only access to logs and reports for the life of the program.</p>
