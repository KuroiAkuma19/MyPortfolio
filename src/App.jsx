import { lazy, Suspense, useEffect, useState } from 'react'

const profile = {
  name: 'Arnold Wilson Fernandes',
  handle: 'KuroiAkuma19',
  location: 'India',
  avatar: 'https://avatars.githubusercontent.com/u/185193431?v=4',
  github: 'https://github.com/KuroiAkuma19',
  linkedin: 'https://www.linkedin.com/in/arnoldfernandes1945',
  x: 'https://x.com/__arnold__19',
  email: 'arnoldfern.1945@gmail.com',
}

const skillGroups = [
  {
    category: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Kotlin', 'C', 'C++'],
  },
  {
    category: 'Frameworks & Web',
    skills: ['React', 'Three.js', 'Django', 'HTML5', 'CSS3'],
  },
  {
    category: 'Tools & Databases',
    skills: ['Git', 'GitHub', 'MySQL'],
  },
]

const excludedRepositoryNames = new Set(['kuroiakuma19', 'testrepo'])    //Personal profile repository and a test repository.

const pinnedProjects = [
  {
    name: 'Voxel-Verse',
    category: 'JavaScript / 3D sandbox',
    description: 'A 3D sandbox experiment with procedural terrain, mesh generation, and immersive exploration.',
    repo: 'https://github.com/KuroiAkuma19/Voxel-Verse',
  },
  {
    name: 'ArnoCrypt',
    category: 'Kotlin / mobile security',
    description: 'An Android encryption app built around classic cipher modes and a clean, high-contrast interface.',
    repo: 'https://github.com/KuroiAkuma19/ArnoCrypt',
  },
  {
    name: 'Apex Digital Bank',
    category: 'Python / finance systems',
    description: 'A banking management system focused on account flows, transaction handling, and desktop UI logic.',
    repo: 'https://github.com/KuroiAkuma19/Apex-Digital-Bank',
  },
  {
    name: 'Arno_Task',
    category: 'Kotlin / Android productivity',
    description: 'A centralized Android task manager with notes, reminders, location stamps, dark/light themes, and progress tracking.',
    repo: 'https://github.com/KuroiAkuma19/Arno_Task',
  },
  {
    name: 'JavaMathGame',
    category: 'Java / game loop',
    description: 'A fast-paced math challenge with scoring, timing, and replayable game rounds.',
    repo: 'https://github.com/KuroiAkuma19/JavaMathGame',
  },
  {
    name: 'CustomWear',
    category: 'React / e-commerce',
    description: 'A sleek e-commerce storefront built with React and Tailwind CSS, focused on speed, polish, and clean product presentation.',
    repo: 'https://github.com/KuroiAkuma19/CustomWear',
  },
]

const ThreeBackdrop = lazy(() => import('./components/ThreeBackdrop.jsx'))

function normalizeRepositoryName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function buildRepositorySummary(repository) {
  return {
    name: repository.name,
    category: `${repository.language || 'Code'} repository`,
    description: repository.description?.trim() || 'No description added yet.',
    repo: repository.html_url,
  }
}

function App() {
  const [page, setPage] = useState('home')
  const [repositories, setRepositories] = useState([])
  const [repoError, setRepoError] = useState('')

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    const loadRepositories = async () => {
      try {
        setRepoError('')

        const response = await fetch(
          'https://api.github.com/users/KuroiAkuma19/repos?per_page=100&type=owner&sort=updated',
          { signal: controller.signal, cache: 'no-store' },
        )

        if (!response.ok) {
          throw new Error('GitHub API request failed.')
        }

        const repositoryData = await response.json()

        if (!active) {
          return
        }

        const liveRepositories = repositoryData
          .filter((repository) => !excludedRepositoryNames.has(normalizeRepositoryName(repository.name)))
          .sort((left, right) => new Date(right.updated_at) - new Date(left.updated_at))
          .map(buildRepositorySummary)

        setRepositories(liveRepositories)
      } catch {
        if (active) {
          setRepoError('Unable to load live repositories right now.')
        }
      }
    }

    loadRepositories()

    const refreshInterval = window.setInterval(loadRepositories, 10 * 60 * 1000)

    return () => {
      active = false
      controller.abort()
      window.clearInterval(refreshInterval)
    }
  }, [])

  const projectList = page === 'projects' && repositories.length > 0 ? repositories : pinnedProjects

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04),_transparent_32%),linear-gradient(180deg,_#000000_0%,_#000000_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] opacity-18" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.08)_56%,_rgba(0,0,0,0.94)_100%)]" />

      <Suspense
        fallback={
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_55%)]" />
        }
      >
        <ThreeBackdrop />
      </Suspense>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <div>
            <p className="text-xs uppercase tracking-tight md:tracking-[0.45em] text-cyan-200/75">{profile.name}</p>
            <p className="mt-1 text-sm text-slate-300">{profile.handle}</p>
          </div>

          <nav className="flex flex-wrap gap-3 text-sm text-slate-200">
            <button
              type="button"
              className={`rounded-lg border px-3 py-1.5 sm:px-4 sm:py-2 transition ${page === 'home' ? 'border-cyan-300/60 bg-cyan-300/10 text-cyan-100' : 'border-white/10 hover:border-cyan-300/50 hover:bg-white/10'}`}
              onClick={() => setPage('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`rounded-lg border px-3 py-1.5 sm:px-4 sm:py-2 transition ${page === 'projects' ? 'border-cyan-300/60 bg-cyan-300/10 text-cyan-100' : 'border-white/10 hover:border-cyan-300/50 hover:bg-white/10'}`}
              onClick={() => setPage('projects')}
            >
              All Projects
            </button>
          </nav>
        </header>

        {page === 'home' ? (
          <>
            <section className="grid flex-1 items-start gap-6 py-6 sm:py-8 md:grid-cols-[1.1fr_0.9fr] lg:py-20">
              <div className="space-y-8">
                    <div className="space-y-6">
                      <h1 className="max-w-full text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl md:text-4xl lg:text-8xl lg:leading-[0.95]">
                    Building practical projects with a clean, visual edge.
                  </h1>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    className="git-btn rounded-lg bg-cyan-300 px-4 py-2 sm:px-6 sm:py-3 text-sm font-semibold text-slate-950"
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View GitHub
                  </a>
                </div>
              </div>

              <aside className="relative self-start pt-2 sm:pt-4 lg:pt-10 flex-shrink-0">
                <div className="absolute inset-0 lg:-inset-6 rounded-[2rem] bg-[radial-gradient(circle,_rgba(16,185,129,0.18),_transparent_60%)] blur-3xl" />
                <div className="card profile-card relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/40 p-7 pb-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl w-full">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                    <img
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-white/10 object-cover"
                      src={profile.avatar}
                      alt={`${profile.name} avatar`}
                    />
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Profile</p>
                      <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-white">{profile.name}</h2>
                    </div>
                  </div>

                  <div className="space-y-5 py-4 sm:py-6 text-sm leading-7 text-slate-200">
                    <section className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Education</p>
                      <p>
                        Computer Engineering student at St. Francis Institute of Technology.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Looking for</p>
                      <p>Internships, open-source collaboration, and junior developer roles.</p>
                    </section>

                    <section className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Tech stack</p>
                      <p>React, Three.js, JavaScript, Python, Java, Kotlin.</p>
                    </section>

                    <section className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Interests</p>
                      <p>Singing, football, and photography.</p>
                    </section>

                    <section className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Socials / Contact info</p>
                        <div className="text-slate-100 socials-contact-info">
                          {[
                            { label: 'LinkedIn', href: profile.linkedin },
                            { label: 'X', href: profile.x },
                            { label: 'GitHub', href: profile.github },
                            { label: profile.email, href: `mailto:${profile.email}` },
                          ].map((item) => (
                            <span key={item.href} className="social-item inline-block">
                              <a
                                className="inline text-slate-100 transition hover:text-cyan-200"
                                href={item.href}
                                target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                                rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                              >
                                {item.label}
                              </a>
                            </span>
                          ))}
                        </div>
                    </section>
                  </div>

                  <div className="border-t border-white/10 pt-4 text-sm text-slate-100">
                    {profile.location} · {profile.handle}
                  </div>
                </div>
              </aside>
            </section>

            <section className="grid gap-6 py-8 sm:py-10 lg:grid-cols-[0.9fr_1.1fr]">
              <article className="card rounded-[2rem] border border-white/10 bg-slate-950/40 p-6 sm:p-7 backdrop-blur-xl w-full">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">About</p>
                <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight">
                  I build high-utility software by getting things working first.
                </h2>
                <div className="mt-4 space-y-4 max-w-2xl text-sm leading-7 text-slate-300">
                  <p>
                    I focus on practical engineering and clean visual design. I believe software
                    should be straightforward, fast, and intuitive to use. Instead of
                    over-complicating things early on, I prioritize building a robust core layout,
                    then refining the user experience with sharp, deliberate design choices.
                  </p>
                  <p>
                    My experience covers full-stack web apps, mobile, and desktop tools. Whether
                    I&apos;m optimizing database logic in Django or crafting fluid 3D interactions
                    with Three.js, I love bridging the gap between solid backend code and engaging
                    front-end interfaces.
                  </p>
                </div>
              </article>

              <article className="card rounded-[2rem] border border-white/10 bg-slate-950/40 p-7 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Skills &amp; Technologies</p>
                <div className="mt-6 grid gap-6">
                  {skillGroups.map((group) => (
                    <div key={group.category} className="grid gap-3 sm:grid-cols-[180px_1fr] sm:items-start">
                      <div>
                        <p className="text-sm font-semibold text-white">{group.category}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {group.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="py-10">
              <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Pinned projects</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Projects that should be seen first.</h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pinnedProjects.map((project) => (
                  <article
                    key={project.name}
                    className="card project-card group rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-950/45"
                  >
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">{project.category}</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{project.name}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{project.description}</p>
                    <a
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-200 transition group-hover:text-orange-100"
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open repository
                      <span aria-hidden="true">↗</span>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="flex flex-1 flex-col gap-8 py-14 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">All projects</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Every public repository</h2>
              </div>
            </div>

            {repoError ? <p className="text-sm text-amber-200/90">{repoError}</p> : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projectList.map((project) => (
                <article
                  key={project.name}
                  className="card project-card group rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-950/40"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">{project.category}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{project.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{project.description}</p>
                  <a
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-200 transition group-hover:text-orange-100"
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open repository
                    <span aria-hidden="true">↗</span>
                  </a>
                  {'stars' in project ? (
                    <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                      {project.stars} stars · updated {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-slate-400">
        </footer>
      </div>
    </main>
  )
}

export default App
