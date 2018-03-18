(ns spike-1.heatmap)

(defprotocol Heatmappable
  ""
  (heatmap [obj] "Returns a map from file-lines to heat values."))