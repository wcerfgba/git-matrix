(ns spike-1.arithmetic-map
  (:refer-clojure :exclude [*])
  (:require [clojure.core :as clj]
            [clojure.set :refer [union]]))

(defprotocol IArithmeticMap
  (_* [map scale])
  (_+ [map-l map-r])
  (_get [map key])
  (_keys [map]))
(defrecord ArithmeticMap [_map]
  IArithmeticMap
    (_* [map scale]
       (->ArithmeticMap (clj/map (fn [[k v]] [k (* scale v)]) (:_map map))))
    (_+ [map-l map-r]
       (->ArithmeticMap (clj/map (fn [k] [k (+ (get map-l k) (get map-r k))])
                            (union (keys map-l) (keys map-r)))))
    (_get [map key] (clj/get (:_map map) key))
    (_keys [map] (clj/keys (:_map map))))
(defn arithmetic-map
  ([] (arithmetic-map {}))
  ([map] (->ArithmeticMap map)))

(defn * [& args]
  (if (= spike_1.arithmetic_map.ArithmeticMap
         (type (first args)))
      (apply _* args)
      (apply clj/* args)))
(defn + [& args]
  (if (= spike_1.arithmetic_map.ArithmeticMap
         (type (first args)))
      (apply _+ args)
      (apply clj/+ args)))
(defn get [& args]
  (if (= spike_1.arithmetic_map.ArithmeticMap
         (type (first args)))
      (apply _get args)
      (apply clj/get args)))
(defn keys [& args]
  (if (= spike_1.arithmetic_map.ArithmeticMap
         (type (first args)))
      (apply _keys args)
      (apply clj/keys args)))