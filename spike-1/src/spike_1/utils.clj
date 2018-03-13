(ns spike-1.utils
  (:use [spike-1.arithmetic-map]))

(defmacro debug
  [& body]
  `(do
    (println "\n---- DEBUG START ----")
    (println ~@body)
    (println "---- DEBUG END ----\n")
    ~@body))




(defn now [] (java.util.Date.))




(defn integrate-time
  ""
  [{:keys [from-time to-time]} expr]
  (let [dt 0.001
        decay 0.999]
    (reduce
      (fn [sum t] (+ (* decay sum) (* dt (expr))))
      (range from-time to-time dt))))






(defmacro warn-unimplemented
  ""
  [name args]
  `(throw (Exception. (str "Unimplemented '" ~name "' for '" ~args "'"))))
(defmacro warn-unimplemented-extend-protocol
  ""
  [name args]
  `(~name ~args (warn-unimplemented ~name ~args)))