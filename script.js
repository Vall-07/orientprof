// script.js

// Aguarda o carregamento completo do DOM (Seção 2.1)
document.addEventListener('DOMContentLoaded', () => {

    // --- Seção do Mapa (Seções 2.1, 2.2, 2.3) ---
    
    // Coordenadas centrais e zoom (Seção 2.1)
    const latInicial = -22.5;
    const lonInicial = -48.5;
    const zoomInicial = 7;
    
    // Inicializa o mapa Leaflet (Seção 2.1)
    const map = L.map('mapa-container').setView([latInicial, lonInicial], zoomInicial);

    // Adiciona a camada de mapa (tile layer) do OpenStreetMap (Seção 2.1)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let todasAsUniversidades = []; // Armazena todos os dados (Seção 2.2)
    const marcadoresLayerGroup = L.layerGroup().addTo(map); // Grupo para gerenciar os marcadores (Seção 2.2)

    // Função assíncrona para carregar os dados do JSON (Seção 2.2)
    async function carregarUniversidades() {
        try {
            const response = await fetch('universidades.json');
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            todasAsUniversidades = await response.json();
            renderizarMarcadores(todasAsUniversidades); // Renderiza todos os marcadores inicialmente
            configurarFiltrosEBusca(); // Configura os event listeners dos filtros
        } catch (error) {
            console.error("Não foi possível carregar os dados das universidades:", error);
            // Opcional: Exibir uma mensagem de erro para o usuário na interface
        }
    }

    // Função para renderizar os marcadores no mapa (Seção 2.2)
    function renderizarMarcadores(listaDeUniversidades) {
        marcadoresLayerGroup.clearLayers(); // Limpa os marcadores antigos
        listaDeUniversidades.forEach(uni => {
            const marcador = L.marker([uni.latitude, uni.longitude]);
            
            // Cria o conteúdo do popup com HTML dinâmico (Seção 2.2)
            const conteudoPopup = `
                <strong>${uni.nome}</strong><br>
                ${uni.cidade}<br>
                <a href="${uni.site_vestibular || uni.site}" target="_blank" rel="noopener noreferrer">Visitar Site do Vestibular</a>
            `;
            marcador.bindPopup(conteudoPopup); // Associa o popup ao marcador
            marcadoresLayerGroup.addLayer(marcador); // Adiciona o marcador ao grupo
        });
    }

    // Função para configurar os filtros e a busca (Seção 2.3)
    function configurarFiltrosEBusca() {
        // Seleciona os elementos do DOM
        const filtroPublica = document.getElementById('filtro-publica');
        const filtroPrivada = document.getElementById('filtro-privada');
        const filtroSisuCheck = document.getElementById('filtro-sisu-check');
        const filtroEnemCheck = document.getElementById('filtro-enem-check');
        const filtroVestibularProprioCheck = document.getElementById('filtro-vestibular-proprio-check');
        const searchInput = document.getElementById('search-uni');

        // Função unificada para atualizar o mapa
        function atualizarMapa() {
            // Valores dos filtros
            const isPublicaChecked = filtroPublica.checked;
            const isPrivadaChecked = filtroPrivada.checked;
            const isSisuChecked = filtroSisuCheck.checked;
            const isEnemChecked = filtroEnemCheck.checked;
            const isVestibularProprioChecked = filtroVestibularProprioCheck.checked;
            const termoBusca = searchInput.value.toLowerCase();

            // Filtra a lista completa de universidades
            const universidadesFiltradas = todasAsUniversidades.filter(uni => {
                
                // --- Lógica do filtro de TIPO ---
                // Se ambos estiverem desmarcados, não mostra nada.
                // Se um (ou ambos) estiver marcado, mostra os tipos correspondentes.
                const passaFiltroTipo = (isPublicaChecked && uni.tipo === 'Pública') || (isPrivadaChecked && uni.tipo === 'Privada');
                
                // --- Lógica do filtro de INGRESSO ---
                const filtrosIngressoAtivos = isSisuChecked || isEnemChecked || isVestibularProprioChecked;
                let passaFiltroIngresso = true; // Por padrão, passa (se nenhum filtro estiver ativo)

                if (filtrosIngressoAtivos) {
                    // Se algum filtro de ingresso estiver ativo, a universidade deve ter PELO MENOS UM dos métodos
                    const temEnem = uni.formas_ingresso.some(forma => forma.toUpperCase().includes('ENEM'));
                    const temSisu = uni.formas_ingresso.includes('SISU');
                    const temVestibularProprio = uni.formas_ingresso.includes('Vestibular Próprio');
                    
                    passaFiltroIngresso = (isSisuChecked && temSisu) ||
                                         (isEnemChecked && temEnem) ||
                                         (isVestibularProprioChecked && temVestibularProprio);
                }
                
                // --- Lógica da BUSCA ---
                const passaBusca = uni.nome.toLowerCase().includes(termoBusca);

                // Retorna true apenas se passar em todos os filtros
                return passaFiltroTipo && passaFiltroIngresso && passaBusca;
            });

            // Renderiza apenas os marcadores filtrados
            renderizarMarcadores(universidadesFiltradas);
        }

        // Adiciona 'event listeners' aos checkboxes e à barra de busca (Seção 2.3)
        filtroPublica.addEventListener('change', atualizarMapa);
        filtroPrivada.addEventListener('change', atualizarMapa);
        filtroSisuCheck.addEventListener('change', atualizarMapa);
        filtroEnemCheck.addEventListener('change', atualizarMapa);
        filtroVestibularProprioCheck.addEventListener('change', atualizarMapa);
        searchInput.addEventListener('input', atualizarMapa);
    }

    // Inicia o processo de carregamento dos dados
    carregarUniversidades();


    // --- Seção do Guia (Accordion) (Seção 3.1) ---
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Alterna o estado do item clicado
            button.setAttribute('aria-expanded', !isExpanded);
            content.hidden = isExpanded;
            
            // Opcional: Fechar outros itens abertos
            // document.querySelectorAll('.accordion-header').forEach(otherButton => {
            //     if (otherButton !== button) {
            //         otherButton.setAttribute('aria-expanded', 'false');
            //         otherButton.nextElementSibling.hidden = true;
            //     }
            // });
        });
    });

    // --- Seção de Materiais (Abas) (Seção 3.2 Melhorada) ---
    const tabsContainer = document.querySelector('.tabs-container');
    
    // Verifica se o container de abas existe antes de adicionar listeners
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

}); // Fim do 'DOMContentLoaded'


