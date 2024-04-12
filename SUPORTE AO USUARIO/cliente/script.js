// Função para cadastrar um novo chamado
async function cadastrarUsuario(event) {
    event.preventDefault(); // Evita que o formulário seja enviado normalmente

    const formData = new FormData(document.getElementById('formulario_chamado'));

    const response = await fetch('http://127.0.0.1:5000/cadastro', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Chamado cadastrado com sucesso!');
        window.location.href = "consulta.html";
    } else {
        alert('Falha ao cadastrar! Fale com o suporte');
    }
}

// Função para listar todos os chamados
async function listarChamados() {
    const dados_tabela = document.getElementById("dados_tabela");
    const apiUrl = 'http://127.0.0.1:5000/listar'; // Insira a URL correta da API que retorna os chamados
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro ao obter os dados.');
        }
        const data = await response.json();
        for (const item of data) {
            const linha = document.createElement("tr");
            const id = document.createElement("td");
            const nome = document.createElement("td");
            const cpf = document.createElement("td");
            const setor = document.createElement("td");
            const problema = document.createElement("td");
            const status = document.createElement("td");
            const editar = document.createElement("td");
            const excluir = document.createElement("td");

            id.textContent = item.id;
            nome.textContent = item.nome;
            cpf.textContent = item.cpf;
            setor.textContent = item.setor;
            problema.textContent = item.problema;

            if (item.status === "ABERTO") {
                status.innerHTML = `<button onclick='alterarStatus(${item.id})'>ABERTO</button>`;
            } else {
                status.innerHTML = `<button onclick='alterarStatus(${item.id})'>FECHADO</button>`;
            }

            editar.innerHTML = `<button onclick='editaSolicitacao(${item.id})'>Editar</button>`;
            excluir.innerHTML = `<button onclick='excluirSolicitacao(${item.id})'>Excluir</button>`;

            linha.appendChild(id);
            linha.appendChild(nome);
            linha.appendChild(cpf);
            linha.appendChild(setor);
            linha.appendChild(problema);
            linha.appendChild(status);
            linha.appendChild(editar);
            linha.appendChild(excluir);

            dados_tabela.appendChild(linha);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao carregar os dados. Por favor, tente novamente mais tarde.');
    }
}

// Função para obter o número do CPF da URL
function obterNumeroDaURL() {
    const urlParams = new URLSearchParams(window.location.search)
    const cpf = urlParams.get('cpf')
    return cpf
}

// Função executada quando a página é carregada
window.onload = async function() {
    const cpf = obterNumeroDaURL()
    if (cpf !== null) {
        await consultarCPF(cpf);
    } else {
        alert('Parâmetro "CPF" não encontrado na URL.')
    }
}

// Função para consultar os chamados associados a um CPF
async function consultarCPF(cpf) {
    const resultados = document.getElementById('resultados');
    const apiUrl = 'http://127.0.0.1:5000/' + cpf;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            resultados.innerHTML = "<p> Não há chamados para o seu CPF </p>";
            console.log("Não há chamados para o seu CPF");
            return;
        }
        const lista_dados = await response.json();
        console.log(lista_dados);

        for (let dados of lista_dados) {
            console.log(dados)
            const nome = dados.nome;
            const data = dados.data;
            const setor = dados.setor;
            const descricao = dados.descricao;
            const status = dados.status;
            const situacao = status ? "EM ABERTO" : "ENCERRADO";

            resultados.innerHTML += `<p>Data: ${data} - Nome: ${nome} - Setor: ${setor} - Descrição: ${descricao} - Status: ${situacao} </p>`;
            console.log("Deu certo");
        }
    } catch (error) {
        console.error('Erro ao consultar CPF:', error);
        alert('Falha ao consultar o CPF. Por favor, tente novamente mais tarde.');
    }
}

// Função para excluir um chamado
async function excluirSolicitacao(id) {
    if (confirm('Tem certeza que deseja excluir este chamado?')) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/listar/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Erro ao excluir o chamado.');
            }
            alert('Chamado excluído com sucesso!');
            listarChamados(); // Atualiza a lista após a exclusão
        } catch (error) {
            console.error('Erro ao excluir o chamado:', error);
            alert('Falha ao excluir o chamado. Por favor, tente novamente mais tarde.');
        }
    }
}

