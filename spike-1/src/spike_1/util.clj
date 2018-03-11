(ns spike-1.util)

(defmacro debug
  [& body]
  `(do (println ~@body) ~@body))

(defn now [] (java.util.Date.))
(defn ts [date] (java.util.Date. date))

(defmacro warn-unimplemented
  ""
  [name args]
  `(throw (Exception. (str "Unimplemented '" ~name "' for '" ~args "'"))))
(defmacro warn-unimplemented-extend-protocol
  ""
  [name args]
  `(~name ~args (warn-unimplemented ~name ~args)))