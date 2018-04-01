import loki from 'lokijs'

export const create = (o = {}) => {
  const store = {
    name: o.name,
    dbType: 'lokijs',
    db: null,
    collection: null
  }
  store.db = new loki(`${store.name}.lokijs.db`)
  store.collection = store.db.getCollection(store.name) ||
                     store.db.addCollection(store.name)
  return store
}

// TODO: write thin wrappers for MongoDB/LokiDB and place in common/store,
// then re-export from here :D

export const find = (store, query) => {
  return store.collection.find(query)
}

export const findOne = (store, query) => {
  return store.collection.findOne(query)
}

export const insertMany = (store, docs) => {
  store.collection.insert(docs)
  console.log(find(store))
}