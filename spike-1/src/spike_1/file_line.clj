(ns spike-1.file-line)

(defrecord FileLine
  [project-name
   vcs-reference
   file-path
   line-number])
(defn file-line
  ""
  [& attrs]
  (map->FileLine attrs))