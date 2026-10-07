# PLACEHOLDER — replace with your own Dynamo Python node source.
#
# Facade panel numbering
# Numbers rainscreen panels per elevation, left to right and bottom to top,
# and writes the result to the "Panel Mark" parameter.
#
# IN[0]: list of facade panel elements
# IN[1]: elevation prefix, e.g. "N", "S", "E", "W"
# OUT:   list of assigned marks

import clr

clr.AddReference("RevitServices")
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager

clr.AddReference("RevitAPI")
from Autodesk.Revit.DB import BuiltInParameter

doc = DocumentManager.Instance.CurrentDBDocument

panels = UnwrapElement(IN[0])
prefix = IN[1]

ROW_TOLERANCE = 0.1  # feet; panels within this height share a row


def panel_origin(panel):
    """Bottom-left corner of the panel's bounding box."""
    box = panel.get_BoundingBox(None)
    return box.Min


def sort_key(panel):
    origin = panel_origin(panel)
    row = round(origin.Z / ROW_TOLERANCE)
    return (row, origin.X, origin.Y)


marks = []
TransactionManager.Instance.EnsureInTransaction(doc)

for index, panel in enumerate(sorted(panels, key=sort_key), start=1):
    mark = "{0}-{1:03d}".format(prefix, index)
    panel.get_Parameter(BuiltInParameter.ALL_MODEL_MARK).Set(mark)
    marks.append(mark)

TransactionManager.Instance.TransactionTaskDone()

OUT = marks
