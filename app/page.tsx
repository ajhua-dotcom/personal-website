import { CanvasSpotlight } from '@/components/canvas-spotlight';
import { Explorer } from '@/components/explorer';
import { PathBar } from '@/components/path-bar';
import { StatusBar } from '@/components/status-bar';
import {
  AwardsSection,
  EducationSection,
  ExperienceSection,
  Footer,
  ProjectsSection,
  Readme,
  SkillsSection,
} from '@/components/sections';
import { WorkspaceMain, WorkspaceProvider } from '@/components/workspace';

export default function Home() {
  return (
    <WorkspaceProvider>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <div className="canvas" aria-hidden="true" />
      <CanvasSpotlight />
      <div className="workspace">
        <Explorer />
        <WorkspaceMain>
          <PathBar />
          <main id="content" className="content" tabIndex={-1}>
            <Readme />
            <SkillsSection />
            <ExperienceSection />
            <EducationSection />
            <ProjectsSection />
            <AwardsSection />
            <Footer />
          </main>
          <StatusBar />
        </WorkspaceMain>
      </div>
    </WorkspaceProvider>
  );
}
