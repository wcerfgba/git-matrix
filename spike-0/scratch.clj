(ns jpreston.eyeson.spike-0.scratch
  (:use [clojure.string :only (split capitalize join)]))

(defn defevent
  ""
  ([event-type doc-string attrs]
    (do
      (eval `(def ~(symbol (str (name event-type) "-event-attrs")) ~attrs))
      (eval `(defn ~(symbol (str (name event-type) "-event")) [attrs#] (merge attrs# {:event-type ~(keyword event-type)}))))))

(defevent :default
  "The essential attibutes for an event object."
  [
    :timestamp
    :project-name
    :vcs-reference
    :event-type
  ])

(defevent :file-opened
  ""
  (vec (concat default-event-attrs [
    :file-path
  ])))


(defevent :file-closed
  ""
  (vec (concat default-event-attrs [
    :file-path
  ])))

(defevent :switched-file
  ""
  (vec (concat default-event-attrs [
    :from-file-path
    :to-file-path
  ])))

(defevent :file-scrolled
  ""
  (vec (concat default-event-attrs [
    :file-path
    :from-viewport-top-line
    :from-viewport-bottom-line
    :to-viewport-top-line
    :to-viewport-bottom-line
  ])))

(defevent :file-lost-focus
  ""
  (vec (concat default-event-attrs [
    :file-path
  ])))

(defevent :file-gained-focus
  ""
  (vec (concat default-event-attrs [
    :file-path
  ])))

(defevent :cursor-moved
  ""
  (vec (concat default-event-attrs [
    :file-path
    :cursor-line
    :cursor-column
  ])))

(defevent :text-inserted
  ""
  (vec (concat default-event-attrs [
    :file-path
    :from-cursor-line
    :from-cursor-column
    :to-cursor-line
    :to-cursor-column
    ;; :inserted-character-string ???
  ])))

(defevent :text-selected
  ""
  (vec (concat default-event-attrs [
    :file-path
    :from-cursor-line
    :from-cursor-column
    :to-cursor-line
    :to-cursor-column
  ])))

;; copy, paste, ...

(defmulti event-
  "Calculates the focus an event represents for a given file line."
  (fn [context event] (:event-type event)))

(defmethod event-focus :text-inserted [context event] 1.0)
(defmethod event-focus :default [context event] 0.0)

(println (event-focus {} (text-inserted-event {})))
(println (event-focus {} {:event-type :unreal}))