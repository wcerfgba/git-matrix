(ns spike-1.effect)

(defprotocol Effect
  ""
  (file-lines [effect] ""))
(defn integrate-time
  ""
  [{:keys [from-time to-time]} expr]
  (let [dt 0.001
        decay 0.9]
    (reduce
      (fn [sum t] (+ (* decay sum) (* dt (expr))))
      (range from-time to-time dt))))