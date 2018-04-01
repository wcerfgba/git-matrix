import loki from 'lokijs'
import { log, logMethod, logReturn } from '../vendor/eyeson-common/lib/logging'

export const create = (o = {}) => {
  logMethod('Store.create')
  const store = {
    name: o.name,
    dbType: 'lokijs',
    db: null,
    collection: null
  }
  store.db = new loki(`${store.name}.lokijs.db`)
  store.collection = store.db.getCollection(store.name) ||
                     store.db.addCollection(store.name)
  logReturn(store)
  return store
}

// TODO: write thin wrappers for MongoDB/LokiDB and place in common/store,
// then re-export from here :D

export const find = (store, query) => {
  logMethod('Store.find')
  log('query', query)
  const results = store.collection.find(query)
  logReturn(results)
  return results
}

export const findOne = (store, query) => {
  logMethod('Store.findOne')
  log('query', query)
  const result = store.collection.findOne(query)
  logReturn(result)
  return result
}

export const insertMany = (store, docs) => {
  logMethod('Store.insertMany')
  log('docs', docs)
  store.collection.insert(docs)
  logReturn()
}