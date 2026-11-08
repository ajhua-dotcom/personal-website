import Image, { type StaticImageData } from 'next/image';
import { awards, education, experience, profile, projects, skills } from '@/lib/content';
import {
  fileColor,
  DocumentIcon,
  ExternalIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from './icons';
import { SkillIcon } from './skill-icons';
import s from './sections.module.css';

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={`${id}-title`} className={s.heading}>
      {children}
    </h2>
  );
}

// The logo is decorative: the organization's name sits right beside it.
function Logo({ src }: { src: StaticImageData }) {
  return (
    <span className={s.logo}>
      <Image src={src} alt="" width={44} height={44} />
    </span>
  );
}

function OrgLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className={s.orgLink} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ExternalIcon className={s.external} />
    </a>
  );
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className={s.points} role="list">
      {items.map((point) => (
        <li key={point.slice(0, 32)}>{point}</li>
      ))}
    </ul>
  );
}

export function Readme() {
  return (
    <section id="readme" className={s.readme} aria-labelledby="readme-title">
      <h1 id="readme-title" className={s.name}>
        {profile.name}
      </h1>
      <p className={s.role}>{profile.role}</p>
      <div className={s.intro}>
        {profile.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
      <ul className={s.actions} role="list">
        <li>
          <a className={`${s.button} ${s.primary}`} href={profile.resume} target="_blank" rel="noopener noreferrer">
            <DocumentIcon />
            Resume (PDF)
          </a>
        </li>
        <li>
          <a className={`${s.button} ${s.secondary}`} href={profile.github} target="_blank" rel="noopener noreferrer">
            <GitHubIcon />
            GitHub
          </a>
        </li>
        <li>
          <a className={`${s.button} ${s.secondary}`} href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon />
            LinkedIn
          </a>
        </li>
        <li>
          <a className={`${s.button} ${s.secondary}`} href={`mailto:${profile.email}`}>
            <MailIcon />
            Email
          </a>
        </li>
      </ul>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className={s.section} aria-labelledby="experience-title">
      <SectionHeading id="experience">Experience</SectionHeading>
      <div className={s.entries}>
        {experience.map((job) => (
          <article key={job.id} id={job.id} className={s.entry}>
            <header className={s.entryHead}>
              <Logo src={job.logo} />
              <div className={s.titles}>
                <h3 className={s.entryTitle}>
                  <OrgLink href={job.url}>{job.company}</OrgLink>
                </h3>
                <p className={s.sub}>{job.role}</p>
              </div>
              <div className={s.meta}>
                <p>
                  {job.start} – {job.end}
                </p>
                <p>{job.location}</p>
              </div>
            </header>
            <Points items={job.points} />
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className={s.section} aria-labelledby="projects-title">
      <SectionHeading id="projects">Projects</SectionHeading>
      <div className={s.entries}>
        {projects.map((project) => (
          <article key={project.id} id={project.id} className={s.entry}>
            <header className={`${s.entryHead} ${s.entryHeadSingle}`}>
              {/* Projects have no logo; the tile shows the source file's extension. */}
              <span
                className={s.fileTile}
                style={{ color: fileColor[project.language] }}
                aria-hidden="true"
                translate="no"
              >
                .{project.language}
              </span>
              <div className={s.titles}>
                <h3 className={s.entryTitle}>{project.title}</h3>
              </div>
              <div className={s.meta}>
                <p>{project.date}</p>
                <p>{project.languageLabel}</p>
              </div>
            </header>
            <Points items={project.points} />
          </article>
        ))}
      </div>
    </section>
  );
}

export function EducationSection() {
  return (
    <section id="education" className={s.section} aria-labelledby="education-title">
      <SectionHeading id="education">Education</SectionHeading>
      <article className={s.entry}>
        <header className={s.entryHead}>
          <Logo src={education.logo} />
          <div className={s.titles}>
            <h3 className={s.entryTitle}>
              <OrgLink href={education.url}>{education.school}</OrgLink>
            </h3>
            {education.degrees.map((degree) => (
              <p key={degree} className={s.sub}>
                {degree}
              </p>
            ))}
          </div>
          <div className={s.meta}>
            <p>
              {education.start} – {education.end}
            </p>
            <p>{education.location}</p>
          </div>
        </header>
        <dl className={s.table}>
          {education.details.map((item) => (
            <div key={item.term} className={s.tableRow}>
              <dt>{item.term}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}

export function AwardsSection() {
  return (
    <section id="awards" className={s.section} aria-labelledby="awards-title">
      <SectionHeading id="awards">Awards</SectionHeading>
      <ul className={s.awards} role="list">
        {awards.map((award) => (
          <li key={award.event} className={s.award}>
            <p className={s.result}>{award.result}</p>
            <div>
              <p className={s.event}>{award.event}</p>
              {award.note ? <p className={s.note}>{award.note}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// The skills map: each group is a transit line, each skill a stop on it.
export function SkillsSection() {
  return (
    <section id="skills" className={s.section} aria-labelledby="skills-title">
      <SectionHeading id="skills">Technical skills</SectionHeading>
      <div className={s.routes}>
        {skills.map((group) => (
          <div
            key={group.id}
            className={s.route}
            style={{ '--route': group.color } as React.CSSProperties}
          >
            <h3 id={`route-${group.id}`} className={s.routeName}>
              <span className={s.routeBadge}>{group.group}</span>
            </h3>
            <ul className={s.stops} role="list" aria-labelledby={`route-${group.id}`}>
              {group.items.map((item) => (
                <li key={item} className={s.stop}>
                  <span className={s.stopNode}>
                    <SkillIcon name={item} />
                  </span>
                  <span className={s.stopName} translate="no">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <p>
        Reach me at <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <p>© {new Date().getFullYear()} {profile.name}</p>
    </footer>
  );
}
