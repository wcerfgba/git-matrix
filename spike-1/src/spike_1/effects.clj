(ns spike-1.effects
  (:use [spike-1.file-line]
        [spike-1.effect]
        [spike-1.heatmap]
        [spike-1.arithmetic-map]
        [spike-1.utils]))
  
; (extend-protocol Heatmappable
;   Effect
;     (warn-unimplemented-extend-protocol heatmap [effect]))

; (extend DefaultEffect
;   Heatmappable
;     {:heatmap (fn [effect] {})})

(defrecord VisibleFileEffect
  [from-time
   to-time
   project-name
   vcs-reference
   file-path
   viewport-top-line
   viewport-bottom-line]
  Effect
    (file-lines [effect]
      (map #(file-line (merge effect {:line-number %}))
          (range viewport-top-line
                  (+ 1 viewport-bottom-line))))
  Heatmappable
    (heatmap [effect]
        (integrate-time effect (fn []
          (let [reducer
                  (fn [heatmap file-line]
                      (assoc heatmap file-line 0.1))]
            (reduce reducer (arithmetic-map) (file-lines effect)))))))
(defn visible-file-effect
  ""
  [& attrs]
  (map->VisibleFileEffect attrs))




(defrecord CursorPositionEffect
  [from-time
   to-time
   project-name
   vcs-reference
   file-path
   cursor-line
   cursor-column]
  Effect
    (file-lines [effect]
      [(file-line (merge effect {:line-number (:cursor-line effect)}))])
  Heatmappable
    (heatmap [effect]
      (integrate-time effect (fn []
        (arithmetic-map {(file-line effect) 1.0})))))
(defn cursor-position-effect
  ""
  [& attrs]
  (map->CursorPositionEffect attrs))



; (let [val-or-zero (fn [val] (or val 0.0))
;   current-line-heat (val-or-zero (heatmap file-line))
;   extra-line-heat 0.1
;   next-line-heat (+ (* 0.9 dt current-line-heat) extra-line-heat)]