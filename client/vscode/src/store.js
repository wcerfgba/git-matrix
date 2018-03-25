import * as Loki from 'lokijs'

export const create = (o) => {
  const store = {
    name: o.name,
    dbType: 'lokijs',
    db: null,
    networkHandler: o.networkHandler
  }
  store.db = new Loki(`${store.name}.lokijs.db`)
  return store
}

// TODO: write thin wrappers for MongoDB/LokiDB and place in common/store,
// then re-export from here :D

export const findOne = (store, query) => {
  return store.db.findOne(query)
}