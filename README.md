# PriceWatch

PriceWatch é uma aplicação web full-stack projetada para automatizar o monitoramento de preços de produtos em e-commerces. Os usuários podem se cadastrar, adicionar produtos de interesse através de uma URL, definir um preço alvo e serem notificados por e-mail quando o valor do produto atingir o ideal para compra.

Este projeto foi construído para demonstrar e aprofundar conhecimentos em uma arquitetura de software moderna, utilizando Django para o backend, React para o frontend, Celery para tarefas assíncronas e Docker para orquestração de todo o ambiente.

## ✨ Funcionalidades

- **Autenticação de Usuários:** Sistema completo de cadastro e login via API com tokens JWT.
- **Gerenciamento de Produtos:** Interface que permite aos usuários adicionar, visualizar e deletar produtos a serem monitorados.
- **Monitoramento Automático:** Um sistema de tarefas em segundo plano que roda de forma autônoma e periódica para buscar os preços atualizados.
- **Notificação de Alerta:** Envio de e-mails de alerta quando o preço de um produto atinge ou fica abaixo do preço alvo definido pelo usuário.
- **Feedback Visual:** A interface destaca visualmente os produtos que estão em promoção.

## 🛠️ Tecnologias Utilizadas

| Categoria                  | Tecnologia / Ferramenta                                |
| -------------------------- | ------------------------------------------------------ |
| **Backend** | Python, Django, Django Rest Framework (DRF)            |
| **Frontend** | React, React Router, Recharts                                     |
| **Banco de Dados** | PostgreSQL                                             |
| **Tarefas Assíncronas** | Celery, Celery Beat                                    |
| **Fila de Mensagens** | Redis                                                  |
| **Autenticação API** | Djoser, Simple JWT                                     |
| **Notificações** | SendGrid                                               |
| **Web Scraping** | `requests`, `BeautifulSoup4`                           |
| **Ambiente e Orquestração**| Docker                                 |
| **Controle de Versão** | Git, GitHub                                            |

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (para o ambiente de frontend)

### Passos para a Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd price-watch
    ```

2.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` dentro da pasta `src` (`src/.env`) e adicione suas chaves:
    ```env
    SENDGRID_API_KEY=SUA_CHAVE_DO_SENDGRID
    SENDGRID_EMAIL=SEU_EMAIL_VERIFICADO_NO_SENDGRID
    ```

3.  **Suba os contêineres do Backend:**
    Este comando irá construir as imagens e iniciar todos os serviços do backend (web, worker, beat, db, redis).
    ```bash
    docker-compose up --build -d
    ```

4.  **Aplique as migrações do Banco de Dados:**
    ```bash
    docker-compose exec web python manage.py migrate
    ```

5.  **Crie um Superusuário:**
    Este será o primeiro usuário do sistema, necessário para associar os produtos.
    ```bash
    docker-compose exec web python manage.py createsuperuser
    ```

6.  **Inicie o Frontend:**
    Em um **novo terminal**, navegue até a pasta `frontend` e instale as dependências.
    ```bash
    cd frontend
    npm install
    npm start
    ```

A aplicação estará rodando com o frontend em `http://localhost:3000` e o backend em `http://localhost:8000`.
