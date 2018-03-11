(ns spike-1.timeline
  (:require [spike-1.heatmap]))

(defprotocol ITimeline
  (effects [timeline] ""))

(defrecord Timeline
  [effects]
  ITimeline
    (effects [timeline] (:effects timeline)))
  Heatmappable
    (heatmap [timeline]
             (let [effects (map heatmap (effects timeline))]
                  (reduce + effects))))
(defn timeline
  ""
  [effects]
  (->Timeline effects))

