---
title: "Missions"
order: 3
---

<h1 id="sec-3">3. Missions</h1>
<p>This section covers mission planning, operational rules, status tracking, and classification.</p>

<h2 id="sec-3-1">3.1 Mission Planning</h2>
<p>All missions follow standardized planning and launch procedures. Rules are evaluated in order and must all pass before launch authorization is granted.</p>

<h3 id="sec-3-1-1">3.1.1 Launch Procedures</h3>
<ol class="doc-rules-list" style="list-style: none">
  <li>
    <div class="doc-rule-line doc-rule-header"><span class="doc-rule-num">(1) </span><span class="doc-rule-keyword">Trigger</span><span class="doc-rule-content"><strong>Launch window opens</strong> &rarr;</span></div>
    <div class="doc-rule-line doc-rule-conditions"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Condition</span><span class="doc-rule-content">Weather clearance = <strong>GO</strong></span></div>
    <div class="doc-rule-line"><span class="doc-rule-num"></span><span class="doc-rule-cont">&amp;</span><span class="doc-rule-content">Range safety = <strong>Clear</strong></span></div>
    <div class="doc-rule-line doc-rule-then"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Action</span><span class="doc-rule-content">Begin countdown sequence. Set mission status to <strong>Pre-Launch</strong>.</span></div>
  </li>
  <li>
    <div class="doc-rule-line doc-rule-header"><span class="doc-rule-num">(2) </span><span class="doc-rule-keyword">Trigger</span><span class="doc-rule-content"><strong>T-minus 10 minutes</strong> &rarr;</span></div>
    <div class="doc-rule-line doc-rule-conditions"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Condition</span><span class="doc-rule-content">All subsystems report <strong>nominal</strong></span></div>
    <div class="doc-rule-line"><span class="doc-rule-num"></span><span class="doc-rule-cont">&amp;</span><span class="doc-rule-content">Propellant levels &ge; 98%</span></div>
    <div class="doc-rule-line doc-rule-then"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Action</span><span class="doc-rule-content">Arm flight termination system. Confirm crew readiness.</span></div>
  </li>
  <li>
    <div class="doc-rule-line doc-rule-header"><span class="doc-rule-num">(3) </span><span class="doc-rule-keyword">Trigger</span><span class="doc-rule-content"><strong>Main engine ignition confirmed</strong> &rarr;</span></div>
    <div class="doc-rule-line doc-rule-then"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Action</span><span class="doc-rule-content">Release hold-down clamps. Set mission status to <strong>In Flight</strong>.</span></div>
  </li>
  <li>
    <div class="doc-rule-line doc-rule-header"><span class="doc-rule-num">(4) </span><span class="doc-rule-keyword">Trigger</span><span class="doc-rule-content"><strong>Orbit achieved</strong> &rarr;</span></div>
    <div class="doc-rule-line doc-rule-conditions"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Condition</span><span class="doc-rule-content">Orbital parameters within tolerance</span></div>
    <div class="doc-rule-line doc-rule-then"><span class="doc-rule-num"></span><span class="doc-rule-keyword">Action</span><span class="doc-rule-content">Set mission status to <strong>Orbit Achieved</strong>. Begin payload deployment.</span></div>
  </li>
</ol>

<h4 id="sec-3-1-1-1">3.1.1.1 Countdown Phases</h4>
<p>Launch is divided into distinct countdown phases, each with its own go/no-go criteria.</p>

<h5 id="sec-3-1-1-1-1">3.1.1.1.1 Pre-Countdown</h5>
<p>Before the countdown starts, weather and range must be GO. Mission status is set to Pre-Launch only after the first rule (1) is satisfied.</p><p>1</p><p>1</p><p>1</p><p>1</p>

<h5 id="sec-3-1-1-1-2">3.1.1.1.2 Final Ten Minutes</h5>
<p>At T-minus 10 minutes, all subsystems must be nominal and propellant at or above 98%. Flight termination system is armed and crew readiness confirmed.</p>

<h4 id="sec-3-1-1-2">3.1.1.2 Post-Ignition</h4>
<p>After main engine ignition, hold-down clamps release and status becomes In Flight. No rollback after this point.</p>

<h5 id="sec-3-1-1-2-1">3.1.1.2.1 Orbit Insertion</h5>
<p>When orbital parameters are within tolerance, status is set to Orbit Achieved and payload deployment may begin.</p>

<h2 id="sec-3-2">3.2 Mission Status</h2>
<p>Every mission progresses through a defined set of statuses. These statuses drive dashboard views, reporting, and automation triggers.</p>

<h3 id="sec-3-2-1">3.2.1 Mission Status Groups</h3>
<ul>
  <li><strong>Pre-Launch</strong> &mdash; Countdown initiated, all systems being verified.</li>
  <li><strong>In Flight</strong> &mdash; Vehicle has cleared the launch pad and is in powered ascent or transit.</li>
  <li><strong>Orbit Achieved</strong> &mdash; Stable orbit confirmed, payload operations may begin.</li>
  <li><strong>Completed</strong> &mdash; Mission objectives fulfilled; vehicle deorbited or parked.</li>
  <li><strong>Aborted</strong> &mdash; Mission terminated before completion due to anomaly.</li>
</ul>

<h4 id="sec-3-2-1-1">3.2.1.1 Status Transitions</h4>
<p>Status changes are logged and drive reporting and automation.</p>

<h5 id="sec-3-2-1-1-1">3.2.1.1.1 Valid Transitions</h5>
<p>Pre-Launch → In Flight → Orbit Achieved → Completed. Aborted can be entered from any pre-Completed status. No reverse transitions except for data correction.</p>

<h5 id="sec-3-2-1-1-2">3.2.1.1.2 Dashboard Display</h5>
<p>Dashboards show current status with color coding; history is available in the mission log for audit.</p>

<h4 id="sec-3-2-1-2">3.2.1.2 Status Definitions</h4>
<p>Each status has a formal definition used for reporting and compliance.</p>

<h5 id="sec-3-2-1-2-1">3.2.1.2.1 Pre-Launch Through Orbit</h5>
<p>Pre-Launch: countdown in progress. In Flight: vehicle in powered ascent or transit. Orbit Achieved: stable orbit confirmed.</p>

<h3 id="sec-3-2-2">3.2.2 Mission Classification</h3>
<p>Missions are classified by type for scheduling and resource allocation.</p>
<ul>
  <li><strong>Crewed</strong> &mdash; Missions carrying human crew to orbit or beyond.</li>
  <li><strong>Cargo</strong> &mdash; Uncrewed resupply or payload delivery missions.</li>
  <li><strong>Probe</strong> &mdash; Autonomous scientific exploration beyond Earth orbit.</li>
  <li><strong>LEO Service</strong> &mdash; Satellite deployment, maintenance, or debris cleanup in low Earth orbit.</li>
  <li><strong>Test Flight</strong> &mdash; Vehicle or system qualification flights.</li>
</ul>

<h2 id="sec-3-3">3.3 Mission Timeline</h2>
<p>Typical crewed mission flow: Pre-Launch → In Flight → Orbit Achieved → (on-orbit operations) → Completed. Cargo and probe missions may skip crew steps but use the same status model. Aborted status is used when a mission is terminated early; post-abort reviews are mandatory.</p>

<h2 id="sec-3-4">3.4 Cross References</h2>
<p>This section demonstrates cross-referencing between different parts of the document.</p>
<p>The <a href="#row-horizon">Horizon</a> spacecraft, equipped with a <a href="#row-prop-fusion">Fusion Pulse</a> drive, is the primary vessel for deep-space missions. Before any launch, all crews must follow the <a href="#sec-3-1-1">Launch Procedures</a> documented above.</p>
<p>Cargo deliveries to the station are handled by the <a href="#row-atlas">Atlas IV</a> using its efficient <a href="#row-prop-ion">Ion Drive</a>. The retired <a href="#row-sentinel">Sentinel</a> has been replaced by the <a href="#row-meridian">Meridian</a> for all orbital crew transfers.</p>
<p>Current mission statuses are tracked in the <a href="#sec-3-2-1">Mission Status Groups</a>. Scheduling is organized by <a href="#sec-3-2-2">Mission Classification</a> tags.</p>
<p>For details on how power is allocated during different mission phases, see <a href="#sec-2-3-2">Power Requirements</a>. The subsystem hierarchy is documented in the <a href="#sec-2-3-1">Subsystem Overview</a>.</p>
