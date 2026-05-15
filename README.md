# Sistema de registro simples de venda e reserva de aves

Imagem da Home - demonstração

<img width="757" height="565" alt="image" src="https://github.com/user-attachments/assets/6a528773-4aca-449b-b7b5-06008bed017b" />

## Descrição
O projeto foi desenvolvido com foco em praticar conceitos de desenvolvimento da disciplina de WEB I do curso Análise e Desenvolvimento de Sistemas utilizando Vue, TypeScript, JavaScript e integração com banco de dados PostgreSQL via Neon Database/Vercel.

O sistema permite que o usuário (padrão) realize registros de venda ou reserva de aves e visualize o histórico. Para fazer isso, o usuário deve apertar no icon de login e inserir os dados:

```txt
Email: usuario1@email.com
Senha: 123456
```
Depois, para dá início ao processo de registro, aperte no botão "Registrar" em algum dos cards ou no botão de "Nova compra" junto ao de "Histórico".

# Observações
Lembrando que os dados sensíveis de CPF, nome e contato já salvos no histórico são FICTÍCIOS. Lembre-se que, ao testar, também insira dados fictícios.

# Tecnologias utilizadas

- Vue.js, Vite
- TypeScript
- HTML
- CSS
- JavaScript
- PostgreSQL, Neon Database
- Vercel

# Funcionalidades

- Login de usuário (padrão)
- Registro de venda ou reserva de aves
- Histórico de registros
- Integração com BD
- Deploy online via Vercel

# Deploy online
O sitema está hospedado na Vercel:
```txt
https://registro-simples-de-venda-e-reserva.vercel.app/
```

# Limitações atuais

- O site ainda não está totalmente responsivo
- Existem 3 opções de pagamento, porém:
  - não há geração de QR Code para Pix
  - não existem campos adicionais para cartão
- Não há verificação de autentificação de login
- CPF e número de contato não exige padronização ou que seja verdadeiro
- O formulário não permite selecionar dois gêneros diferentes em uma única compra

### Exemplo:

Caso o usuário deseje:
- 1 arara macho
- 1 arara fêmea

Será necessário criar dois registros separados.

# Desenvolvedora
Laís Castro Costa, 5º período de Análise e Desenvolvimento de Sistemas pelo IFCE.

# Contato
- Email: laisccastroc2023@gmail.com
- Linkedin: www.linkedin.com/in/laís-castro-569367333
