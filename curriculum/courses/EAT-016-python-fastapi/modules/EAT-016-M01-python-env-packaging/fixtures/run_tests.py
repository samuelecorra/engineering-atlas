"""Test diretto del sorgente, senza simulare una installazione editable."""
from pathlib import Path
import sys
import unittest

root = Path(__file__).resolve().parent
sys.path.insert(0, str(root / "src"))
suite = unittest.defaultTestLoader.discover(str(root / "tests"))
result = unittest.TextTestRunner(verbosity=2).run(suite)
sys.exit(0 if result.wasSuccessful() else 1)
