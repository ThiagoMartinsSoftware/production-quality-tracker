# Production Quality Tracker

Sistema web desenvolvido para registrar e acompanhar reclamações relacionadas à qualidade das tampas durante o processo de montagem.

O objetivo do sistema é substituir a comunicação informal entre a linha de montagem e a pré-montagem por um sistema digital de alertas, permitindo que os problemas sejam registrados, visualizados e marcados como alertados.

---

## 🎥 Demonstração em video
https://youtu.be/I8SbjoSJHzM?si=SzfZkux3pmH2bZSz


---

## 📌 Sobre o projeto

Durante o processo de montagem, podem ocorrer problemas nas tampas, como:

- Tampa sem borracha
- Tampa sem terminal
- Terminal mal rebitado
- Tampa sem pino
- Tampa com pino danificado
- Tampa quebrada

O sistema permite que o operador da linha registre o problema diretamente pela interface.

Para problemas relacionados a componentes presentes em diferentes modelos de tampa, o sistema solicita a identificação da marca:

- Electrolux
- Whirlpool

Já os problemas relacionados aos pinos não exigem seleção de marca, pois correspondem a um único tipo de tampa no processo.

Quando a reclamação é enviada, ela fica disponível na tela da Pré-Montagem, onde o preparador ou volante pode visualizar o problema e marcar o alerta como "Alertado" após comunicar os operadores responsáveis.

---

## ⚙️ Funcionamento

O fluxo principal do sistema funciona da seguinte forma:

Linha de Montagem
        ↓
Operador registra o problema
        ↓
Frontend envia a reclamação
        ↓
Backend / API
        ↓
MongoDB
        ↓
Pré-Montagem recebe a reclamação
        ↓
Preparador ou volante visualiza o problema
        ↓
Problema é comunicado aos operadores
        ↓
Alerta é marcado como "Alertado"

A atualização das reclamações é feita automaticamente através de polling, evitando a necessidade de atualizar manualmente a página.

---

## 🚀 Funcionalidades

### Linha de Montagem

- Registro de reclamações
- Seleção do tipo de problema
- Seleção da marca da tampa quando necessário
- Identificação entre Electrolux e Whirlpool
- Tampa sem borracha
- Tampa sem terminal
- Terminal mal rebitado
- Tampa sem pino
- Tampa com pino danificado
- Tampa quebrada
- Indicador de total de alertas enviados
- Indicador de alertas pendentes
- Indicador de alertas já tratados
- Contador de alertas do turno
- Atualização automática das informações
- Card de confirmação após o envio do alerta

### Pré-Montagem

- Recebimento automático das reclamações
- Visualização do problema informado
- Identificação da marca da tampa
- Botão para marcar o problema como "Alertado"
- Contador de alertas do turno
- Reset da contagem ao iniciar um novo turno
- Histórico dos alertas preservado no banco de dados
- Atualização automática das reclamações

---

## 🔄 Contagem por turno

O sistema possui uma contagem específica para o turno atual.

A contagem é controlada através de um registro separado no MongoDB que armazena o momento em que a contagem atual foi iniciada.

Exemplo:

1º turno
17 alertas

        ↓
    RESETAR

        ↓

2º turno
0 alertas

Quando o botão "Resetar contagem" é utilizado, o sistema não apaga nenhum alerta.

O que acontece é apenas a alteração do ponto inicial da contagem.

Dessa forma, os alertas do primeiro turno continuam armazenados no banco de dados e podem ser consultados posteriormente.

---

## 🗄️ Banco de dados

O projeto utiliza MongoDB Atlas para armazenamento dos dados.

Os alertas possuem informações como:

- _id
- problem
- brand
- status
- createdAt
- updatedAt

Exemplo de registro:

{
  "problem": "Tampa sem borracha",
  "brand": "Electrolux",
  "status": "alerted",
  "createdAt": "2026-08-16T19:00:18.238Z",
  "updatedAt": "2026-08-16T19:00:33.239Z"
}

O campo "createdAt" permite identificar o momento em que o alerta foi criado.

O campo "updatedAt" registra a última alteração realizada no alerta.

O histórico não é apagado quando a contagem do turno é resetada.

Além da coleção de alertas, o sistema possui uma coleção responsável por controlar o início da contagem atual do turno.

---

## 📊 Status dos alertas

Cada reclamação possui um status.

### Pending

Indica que a reclamação foi registrada pela Linha de Montagem, mas ainda não foi comunicada aos responsáveis da Pré-Montagem.

### Alerted

Indica que o preparador ou volante já recebeu a informação e comunicou os operadores responsáveis.

---

## 📈 Resumo dos alertas

A Linha de Montagem possui um resumo com:

- Total enviados
- Pendentes
- Alertados

Exemplo:

RESUMO

Total enviados       24
Pendentes             2
Alertados            22

Esses valores representam os alertas pertencentes à contagem do turno atual.

Após o reset do turno, os valores retornam para:

Total enviados        0
Pendentes              0
Alertados              0

Os registros antigos continuam preservados no MongoDB.

---

## 🛠️ Tecnologias utilizadas

### Frontend

- React
- JavaScript
- CSS
- React Router
- Vite

### Backend

- Node.js
- Express
- JavaScript
- MongoDB
- Mongoose
- CORS
- dotenv

### Banco de dados

- MongoDB Atlas

### Controle de versão

- Git
- GitHub

### Deploy

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Banco de dados

---

## Estrutura do projeto

```
/backend             → Servidor e API Node.js
├── /src
│   ├── /config    → Configurações (banco de dados)
│   ├── /controllers → Regras de negócio e controle das requisições
│   ├── /models    → Estrutura e modelos de dados (Alert, ShiftCounter)
│   ├── /routes    → Definição das rotas e endpoints
│   └── server.js  → Ponto de entrada do servidor
/frontend            → Interface do usuário em React
├── /src
│   ├── /pages     → Visualizações principais (LineOne, PreAssembly)
│   ├── App.jsx    → Componente raiz da aplicação
│   ├── main.jsx   → Ponto de entrada do React
│   └── index.css  → Estilização global
```

---

## 🔌 API

### Criar alerta

POST /alerts

Exemplo de requisição:

{
  "problem": "Tampa sem borracha",
  "brand": "Electrolux"
}

---

### Buscar alertas pendentes

GET /alerts

Retorna os alertas que ainda estão com status "pending".

---

### Buscar resumo dos alertas

GET /alerts/summary

Retorna:

{
  "total": 24,
  "pending": 2,
  "alerted": 22
}

Os valores representam os alertas desde o início da contagem atual do turno.

---

### Buscar quantidade de alertas do turno

GET /alerts/today

Retorna a quantidade de reclamações registradas desde o início da contagem atual.

Exemplo:

{
  "total": 17,
  "startedAt": "2026-08-23T10:00:00.000Z"
}

---

### Resetar contador do turno

POST /alerts/reset

O endpoint altera o início da contagem atual.

Nenhum alerta é removido do banco de dados.

---

### Marcar alerta como alertado

PATCH /alerts/:id

Altera o status do alerta para:

"alerted"

---

## 🔄 Atualização em tempo real

O sistema utiliza polling para verificar periodicamente se existem novos alertas.

As páginas consultam o backend a cada poucos segundos.

Isso permite que uma reclamação enviada pela Linha de Montagem apareça automaticamente na Pré-Montagem sem que o operador precise atualizar manualmente a página.

O polling também mantém os contadores atualizados.

---

## 🔐 Variáveis de ambiente

### Backend

MONGODB_URI=sua_string_de_conexao
PORT=3000

### Frontend

VITE_API_URL=sua_url_do_backend

As variáveis de ambiente não devem ser versionadas no Git.

Arquivos .env são protegidos pelo .gitignore.

---

## ▶️ Executando localmente

### Backend

Navegue até a pasta backend:

cd backend

Instale as dependências:

npm install

Inicie o servidor em desenvolvimento:

npm run dev

O backend será executado na porta configurada através da variável PORT.

---

### Frontend

Navegue até a pasta frontend:

cd frontend

Instale as dependências:

npm install

Inicie o servidor de desenvolvimento:

npm run dev

O Vite fornecerá a URL local para acessar a aplicação.

---

## 🌐 Deploy

O projeto está dividido em três partes principais:

Frontend
Vercel

Backend
Render

Banco de dados
MongoDB Atlas

Fluxo:

Usuário
  ↓
Vercel
  ↓
Frontend React
  ↓
Render
  ↓
API Express
  ↓
MongoDB Atlas

---

## 🎯 Objetivo

O projeto foi desenvolvido como uma solução simples para digitalizar a comunicação de problemas de qualidade entre a linha de montagem e a pré-montagem.

A proposta não é substituir o processo de correção do problema, mas garantir que a informação sobre o erro chegue rapidamente aos responsáveis.

O sistema também cria um registro digital das reclamações, permitindo acompanhar os problemas registrados durante os turnos.

---

## 💡 Problema que o projeto resolve

No processo de produção, quando uma tampa apresenta algum problema, a comunicação pode depender de uma pessoa localizar o volante ou preparador e comunicar verbalmente o ocorrido.

Isso pode gerar:

- Comunicação lenta
- Falta de registro
- Dificuldade para acompanhar os problemas
- Repetição de erros
- Falta de informação sobre a quantidade de ocorrências

O Production Quality Tracker transforma essa comunicação em um fluxo digital simples.

---

## 📚 Aprendizados

Durante o desenvolvimento foram utilizados conceitos de:

- Desenvolvimento de APIs REST
- React
- Node.js
- Express
- MongoDB
- Mongoose
- Comunicação entre frontend e backend
- Polling
- CRUD
- Controle de estados
- React Router
- Componentização
- Requisições HTTP
- Variáveis de ambiente
- Git
- GitHub
- Deploy de aplicações
- Vercel
- Render
- MongoDB Atlas

---

## 📌 Características do projeto

O projeto foi desenvolvido com foco em:

- Simplicidade
- Facilidade de utilização
- Comunicação rápida
- Organização do código
- Persistência dos dados
- Histórico das reclamações
- Separação entre frontend e backend
- Aplicação prática em um ambiente industrial

A aplicação não busca substituir sistemas industriais complexos.

A proposta é resolver um problema específico de comunicação utilizando uma solução web simples.

---

## 👨‍💻 Autor

Thiago Martins

Projeto desenvolvido para fins de aprendizado, portfólio e aplicação prática de conceitos de desenvolvimento de sistemas.

---

⭐ Se este projeto foi útil ou interessante, considere deixar uma estrela no repositório.
