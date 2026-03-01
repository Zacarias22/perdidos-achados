const form = document.getElementById("formItem");
let editandoId = null;

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
        tipo: "perdido",
        imagem: imagemBase64,
        data: new Date().toLocaleString()
    };

    if (editandoId) {
        itens = itens.map(item =>
            item.id === editandoId ? novoItem : item
        );
        editandoId = null;
    } else {
        itens.push(novoItem);
    }

    localStorage.setItem("itens", JSON.stringify(itens));
    alert("Publicação salva com sucesso!");
    form.reset();
}