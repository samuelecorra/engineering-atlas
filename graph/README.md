# Knowledge graph

`knowledge-graph.json` è canonico. ID e path POSIX devono risolvere ai metadata, non ai sibling. Nodi: course, skill, module, assessment, evidence, taxonomy, mastery. I nodi evidence puntano al JSON locale che contiene il record; il path originale del repository rimane dentro quel record.

| Arco | Direzione e significato | Strength |
| --- | --- | --- |
| PREREQUISITE_OF | corso prerequisito → corso dipendente | required |
| RECOMMENDED_BEFORE | corso consigliato → corso dipendente | recommended |
| PART_OF | skill → corso proprietario; modulo → corso; assessment → modulo | structural |
| REINFORCES | corso/modulo → skill esercitata | supporting |
| EVIDENCED_BY | skill → evidenza source | supporting |
| REQUIRES_MASTERY | skill → livello target | required |
| MAPS_TO_TAXONOMY | skill/corso → label esterna | supporting |

Soltanto PREREQUISITE_OF deve essere un DAG. Il validator verifica anche la corrispondenza esatta delle relazioni con metadata e scope, l'ordine dei corsi e la raggiungibilità delle skill tramite PART_OF (invertito per navigare dal corso). Le dipendenze tra skill dei singoli moduli sono controllate nei metadata; non sono dichiarate un DAG curricolare alternativo.
