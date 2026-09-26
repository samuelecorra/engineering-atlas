# Impeccable — provenienza e installazione locale

Installazione del 2026-09-05 dalla fonte ufficiale [Impeccable](https://impeccable.style/docs/) e dal [repository upstream](https://github.com/pbakaus/impeccable). Bootstrap npm `impeccable@4.0.1`; skill scaricata con metadata `4.2.0`; engine `0.1.0` per darwin-arm64. Il bootstrap installa una skill remota: fissare la sola versione npm non fissa i byte della skill, perciò l'inventario sotto registra gli hash effettivamente ricevuti.

Comando eseguito dalla root, con cache e temporanei del processo confinati al progetto:

```sh
IMPECCABLE_HOME="$PWD/.work/impeccable-state" TMPDIR="$PWD/.work/tmp" npm_config_cache="$PWD/.lab-runs/npm-cache" npx --yes impeccable@4.0.1 install -y --providers=codex --scope=project --no-hooks
```

Prima dell'esecuzione è stato scaricato il pacchetto con `npm pack --ignore-scripts` e ispezionato il launcher. Registry tarball: `https://registry.npmjs.org/impeccable/-/impeccable-4.0.1.tgz`. Integrità npm: `sha512-gip60/B+BOTwVyCMA0PxgDyqw7gwWavoig2+qtDhwD2Fn8+Q8tIuMU7tGwwYBORCWZgo5UJC03YuWOCIQM4zdQ==`; shasum npm: `1cc2cf072c36b03ff9fc20f2eca94adf83e274e8`.

L'installer ha prodotto 57 file, 14.781.888 byte. Nessun symlink. Sono stati controllati inventario, hash, formati, header, JSON e launcher; il binario Mach-O è stato identificato e sottoposto a checksum, non a una revisione del codice macchina. La directory `.agents/skills/impeccable` rimane locale e ignorata da Git, separata dalle fonti curricolari e dai dati web. Nessun hook è stato installato. Il pacchetto bootstrap contiene LICENSE Apache-2.0, preservata nel pacchetto locale; nessun file di codice Impeccable è vendorizzato in Atlas e nessun notice è stato rimosso. Un eventuale vendoring futuro richiede una verifica delle licenze e notice del bundle completo, incluse le risorse browser. La licenza di Atlas resta una decisione distinta e pendente.

La skill non era disponibile nel primo catalogo della sessione; dopo il rinnovo della sessione è comparsa come skill project-local ed è stata caricata e applicata. Non è stato necessario fermare definitivamente il frontend per il reload.

## Decisioni registrate

Il workflow `init` ha prodotto [PRODUCT.md](../../PRODUCT.md) dal brief esplicito dell'utente, senza inventare audience o deployment. L'utente ha scelto esplicitamente il percorso con mockup (`buildPath: comp`). Il comando `concept-seed --scope direction --mode operate` ha prodotto il seed `b459214c`. La selezione accidentale `assigned` è annullata; la scelta valida è `model-pick`, Carta di navigazione orbitale. Il confronto di tre composizioni ha ricevuto approvazione `orbit-a`, domanda `633278ae`, il 2026-09-06. La pagina chiariva che ID, titoli e archi imprecisi nelle immagini sarebbero stati sostituiti dai metadata canonici.

I mockup sono stati generati con lo strumento ImageGen integrato e copiati in `.impeccable/mocks`, con prompt esatti incorporati e sidecar. Sono file di progetto ignorati, non asset serviti dall'app. PNG preservato perché il convertitore `sips` non supporta scrittura WebP. Il mockup approvato è `.impeccable/mocks/orbit-a.png`; l'approvazione è nel relativo `.png.json`. La [surface brief](../../apps/web/.impeccable/surfaces/apps-web-src-app-tsx.md) conserva il contratto.

Comandi engine realmente eseguiti fino alla specifica: `context`, `concept-seed`, `serve-question --schema/--start/--wait`, `embed-prompt`, `build-phase start/advance`, `surface-brief read/write`, `comp-spec --grid/--regions`, `font-match --measure/--rank`. `serve-question --update` ha segnalato correttamente che la pagina era già stata chiusa dalla scelta. Le impostazioni di telemetry sono state disattivate per i comandi successivi con `IMPECCABLE_NO_TELEMETRY=1`. Comps, spec e plates sono stati chiusi correggendo i relativi errori. Il gate hero conserva un blocco regionale dopo gli adattamenti canonici e la review: non è stato forzato; il [rapporto visuale](../reviews/2026-09-06-local-web.md) distingue esito numerico, limiti e verdetto.

Il grafo e la griglia sono geometria interattiva da dati: la specifica li dichiara `codeDrawn`, come consentito per elementi semantici, con una griglia continua `container`. Non sono illustrazioni da rasterizzare. Il confronto font ha scelto Nanum Gothic 700 per il titolo principale, servito localmente dal package Fontsource. Successivamente sono stati eseguiti `build-phase scaffold/note/record`, `comp-diff` e `detect --json`. I workflow `audit`, `distill` e `polish` sono stati applicati dalle reference della skill; non sono comandi shell omonimi. Il workflow completo `critique` non è stato eseguito, quindi non viene rivendicato: la valutazione indipendente è quella dell’agente ufficiale `impeccable_finish_reviewer`. Il documenter ufficiale produce DESIGN.md e il sidecar dal codice verificato. Le ulteriori verifiche e il verdetto sono nel rapporto visuale.

## Inventario dell'installer

Questi hash descrivono l'installazione iniziale, non i file di lavoro generati dopo. I path partono dalla root Atlas.

| Path | Byte | SHA-256 | Tipo |
| --- | ---: | --- | --- |
| `.agents/skills/impeccable/SKILL.md` | 11038 | `541379a8e7e9bab3bdc287090571fb7ee4170cef7fddc812b725f62a53dd2697` | text |
| `.agents/skills/impeccable/agents/impeccable_asset_producer.toml` | 6190 | `4a200cdc0bbe2ae0ee91d88d1f97dd0cfdc828bc32685eea14e86f5ebc82d966` | text |
| `.agents/skills/impeccable/agents/impeccable_documenter.toml` | 3243 | `d5922228b571900e21a47855d7de9e081c2246fc9cec6c6235b1a6da31098896` | text |
| `.agents/skills/impeccable/agents/impeccable_finish_reviewer.toml` | 15297 | `869fa5390b84bfd00d072f5280a9002ea3e3936edf5985241be641a87f03ff7b` | text |
| `.agents/skills/impeccable/agents/impeccable_manual_edit_applier.toml` | 7032 | `6c9ce3e27ec4520ead001da3aad2a2ebba481c4e5cd22873db8890259ee579fe` | text |
| `.agents/skills/impeccable/agents/openai.yaml` | 235 | `cbd8bd68fa00935dd0f179adb169252629cf7ee443ea9dc7db77e7ef2cf77446` | text |
| `.agents/skills/impeccable/reference/adapt.md` | 10307 | `bead87679caad7c537dd7c04c3bb78be56ac7eec279ad6aad7322f48ff2df2d9` | text |
| `.agents/skills/impeccable/reference/adapt.native.md` | 3910 | `6acc0bf221a4ddc6e5c6438348920b2ca2393b29c4314dbde2cdc23f2b1a9639` | text |
| `.agents/skills/impeccable/reference/android.md` | 4093 | `058f81f256134841875fd3183e06b37a023de0c877fd2b9eecd97011640791fe` | text |
| `.agents/skills/impeccable/reference/animate.md` | 5236 | `d658c48ffbe0031e8e3b318996cad6ceafe29e40aa50d5bb25e4bf1d6839dc7c` | text |
| `.agents/skills/impeccable/reference/audit.md` | 7873 | `910461b1c1f8216155165955c860a884a1e2f557cb38f21ef512ea90ef6503c2` | text |
| `.agents/skills/impeccable/reference/audit.native.md` | 8364 | `960cb922bc934adbf9192e9428ff6bec1f382038166f02a785939c93b7391067` | text |
| `.agents/skills/impeccable/reference/bolder.md` | 3564 | `f964506c0fae87b3c2c1db7016ddc9be9ef970bbcf5548d684b997b5d5991586` | text |
| `.agents/skills/impeccable/reference/clarify.md` | 4590 | `173dd66abe65633910dcb04a51f40d6ff2a793f87088f022a02fc4cad24dd133` | text |
| `.agents/skills/impeccable/reference/colorize.md` | 4537 | `bc5f71f1129d0f2c310d913d07c8dc609a1d25644121bd78c308f42d52a0b9e9` | text |
| `.agents/skills/impeccable/reference/craft-floor.md` | 5500 | `e802e4f7bdc89050a9c0f2ca506e1d493a2316e6e810c0336c57aa073717ef3e` | text |
| `.agents/skills/impeccable/reference/craft.md` | 555 | `9205e222bc6565b37fb504ceec93233c2d2a456802b69d16e6b1c44723907c4c` | text |
| `.agents/skills/impeccable/reference/critique.md` | 45944 | `cb8caddbb3919e5bf7f252143b519fb16db28a244642d937b186cb89962d9201` | text |
| `.agents/skills/impeccable/reference/degraded/asset-producer.md` | 6352 | `fadd4a57ec67175230191b4a6d7415580ca24caf2fbfb359496ffec0f6442f50` | text |
| `.agents/skills/impeccable/reference/degraded/documenter.md` | 3365 | `97a09e350c383cb2f6bba027b83bedffd12a23b1b439ad4a045a48953eb19365` | text |
| `.agents/skills/impeccable/reference/degraded/finish-reviewer.md` | 15397 | `5f24c5a97b4ffcabc7c432b064cfdd04c7a2ad52f52e765be648dc0aadab8f38` | text |
| `.agents/skills/impeccable/reference/degraded/manual-edit-applier.md` | 7196 | `5fae7f8a2fc3ddd49ad0a413446dc44daedef5b6b7de5eb935bd2fbfad646d58` | text |
| `.agents/skills/impeccable/reference/delight.md` | 3716 | `098a891028ce59c212b747d3c70468dd750aff7053a703d1336045ed31e0da7c` | text |
| `.agents/skills/impeccable/reference/distill.md` | 5717 | `ea8432c90c30ecb0426662a681ead5c0941113079704e1a766cda09e85b15b4f` | text |
| `.agents/skills/impeccable/reference/doctor.md` | 5481 | `a98b397cedeeaa1da57f3395b3d9b6c1fc477f4247fb9dc13e4da3da588283ff` | text |
| `.agents/skills/impeccable/reference/document.md` | 27521 | `3673248740bcdd1122ccc610093ba2fe52f3943a61ce0b7170b74dc49e5b6098` | text |
| `.agents/skills/impeccable/reference/extract.md` | 3433 | `31b90048c0b540daec46762a10c2b6b6434737a89af005054d8b848d829d003b` | text |
| `.agents/skills/impeccable/reference/harden.md` | 8539 | `b31ff29c7a1ea979c6d039f7e8d17007410697ab49536690dca109f0af3f20f8` | text |
| `.agents/skills/impeccable/reference/hooks.md` | 13312 | `12fefe52d80d25014e5f7e2f9b278275a675653d3d99ae8f0ecf344cdb9abbe6` | text |
| `.agents/skills/impeccable/reference/init.md` | 11536 | `bb069b43c09109d7031b0374e31955749fec657b252d39782f11e8985aca2b51` | text |
| `.agents/skills/impeccable/reference/ios.md` | 3812 | `40c87038b5f75147a5952a96237acf312a327bf70c1bcd8e0a5f064625ae9668` | text |
| `.agents/skills/impeccable/reference/layout.md` | 5161 | `0bc7d7971b3edf2acd0580e847458dc6d84129d90715b452799ace3bed815c7c` | text |
| `.agents/skills/impeccable/reference/live-setup.md` | 7459 | `6efb8b42387ed3e8770903c700192c6b088dbe0f58f71680bc4f0e71268f909c` | text |
| `.agents/skills/impeccable/reference/live.md` | 36049 | `7a8ec3d47b210fce70246ba3781af07d196ea2f87f66cd46a8c8153976c281c6` | text |
| `.agents/skills/impeccable/reference/new-work.md` | 52146 | `0e26bc3f24067ccb5c08bce4a673fab96164c81b8794206dfdd124e566b2c45d` | text |
| `.agents/skills/impeccable/reference/onboard.md` | 7740 | `ef2dde00030580ed2765cbf7be9b2ea4a6f64cb915b804fd6f6abcf38051c7b9` | text |
| `.agents/skills/impeccable/reference/operate.md` | 4145 | `a9d2203acd45ca33a13d5c68b02b23ed512425ac15f0e8438318ed124b43729d` | text |
| `.agents/skills/impeccable/reference/optimize.md` | 7614 | `f672ef8251a3ed4051a053d30819664951b17540b2899acd27d20e500c234abc` | text |
| `.agents/skills/impeccable/reference/overdrive.md` | 9178 | `fce6688138d2ceb1e3d2cde5231f54b1d8dc8748b4c95a7919aa83b6f924cf96` | text |
| `.agents/skills/impeccable/reference/polish.md` | 6646 | `81666fc7f783b4e3514db6554e713dc0479bd9cdedb06e93d15f8b579aae869a` | text |
| `.agents/skills/impeccable/reference/quieter.md` | 4952 | `190a4e642ca362d7499f3c3ab123e21f18f75457d11f072b545a183f296e6495` | text |
| `.agents/skills/impeccable/reference/routing.md` | 2911 | `9d57b9e816a64c044e19ec907c59bf88d4fe3e809e5602f51c10057e62478ef3` | text |
| `.agents/skills/impeccable/reference/shape.md` | 3547 | `a55f016c046cb6a27c55bd7f346375aeb506a755c4fbca19a5f92dbd42309c23` | text |
| `.agents/skills/impeccable/reference/typeset.md` | 5256 | `442749aed338f51c1a3ccfb182c6ade9b74b90590b67984062ac94a5b100e914` | text |
| `.agents/skills/impeccable/reference/visualize.md` | 11294 | `2806ada0ec5b488409e57bdbf639626b77661aba6cfde9899df7291fdb7abfcc` | text |
| `.agents/skills/impeccable/scripts/VERSION` | 6 | `e9dd8507f4bf0c6f42458e41aea833ad0bd3f6127272335eee9bf4d58541ed67` | text |
| `.agents/skills/impeccable/scripts/bin/darwin-arm64/impeccable` | 12661264 | `1f063e93650b31ab753e6298f762100ef028ccda6628caf7a7e355f45dae4197` | binary |
| `.agents/skills/impeccable/scripts/command-metadata.json` | 7934 | `6bdbc3f745ceee15e10b050f109ce42bbeb53ab3c3b5239257de1d596654dee7` | text |
| `.agents/skills/impeccable/scripts/data/font-index-failures.json` | 2437 | `835f19a0a3812f3652dd6979a2ce5597f654fd01f26e1b420b92d5f42b997ce4` | text |
| `.agents/skills/impeccable/scripts/data/font-index.json` | 1100013 | `47edbdfaf27073c47033d1ac7dfee881be49e2dcbda7671d1157300481dde6da` | text |
| `.agents/skills/impeccable/scripts/impeccable` | 6438 | `340d6cfb8f36b6dc8a15d1591d09c0333e988f93b228e7ac413760bdf75416bc` | text |
| `.agents/skills/impeccable/scripts/impeccable.cmd` | 5606 | `67d1f8a2b1f26f0db7aaa7d39c2a071b10e32e0952af3b09bfbbf8cd1e94adcd` | text |
| `.agents/skills/impeccable/scripts/live-browser-dom.js` | 4917 | `de1b7404f4cdfd7b515196afb17b74b1980f0bc88cb8681ae93a76ca48ec7bdb` | text |
| `.agents/skills/impeccable/scripts/live-browser-ignores.js` | 10346 | `c1cb6877ca99a0c1b38ba0c7d59f32702d3022f6821d8045f7133f7c40b6362f` | text |
| `.agents/skills/impeccable/scripts/live-browser-session.js` | 4090 | `edddeb3fad88adec9a055b1bf9d5c75418cbe97a13b1a7f6765e73249e482563` | text |
| `.agents/skills/impeccable/scripts/live-browser.js` | 522564 | `c2e8258dde5d2dc58625b8bd16da0b37016cac445b99042b1005db833e5a22a0` | text |
| `.agents/skills/impeccable/scripts/modern-screenshot.umd.js` | 29290 | `bb36665889124a0b6e15f16045265737449c3bdcf2712cdb08af3cfa01563e2b` | text |
