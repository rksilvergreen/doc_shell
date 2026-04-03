import type { TocEntry } from 'doc-shell/layouts/toc/toc.astro';

export const tocs: Record<string, TocEntry[]> = {
  main: [
    {
      id: 'sec-1',
      text: '1. Overview',
      children: [
        { id: 'sec-1-1', text: '1.1 Purpose' },
        { id: 'sec-1-2', text: '1.2 Document Map' },
      ],
    },
    {
      id: 'sec-2',
      text: '2. Spacecraft',
      children: [
        {
          id: 'sec-2-1',
          text: '2.1 Spacecraft Types',
          children: [
            {
              id: 'sec-2-1-1',
              text: '2.1.1 Spacecraft Registry',
              children: [
                {
                  id: 'sec-2-1-1-1',
                  text: '2.1.1.1 Registry by Status',
                  children: [
                    { id: 'sec-2-1-1-1-1', text: '2.1.1.1.1 Active' },
                    { id: 'sec-2-1-1-1-2', text: '2.1.1.1.2 In-Transit' },
                    { id: 'sec-2-1-1-1-3', text: '2.1.1.1.3 Retired' },
                    { id: 'sec-2-1-1-1-4', text: '2.1.1.1.4 Standby and Reserve' },
                  ],
                },
                {
                  id: 'sec-2-1-1-2',
                  text: '2.1.1.2 Registry by Role',
                  children: [
                    { id: 'sec-2-1-1-2-1', text: '2.1.1.2.1 Active and In-Transit' },
                    { id: 'sec-2-1-1-2-2', text: '2.1.1.2.2 Retired' },
                    { id: 'sec-2-1-1-2-3', text: '2.1.1.2.3 Crewed Vessels' },
                    { id: 'sec-2-1-1-2-4', text: '2.1.1.2.4 Cargo and Probe' },
                    { id: 'sec-2-1-1-2-5', text: '2.1.1.2.5 Registry Maintenance and Reclassification' },
                  ],
                },
              ],
            },
            {
              id: 'sec-2-1-2',
              text: '2.1.2 Propulsion Systems',
              children: [
                {
                  id: 'sec-2-1-2-1',
                  text: '2.1.2.1 Chemical Propulsion',
                  children: [
                    { id: 'sec-2-1-2-1-1', text: '2.1.2.1.1 Bipropellant (LOX/RP-1)' },
                  ],
                },
                {
                  id: 'sec-2-1-2-2',
                  text: '2.1.2.2 Electric Propulsion',
                  children: [
                    { id: 'sec-2-1-2-2-1', text: '2.1.2.2.1 Ion Drive' },
                  ],
                },
                {
                  id: 'sec-2-1-2-3',
                  text: '2.1.2.3 Fusion Propulsion',
                  children: [
                    { id: 'sec-2-1-2-3-1', text: '2.1.2.3.1 D-T Fusion Pulse' },
                  ],
                },
              ],
            },
          ],
        },
        { id: 'sec-2-2', text: '2.2 Design Philosophy' },
        {
          id: 'sec-2-3',
          text: '2.3 Subsystems',
          children: [
            {
              id: 'sec-2-3-1',
              text: '2.3.1 Subsystem Overview',
              children: [
                {
                  id: 'sec-2-3-1-1',
                  text: '2.3.1.1 Power Subsystem',
                  children: [
                    { id: 'sec-2-3-1-1-1', text: '2.3.1.1.1 Solar and RTG' },
                  ],
                },
                {
                  id: 'sec-2-3-1-2',
                  text: '2.3.1.2 Life Support Subsystem',
                  children: [
                    { id: 'sec-2-3-1-2-1', text: '2.3.1.2.1 Redundancy' },
                  ],
                },
              ],
            },
            { id: 'sec-2-3-2', text: '2.3.2 Power Requirements' },
          ],
        },
        { id: 'sec-2-4', text: '2.4 Mass and Payload' },
        { id: 'sec-2-5', text: '2.5 Maintenance and Refit' },
      ],
    },
    {
      id: 'sec-3',
      text: '3. Missions',
      children: [
        {
          id: 'sec-3-1',
          text: '3.1 Mission Planning',
          children: [
            {
              id: 'sec-3-1-1',
              text: '3.1.1 Launch Procedures',
              children: [
                {
                  id: 'sec-3-1-1-1',
                  text: '3.1.1.1 Countdown Phases',
                  children: [
                    { id: 'sec-3-1-1-1-1', text: '3.1.1.1.1 Pre-Countdown' },
                    { id: 'sec-3-1-1-1-2', text: '3.1.1.1.2 Final Ten Minutes' },
                  ],
                },
                {
                  id: 'sec-3-1-1-2',
                  text: '3.1.1.2 Post-Ignition',
                  children: [
                    { id: 'sec-3-1-1-2-1', text: '3.1.1.2.1 Orbit Insertion' },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'sec-3-2',
          text: '3.2 Mission Status',
          children: [
            {
              id: 'sec-3-2-1',
              text: '3.2.1 Mission Status Groups',
              children: [
                {
                  id: 'sec-3-2-1-1',
                  text: '3.2.1.1 Status Transitions',
                  children: [
                    { id: 'sec-3-2-1-1-1', text: '3.2.1.1.1 Valid Transitions' },
                    { id: 'sec-3-2-1-1-2', text: '3.2.1.1.2 Dashboard Display' },
                  ],
                },
                {
                  id: 'sec-3-2-1-2',
                  text: '3.2.1.2 Status Definitions',
                  children: [
                    { id: 'sec-3-2-1-2-1', text: '3.2.1.2.1 Pre-Launch Through Orbit' },
                  ],
                },
              ],
            },
            { id: 'sec-3-2-2', text: '3.2.2 Mission Classification' },
          ],
        },
        { id: 'sec-3-3', text: '3.3 Mission Timeline' },
        { id: 'sec-3-4', text: '3.4 Cross References' },
      ],
    },
    { id: 'sec-4', text: '4. Safety' },
    { id: 'sec-5', text: '5. Glossary' },
    {
      id: 'sec-6',
      text: '6. Operations',
      children: [
        {
          id: 'sec-6-1',
          text: '6.1 Daily Operations',
          children: [
            {
              id: 'sec-6-1-1',
              text: '6.1.1 Shift Structure',
              children: [
                {
                  id: 'sec-6-1-1-1',
                  text: '6.1.1.1 Handover',
                  children: [
                    { id: 'sec-6-1-1-1-1', text: '6.1.1.1.1 Handover Checklist' },
                    { id: 'sec-6-1-1-1-2', text: '6.1.1.1.2 Sign-Off' },
                  ],
                },
                { id: 'sec-6-1-1-2', text: '6.1.1.2 Shift Length and Overlap' },
              ],
            },
            {
              id: 'sec-6-1-2',
              text: '6.1.2 Roles and Authority',
              children: [
                {
                  id: 'sec-6-1-2-1',
                  text: '6.1.2.1 Flight Director',
                  children: [
                    { id: 'sec-6-1-2-1-1', text: '6.1.2.1.1 FD Authority Scope' },
                  ],
                },
                {
                  id: 'sec-6-1-2-2',
                  text: '6.1.2.2 CAPCOM and Ground Systems',
                  children: [
                    { id: 'sec-6-1-2-2-1', text: '6.1.2.2.1 Uncrewed Missions' },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'sec-6-2',
          text: '6.2 Emergency Protocols',
          children: [
            {
              id: 'sec-6-2-1',
              text: '6.2.1 Abort Types',
              children: [
                {
                  id: 'sec-6-2-1-1',
                  text: '6.2.1.1 Ascent Aborts',
                  children: [
                    { id: 'sec-6-2-1-1-1', text: '6.2.1.1.1 RTLS' },
                    { id: 'sec-6-2-1-1-2', text: '6.2.1.1.2 ATO and TAL' },
                  ],
                },
                { id: 'sec-6-2-1-2', text: '6.2.1.2 On-Orbit Emergencies' },
              ],
            },
          ],
        },
        { id: 'sec-6-3', text: '6.3 Communications Windows' },
        { id: 'sec-6-4', text: '6.4 Logistics and Resupply' },
        { id: 'sec-6-5', text: '6.5 Reporting and Metrics' },
      ],
    },
    {
      id: 'sec-7',
      text: '7. Training',
      children: [
        { id: 'sec-7-1', text: '7.1 Flight Controller Certification' },
        { id: 'sec-7-2', text: '7.2 Crew Training' },
        { id: 'sec-7-3', text: '7.3 Training Records' },
      ],
    },
    { id: 'sec-8', text: '8. Appendix' },
  ],

  handbook: [
    {
      id: 'sec-101',
      text: '1. Handbook',
      children: [
        { id: 'sec-101-1', text: '1.1 Navigation Map' },
        {
          id: 'sec-101-2',
          text: '1.2 Commands',
          children: [{ id: 'sec-101-2-1', text: '1.2.1 Example Command' }],
        },
        {
          id: 'sec-101-4',
          text: '1.4 Validation',
          children: [{ id: 'sec-101-4-1', text: '1.4.1 Preview Workflow' }],
        },
      ],
    },
  ],

  reference: [
    {
      id: 'sec-301',
      text: '3. Reference Library',
      children: [
        { id: 'sec-301-1', text: '3.1 Procedure Map' },
        { id: 'sec-301-2', text: '3.2 Crosswalk' },
        {
          id: 'sec-301-3',
          text: '3.3 Decision Rules',
          children: [{ id: 'sec-301-3-1', text: '3.3.1 Table Cross-Links' }],
        },
      ],
    },
  ],

  glossary: [
    {
      id: 'sec-201',
      text: '2. Glossary & Terms',
      children: [
        { id: 'sec-201-1', text: '2.1 Key Terms' },
        { id: 'sec-201-2', text: '2.2 Mappings' },
        {
          id: 'sec-201-3',
          text: '2.3 Definitions',
          children: [{ id: 'sec-201-3-1', text: '2.3.1 Row References' }],
        },
      ],
    },
  ],
};
