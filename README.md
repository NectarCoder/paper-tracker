Phase 1: Foundation & Mock UI (No Backend)  
- Initialize Vite + React + TypeScript project
- Configure styling strategy (CSS / Tailwind / UI Lib) and Theme Context (Dark/Light mode)
- Setup base layout components (Header, Main layout)
- Implement Resizable Split-Pane component
- Create Mock Data schema for papers and citations (JSON)
- Build Left Pane: Paper List/Dashboard UI
- Build Left Pane: Search & Filter UI
- Build Left Pane: Add/Edit Paper form UI (mock state update)
- Build Right Pane: Interactive Knowledge Graph visualization (using react-force-graph)
- Implement interaction between List and Graph (clicking node selects paper in list, etc.)

Phase 2: Supabase Integration  
- Setup Supabase project (Auth, Database, Storage)
- Define PostgreSQL schema for Papers and Citations (edges)
- Implement Auth Context and UI (Login/Signup - Email, Google, GitHub)
- Replace mock data reads with Supabase select queries
- Replace mock data writes with Supabase insert/update/delete mutations
- Implement PDF upload to Supabase Storage and link URL to Paper record
- Add Row Level Security (RLS) policies so user only sees their own data

Phase 3: Polish & Deployment  
- Review UI/UX for premium feel (animations, spacing, typography)
- Ensure responsive design (how split pane behaves on smaller screens)
- Create GitHub Actions workflow for GitHub Pages deployment
- Test live deployment