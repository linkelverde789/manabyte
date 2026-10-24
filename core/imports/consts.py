import re

QUANTITY_RE = re.compile(r"^(\d+)\s+")
SET_AND_NUMBER_RE = re.compile(r"\s+\(([^()]*)\)\s*(\S+)\s*$")
SET_ONLY_RE = re.compile(r"\s+\(([^()]*)\)\s*$")
SET_PAREN_RE = re.compile(r"\(([A-Za-z0-9]+)\)(?:\s+(\S+))?")
