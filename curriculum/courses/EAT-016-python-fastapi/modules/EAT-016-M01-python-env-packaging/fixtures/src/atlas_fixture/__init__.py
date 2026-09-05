"""Funzioni pure per una fixture curricolare offline."""


def mean(values):
    """Calcola la media; la collezione vuota è un errore esplicito."""
    if not values:
        raise ValueError("Serve almeno un valore")
    return sum(values) / len(values)
