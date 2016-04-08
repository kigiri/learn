const is = require('lib/is')
const each = require('lib/collection/each')
const assign = require('lib/assign-deep')

const VNode = require('virtual-dom/vnode/vnode')
const VText = require('virtual-dom/vnode/vtext')

const parseTag = require('virtual-dom/virtual-hyperscript/parse-tag')
const softSetHook = require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook')
const evHook = require('virtual-dom/virtual-hyperscript/hooks/ev-hook')

const pixelize = require('lib/default-unit')

const transformProperties = each((value, propName, props) => {
  if (!is.hook(value) && /^ev[-A-Z]/.test(propName)) {
    props[propName] = evHook(value)
  }
})

function parseArgs(cssPath, props, children) {
  if (!children && is.children(props)) {
    return {
      children: props,
      props: {}
    }
  }
  const parsedArgs = { children }

  if (props) {
    if (props.key) {
      parsedArgs.key = props.key
      props.key = undefined
    }

    if (props.namespace) {
      parsedArgs.namespace = props.namespace
      props.namespace = undefined
    } else if (isInputWithValue(cssPath, props)) {
      props.value = softSetHook(props.value)
    }
  } else {
    props = {}
  }
  parsedArgs.tag = parseTag(cssPath, props)
  parsedArgs.props = props

  return parsedArgs
}

const isInputWithValue = (tag, props) => tag === 'INPUT'
  && props.hasOwnProperty('value')
  && props.value !== undefined
  && !is.hook(props.value)

function buildVnode(tag, props, children, key, namespace) {
  const childNodes = []

  if (props.style) {
    pixelize(props.style)
  }

  transformProperties(props)
  addChild(children, childNodes, tag, props)

  return new VNode(tag, props, childNodes, key, namespace)
}

function addChild(c, childNodes, tag, props) {
  if (c === undefined || c === null) return
  if (is.str(c)) {
    childNodes.push(new VText(c))
  } else if (typeof c === 'number') {
    childNodes.push(new VText(String(c)))
  } else if (is.child(c)) {
    childNodes.push(c)
  } else if (is.arr(c)) {
    each(child => addChild(child, childNodes, tag, props), c)
  } else {
    throw UnexpectedVirtualElement({
      foreignObject: c,
      parentVnode: {
        tagName: tag,
        properties: props
      }
    })
  }
}

function UnexpectedVirtualElement(data) {
  const err = new Error('Unexpected virtual child passed to h().\n'
    +'Expected a VNode / Vthunk / VWidget / string but:\n'
    +'got:\n'+ errorString(data.foreignObject) +'.\n'
    +'The parent vnode is:\n'+ errorString(data.parentVnode) +'\n'
    +'Suggested fix: change your `h(..., [ ... ])` callsite.')

  err.type = 'virtual-hyperscript.unexpected.virtual-element'
  err.foreignObject = data.foreignObject
  err.parentVnode = data.parentVnode

  return err
}

function errorString(obj) {
  try {
    return JSON.stringify(obj, null, '    ')
  } catch (e) {
    return String(obj)
  }
}

function parseCurryArgs(args, props, children) {
  if (!children && is.children(props)) {
    args.children = props
  } else {
    args.children = children
    if (props) {
      if (props.className && args.props.className) {
        props.className = props.className +' '+ args.props.className
      }
      args.props = assign({}, args.props, props)
    }
  }
  return args
}

const applyArgsToBuild = arg =>
  buildVnode(arg.tag, arg.props, arg.children, arg.key, arg.namespace, arg)

const h = (tagName, properties, children) =>
  applyArgsToBuild(parseArgs(tagName, properties, children))

h.build = buildVnode
h.curry = (tagName, properties) => {
  let tag
  let props

  if (is.str(tagName)) {
    const args = parseArgs(tagName, properties)
    tag = args.tag;
    props = args.props || {}
  } else {
    tag = 'DIV'
    props = tagName || {}
  }

  const curryfied = (newProps, children) => 
    applyArgsToBuild(parseCurryArgs({ tag, props }, newProps, children))

  curryfied.style = (style, children) => curryfied({ style }, children)

  return curryfied
}

module.exports = h
