// ============================
// SELETORES
// ============================

const form = document.getElementById("formItem");
const lista = document.getElementById("listaItens");
const pesquisaInput = document.getElementById("pesquisa");

let editandoId = null;

// ============================
// CARREGAR AO ABRIR A PÁGINA
// ============================

document.addEventListener("DOMContentLoaded", () => {
    mostrarItens();
    carregarEdicao();
});

// ============================
// ENVIAR FORMULÁRIO
// ============================

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const file = document.getElementById("imagem").files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                salvarItem(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            salvarItem(null);
        }
    });
}

// ============================
// SALVAR ITEM
// ============================

function salvarItem(imagemBase64) {

    let itens = JSON.parse(localStorage.getItem("itens")) || [];

    const novoItem = {
        id: editandoId || Date.now(),
        objeto: form.objeto.value.trim(),
        municipio: form.municipio.value.trim(),
        local: form.local.value.trim(),
        descricao: form.descricao.value.trim(),
        nome: form.nome.value.trim(),
        telefone: form.telefone.value.trim(),
        email: form.email.value.trim(),
        imagem: imagemBase64,
        data: new Date().toLocaleString()
    };

    // EDITAR
    if (editandoId) {
        itens = itens.map(item =>
            item.id === editandoId ? novoItem : item
        );
        editandoId = null;
    } else {

        // VERIFICAR DUPLICADO
        if (itemExiste(novoItem.objeto, novoItem.municipio)) {
            alert("Este item já foi publicado!");
            return;
        }

        itens.push(novoItem);
    }

    localStorage.setItem("itens", JSON.stringify(itens));
    alert("Publicação salva com sucesso!");
    form.reset();
    mostrarItens();
}

// ============================
// MOSTRAR ITENS
// ============================

function mostrarItens(filtro = "") {

    if (!lista) return;

    let itens = JSON.parse(localStorage.getItem("itens")) || [];

    lista.innerHTML = "";

    if (itens.length === 0) {
        lista.innerHTML = "<p>Nenhum item publicado ainda.</p>";
        return;
    }

    // Ordenar do mais recente
    itens.sort((a, b) => b.id - a.id);

    // Filtro de pesquisa
    let filtrados = itens.filter(item =>
        item.objeto.toLowerCase().includes(filtro.toLowerCase())
    );

    filtrados.forEach(item => {

        const div = document.createElement("div");
        div.classList.add("card-item");

        div.innerHTML = `
            ${item.imagem ? `<img src="${item.imagem}">` : ""}

            <h3>${item.objeto}</h3>
            <p><strong>Município:</strong> ${item.municipio}</p>
            <p><strong>Local:</strong> ${item.local}</p>
            <p>${item.descricao}</p>

            <p><strong>Contacto:</strong> ${item.nome}</p>

            <div>
                <a href="https://wa.me/244${item.telefone}" target="_blank">
                    <button>WhatsApp</button>
                </a>

                <button onclick="editarItem(${item.id})">Editar</button>
                <button onclick="excluirItem(${item.id})">Excluir</button>
            </div>

            <p><small>${item.data}</small></p>
        `;

        lista.appendChild(div);
    });
}

// ============================
// PESQUISA EM TEMPO REAL
// ============================

if (pesquisaInput) {
    pesquisaInput.addEventListener("input", function () {
        mostrarItens(this.value);
    });
}

// ============================
// VERIFICAR DUPLICADO
// ============================

function itemExiste(objeto, municipio) {
    let itens = JSON.parse(localStorage.getItem("itens")) || [];

    return itens.some(item =>
        item.objeto.toLowerCase() === objeto.toLowerCase() &&
        item.municipio.toLowerCase() === municipio.toLowerCase()
    );
}

// ============================
// EXCLUIR
// ============================

function excluirItem(id) {
    let itens = JSON.parse(localStorage.getItem("itens")) || [];

    itens = itens.filter(item => item.id !== id);

    localStorage.setItem("itens", JSON.stringify(itens));

    mostrarItens();
}

// ============================
// EDITAR
// ============================

function editarItem(id) {

    let itens = JSON.parse(localStorage.getItem("itens")) || [];

    let item = itens.find(item => item.id === id);

    localStorage.setItem("editarItem", JSON.stringify(item));

    window.location.href = "formulario.html";
}

// ============================
// CARREGAR DADOS PARA EDIÇÃO
// ============================

function carregarEdicao() {

    if (!form) return;

    const itemEditar = JSON.parse(localStorage.getItem("editarItem"));

    if (itemEditar) {

        form.objeto.value = itemEditar.objeto;
        form.municipio.value = itemEditar.municipio;
        form.local.value = itemEditar.local;
        form.descricao.value = itemEditar.descricao;
        form.nome.value = itemEditar.nome;
        form.telefone.value = itemEditar.telefone;
        form.email.value = itemEditar.email;

        editandoId = itemEditar.id;

        localStorage.removeItem("editarItem");
    }
}