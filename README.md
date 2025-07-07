# Graph Visualizer

Graph Visualizer è una piattaforma web interattiva per la **creazione, simulazione e gestione di grafi**.  
Permette di disegnare grafi, ottimizzare la disposizione dei nodi con algoritmi fisici, salvare e importare strutture.

## Funzionalità

**Creazione e Visualizzazione:**  
Si possono creare e osservare i grafi in modo intuitivo:
- Click sul canvas: aggiunge un nodo.
- Click su due nodi diversi: aggiunge un arco fra i due nodi.

**Personalizzazione:**
- Doppio click su un nodo: appare un prompt per modificare il suo peso.
- Click su un arco: appare un prompt per modificare la sua lunghezza a riposo. (gli archi si comportano come delle molle)

**Ottimizzazione:**
- Cliccando il tasto ottimizza in basso a sinistra sito applicherà un algoritmo (Goldstein-Fruchterman) per rendere il grafo più "leggibile"

**Salvataggio:**
- Puoi salvare i tuoi grafi e importarli successivamente dal tuo profilo utente.
- Ogni grafo è associato all’utente autenticato.

## Struttura del progetto

- `/html` — pagine HTML principali
- `/css` — fogli di stile per layout, temi e componenti
- `/js` — logica frontend (disegno, interazione, autenticazione, simulazione)
- `/php` — backend PHP per autenticazione, salvataggio e gestione grafi

## Consigli per gli altri studenti

- Dovete trattare la presentazione del progetto come un business pitch per vendere un prodotto: conoscete bene tutti i punti di forza del vostro progetto e presentatelo in modo appassionato ed interessato, alla fine dei conti avete scelto voi su cosa fare il progetto quindi provate a farlo su qualcosa che vi interessa veramente. Più spiegate, meno domande vi farà il professore. Sconsiglio di avere un discorso granitico già scritto: regolatevi anche in base a ciò che il professore sta visualizzando sullo schermo, spiegando mano a mano cosa fanno le funzioni.
- Meglio un progetto curato ma "piccolo" piuttosto che un progetto enorme con funzioni mancanti o non funzionanti. Consiglio di rimuovere per intero eventuali sezioni rotte.
---

**Autore:** Giacomo Fundarò
