// Certifique-se de que esses elementos existem no seu HTML
const overlay = document.getElementById("overlay");
const criarTarefa = document.getElementById("criarTarefa");
const lista = document.getElementById("listaTarefas");
const titulo = document.getElementById("titulo");
const descricao = document.getElementById("descricao");

function abrirModal() {
  overlay.classList.add("active");
  criarTarefa.classList.add("active");
}

function fecharModal() {
  overlay.classList.remove("active");
  criarTarefa.classList.remove("active");
}

// Função para buscar tarefas do servidor
function buscarTarefas() {
  fetch("http://localhost:3000/tarefas")
    .then(res => res.json())
    .then(res => {
      inserirTarefas(res);
    })
    .catch(error => console.error('Erro ao buscar tarefas:', error));
}

// Chama a função para buscar as tarefas ao carregar a página
document.addEventListener('DOMContentLoaded', buscarTarefas);

function inserirTarefas(listaDeTarefas) {
  // Limpa a lista antes de adicionar novas tarefas
  lista.innerHTML = '';

  if (listaDeTarefas.length > 0) {
    listaDeTarefas.forEach(tarefa => {
      lista.innerHTML += `
        <li>
          <h5>${tarefa.titulo}</h5>
          <p>${tarefa.descricao}</p>
          <div class="actions">
            <box-icon name='trash' size="sm" onclick="deletarTarefa('${tarefa.id}')"></box-icon>
          </div>
        </li>
      `;
    });
  } else {
    lista.innerHTML = `<li>Nenhuma tarefa registrada</li>`;
  }
}

// Função para criar nova tarefa
function novaTarefa(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  let tarefa = {
    titulo: titulo.value,
    descricao: descricao.value
  };

  fetch("http://localhost:3000/tarefas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tarefa)
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      // Atualiza a lista de tarefas após criar uma nova
      buscarTarefas();
    })
    .catch(error => console.error('Erro ao criar tarefa:', error));

  fecharModal();
}

// Função para apagar tarefa
function deletarTarefa(id) {
  fetch(`http://localhost:3000/tarefas/${id}`, {
    method: "DELETE",
  }) 
  .then(res => {
    if (!res.ok) {
      throw new Error('Erro ao deletar a tarefa'); // Verifica se a resposta foi bem-sucedida
    }
    return res.json();
  })
  .then(res => {
    alert("Tarefa deletada com sucesso!");
    buscarTarefas(); // Atualiza a lista de tarefas após a deleção
  })
  .catch(error => {
    console.error('Erro ao deletar tarefa:', error);
    alert("Não foi possível deletar a tarefa.");
  });
}

// Função para buscar tarefa
function pesquisarTarefa() {
  const busca = document.getElementById("busca").value.toLowerCase(); // Obtém o valor da busca
  const lis = document.querySelectorAll("#listaTarefas li"); // Seleciona todos os <li> da lista de tarefas
  
  lis.forEach(li => {
    const titulo = li.children[0].innerText.toLowerCase(); // Obtém o texto do título
    if (titulo.includes(busca)) {
      li.classList.remove('oculto'); // Mostra o item se corresponder
    } else {
      li.classList.add('oculto'); // Esconde o item se não corresponder
    }
  });
}

