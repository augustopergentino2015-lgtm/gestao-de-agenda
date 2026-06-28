# 📅 Gestão de Agenda — Guia Completo de Instalação e Deploy

> App PWA Mobile-First para controle privado de compromissos, relatórios e instituições.  
> Tecnologias: HTML5 · CSS3 · JavaScript Vanilla · Firebase (Auth + Firestore) · PWA

---

## 📁 Estrutura de Arquivos

```
gestao-agenda/
├── index.html              ← App principal (toda a UI)
├── manifest.json           ← Configuração PWA
├── service-worker.js       ← Cache offline
├── FIREBASE_RULES.txt      ← Regras de segurança Firestore
├── README.md               ← Este arquivo
├── css/
│   └── style.css           ← Estilos Mobile-First
├── js/
│   ├── config.js           ← Configuração Firebase (EDITE AQUI)
│   ├── db.js               ← Camada de dados (Firestore)
│   ├── auth.js             ← Autenticação
│   ├── profile.js          ← Perfil do usuário
│   ├── institutions.js     ← CRUD de instituições
│   ├── events.js           ← CRUD de eventos + D-1
│   ├── relatoria.js        ← Motor de inteligência textual
│   └── ui.js               ← Utilitários de interface
└── icons/
    ├── icon-192.png        ← Ícone PWA (192x192 px)
    └── icon-512.png        ← Ícone PWA (512x512 px)
```

---

## 🔥 PASSO 1 — Configurar o Firebase (obrigatório)

### 1.1 Criar o projeto
1. Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"** → dê um nome (ex: `gestao-agenda`)
3. Desative o Google Analytics (opcional) → **Criar projeto**

### 1.2 Habilitar Autenticação
1. No menu lateral: **Authentication** → **Começar**
2. Aba **"Sign-in method"** → habilite **E-mail/senha** → Salvar

### 1.3 Criar o Banco de Dados Firestore
1. No menu lateral: **Firestore Database** → **Criar banco de dados**
2. Escolha **"Iniciar no modo de produção"** → selecione a região mais próxima → **Ativar**

### 1.4 Aplicar as Regras de Segurança
1. Firestore → aba **"Regras"**
2. Apague o conteúdo existente
3. Copie TODO o conteúdo do arquivo `FIREBASE_RULES.txt` e cole
4. Clique em **"Publicar"**

### 1.5 Obter as Credenciais do App
1. Na tela inicial do projeto → clique em **"</> Web"**
2. Dê um apelido ao app (ex: `agenda-web`) → Registrar
3. Copie o objeto `firebaseConfig`

### 1.6 Colar as Credenciais no App
Abra `js/config.js` e substitua os valores:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",          // ← cole aqui
  authDomain:        "meu-projeto.firebaseapp.com",
  projectId:         "meu-projeto",
  storageBucket:     "meu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123...:web:abc..."
};
```

---

## 🖼️ PASSO 2 — Criar os Ícones PWA

Você precisa de 2 arquivos PNG na pasta `icons/`:

| Arquivo          | Tamanho  |
|------------------|----------|
| `icon-192.png`   | 192×192  |
| `icon-512.png`   | 512×512  |

**Opção gratuita rápida:**
1. Acesse [https://favicon.io](https://favicon.io/favicon-generator/)
2. Texto: `GA`, Cor de fundo: `#2563EB`, Cor da fonte: `#FFFFFF`
3. Baixe → extraia os arquivos `.png` para a pasta `icons/`

---

## 🚀 PASSO 3 — Publicar na Internet (GRÁTIS)

### Opção A — GitHub Pages (recomendada)

1. **Crie uma conta** em [https://github.com](https://github.com) (grátis)

2. **Crie um repositório** novo:
   - Nome: `gestao-agenda`
   - Público: ✅
   - Clique em **"Create repository"**

3. **Faça upload dos arquivos:**
   - Clique em **"uploading an existing file"**
   - Arraste TODA a pasta `gestao-agenda/` (com subpastas)
   - Commit: **"Initial commit"** → **Commit changes**

4. **Ative o GitHub Pages:**
   - Repositório → **Settings** → **Pages**
   - Source: **"Deploy from a branch"**
   - Branch: `main` · Pasta: `/ (root)` → **Save**

5. Após ~2 minutos, seu app estará em:
   ```
   https://SEU_USUARIO.github.io/gestao-agenda/
   ```

> ⚠️ **Importante:** No Firebase Console → Authentication → **Domínios autorizados**,  
> adicione `SEU_USUARIO.github.io` para permitir o login.

---

### Opção B — Netlify (ainda mais simples)

1. Acesse [https://netlify.com](https://netlify.com) → Login com GitHub
2. Clique em **"Add new site"** → **"Deploy manually"**
3. **Arraste a pasta `gestao-agenda/`** para a área indicada
4. Seu site estará online em segundos com URL automática!
5. Adicione o domínio Netlify nos **Domínios autorizados** do Firebase

---

### Opção C — Vercel

```bash
npm install -g vercel
cd gestao-agenda
vercel
```

Siga as instruções na tela. URL gerada automaticamente.

---

## 📲 PASSO 4 — Instalar no Celular (PWA)

### Android (Chrome)
1. Abra o link do app no Chrome
2. Menu (⋮) → **"Adicionar à tela inicial"**
3. Confirme → o app aparece como ícone nativo!

### iPhone (Safari)
1. Abra o link no Safari
2. Botão de compartilhar (□↑) → **"Adicionar à Tela Inicial"**
3. Confirme

---

## 🔐 Modelo de Privacidade

```
Firebase Auth
    └── user.uid (único por conta)
            └── Firestore: users/{uid}/
                    ├── profile/data        ← perfil do usuário
                    ├── institutions/{id}   ← instituições
                    └── events/{id}         ← eventos da agenda
```

As Regras de Segurança do Firestore garantem que **nenhum usuário pode ler
ou escrever dados de outro**, mesmo que tente manipular requisições diretas.

---

## ⚙️ Funcionalidades

| Módulo                  | Descrição                                                  |
|-------------------------|------------------------------------------------------------|
| 🔐 Autenticação         | Login por e-mail ou telefone (convertido em e-mail)        |
| 👤 Perfil Obrigatório   | CPF/CNPJ, endereço completo, cargo — máscaras automáticas  |
| 🏛 Instituições         | CRUD com cor de identificação, vinculação a eventos        |
| 📅 Agenda               | Navegação por dias, filtro por instituição, real-time sync |
| ⚡ Lembretes D-1        | Painel fixo com compromissos do dia seguinte               |
| 🧠 Relatoria Inteligente| Extração de datas + vínculo automático com instituições    |
| 📶 Offline              | Firestore + Service Worker garantem uso sem internet       |
| 📲 PWA                  | Instalável no celular, tela cheia, sem navegador visível   |

---

## 🛠️ Desenvolvimento Local

Para rodar localmente (necessário para o Service Worker funcionar):

```bash
# Opção 1: VS Code → instale a extensão "Live Server" → clique em "Go Live"

# Opção 2: Python 3
cd gestao-agenda
python3 -m http.server 8080
# Acesse: http://localhost:8080

# Opção 3: Node.js
npx serve gestao-agenda
```

> ⚠️ Nunca abra `index.html` diretamente pelo sistema de arquivos (`file://`).  
> O Service Worker exige protocolo `http://` ou `https://`.

---

## 🔄 Sincronização Bidirecional

```
┌─────────────────────────────────────────────────────────┐
│                    FIREBASE FIRESTORE                   │
│              (banco de dados na nuvem)                  │
└────────────┬───────────────────────┬────────────────────┘
             │ PULL (ao abrir app)   │ PUSH (ao salvar)
             ▼                       ▲
┌─────────────────────────────────────────────────────────┐
│                    CELULAR / BROWSER                    │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │
│  │  Perfil  │  │ Institui.│  │ Eventos (real-time) │   │
│  └──────────┘  └──────────┘  └────────────────────┘    │
│                Listener em tempo real (onSnapshot)       │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Dependências Externas

Todas carregadas via CDN (sem npm necessário):

| Lib                        | Versão  | Uso                       |
|----------------------------|---------|---------------------------|
| Firebase App Compat        | 10.12.0 | Inicialização             |
| Firebase Auth Compat       | 10.12.0 | Login/cadastro            |
| Firebase Firestore Compat  | 10.12.0 | Banco de dados            |
| Google Fonts (Inter + SG)  | latest  | Tipografia                |

---

## 🐛 Problemas Comuns

| Problema                        | Solução                                                   |
|---------------------------------|-----------------------------------------------------------|
| Login com erro 400              | Verifique se o domínio está em Auth → Domínios autorizados|
| Dados não aparecem              | Verifique as Regras do Firestore (FIREBASE_RULES.txt)     |
| PWA não instala                 | Certifique-se que está em HTTPS e manifest.json está OK   |
| Service Worker não registra     | Use `http://localhost` ou `https://` (não `file://`)      |
| `firebaseConfig` com valores fictícios | Substitua os valores em `js/config.js`             |

---

*Desenvolvido com arquitetura Mobile-First · Privacidade por Design · PWA Nativo*

.
