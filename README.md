# Chunkify - em desenvolvimento...

Transformar em pedaços!

Projeto de desenvolvimento de app no estilo `Kanban`.

## Objetivo

Este projeto tem como principal objetivo consolidar os conhecimentos que venho adquirindo em desenvolvimento `Full-stack`.

Além disso, busca a criação de um aplicativo funcional, com design atrativo e alinhado às boas práticas utilizadas no mercado, tanto no front-end quanto no back-end.

## Tecnologias utilizadas

🔹 Next.js 🔹 React 🔹 Node.js 🔹 Typescript 🔹 Jest 🔹 PostgresSQL 🔹 Docker 🔹 Tailwindcss 🔸 [package.json](https://github.com/m4rcone/chunkify/blob/c44a6b55efbe84d5b23342dc703a27f1bd960421/package.json)

## Estrutura de pastas

_Última atualização: 09/05/2025_

```
📂 public/
📂 src/
├── 📂 app/
│   ├── 📂 api/
│   │   ├── 📂 v1/
│   │   │   ├── 📂 boards/
│   │   │   │   ├── 📂 [id]/
│   │   │   ├── 📂 columns/
│   │   │   │   ├── 📂 [id]/
│   │   │   ├── 📂 subtasks/
│   │   │   │   ├── 📂 [id]/
│   │   │   ├── 📂 tasks/
│   │   │   │   ├── 📂 [id]/
│   ├── 📂 boards/
│   │   ├── 📂 [boardId]/
│   ├── 📂 components/
│   │   ├── 📂 modals/
│   │   ├── 📂 navigation/
│   │   ├── 📂 ui/
│   ├── 📂 hooks/
│   │   ├── 📂 boards/
|   |   ├── 📂 tasks/
│   ├── 📂 services/
│   ├── 📂 styles/
├── 📂 infra/
│   ├── 📂 migrations/
├── 📂 models/
├── 📂 tests/
    ├── 📂 integration/
        ├── 📂 api/
            ├── 📂 v1/
                ├── 📂 boards/
                │   ├── 📂 [id]/
                ├── 📂 columns/
                |    ├── 📂 [id]/
                ├── 📂 subtasks/
                │   ├── 📂 [id]/
                ├── 📂 tasks/
                    ├── 📂 [id]/
```

## Infraestrutura

_Última atualização: 09/05/2025_

Na infraestrutura, estou utilizando `Docker` com banco de dados `PostgreSQL`. Para conectar ao banco, uso o módulo `pg`, e para as migrações, o `node-pg-migrate`.

Optei por **não usar ORM**, pois quero praticar e escrever `SQL` manualmente. Criei três scripts para gerenciamento dos serviços, e aprimorei o script `dev` para garantir que os serviços estejam ativos antes de iniciar o servidor.

Planejo, futuramente, incluir a execução das migrations também no script `dev`.

Scripts:

```json
"dev": "npm run services:up && next dev",
"services:up": "docker compose -f src/infra/compose.yaml up -d",
"services:stop": "docker compose -f src/infra/compose.yaml stop",
"services:down": "docker compose -f src/infra/compose.yaml down",
"migrations:create": "node-pg-migrate --migrations-dir src/infra/migrations create",
"migrations:up": "node-pg-migrate --migrations-dir src/infra/migrations --envPath .env.development up",
```

Também criei 4 [erros customizados](https://github.com/m4rcone/chunkify/blob/c44a6b55efbe84d5b23342dc703a27f1bd960421/src/infra/errors.ts) e um [controller](https://github.com/m4rcone/chunkify/blob/c44a6b55efbe84d5b23342dc703a27f1bd960421/src/infra/controller.ts) para os mesmos.

## Testes Automatizados

_Última atualização: 22/05/2025_

No back-end, utilizo `Jest` com uma abordagem baseada em orchestrator. Antes de cada teste _(beforeAll)_, o orchestrator limpa o banco e executa as migrações utilizando o [migrator](https://github.com/m4rcone/chunkify/blob/c44a6b55efbe84d5b23342dc703a27f1bd960421/src/models/migrator.ts), criado com a API programática do `node-pg-migrate`.
No orchestrator também criei métodos para criação de boards, columns, tasks e substasks, facilitando a escrita dos testes.

## Back-end

_Última atualização: 22/05/2025_

Já estão finalizados os _models_ `boards`, `columns`, `tasks` e `subtasks`, com criação, atualização, exclusão e busca. Os endpoints de tasks e subtasks seguiram a mesma estrutura de boards e columns:

- `GET / api/v1/boards` -> Buscar todos boards
- `POST / api/v1/boards` -> Criar um board
- `GET / api/v1/boards/[id]` -> Buscar apenas um board
- `PATCH / api/v1/boards/[id]` -> Atualizar um board
- `DELETE / api/v1/boards/[id]` -> Deletar um board
- `GET / api/v1/boards/[id]/columns` -> Buscar todas columns de um board
- `POST / api/v1/boards/[id]/columns` -> Criar uma column para um board
- `GET / api/v1/columns/[id]` -> Buscar apenas uma column
- `PATCH / api/v1/columns/[id]` -> Atualizar uma column
- `DELETE / api/v1/columns/[id]` -> Deletar uma column

📌 Próximo passo: implementar os endpoints de `users` e `sessions` para criar um sistema de autenticação/autorização.

## Front-end

_Última atualização: 22/05/2025_

A `UI` de criação, edição e exclusão de `boards`, `columns`, `tasks` e `subtasks` está finalizada, com layout responsivo e suporte a `dark mode` via hook personalizado.

Também criei o hook `useMediaQuery` para detectar se o usuário está em uma tela mobile e renderizar os componentes `DesktopNavigation` ou `MobileNavigation`, que são os layouts base da aplicação.

Optei por não utilizar `context`, e criei o hook `useBoards` para lidar com chamadas aos endpoints via `boardService`. Para o fetch, utilizo a biblioteca `SWR`, da Vercel, garantindo bom controle de `cache` e revalidação. Usei a mesma estratégia para as `tasks`.

📌 Próximo passo: após finalizar os endpoints de `users` e `sessions` no back-end, desenvolver a UI de `cadastro` e `login`.

## Executar o projeto:

Necessita do `Docker` instalado. Caso não tenha, sugiro utilizar o `codespaces` do GitHub.

Para testar localmente o projeto em andamento:

```bash
npm install
npm run dev
npm run migrations:up
```

## Objetivos Futuros

Pretendo implementar um sistema de autenticação/autorização com `JWT`, além de configurar ambientes de produção e homologação para consolidar meus conhecimentos em `CI/CD` utilizando `GitHub Actions` para automatização de deploys.

E claro, colocar o app em um pedacinho da internet!

## Galeria

![add-new-board](https://github.com/user-attachments/assets/4d83ae4c-5ba3-4284-b4a0-cb894cdaaa82)
![add-new-task](https://github.com/user-attachments/assets/01c5d46c-7dff-45d9-bca2-16331e21b277)
![delete-board](https://github.com/user-attachments/assets/3adf25bc-d91b-4dd2-b3c2-ca5a6d48d271)
![delete-task](https://github.com/user-attachments/assets/ebdf113e-2312-4b14-bf8c-498a6033f64f)
![view-task](https://github.com/user-attachments/assets/aa33497c-e850-4610-a103-42c2f22d1e9c)
![empty-board](https://github.com/user-attachments/assets/abbde331-2b51-4b22-a37a-1c460317cafb)
![full-board](https://github.com/user-attachments/assets/4bba9fef-ecf8-4d17-8428-f7393d40840f)
![full-board2](https://github.com/user-attachments/assets/dd47905a-6429-4096-9c67-86c07022ab40)
