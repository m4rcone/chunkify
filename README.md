# Chunkify (em desenvolvimento)

Transformar em pedaços! 

Projeto de desenvolvimento de app no estilo `Kanban`.

## Objetivo

Este projeto tem como principal objetivo consolidar os conhecimentos que venho adquirindo em desenvolvimento `Full-stack`. 

Além disso, busca a criação de um aplicativo funcional, com design atrativo e alinhado às boas práticas utilizadas no mercado, tanto no front-end quanto no back-end.

## Tecnologias utilizadas

🔹 Next.js 🔹 React 🔹 Node.js 🔹 Typescript 🔹 Jest 🔹 PostgresSQL 🔹 Docker 🔹 Tailwindcss 🔸 [package.json](https://github.com/m4rcone/chunkify/blob/c44a6b55efbe84d5b23342dc703a27f1bd960421/package.json)

## Estrutura de pastas
*Última atualização: 09/05/2025*

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
│   ├── 📂 boards/
│   │   ├── 📂 [boardId]/
│   ├── 📂 components/
│   │   ├── 📂 modals/
│   │   ├── 📂 navigation/
│   │   ├── 📂 ui/
│   ├── 📂 hooks/
│   │   ├── 📂 boards/
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
                    ├── 📂 [id]/
```
## Infraestrutura
*Última atualização: 09/05/2025*

Na infraestrutura, estou utilizando `Docker` com banco de dados `PostgreSQL`. Para conectar ao banco, uso o módulo `pg`, e para as migrações, o `node-pg-migrate`.

Optei por **não usar ORM**, pois quero praticar e escrever `SQL` manualmente. Criei três scripts para gerenciamento dos serviços, e aprimorei o script `dev` para garantir que os serviços estejam ativos antes de iniciar o servidor.

Planejo, futuramente, incluir a execução das migrações também no script `dev`. 

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
*Última atualização: 09/05/2025*

No back-end, utilizo `Jest` com uma abordagem baseada em orchestrator. Antes de cada teste *(beforeAll)*, o orchestrator limpa o banco e executa as migrações utilizando o [migrator](https://github.com/m4rcone/chunkify/blob/c44a6b55efbe84d5b23342dc703a27f1bd960421/src/models/migrator.ts), criado com a *API programática* do `node-pg-migrate`.

## Back-end
*Última atualização: 09/05/2025*

Já estão finalizados os *models* `boards` e `columns`, com criação, atualização, exclusão e busca. Todos os endpoints contam com testes automatizados:

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

📌  Próximo passo: implementar os endpoints de `tasks` e `subtasks`.

## Front-end
*Última atualização: 09/05/2025*

A `UI` de criação, edição e exclusão de `boards` e `columns` está finalizada, com layout responsivo e suporte a `dark mode` via hook personalizado.

Também criei o hook `useMediaQuery` para detectar se o usuário está em uma tela mobile e renderizar os componentes `DesktopNavigation` ou `MobileNavigation`, que são os layouts base da aplicação.

Optei por não utilizar `context`, e criei o hook `useBoards` para lidar com chamadas aos endpoints via `boardService`. Para o fetch, utilizo a biblioteca `SWR`, da Vercel, garantindo bom controle de `cache` e revalidação.

📌 Próximo passo: após finalizar os endpoints no back-end, desenvolver a UI das `tasks` e `subtasks`.

## Executar o projeto:

Necessita do `Docker` instalado.

Para testar localmente o projeto em andamento:

```bash
npm install
npm run dev
npm run migrations:up
```

## Objetivos Futuros

Pretendo implementar um sistema de autenticação com `JWT`, além de configurar ambientes de produção e homologação para consolidar meus conhecimentos em `CI/CD` utilizando `GitHub Actions`. 

E claro, colocar o app em um pedacinho da internet!

## Galeria

