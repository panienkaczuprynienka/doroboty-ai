import type { ProjectCard } from "./model";

const fields: { key: keyof ProjectCard; label: string }[] = [
  { key: "candidateActions", label: "Moje działania" },
  { key: "teamActions", label: "Działania zespołu" },
  { key: "responsibility", label: "Moja odpowiedzialność" },
];

export function ProjectContributionCard({ project }: { project: ProjectCard }) {
  return (
    <div className="project-contribution-content">
      {(project.organization || project.position || project.period) && (
        <div className="project-contribution-context">
          {[project.position, project.organization, project.period].filter(Boolean).join(" · ")}
        </div>
      )}
      <div className="project-contribution-overview">
        <div className="project-contribution-goal">
          <span>PROJEKT</span>
          <h3>{project.goal}</h3>
        </div>
        <div className="project-contribution-result">
          <span>REZULTAT</span>
          <strong>{project.result}</strong>
        </div>
      </div>
      <dl className="project-contribution-facts">
        {fields.map(({ key, label }) => (
          <div className="project-contribution-fact" key={key}>
            <dt>{label}</dt>
            <dd>{project[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
