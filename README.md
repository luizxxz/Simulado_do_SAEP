# Simulado_do_SAEP
Trabalho Avaliativo do SENAI para a futura prova "SAEP"

Sistema de Gerenciamento de Tarefas
É uma aplicação desenvolvida para facilitar a organização de fluxos de trabalho. O sistema permite o cadastro de colaboradores e a gestão de tarefas através de um quadro dinâmico dividido em colunas de status.

📋 Funcionalidades
Gestão de Usuários: Cadastro de colaboradores com validação de e-mail único.

Gestão de Tarefas: Criação, edição e exclusão de tarefas.

Quadro: Visualização de tarefas divididas em:

A Fazer

Fazendo

Pronto

Movimentação Dinâmica: Alteração de status da tarefa diretamente no card.

Priorização: Classificação de tarefas por níveis (Baixa, Média, Alta).

🗄️ Estrutura do Banco de Dados
O projeto utiliza o banco de dados PostgreSQL com a seguinte estrutura de tabelas:

Tabela usuarios: Armazena nome e email.

Tabela tarefas: Armazena descricao, setor, prioridade, status e a chave estrangeira id_usuario.

🎨 Casos de Uso
As interações do sistema seguem o fluxo de um colaborador gerenciando seu próprio quadro:

O usuário acessa o sistema.

Cadastra colaboradores.

Cria tarefas vinculadas a esses colaboradores.

Move as tarefas entre as colunas conforme o progresso do trabalho.

⚙️ Como Executar o Projeto
Clone o repositório

Configure o Banco de Dados:

Execute o script SQL fornecido na pasta
Inicie o Servidor:

Bash
cd server
npm install
Acesse a Aplicação:

Abra o arquivo index.html no seu navegador.
