(ns spike-1.timeline
  (:use [spike-1.heatmap]
        [spike-1.utils]))

(defprotocol ITimeline
  (effects [timeline] ""))

(defrecord Timeline
  [_effects]
  ITimeline
    (effects [timeline] (:_effects timeline))
  Heatmappable
    (heatmap [timeline]
             (let [effect-heatmaps (map heatmap (effects timeline))]
                  (apply + effect-heatmaps))))
(defn timeline
  ""
  [effects]
  (->Timeline effects))

