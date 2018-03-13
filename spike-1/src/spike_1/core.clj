(ns spike-1.core
  (:use [spike-1.timeline]
        [spike-1.effects]
        [spike-1.heatmap]
        [spike-1.utils]))

(defn get-timeline []
  (timeline
    [(visible-file-effect
      {:from-time 10240000
       :to-time 10240300
       :project-name "eyeson"
       :vcs-reference "<hash>"
       :file-path "scratch-1/src/core.clj"
       :viewport-top-line 1
       :viewport-bottom-line 36})
    (cursor-position-effect
      {:from-time 10240230
       :to-time 10240300
       :project-name "eyeson"
       :vcs-reference "<hash>"
       :file-path "scratch-1/src/core.clj"
       :cursor-line 28
       :cursor-column 20})]))

(defn -main
  [& args]
  (do
    (println (heatmap (debug (get-timeline))))))