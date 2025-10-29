// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica do Menu Hamburguer (Responsividade) ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav'); 
    const mainNavList = document.getElementById('main-nav-list'); 
    
    // --- Lógica do Modo Escuro ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIconSvg = `
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3a9 9 0 0 0 9 9 9 9 0 0 1-9-9z" id="dark-mode-path"/>
        </svg>
    `;

    // Função para aplicar o modo de cor
    const applyDarkMode = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark);
        
        // Atualiza o ícone SVG (Sol ou Lua)
        if (isDark) {
            darkModeToggle.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm9.75 5.625a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM18.75 3.75h.008v.008h-.008V3.75Zm-12 0h.008v.008h-.008V3.75ZM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM4.5 5.625h-.008v.008h.008V5.625ZM5.625 4.5h.008v.008h-.008V4.5Zm12 12h.008v.008h-.008v-.008Zm1.125-1.125h.008v.008h-.008v-.008ZM4.5 18.375h-.008v.008h.008v-.008ZM19.875 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM6 18.75a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75Z"/>
                </svg>
            `;
        } else {
            darkModeToggle.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.75 6.75C9.75 5.619 10.669 4.75 11.8 4.75h.4c1.131 0 2.05.869 2.05 1.75v.25c0 1.131-.919 2.05-2.05 2.05h-.4c-1.131 0-2.05-.919-2.05-2.05V6.75ZM6 12.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM16.75 12a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM6 18.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM16.75 18a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM12 9.75a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM4.5 12.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM18 12.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75Z"/>
                </svg>
            `;
        }
    };
    
    // Inicializa o modo de cor
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    applyDarkMode(isDarkMode);

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isCurrentlyDark = document.body.classList.contains('dark-mode');
            applyDarkMode(!isCurrentlyDark);
        });
    }

    if (menuToggle && mainNav) {
        
        // Função para alternar o estado do menu (abrir/fechar)
        const toggleMenu = () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            
            // Alterna o atributo e a classe
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('open');
        };

        menuToggle.addEventListener('click', toggleMenu);

        // 1. Fechar o menu ao clicar em um link (para navegação interna)
        mainNavList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Fechar o menu sempre que um link for clicado
                if (mainNav.classList.contains('open')) {
                    toggleMenu(); 
                }
            });
        });
        
        // 2. Fechar o menu ao clicar fora do menu ou do botão
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('open') && 
                !mainNav.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                
                toggleMenu(); // Chama a função para fechar
            }
        });
        
        // 3. Forçar o fechamento do menu se a tela for redimensionada (por precaução)
        window.addEventListener('resize', () => {
            if (mainNav.classList.contains('open')) {
                 // Reseta o estado do menu
                 menuToggle.setAttribute('aria-expanded', 'false');
                 mainNav.classList.remove('open');
            }
        });
    }

    // --- Lógica do Accordion ---
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Abre ou fecha o item clicado
            button.setAttribute('aria-expanded', !isExpanded);
            content.hidden = isExpanded;
        });
    });

    // --- Lógica das Abas ---
    const tabsContainer = document.querySelector('.tabs-container');
    
    if (tabsContainer) {
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabPanels = tabsContainer.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. Desativar todos os botões e esconder todos os painéis
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                tabPanels.forEach(panel => {
                    panel.hidden = true;
                });

                // 2. Ativar o botão clicado
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                // 3. Mostrar o painel correspondente
                const targetPanelId = button.getAttribute('aria-controls');
                const targetPanel = document.getElementById(targetPanelId);
                if (targetPanel) {
                    targetPanel.hidden = false;
                }
            });
        });
    }

    // --- Configuração do Mapa ---
    const latInicial = -22.5;
    const lonInicial = -48.5;
    const zoomInicial = 7;
    
    // Inicializa o mapa Leaflet
    const mapContainer = document.getElementById('mapa-container');
    let map = null;

    // Inicializa o mapa apenas se o container existir
    if (mapContainer) {
        map = L.map('mapa-container').setView([latInicial, lonInicial], zoomInicial);

        // Adiciona a camada de mapa (tile layer) do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    } else {
        console.error("Contêiner do mapa não encontrado.");
        return; // Retorna se o mapa não puder ser inicializado
    }


    // Variáveis globais para armazenar dados e marcadores
    let todasAsUniversidades = [];
    const marcadoresLayerGroup = L.layerGroup().addTo(map); 

    // --- DADOS MOCK (Mantidos em comentário para referência) ---
    /*
    const mockUniversidades = [
        // USP (Universidade de São Paulo)
        { "nome": "USP - Campus Butantã (Capital)", "tipo": "Pública", "cidade": "São Paulo", "formas_ingresso": ["Vestibular Próprio (FUVEST)", "ENEM-USP"], "site": "usp.br", "site_vestibular": "fuvest.br", "latitude": -23.5606, "longitude": -46.7291 },
        { "nome": "USP - Campus São Carlos", "tipo": "Pública", "cidade": "São Carlos", "formas_ingresso": ["Vestibular Próprio (FUVEST)", "ENEM-USP"], "site": "usp.br", "site_vestibular": "fuvest.br", "latitude": -21.9902, "longitude": -47.3789 },
        // ... mais dados ...
    ];
    */

    // --- Carregamento de Dados (CORRIGIDO PARA BUSCAR JSON) ---
    async function carregarUniversidades() {
        try {
            // Tenta buscar o arquivo universidades.json
            const response = await fetch('universidades.json'); 

            if (!response.ok) {
                // Se o arquivo JSON não for encontrado ou houver erro, usa os dados mock (se existissem)
                console.error(`Erro ao carregar universidades.json: ${response.statusText}.`);
                
                // DEVE SER SUBSTITUÍDO PELA LÓGICA DE DADOS MOCK AQUI SE NECESSÁRIO
                // Exemplo: todasAsUniversidades = mockUniversidades;
                return; 
            }
            
            todasAsUniversidades = await response.json();
            
            // Log para debug
            console.log(`Carregadas ${todasAsUniversidades.length} universidades do JSON.`);

        } catch (error) {
            console.error("Não foi possível realizar o fetch do universidades.json. Verifique o caminho do arquivo.", error);

            // Apenas para garantir que o mapa tenha algo para exibir em caso de falha de fetch
            // **IMPORTANTE**: Se você tem certeza que o arquivo JSON existe, remova esta linha:
            todasAsUniversidades = [
                { "nome": "USP - Campus Butantã (Capital)", "tipo": "Pública", "cidade": "São Paulo", "formas_ingresso": ["Vestibular Próprio (FUVEST)", "ENEM-USP"], "site": "usp.br", "site_vestibular": "fuvest.br", "latitude": -23.5606, "longitude": -46.7291 },
                { "nome": "UNICAMP - Campus Barão Geraldo", "tipo": "Pública", "cidade": "Campinas", "formas_ingresso": ["Vestibular Próprio (COMVEST)", "ENEM"], "site": "unicamp.br", "site_vestibular": "comvest.unicamp.br", "latitude": -22.8173, "longitude": -47.0734 },
                { "nome": "UFSCar - Campus São Carlos", "tipo": "Pública", "cidade": "São Carlos", "formas_ingresso": ["SISU (ENEM)"], "site": "ufscar.br", "site_vestibular": "ufscar.br", "latitude": -21.9860, "longitude": -47.3824 },
            ];
        } finally {
            // Configurações dependentes do carregamento
            configurarFiltrosEBusca(); 
            if (map) atualizarMapa(); 
            configurarBuscaPrincipal();
        }
    }

    // --- Renderização de Marcadores ---
    function renderizarMarcadores(listaDeUniversidades) {
        if (!map) return; 
        
        marcadoresLayerGroup.clearLayers(); 
        
        listaDeUniversidades.forEach(uni => {
            let siteUrl = uni.site.startsWith('http') ? uni.site : `https://${uni.site}`;
            let vestibularUrl = uni.site_vestibular.startsWith('http') ? uni.site_vestibular : `https://${uni.site_vestibular}`;

            // Cria um marcador
            const marcador = L.marker([uni.latitude, uni.longitude]);
            
            const formasIngressoHtml = uni.formas_ingresso ? 
                `<strong>Ingresso:</strong> ${uni.formas_ingresso.join(', ')}<br>` : '';

            const conteudoPopup = `
                <div style="font-family: var(--fonte-principal); color: black;">
                    <strong style="font-size: 1.1em;">${uni.nome}</strong><br>
                    ${uni.cidade}<br>
                    ${formasIngressoHtml}
                    <a href="${vestibularUrl || siteUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--cor-secundaria); font-weight: bold; text-decoration: none;">Visitar Site do Vestibular</a>
                </div>
            `;
            marcador.bindPopup(conteudoPopup);
            marcador.addTo(marcadoresLayerGroup); // Adiciona ao LayerGroup
        });
    }

    // --- Filtros do Mapa ---
    const filtroPublica = document.getElementById('filtro-publica'); 
    const filtroSisuCheck = document.getElementById('filtro-sisu-check');
    const filtroEnemCheck = document.getElementById('filtro-enem-check');
    const filtroVestibularProprioCheck = document.getElementById('filtro-vestibular-proprio-check');
    
    function atualizarMapa() {
        if (!map) return; 
        
        // Valores dos filtros
        const isPublicaChecked = filtroPublica ? filtroPublica.checked : true;
        const isSisuChecked = filtroSisuCheck ? filtroSisuCheck.checked : false;
        const isEnemChecked = filtroEnemCheck ? filtroEnemCheck.checked : false;
        const isVestibularProprioChecked = filtroVestibularProprioCheck ? filtroVestibularProprioCheck.checked : false;

        const universidadesFiltradas = todasAsUniversidades.filter(uni => {
            
            // Filtro de Tipo (já que todos são públicos, é sempre true se o checkbox estiver marcado)
            const passaFiltroTipo = (isPublicaChecked && uni.tipo === 'Pública');
            
            // Lógica do filtro de INGRESSO
            const filtrosIngressoAtivos = isSisuChecked || isEnemChecked || isVestibularProprioChecked;
            let passaFiltroIngresso = true; 

            if (filtrosIngressoAtivos && uni.formas_ingresso) {
                const formas = uni.formas_ingresso.map(f => f.toUpperCase());
                
                // SISU e ENEM são tratados em conjunto no mock, mas separamos a lógica aqui
                const temSisu = formas.some(forma => forma.includes('SISU'));
                const temEnemOutros = formas.some(forma => forma.includes('ENEM') && !forma.includes('SISU'));
                const temVestibularProprio = formas.some(forma => forma.includes('VESTIBULAR PRÓPRIO'));
                
                // Assume que passa se pelo menos um dos filtros marcados for atendido
                passaFiltroIngresso = 
                    (isSisuChecked && temSisu) || 
                    (isEnemChecked && temEnemOutros) ||
                    (isVestibularProprioChecked && temVestibularProprio);

            }
            
            return passaFiltroTipo && passaFiltroIngresso;
        });

        renderizarMarcadores(universidadesFiltradas);
    }

    // Configura os event listeners para os filtros do mapa
    function configurarFiltrosEBusca() {
        if (filtroSisuCheck) filtroSisuCheck.addEventListener('change', atualizarMapa);
        if (filtroEnemCheck) filtroEnemCheck.addEventListener('change', atualizarMapa);
        if (filtroVestibularProprioCheck) filtroVestibularProprioCheck.addEventListener('change', atualizarMapa);
    }

    // --- Busca Principal e Display de Info (Seção Universidades) ---
    function configurarBuscaPrincipal() {
        const searchBar = document.getElementById('uni-search-bar');
        const searchResults = document.getElementById('uni-search-results');
        const infoDisplay = document.getElementById('uni-info-display');
        
        if (!searchBar || !searchResults || !infoDisplay) return;

        searchBar.addEventListener('input', (e) => {
            const termoBusca = e.target.value.toLowerCase();
            searchResults.innerHTML = ''; 

            if (termoBusca.length < 2) {
                searchResults.innerHTML = ''; 
                return; 
            }

            const termosBuscaArray = termoBusca.split(' ').filter(term => term.length > 0);

            const resultados = todasAsUniversidades.filter(uni => {
                const nomeUniLower = uni.nome.toLowerCase();
                // Verifica se CADA termo de busca está presente no nome
                return termosBuscaArray.every(term => nomeUniLower.includes(term));
            }).slice(0, 10); // Limita a 10 resultados

            if (resultados.length > 0) {
                // Adiciona o box-shadow apenas quando há resultados
                searchResults.style.boxShadow = '0 8px 15px rgba(0,0,0,0.5)';
            } else {
                searchResults.style.boxShadow = 'none';
            }

            resultados.forEach(uni => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.textContent = uni.nome;
                item.setAttribute('tabindex', '0'); // Torna clicável via teclado
                item.setAttribute('role', 'option'); // Acessibilidade
                
                const selectUni = () => {
                    displayUniversityInfo(uni); 
                    
                    if (map) {
                        map.flyTo([uni.latitude, uni.longitude], 15); 
                        
                        // Encontra e abre o popup
                        marcadoresLayerGroup.eachLayer(layer => {
                            if (layer.getLatLng().lat === uni.latitude && layer.getLatLng().lng === uni.longitude) {
                                layer.openPopup();
                            }
                        });
                    }

                    searchBar.value = uni.nome; 
                    searchResults.innerHTML = '';
                    
                    infoDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
                };

                item.addEventListener('click', selectUni);
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectUni();
                    }
                });

                searchResults.appendChild(item);
            });
        });

        // Fecha os resultados se clicar fora
        document.addEventListener('click', (e) => {
            if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.innerHTML = '';
            }
        });
    }

    // Função para mostrar o Card de Informações
    function displayUniversityInfo(uni) {
        const infoDisplay = document.getElementById('uni-info-display');
        
        let siteUrl = uni.site.startsWith('http') ? uni.site : `https://${uni.site}`;
        let vestibularUrl = uni.site_vestibular.startsWith('http') ? uni.site_vestibular : `https://${uni.site_vestibular}`;
        
        const formasIngresso = uni.formas_ingresso.join(', ');

        infoDisplay.innerHTML = `
            <div class="uni-info-card">
                <h3>${uni.nome}</h3>
                <p><span class="info-label">Cidade:</span> ${uni.cidade}</p>
                <p><span class="info-label">Formas de Ingresso:</span> ${formasIngresso}</p>
                <div class="info-links">
                    <a href="${siteUrl}" class="info-link" target="_blank" rel="noopener noreferrer">Site Oficial</a>
                    <a href="${vestibularUrl}" class="info-link" target="_blank" rel="noopener noreferrer">Site do Vestibular</a>
                </div>
            </div>
        `;
    }

    // Inicia o processo de carregamento dos dados
    carregarUniversidades();

});
