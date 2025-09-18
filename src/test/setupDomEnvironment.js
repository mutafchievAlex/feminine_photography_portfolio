if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Environment already has a DOM implementation.
} else {
  const documentStub = {};

  function createNode(tag) {
    return {
      tagName: tag.toUpperCase(),
      nodeType: 1,
      style: {},
      _children: [],
      ownerDocument: documentStub,
      parentNode: null,
      appendChild(child) {
        child.parentNode = this;
        this._children.push(child);
      },
      removeChild(child) {
        this._children = this._children.filter((n) => n !== child);
        child.parentNode = null;
      },
      insertBefore(child, ref) {
        child.parentNode = this;
        const idx = this._children.indexOf(ref);
        if (idx === -1) {
          this._children.push(child);
        } else {
          this._children.splice(idx, 0, child);
        }
      },
      setAttribute() {},
      removeAttribute() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() { return false; },
    };
  }

  documentStub.createElement = createNode;
  documentStub.createTextNode = (text) => ({ nodeType: 3, textContent: text, parentNode: null });
  documentStub.createComment = () => ({ nodeType: 8 });
  documentStub.createDocumentFragment = () => createNode('#document-fragment');
  documentStub.body = createNode('body');
  documentStub.documentElement = createNode('html');
  documentStub.addEventListener = () => {};
  documentStub.removeEventListener = () => {};
  documentStub.activeElement = null;
  documentStub.defaultView = {};

  documentStub.documentElement.appendChild(documentStub.body);

  documentStub.body.ownerDocument = documentStub;
  documentStub.documentElement.ownerDocument = documentStub;

  global.document = documentStub;

  global.window = {
    document: documentStub,
    HTMLIFrameElement: function HTMLIFrameElement() {},
    HTMLElement: function HTMLElement() {},
    Node: function Node() {},
    addEventListener() {},
    removeEventListener() {},
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    navigator: { userAgent: 'test-environment' },
  };

  documentStub.defaultView = global.window;

  global.navigator = window.navigator;
  global.IS_REACT_ACT_ENVIRONMENT = true;
}
