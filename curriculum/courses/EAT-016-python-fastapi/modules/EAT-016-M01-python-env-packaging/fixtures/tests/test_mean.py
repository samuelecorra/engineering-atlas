import unittest
from atlas_fixture import mean


class MeanTest(unittest.TestCase):
    def test_signed_values(self):
        self.assertEqual(mean([-2, 0, 5]), 1)

    def test_empty_input(self):
        with self.assertRaises(ValueError):
            mean([])


if __name__ == "__main__":
    unittest.main()
