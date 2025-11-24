// --- 1. CONFIGURAÇÃO BASE ---
const WHATSAPP_NUMBER = '5511999999999'; // Seu número de WhatsApp Business
const form = document.getElementById('form-agendamento');
const listaServicosContainer = document.getElementById('lista-servicos');
const listaProfissionaisContainer = document.getElementById('lista-profissionais');
const resumoDuracao = document.getElementById('resumo-duracao');
const resumoPreco = document.getElementById('resumo-preco');

// --- 2. DADOS DO SALÃO (CADASTRO) ---
const servicosDisponiveis = [
    { id: 'corte_fem', nome: 'Corte Feminino', duracao: 60, preco: 120.00 },
    { id: 'escova', nome: 'Escova Simples', duracao: 45, preco: 80.00 },
    { id: 'hidratacao', nome: 'Hidratação de Luxo', duracao: 90, preco: 150.00 },
    { id: 'coloracao', nome: 'Coloração Raiz', duracao: 120, preco: 180.00 },
    { id: 'mechas', nome: 'Mechas e Luzes', duracao: 240, preco: 450.00 },
    { id: 'combo_mp', nome: 'Manicure + Pedicure', duracao: 90, preco: 85.00 },
    { id: 'gel_unha', nome: 'Esmaltação em Gel', duracao: 75, preco: 70.00 },
    { id: 'design_sobr', nome: 'Design de Sobrancelhas', duracao: 40, preco: 55.00 },
];

const profissionaisDisponiveis = [
    { id: 'joana', nome: 'Joana', avatar: 'https://i.ibb.co/X8yK1pQ/joana.jpg' }, // Substitua por URLs reais de avatares
    { id: 'marcia', nome: 'Márcia', avatar: 'https://i.ibb.co/VQLQ8Fq/marcia.jpg' },
    { id: 'pedro', nome: 'Pedro', avatar: 'https://i.ibb.co/J9R2TzY/pedro.jpg' },
    { id: 'any', nome: 'Qualquer um', avatar: 'https://i.ibb.co/XjN2c3v/any.jpg' }
];


// --- 3. FUNÇÕES DE RENDERIZAÇÃO ---

// Carrega os serviços no HTML
function renderizarServicos() {
    servicosDisponiveis.forEach(servico => {
        const label = document.createElement('label');
        label.classList.add('card-servico');
        label.innerHTML = `
            <input type="checkbox" name="servico" value="${servico.id}" data-duracao="${servico.duracao}" data-preco="${servico.preco}">
            <p>
                ${servico.nome} 
                <small>Duração: ${servico.duracao} min | R$ ${servico.preco.toFixed(2).replace('.', ',')}</small>
            </p>
        `;
        listaServicosContainer.appendChild(label);
    });
}

// Carrega os profissionais no HTML
function renderizarProfissionais() {
    profissionaisDisponiveis.forEach((p, index) => {
        const label = document.createElement('label');
        label.classList.add('card-profissional');
        label.innerHTML = `
            <input type="radio" name="profissional" value="${p.nome}" ${index === profissionaisDisponiveis.length - 1 ? 'checked' : ''}>
            <img src="${p.avatar}" alt="Avatar de ${p.nome}" onerror="this.src='https://via.placeholder.com/70/D4A3AE/FFFFFF?text=A'">
            <p class="${p.nome === 'Qualquer um' ? 'opcional' : ''}">${p.nome}</p>
        `;
        listaProfissionaisContainer.appendChild(label);
    });
}

// Atualiza o resumo de duração e preço
function atualizarResumo() {
    const servicosSelecionados = Array.from(document.querySelectorAll('input[name="servico"]:checked'));
    let duracaoTotal = 0;
    let precoTotal = 0;

    servicosSelecionados.forEach(input => {
        duracaoTotal += parseInt(input.dataset.duracao);
        precoTotal += parseFloat(input.dataset.preco);
    });

    resumoDuracao.textContent = duracaoTotal;
    resumoPreco.textContent = `R$ ${precoTotal.toFixed(2).replace('.', ',')}`;
}

// --- 4. GERAÇÃO DA MENSAGEM DO WHATSAPP ---
function gerarMensagemWhatsApp(e) {
    e.preventDefault();

    // 4.1. Coleta dos Dados
    const nome = document.getElementById('nome-cliente').value;
    const telefone = document.getElementById('telefone-cliente').value;
    const data = document.getElementById('data-agendamento').value;
    const horario = document.querySelector('input[name="horario"]:checked').value;
    const profissional = document.querySelector('input[name="profissional"]:checked').value;

    const servicosSelecionados = Array.from(document.querySelectorAll('input[name="servico"]:checked'))
        .map(input => {
            const servico = servicosDisponiveis.find(s => s.id === input.value);
            return servico ? servico.nome : '';
        })
        .filter(nome => nome !== '');

    const listaServicos = servicosSelecionados.join('; ');
    const duracaoTotal = resumoDuracao.textContent;
    const precoTotal = resumoPreco.textContent;

    // 4.2. Montagem da Mensagem Elegante e Estruturada
    const mensagem = `
Olá, ${nome}! Estou enviando meu Pré-Agendamento para Confirmação no Glamour Studio.

*DATA e HORA:*
📅 Data: ${new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
⏰ Horário Preferido: ${horario}
👤 Profissional Solicitado: ${profissional}

*SERVIÇOS:*
✨ ${listaServicos}
⏳ Duração Total Estimada: ${duracaoTotal} minutos
💰 Valor Estimado: ${precoTotal}

*DADOS DE CONTATO:*
📱 Meu WhatsApp: ${telefone}

Por favor, verifique a disponibilidade na agenda e me confirme o agendamento! 😊
    `.trim(); // O .trim() remove espaços em branco extras no início e fim.

    // 4.3. Codificação e Redirecionamento
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${mensagemCodificada}`;
    
    // Abre o WhatsApp
    window.open(urlWhatsApp, '_blank');
}


// --- 5. INICIALIZAÇÃO E LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    // 5.1. RENDERIZAÇÃO DOS DADOS
    renderizarServicos();
    renderizarProfissionais();
    atualizarResumo(); // Inicializa o resumo

    // 5.2. LISTENERS DE EVENTOS
    // Atualiza o resumo sempre que um serviço é checado/deschecado
    listaServicosContainer.addEventListener('change', atualizarResumo);
    
    // Define a data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('data-agendamento').setAttribute('min', today);
    
    // Adiciona o listener para o envio do formulário
    form.addEventListener('submit', gerarMensagemWhatsApp);
});
