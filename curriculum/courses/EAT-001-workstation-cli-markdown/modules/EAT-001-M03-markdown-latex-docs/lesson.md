# EAT-001-M03 — Markdown, LaTeX e documentazione verificabile

Stato: draft. Contenuto autoriale; nessuna mastery personale attribuita.

## Perché questa skill serve

Una spiegazione corretta può diventare inutilizzabile se il link porta altrove o il renderer interpreta male la matematica. Markdown versionato permette review e diff, ma richiede un contratto fra sorgente, percorso e resa. SSRI resta la baseline dei concetti matematici: qui si verifica il documento che li trasporta.

## Outcome osservabili

- Correggere heading, link e delimitatori matematici in un documento minimo.
- Distinguere sorgente canonica, generated, historical e rendering.

## Prerequisiti

Conoscere path relativi e quoting da EAT-001-M01/M02. Basta ricordare la media aritmetica; non viene introdotta nuova matematica. Servono un editor e Node 24. Una preview Markdown è opzionale e locale.

## Modello mentale

Markdown è un file sorgente, non una pagina già renderizzata. Un parser produce una rappresentazione che un renderer può trasformare in HTML. CommonMark definisce il nucleo della sintassi; GFM aggiunge convenzioni come le tabelle. Il motore che apre il file può supportare un sottoinsieme diverso.

LaTeX è la sintassi della formula; KaTeX è un renderer matematico con una propria lista di funzioni supportate. `$...$` e `$$...$$` sono convenzioni di delimitazione del sistema che integra Markdown e matematica: CommonMark da solo non interpreta le formule. Una formula delimitata correttamente può comunque usare una macro non supportata.

Un documento **canonico** è la fonte modificabile di una decisione o contratto. Un documento **generated** deriva da fonti dichiarate e si rigenera. Uno **historical** conserva ciò che era vero a una data e non dichiara lo stato attuale. Modificare a mano un report generated crea una seconda versione destinata a essere sovrascritta.

## Concetti e comandi essenziali

Usa un titolo `#`, sezioni `##` e sottosezioni `###` senza salti gratuiti. I livelli rappresentano la struttura, non la dimensione desiderata del carattere. Separa paragrafi e liste con righe vuote; numerare una procedura aiuta a riferirsi ai passi durante un assessment.

````markdown
# Misura

## Procedura

1. Raccogli tre osservazioni sintetiche.
2. Calcola e verifica il risultato.

| Dato | Valore |
| --- | --- |
| n | 3 |

```text
node check.mjs document.md
```
````

Il code fence dichiara il linguaggio per leggibilità; non esegue i comandi. Chiudilo con almeno lo stesso numero di backtick. Per mostrare un fence di tre backtick dentro un esempio, usa un fence esterno di quattro.

I link relativi si risolvono dalla cartella del documento. Un percorso con spazi può essere scritto fra `<` e `>` nella destinazione oppure percent-encoded. Il case deve corrispondere al nome reale, anche se il filesystem attuale è permissivo. Un anchor dipende dalle regole del renderer per i titoli: evita di assumere una normalizzazione universale.

Per un carattere Markdown letterale puoi usare escaping, ad esempio `\*` per un asterisco. In una formula, il backslash introduce comandi come `\frac`; non duplicarlo come faresti in una stringa JSON. Il confine fra Markdown e formule rende necessari esempi piccoli e una preview nel renderer destinatario.

## Esempio svolto

Questo è un frammento sorgente indipendente dal task del lab:

```markdown
La somma è $s=a+b$.

$$
a+b=b+a
$$
```

La formula inline fa parte del periodo; quella block occupa righe proprie. Il parser Markdown, l'integrazione matematica e KaTeX svolgono ruoli diversi. Se vedi i dollari letterali, controlla prima che l'integrazione matematica sia attiva. Se vedi un errore su un comando LaTeX, consulta il supporto del renderer.

Il checker del lab rileva la struttura concordata per una singola fixture: salti di heading, link locali mancanti e delimitatori attesi. Non è un parser completo di CommonMark o LaTeX e non certifica il risultato visivo.

## Failure mode e recovery

Link rotto: parti dalla directory del documento, confronta spelling e case, verifica encoding e anchor. Una rinomina richiede aggiornare i riferimenti. Non creare un file vuoto solo per far passare un link.

Tabella non renderizzata: il viewer può supportare CommonMark senza estensioni GFM. Formula letterale o macro sconosciuta: separa il problema di delimitazione da quello del renderer. Un report di Atlas modificato a mano verrà rilevato da `check:generated`: correggi il metadata e rigenera, preservando prima eventuali note originali.

Un controllo automatico verde è necessario ma non sufficiente per qualità editoriale: leggi il documento dalla prospettiva di chi deve seguirlo senza contesto.

## Collegamenti a IronMath

Anchor di sola lettura nello snapshot IronMath dichiarato in `sources/repositories.json`: `docs/bible/`, `packages/curriculum/`. Non sono link locali né dipendenze del lab. Consulta la [mappa di lettura](../../../../../projects/ironmath-reading-map.md) per la domanda del macro-corso. Non aprire configurazioni riservate e non avviare servizi del prodotto.

## Esercizio senza LLM

Correggi il mini documento senza cambiare il significato matematico. Scrivi una nota che spieghi ogni errore e indica quale livello lo rileva: sorgente, link checker o renderer. Esegui il checker solo dopo aver formulato la diagnosi.

## Domande di autoverifica

1. Perché un file Markdown valido può non renderizzare una formula?
2. Da quale cartella si risolve un link relativo?
3. Che cosa cambia tra una nota storica e una fonte canonica?
4. Quando si modifica il generatore anziché l'output?
5. Che cosa resta da verificare dopo un checker verde?

## Glossario

**CommonMark**: specifica del nucleo Markdown. **GFM**: estensioni GitHub Flavored Markdown. **Code fence**: delimitatore di un blocco di codice. **Anchor**: identificatore di una sezione. **KaTeX**: renderer matematico. **Freshness**: corrispondenza fra artifact derivato e fonti attuali.

## Fonti e versioni

Fonti: [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/), [GFM](https://github.github.com/gfm/), [KaTeX supported functions](https://katex.org/docs/supported.html). Consultazione tecnica: 2026-09-05. Il lab usa soltanto Node 24 e controlli testuali; non installa un renderer né verifica la resa in KaTeX.
