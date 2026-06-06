# NC - Sistema de Gestão de Projetos e Demandas

## Sobre o Projeto

O **NC - Sistema de Gestão de Projetos e Demandas** é uma aplicação web desenvolvida com o objetivo de auxiliar equipes multidisciplinares no gerenciamento de projetos, demandas e tarefas.

---

## Tecnologias Utilizadas

### Front-end

* React
* TypeScript

### Back-end

* Node.js
* TypeScript

### Banco de Dados

* PostgreSQL

### Infraestrutura

* Docker

---

## Pré-requisitos

Antes de executar o projeto, instale:

* Docker Desktop
* Node.js v24.15.0 ou superior

Verifique a versão instalada:

```bash
node -v
```

Resultado esperado:

```bash
v24.15.0
```

---

## Configuração do Ambiente

### 1. Iniciar o Banco de Dados

O banco de dados é executado através do Docker e é fundamental para o funcionamento do sistema.

Na raiz do projeto execute:

```bash
docker compose up -d
```

Para verificar se o container foi criado corretamente:

```bash
docker ps
```

---

### 2. Executar o Back-end

Abra um terminal na pasta do back-end e execute:

```bash
npm run start
```

---

### 3. Executar o Front-end

Abra outro terminal na pasta do front-end e execute:

```bash
npm run dev
```

---

## Acesso ao Sistema

Após iniciar os serviços, a aplicação poderá ser acessada em:

```text
http://localhost:5173
```

---

## Objetivo Acadêmico

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso com foco na aplicação prática de conceitos de:

* Engenharia de Software;
* Arquitetura de Sistemas Web;
* Desenvolvimento Full Stack;
* Gestão de Projetos;
* Banco de Dados Relacional;
* Containers com Docker;
* Boas Práticas de Desenvolvimento.

---
