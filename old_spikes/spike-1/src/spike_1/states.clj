(ns spike-1.states
  (:require [clojure.spec.alpha :as s]))

(s/def ::default
  (s/keys :req-un
    [::from-time
     ::to-time
     ::project-name
     ::vcs-reference
     ::state-type]))
      
(s/def ::open-file
  (s/and ::default (s/keys :req-un
    [::file-path])))

(s/def ::visible-file
  (s/and ::default (s/keys :req-un
    [::file-path
     ::viewport-top-line
     ::viewport-bottom-line])))

(s/def ::cursor-position
  (s/and ::default (s/keys :req-un
    [::file-path
     ::cursor-line
     ::cursor-column])))

;; We can use git for text-insertion(?)

;; Clipboard is more complicated -- want to store clipboard state as tracks on 
;; a timeline, and indicate immediate (::time, not ::from-time and ::to-time) 
;; events like cut/copy/paste