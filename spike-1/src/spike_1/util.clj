(ns spike-1.util)

(defmacro debug
  [& body]
  `(do (println ~@body) ~@body))

(defn now [] (java.util.Date.))
(defn ts [date] (java.util.Date. date))