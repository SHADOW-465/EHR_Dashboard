# Graph Report - .  (2026-09-23)

## Corpus Check
- Corpus is ~32,084 words - fits in a single context window. You may not need a graph.

## Summary
- 268 nodes · 289 edges · 42 communities (38 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Shadcn UI Primitives|Core Shadcn UI Primitives]]
- [[_COMMUNITY_Main Page & Supabase Sync|Main Page & Supabase Sync]]
- [[_COMMUNITY_Navigation & Sidebar Overlay|Navigation & Sidebar Overlay]]
- [[_COMMUNITY_Form & Layout Controls|Form & Layout Controls]]
- [[_COMMUNITY_Clinical Dashboard & Metric Cards|Clinical Dashboard & Metric Cards]]
- [[_COMMUNITY_LLM Backend & Groq Routes|LLM Backend & Groq Routes]]
- [[_COMMUNITY_Toast Notification Dispatcher|Toast Notification Dispatcher]]
- [[_COMMUNITY_UI Toast Utilities|UI Toast Utilities]]
- [[_COMMUNITY_Carousel Slider|Carousel Slider]]
- [[_COMMUNITY_Typewriter Text Animation|Typewriter Text Animation]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 52 edges
2. `isSupabaseConfigured()` - 10 edges
3. `getGroqClient()` - 7 edges
4. `GlassCard()` - 5 edges
5. `Separator()` - 5 edges
6. `fetchAllPatients()` - 4 edges
7. `savePatientReport()` - 4 edges
8. `handleFileRead()` - 3 edges
9. `loadData()` - 3 edges
10. `handleAnalyzeNewNote()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `getGroqClient()`  [INFERRED]
  app/api/operations/route.ts → lib/groq.ts
- `loadData()` --calls--> `isSupabaseConfigured()`  [INFERRED]
  app/page.tsx → lib/supabase/client.ts
- `loadData()` --calls--> `fetchAllPatients()`  [INFERRED]
  app/page.tsx → lib/supabase/service.ts
- `handleAnalyzeNewNote()` --calls--> `savePatientReport()`  [INFERRED]
  app/page.tsx → lib/supabase/service.ts
- `handleAnalyzeNewNote()` --calls--> `Alert()`  [INFERRED]
  app/page.tsx → components/ui/alert.tsx

## Communities (42 total, 4 thin omitted)

### Community 1 - "Main Page & Supabase Sync"
Cohesion: 0.12
Nodes (15): handleAnalyzeNewNote(), handleDrop(), handleFileInputChange(), handleFileRead(), loadData(), toggleSpeechSynthesis(), createClient(), isSupabaseConfigured() (+7 more)

### Community 2 - "Navigation & Sidebar Overlay"
Cohesion: 0.1
Nodes (10): useIsMobile(), SheetDescription(), SheetHeader(), SheetTitle(), SidebarMenuButton(), useSidebar(), Skeleton(), Tooltip() (+2 more)

### Community 4 - "Clinical Dashboard & Metric Cards"
Cohesion: 0.13
Nodes (5): AnimatedCount(), useCountUp(), AnimatedNumber(), GlassCard(), NeonBadge()

### Community 5 - "LLM Backend & Groq Routes"
Cohesion: 0.31
Nodes (6): generateHeuristicClinicalAnalysis(), POST(), generateClinicalContextReply(), POST(), getGroqClient(), POST()

### Community 6 - "Toast Notification Dispatcher"
Cohesion: 0.39
Nodes (6): addToRemoveQueue(), dispatch(), genId(), reducer(), toast(), useToast()

### Community 12 - "UI Toast Utilities"
Cohesion: 0.48
Nodes (5): addToRemoveQueue(), dispatch(), genId(), reducer(), toast()

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Core Shadcn UI Primitives` to `Main Page & Supabase Sync`, `Navigation & Sidebar Overlay`, `Form & Layout Controls`, `Alert Dialog Modal`, `Breadcrumb Navigation`, `Context Menu Actions`, `Pagination Component`, `Select Dropdown Controls`, `Carousel Slider`, `Drawer Sheet Panel`, `Dropdown Menu Primitives`, `Data Table Controls`, `Card Container Components`, `OTP Input Fields`, `Menubar Top Nav`, `Navigation Menu Primitives`, `Toggle Group Buttons`, `Data Chart Components`?**
  _High betweenness centrality (0.566) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `isSupabaseConfigured()` (e.g. with `loadData()` and `createClient()`) actually correct?**
  _`isSupabaseConfigured()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `getGroqClient()` (e.g. with `POST()` and `POST()`) actually correct?**
  _`getGroqClient()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Core Shadcn UI Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Main Page & Supabase Sync` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Navigation & Sidebar Overlay` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Form & Layout Controls` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._