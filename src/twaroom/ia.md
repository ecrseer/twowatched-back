# Fluxo de Notificação e Aceitação de Roleplay (Twaroom)

Este documento descreve o fluxo de comunicação via WebSocket entre dois clientes e o backend para iniciar uma sala de roleplay.

## 1. Solicitação de Roleplay (Cliente 1)

- O **Cliente 1** deseja iniciar um roleplay e emite o evento `request_roleplay_chat` enviando o filme escolhido.
- No Backend (`twaroom.gateway.ts` - `send_roleplay_room_request`), o socket do Cliente 1 entra na sala de espera chamada `wait_room` (ex: `likes_movie_FilmeNome`).
- O Backend então emite o evento `receive_request_roleplay_chat` contendo os dados da notificação e do filme para todos que estão na sala `wait_room`.

## 2. Recebimento da Notificação (Cliente 2)

- O **Cliente 2**, ao entrar no aplicativo, emite `enter_roleplay_notifications_room` com sua lista de filmes curtidos, entrando em várias salas `wait_room`.
- Ao receber o evento `receive_request_roleplay_chat`, o frontend (`TwaroomReceiverService.ts`) chama o método `NotificationService.add_fading_notification()`, exibindo a notificação na tela.
- A notificação configurada possui a ação `onAccept`, que é disparada quando o usuário clica.

## 3. Aceitação do Roleplay (Cliente 2)

- Quando o **Cliente 2** clica na notificação, a função `onAccept` emite o evento `accept_roleplay_room_request` enviando os dados do filme.
- O Backend recebe a confirmação em `client_accept_roleplay_room_request` (`twaroom.gateway.ts`).
- Uma nova sala (Twaroom) é criada no banco de dados.
- O Backend emite o evento `accepted_roleplay_enter_room` enviando os dados da nova sala:
  - Para a sala de espera `wait_room` (`client.in(wait_room).emit(...)`), para notificar o Cliente 1.
  - Para o próprio socket (`client.emit(...)`), para notificar o Cliente 2.

## 4. Redirecionamento para a Sala (Ambos os Clientes)

- Tanto o Cliente 1 quanto o Cliente 2 recebem o evento `accepted_roleplay_enter_room` no frontend (`TwaroomReceiverService.ts`).
- A função `on_accepted_roleplay_enter_room` salva a nova sala no estado atual e executa o redirecionamento: `navigateTo({ path: '/room/choose-character' })`.
- A partir daqui, ambos os jogadores estão prontos para selecionar seus personagens e prosseguir para a sala de chat.

> **Importante:** Antigamente, o backend emitia o redirecionamento para uma `acceptance_room`, o que impedia que o Cliente 1 recebesse o evento e ficasse travado na tela sem ir para a seleção de personagens. O envio correto deve ser para a `wait_room`, onde o Cliente 1 está aguardando.
