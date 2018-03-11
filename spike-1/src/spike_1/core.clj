(ns spike-1.core
  (:use [spike-1.effects]
        [spike-1.heatmap]
        [spike-1.util]))

(defn timeline []
  (timeline
    [(visible-file-effect
      {:from-time (ts 10240000)
       :to-time (ts 10240300)
       :project-name "eyeson"
       :vcs-reference "<hash>"
       :file-path "scratch-1/src/core.clj"
       :viewport-top-line 1
       :viewport-bottom-line 36})
    (cursor-position-effect
      {:from-time (ts 10240230)
       :to-time (ts 10240300)
       :project-name "eyeson"
       :vcs-reference "<hash>"
       :file-path "scratch-1/src/core.clj"
       :cursor-line 28
       :cursor-column 20})]))

(defn -main
  [& args]
  (do
    (println (heatmap (timeline)))))