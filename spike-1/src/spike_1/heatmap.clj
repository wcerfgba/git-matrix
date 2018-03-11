(ns spike-1.heatmap
  (:require [clojure.spec.alpha :as s])
  (:use [spike-1.util]))

(defmulti state-heat
  ""
  :state-type)

(defmethod state-heat :default [state] {})
(defmethod state-heat :visible-file [state]
  (let [heat-by-line 
          (for [line (range (:viewport-top-line state)
                            (+ 1 (:viewport-bottom-line state)))]
                {line 0.1})]
    (into (sorted-map) heat-by-line)))
(defmethod state-heat :cursor-position [state]
  {(:cursor-line state) 1.0})

(s/def ::heatmap-target 
  (s/keys :req-un 
    [::project-name
      ::vcs-reference
      ::file-path]))
      
(defn heatmap
  ""
  [heatmap-target & {:keys [states at-time]
                      :or {at-time (now)}}]
  (let [state-filter
          #(and (apply = (map :project-name [heatmap-target %]))
                (apply = (map :vcs-reference [heatmap-target %]))
                (apply = (map :file-path [heatmap-target %])))
        file-states
          (filter state-filter states)
        sum-line-heats
          #(merge-with + %1 %2)
        ]
        (reduce sum-line-heats (sorted-map) (map state-heat file-states))))