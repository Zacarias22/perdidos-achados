// ====== SEÇÃO "COMO FUNCIONA" ======
// Seleciona os boxes
const publicarBox = document.getElementById("publicarBox");
const conectarBox = document.getElementById("conectarBox");
const reunirBox = document.getElementById("reunirBox");

// Função auxiliar para limpar destaque
function limparSelecionados() {
    document.querySelectorAll('.funciona .box').forEach(box => {
        box.classList.remove('selected');
    });
}

// Publicar
if (publicarBox) {
    publicarBox.addEventListener("click", () => {
        limparSelecionados();
        publicarBox.classList.add("selected");
        alert("Clique em Publicar: você será redirecionado para o formulário!");
        window.location.href = "formulario.html";
    });
}

// Conectar
if (conectarBox) {
    conectarBox.addEventListener("click", () => {
        limparSelecionados();
        conectarBox.classList.add("selected");
        alert("Clique em Conectar: abrirá a lista de itens perdidos e achados!");
        const lista = document.getElementById("listaPublicacoes");
        if (lista) lista.scrollIntoView({behavior: "smooth"});
    });
}

// Reunir
if (reunirBox) {
    reunirBox.addEventListener("click", () => {
        limparSelecionados();
        reunirBox.classList.add("selected");
        alert("Clique em Reunir: você verá dicas para devolver ou encontrar objetos!");
        // Aqui podes scroll para uma seção de instruções, se existir
    });
}

// ====== SEÇÃO "ITENS RECENTES" ======
const lista = document.getElementById("listaPublicacoes");
const pesquisaInput = document.getElementById("pesquisa");
const filtroSelect = document.getElementById("filtroMunicipio");

// Mostrar itens ao carregar
document.addEventListener("DOMContentLoaded", () => {
    mostrarItens();
});

// Função para mostrar itens
function mostrarItens(filtro = "", textoPesquisa = "") {
    let itens = JSON.parse(localStorage.getItem("itens")) || [];
    lista.innerHTML = "";

    if (itens.length === 0) {
        lista.innerHTML = "<p>Nenhuma publicação ainda.</p>";
        return;
    }

    // Ordena do mais recente
    itens.sort((a,b) => b.id - a.id);

    // Filtra por município
    if(filtro && filtro !== "Selecionar município") {
        itens = itens.filter(item => item.municipio.toLowerCase() === filtro.toLowerCase());
    }

    // Filtra por pesquisa
    if(textoPesquisa) {
        itens = itens.filter(item => item.objeto.toLowerCase().includes(textoPesquisa.toLowerCase()));
    }

    if(itens.length === 0) {
        lista.innerHTML = "<p>Nenhum item encontrado.</p>";
        return;
    }

    // Criar cards
    itens.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${item.imagem || 'img/sem-imagem.png'}" alt="Imagem do item">
            <h3>${item.objeto}</h3>
            <p><strong>Município:</strong> ${item.municipio}</p>
            <p><strong>Local:</strong> ${item.local}</p>
            <p>${item.descricao}</p>
            <a class="btn-whatsapp" target="_blank"
               href="https://wa.me/244${item.telefone}?text=Olá ${item.nome}, vi sua publicação sobre ${item.objeto}">
               💬 Contactar via WhatsApp
            </a>
            <div class="acoes">
                <button onclick="editarItem(${item.id})">✏ Editar</button>
                <button onclick="excluirItem(${item.id})">❌ Excluir</button>
            </div>
            <p><small>${item.data}</small></p>
        `;

        lista.appendChild(card);
    });
}

// Pesquisa em tempo real
if (pesquisaInput) {
    pesquisaInput.addEventListener("input", () => {
        mostrarItens(filtroSelect.value, pesquisaInput.value);
    });
}

// Filtrar por município
function filtrarItens() {
    mostrarItens(filtroSelect.value, pesquisaInput.value);
}

// Excluir item
function excluirItem(id) {
    let itens = JSON.parse(localStorage.getItem("itens")) || [];
    itens = itens.filter(item => item.id !== id);
    localStorage.setItem("itens", JSON.stringify(itens));
    mostrarItens();
}

// Editar item
function editarItem(id) {
    let itens = JSON.parse(localStorage.getItem("itens")) || [];
    const item = itens.find(item => item.id === id);

    const novoNome = prompt("Editar nome do objeto:", item.objeto);
    const novoMunicipio = prompt("Editar município:", item.municipio);
    const novaDescricao = prompt("Editar descrição:", item.descricao);

    if(novoNome && novoMunicipio) {
        item.objeto = novoNome;
        item.municipio = novoMunicipio;
        item.descricao = novaDescricao;
        localStorage.setItem("itens", JSON.stringify(itens));
        mostrarItens();
    }
}