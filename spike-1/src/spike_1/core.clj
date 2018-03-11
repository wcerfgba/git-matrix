(ns spike-1.core
  (:use [spike-1.util]
        [spike-1.states]
        [spike-1.heatmap]))

(defn states []
  [{:from-time (ts 10240000)
    :to-time (ts 10240300)
    :project-name "eyeson"
    :vcs-reference "<hash>"
    :state-type :visible-file
    :file-path "scratch-1/src/core.clj"
    :viewport-top-line 1
    :viewport-bottom-line 36}
   {:from-time (ts 10240230)
    :to-time (ts 10240300)
    :project-name "eyeson"
    :vcs-reference "<hash>"
    :state-type :cursor-position
    :file-path "scratch-1/src/core.clj"
    :cursor-line 28
    :cursor-column 20}])

(def active-target
  {:project-name "eyeson"
   :vcs-reference "<hash>"
   :file-path "scratch-1/src/core.clj"})
(def inactive-target
  {:project-name "eyeson"
   :vcs-reference "<hash>"
   :file-path "scratch-1/src/different_file.clj"})

(defn -main
  [& args]
  (do
    (println (heatmap active-target :states (states)))
    (println (heatmap inactive-target :states (states)))))