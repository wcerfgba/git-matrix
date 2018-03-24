import * as Loki from 'lokijs'

export const create = (o) => {
  return {
    dbType: 'lokijs',
    db: new Loki(`${o.name}.lokijs.db`)
  }
}

// TODO: write thin wrappers for MongoDB/LokiDB and place in common/store,
// then re-export from here :D

export const get = (store, query) => {
  return store.db.findOne(query)
}