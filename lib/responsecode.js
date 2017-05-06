/**
 * This module defines a custom jsDoc tag.
 * It allows you to document responce code of a route.
 * @module lib/responsecode
 */

'use strict';

const tableBuilder = require('./parameterTableBuilder');

exports.name = 'responsecode';
exports.options = {
  mustHaveValue: true,
  mustNotHaveDescription: false,
  canHaveType: true,
  canHaveName: true,
  onTagged: function(doclet, tag) {
    if (!doclet.responsecodes) {
      doclet.responsecodes = [];
    }

    doclet.responsecodes.push({
      'type': tag.value.type ? (tag.value.type.names.length === 1 ? tag.value.type.names[0] : tag.value.type.names) : '',
      'name': tag.value.name,
      'description': tag.value.description || '',
      'optional': tag.value.optional === undefined ? '' : 'optional',
      'defaultvalue': tag.value.defaultvalue === undefined ? undefined : tag.value.defaultvalue,
    });
  },
}
exports.newDocletHandler = function(e) {
  const parameters = e.doclet.responsecodes;
  if (parameters) {
    const table = tableBuilder.build('Response Code', parameters);

    e.doclet.description = `${e.doclet.description}
                            ${table}`;
  }
}
