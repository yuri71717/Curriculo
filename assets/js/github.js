document.addEventListener('DOMContentLoaded', () => {
    const reposContainer = document.getElementById('repos-container');
    const username = 'yuri71717';
    
    // Language Colors mapping
    const languageColors = {
        'C#': '#178600',
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572a5',
        'PHP': '#4f5d95',
        'Java': '#b07219',
        'C++': '#f34b7d'
    };

    // Static Fallbacks
    const fallbackRepos = [
        {
            name: "Atividades-TPA-2025",
            description: "Minhas atividades de C# de 2025 desenvolvidas na ETEC.",
            html_url: "https://github.com/yuri71717/Atividades-TPA-2025",
            language: "C#",
            stargazers_count: 0,
            forks_count: 0
        },
        {
            name: "formulario-de-validacao",
            description: "Formulário simples com validação interativa em JavaScript.",
            html_url: "https://github.com/yuri71717/formulario-de-validacao",
            language: "JavaScript",
            stargazers_count: 0,
            forks_count: 0
        },
        {
            name: "Atividade-JS",
            description: "Exercícios e mini-projetos práticos para fixação de JavaScript.",
            html_url: "https://github.com/yuri71717/Atividade-JS",
            language: "JavaScript",
            stargazers_count: 0,
            forks_count: 0
        }
    ];

    // Loading Skeletons
    function renderShimmers(count = 3) {
        if (!reposContainer) return;
        reposContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            reposContainer.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="project-card shimmer" style="height: 240px; opacity: 0.6;">
                        <div style="height: 24px; width: 60%; background: rgba(255,255,255,0.08); border-radius: 4px; margin-bottom: 15px;"></div>
                        <div style="height: 14px; width: 90%; background: rgba(255,255,255,0.05); border-radius: 4px; margin-bottom: 10px;"></div>
                        <div style="height: 14px; width: 75%; background: rgba(255,255,255,0.05); border-radius: 4px; margin-bottom: 20px;"></div>
                        <div style="margin-top: auto; display: flex; justify-content: space-between;">
                            <div style="height: 16px; width: 30%; background: rgba(255,255,255,0.08); border-radius: 4px;"></div>
                            <div style="height: 16px; width: 30%; background: rgba(255,255,255,0.08); border-radius: 4px;"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Render Cards
    function renderRepos(repos) {
        if (!reposContainer) return;
        reposContainer.innerHTML = '';

        if (repos.length === 0) {
            reposContainer.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="bi bi-folder-x fs-1 mb-3 text-gradient-dual"></i>
                    <p>Nenhum repositório público próprio encontrado.</p>
                </div>
            `;
            return;
        }

        const maxDisplay = 9;
        const displayedRepos = repos.slice(0, maxDisplay);

        displayedRepos.forEach(repo => {
            const langColor = languageColors[repo.language] || '#858b91';
            const displayName = repo.name.replace(/[-_]/g, ' ');

            const cardHTML = `
                <div class="col-md-4 mb-4">
                    <div class="project-card">
                        <span class="project-lang-badge" style="border-color: ${langColor}40; background: ${langColor}15; color: ${langColor}">
                            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:${langColor}; margin-right:6px;"></span>
                            ${repo.language}
                        </span>
                        <h4 class="project-title text-truncate">${displayName}</h4>
                        <p class="project-description">${repo.description || 'Sem descrição disponível.'}</p>
                        <div class="project-footer">
                            <div class="project-stats">
                                <span><i class="bi bi-star-fill text-warning me-1"></i>${repo.stargazers_count}</span>
                                <span><i class="bi bi-diagram-2-fill me-1"></i>${repo.forks_count}</span>
                            </div>
                            <a href="${repo.html_url}" target="_blank" class="project-link">
                                Código <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            reposContainer.innerHTML += cardHTML;
        });
    }

    // Fetch & Cache Logic
    async function loadGitHubRepos() {
        renderShimmers(3);

        const cacheKey = 'github_repos_data';
        const cacheTimeKey = 'github_repos_timestamp';
        const cacheDuration = 3600000;

        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);
        const now = Date.now();

        if (cachedData && cachedTime && (now - cachedTime < cacheDuration)) {
            renderRepos(JSON.parse(cachedData));
            return;
        }

        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
            
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }

            const rawRepos = await response.json();
            
            const ownRepos = rawRepos
                .filter(repo => !repo.fork)
                .map(repo => ({
                    name: repo.name,
                    description: repo.description,
                    html_url: repo.html_url,
                    language: repo.language || 'HTML/CSS',
                    stargazers_count: repo.stargazers_count,
                    forks_count: repo.forks_count
                }));

            localStorage.setItem(cacheKey, JSON.stringify(ownRepos));
            localStorage.setItem(cacheTimeKey, now.toString());

            renderRepos(ownRepos);

        } catch (error) {
            console.warn('Erro ao carregar dados do GitHub:', error);
            
            if (cachedData) {
                renderRepos(JSON.parse(cachedData));
            } else {
                renderRepos(fallbackRepos);
            }
        }
    }

    loadGitHubRepos();
});
