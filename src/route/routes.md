# Routes :
#### Route methods :
##### load `(observables) -> Promise ?`
If we return a promise, the router will wait after it's resolved to update the view

##### render `(state)`
Must return a valid children to render, so eaither a VDomNode, Array or String