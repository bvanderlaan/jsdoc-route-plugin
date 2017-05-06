/**
 * This module defines a custom jsDoc tag.
 * It allows you to document return parameters of a route.
 * @module lib/returnparam
 */

'use strict';

const tableBuilder = require('./parameterTableBuilder');

exports.name = 'returnparam';
exports.options = {
  mustHaveValue: true,
  mustNotHaveDescription: false,
  canHaveType: true,
  canHaveName: true,
  onTagged: function(doclet, tag) {
    if (!doclet.returnparams) {
      doclet.returnparams = [];
    }

    doclet.returnparams.push({
      'name': tag.value.name,
      'type': tag.value.type ? (tag.value.type.names.length === 1 ? tag.value.type.names[0] : tag.value.type.names) : '',
      'description': tag.value.description || '',
      'optional': tag.value.optional === undefined ? '' : 'optional',
      'defaultvalue': tag.value.defaultvalue === undefined ? undefined : tag.value.defaultvalue,
    });
  },
}
exports.newDocletHandler = function(e) {
  const parameters = e.doclet.returnparams;
  if (parameters) {
    const table = tableBuilder.build('Return Parameters', parameters);

    e.doclet.description = `${e.doclet.description}
                            ${table}`;
  }
}
